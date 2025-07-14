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

    // Genera un ID temporaneo se Airtable non è disponibile
    let projectId = `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

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
        // Manteniamo l'ID temporaneo se il database fallisce
      }
    }

    // Salva temporaneamente i dati in localStorage per il recupero
    const analysisData = {
      id: projectId,
      analysis,
      extractedInfo,
      fileName,
      timestamp: new Date().toISOString()
    }

    return NextResponse.json({
      success: true,
      analysis,
      extractedInfo,
      projectId,
      fileName,
      analysisData // Questo può essere usato dal frontend per salvare in localStorage
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
    // Per ora, creiamo un'analisi semplificata dal testo
    // In futuro qui andrà l'integrazione con Claude per l'estrazione strutturata
    
    const lines = text.split('\n').filter(line => line.trim().length > 0)
    const firstLine = lines[0] || 'Progetto Startup'
    
    // Estrae il titolo (prima riga o primi 50 caratteri)
    const title = firstLine.length > 50 ? firstLine.substring(0, 50) + '...' : firstLine
    
    // Usa i primi paragrafi come descrizione
    const description = text.substring(0, 200).trim() + (text.length > 200 ? '...' : '')
    
    // Per ora, usiamo valori di default che l'utente può poi modificare
    const extractedInfo: IdeaAnalysisInput = {
      title: title,
      description: description,
      questionnaire: {
        target_market: extractFromText(text, ['mercato', 'clienti', 'target', 'customers']) || 'Mercato da definire meglio',
        value_proposition: extractFromText(text, ['valore', 'vantaggio', 'beneficio', 'value']) || 'Value proposition da sviluppare',
        business_model: extractFromText(text, ['ricavi', 'monetizzazione', 'business model', 'prezzo']) || 'Modello di business da strutturare',
        competitive_advantage: extractFromText(text, ['competitivo', 'differenziazione', 'unico', 'innovazione']) || 'Vantaggio competitivo da evidenziare',
        team_experience: extractFromText(text, ['team', 'esperienza', 'competenze', 'fondatori']) || 'Esperienza del team da descrivere',
        funding_needed: extractFromText(text, ['finanziamento', 'capitale', 'investimento', 'funding']) || 'Finanziamenti da quantificare',
        timeline: extractFromText(text, ['tempo', 'sviluppo', 'roadmap', 'milestone']) || 'Timeline da pianificare',
        main_challenges: extractFromText(text, ['sfide', 'rischi', 'difficoltà', 'ostacoli']) || 'Sfide principali da identificare'
      }
    }
    
    return extractedInfo

  } catch (error) {
    console.error('Errore estrazione informazioni:', error)
    return null
  }
}

function extractFromText(text: string, keywords: string[]): string | null {
  const lowerText = text.toLowerCase()
  
  for (const keyword of keywords) {
    const index = lowerText.indexOf(keyword.toLowerCase())
    if (index !== -1) {
      // Prende il paragrafo che contiene la keyword
      const start = Math.max(0, index - 100)
      const end = Math.min(text.length, index + 200)
      const extract = text.substring(start, end).trim()
      
      if (extract.length > 20) {
        return extract
      }
    }
  }
  
  return null
}