import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { analyzeIdea, IdeaAnalysisInput } from '@/lib/claude'
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

    // Usa Claude per estrarre informazioni strutturate dal testo
    const extractedInfo = await extractBusinessInfo(text)

    if (!extractedInfo) {
      return NextResponse.json({ 
        error: 'Impossibile estrarre informazioni sufficienti dal documento' 
      }, { status: 400 })
    }

    // Analizza l'idea usando le informazioni estratte
    const analysis = await analyzeIdea(extractedInfo)

    // Salva il progetto e l'analisi nel database (se Airtable è configurato)
    let projectId = null
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
            source: 'document',
            source_file: fileName || 'Documento caricato',
            status: 'analyzed',
            score: analysis.overall_score,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })

          projectId = project.id

          // Salva l'analisi
          await AirtableService.createRecord(TABLES.IDEAS_ANALYSIS, {
            project_id: projectId,
            overall_score: analysis.overall_score,
            swot_analysis: JSON.stringify(analysis.swot_analysis),
            detailed_feedback: JSON.stringify(analysis.detailed_feedback),
            next_steps: JSON.stringify(analysis.next_steps),
            created_at: new Date().toISOString()
          })
        }
      } catch (dbError) {
        console.error('Errore salvando nel database:', dbError)
        // Continuiamo anche se il salvataggio fallisce
      }
    }

    return NextResponse.json({
      success: true,
      analysis,
      extractedInfo,
      projectId,
      fileName
    })

  } catch (error) {
    console.error('Errore analisi documento:', error)
    return NextResponse.json({ 
      error: 'Errore durante l\'analisi del documento' 
    }, { status: 500 })
  }
}

async function extractBusinessInfo(text: string): Promise<IdeaAnalysisInput | null> {
  try {
    // Usa Claude per estrarre informazioni strutturate dal testo del documento
    const prompt = `
Analizza questo testo di presentazione di una startup e estrai le informazioni chiave in formato JSON.

TESTO DEL DOCUMENTO:
${text}

Rispondi SOLO con un JSON valido in questo formato:

{
  "title": "Titolo/Nome della startup o progetto",
  "description": "Descrizione breve del progetto (max 200 caratteri)",
  "questionnaire": {
    "target_market": "Chi sono i clienti target e qual è la dimensione del mercato",
    "value_proposition": "Qual è il valore unico offerto e perché i clienti dovrebbero scegliere questo prodotto",
    "business_model": "Come l'azienda genererà ricavi",
    "competitive_advantage": "Qual è il vantaggio competitivo e cosa differenzia dai competitor",
    "team_experience": "Esperienza e competenze del team",
    "funding_needed": "Finanziamenti necessari e come verranno utilizzati",
    "timeline": "Timeline di sviluppo e lancio del prodotto",
    "main_challenges": "Principali sfide e rischi identificati"
  }
}

Se alcune informazioni non sono presenti nel testo, usa "Non specificato" per quel campo.
IMPORTANTE: Rispondi SOLO con il JSON, senza testo aggiuntivo.
`

    const anthropic = require('@anthropic-ai/sdk')
    const client = new anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY
    })

    const message = await client.messages.create({
      model: 'claude-3-sonnet-20240229',
      max_tokens: 1500,
      messages: [{ role: 'user', content: prompt }]
    })

    const responseText = message.content[0].type === 'text' ? message.content[0].text : ''
    
    try {
      const extractedInfo = JSON.parse(responseText) as IdeaAnalysisInput
      
      // Valida che abbiamo almeno title e description
      if (!extractedInfo.title || !extractedInfo.description) {
        throw new Error('Informazioni insufficienti estratte')
      }
      
      return extractedInfo
    } catch (parseError) {
      console.error('Errore parsing JSON estratto:', parseError)
      return null
    }

  } catch (error) {
    console.error('Errore estrazione informazioni:', error)
    return null
  }
}