import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { IdeaAnalysisInput } from '@/lib/claude'
import { analyzeProfessionalStartup } from '@/lib/claude-professional'
import { AirtableService, TABLES } from '@/lib/airtable'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 })
    }

    const { text, fileName } = await request.json()

    if (!text || text.trim().length === 0) {
      return NextResponse.json({ error: 'Testo del documento mancante' }, { status: 400 })
    }

    // Estrai informazioni strutturate dal testo usando Claude
    const extractedInfo = await extractBusinessInfoProfessional(text)

    if (!extractedInfo) {
      return NextResponse.json({ 
        error: 'Impossibile estrarre informazioni sufficienti dal documento' 
      }, { status: 400 })
    }

    // Analizza l'idea usando l'analisi professionale di Claude
    const professionalAnalysis = await analyzeProfessionalStartup(extractedInfo)

    // Genera un ID temporaneo se Airtable non è disponibile
    let projectId = `professional_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    // Salva il progetto e l'analisi nel database (se Airtable è configurato)
    if (process.env.AIRTABLE_API_KEY && process.env.AIRTABLE_BASE_ID) {
      try {
        // Trova l'utente
        const users = await AirtableService.findRecords(TABLES.USERS, {
          filterByFormula: `{email} = "${session.user.email}"`
        })

        if (users.length > 0) {
          const userId = users[0].id

          // Crea il progetto
          const project = await AirtableService.createRecord(TABLES.PROJECTS, {
            user_id: userId,
            title: extractedInfo.title,
            description: extractedInfo.description,
            source: 'document_professional',
            source_file: fileName || 'Documento caricato',
            status: 'analyzed',
            score: professionalAnalysis.overall_score,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })

          projectId = project.id

          // Salva l'analisi professionale
          await AirtableService.createRecord(TABLES.IDEAS_ANALYSIS, {
            project_id: projectId,
            overall_score: professionalAnalysis.overall_score,
            professional_analysis: JSON.stringify(professionalAnalysis),
            created_at: new Date().toISOString()
          })
        }
      } catch (dbError) {
        console.error('Errore salvando nel database:', dbError)
        // Manteniamo l'ID temporaneo se il database fallisce
      }
    }

    // Salva temporaneamente i dati in localStorage per il recupero
    const analysisData = {
      id: projectId,
      analysis: professionalAnalysis,
      extractedInfo,
      fileName,
      timestamp: new Date().toISOString(),
      type: 'professional'
    }

    return NextResponse.json({
      success: true,
      analysis: professionalAnalysis,
      extractedInfo,
      projectId,
      fileName,
      analysisData,
      type: 'professional'
    })

  } catch (error) {
    console.error('Errore analisi documento professionale:', error)
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Errore durante l\'analisi del documento' 
    }, { status: 500 })
  }
}

async function extractBusinessInfoProfessional(text: string): Promise<IdeaAnalysisInput | null> {
  try {
    // Usa Claude per estrarre informazioni strutturate dal testo
    const anthropic = require('@anthropic-ai/sdk')
    const client = new anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY
    })

    const prompt = `
Analizza questo testo di presentazione di una startup e estrai le informazioni chiave in formato JSON.
Sii molto preciso e dettagliato nell'estrazione seguendo i framework professionali di analisi startup.

TESTO DEL DOCUMENTO:
${text}

Estrai TUTTE le informazioni rilevanti seguendo le best practices di due diligence VC e rispondi SOLO con un JSON valido in questo formato:

{
  "title": "Titolo/Nome della startup o progetto (se non presente, crea un titolo descrittivo basato sul business)",
  "description": "Descrizione completa e professionale del progetto, value proposition e missione aziendale (max 500 caratteri)",
  "questionnaire": {
    "target_market": "Analisi dettagliata del mercato target: dimensioni TAM/SAM/SOM se disponibili, segmenti di clientela, demographics, psychographics, comportamenti d'acquisto, trend di mercato, crescita del settore, opportunità di mercato emergenti.",
    "value_proposition": "Value proposition completa e strutturata: problema specifico risolto, soluzione unica offerta, benefici quantificabili per il cliente, differenziazione competitiva, pain points addressati, job-to-be-done framework, emotional benefits.",
    "business_model": "Modello di business dettagliato seguendo Business Model Canvas: revenue streams (ricorrenti/one-time), pricing strategy e rationale, canali di distribuzione, customer relationships, key partnerships, cost structure, unit economics (LTV/CAC se disponibili), economies of scale.",
    "competitive_advantage": "Vantaggio competitivo sostenibile: differenziazione tecnologica/di mercato/operativa, barriere all'ingresso create, moat difensivo, proprietà intellettuale, network effects, switching costs, first-mover advantage, brand loyalty, operational excellence.",
    "team_experience": "Analisi completa del team: background professionale dei founder, track record imprenditoriale, domain expertise specifico, complementarità skills, precedenti successi/fallimenti, network di settore, advisory board, gap di competenze identificati.",
    "funding_needed": "Strategia di finanziamento dettagliata: importo specifico richiesto, use of funds breakdown percentuale, milestones da raggiungere, round precedenti e valutazioni, timeline di utilizzo fondi, runway attuale, burn rate, dilution analysis, exit strategy timeline.",
    "timeline": "Roadmap di sviluppo professionale: milestones prodotto/mercato/business a 3/6/12 mesi, go-to-market timeline, scaling plan, hiring plan, partnership timeline, obiettivi di crescita quantificati, KPIs di successo per ogni fase.",
    "main_challenges": "Risk assessment completo: rischi di mercato (timing, adozione, competizione), rischi tecnici (feasibility, scalabilità), rischi finanziari (funding, burn, revenue), rischi team (key person, retention), rischi regolamentari, rischi operativi. Include strategie di mitigazione specifiche."
  }
}

LINEE GUIDA PER L'ESTRAZIONE:
- Se informazioni non sono presenti, inferisci ragionevolmente dal contesto o indica "Da approfondire in fase di due diligence"
- Usa linguaggio professionale da investment memo
- Quantifica quando possibile (numeri, percentuali, timeline)
- Identifica opportunità e rischi nascosti nel testo
- Considera implicazioni strategiche di ogni elemento

IMPORTANTE: Rispondi SOLO con il JSON valido, senza testo aggiuntivo.
`

    const message = await client.messages.create({
      model: 'claude-3-sonnet-20240229',
      max_tokens: 2000,
      messages: [{ role: 'user', content: prompt }]
    })

    const responseText = message.content[0].type === 'text' ? message.content[0].text : ''
    
    try {
      const extractedInfo = JSON.parse(responseText) as IdeaAnalysisInput
      
      // Valida che abbiamo almeno title e description
      if (!extractedInfo.title || !extractedInfo.description) {
        throw new Error('Informazioni insufficienti estratte dal documento')
      }
      
      return extractedInfo
    } catch (parseError) {
      console.error('Errore parsing JSON estratto:', parseError)
      console.error('Response text:', responseText)
      return null
    }

  } catch (error) {
    console.error('Errore estrazione informazioni professionali:', error)
    return null
  }
}