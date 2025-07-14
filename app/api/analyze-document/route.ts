import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { IdeaAnalysisInput } from '@/lib/claude'
import { analyzeProfessionalStartup } from '@/lib/claude-professional'

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

    // Estrai informazioni strutturate dal testo usando una funzione più robusta
    const extractedInfo = await extractBusinessInfoRobust(text)

    if (!extractedInfo) {
      return NextResponse.json({ 
        error: 'Il documento non contiene informazioni sufficienti per l\'analisi. Assicurati che contenga dettagli su: business idea, mercato target, modello di business, team.' 
      }, { status: 400 })
    }

    // Analizza l'idea usando l'analisi professionale di Claude
    const professionalAnalysis = await analyzeProfessionalStartup(extractedInfo)

    // Genera un ID temporaneo
    let projectId = `professional_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

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

async function extractBusinessInfoRobust(text: string): Promise<IdeaAnalysisInput | null> {
  try {
    // Validazione testo minimo
    if (text.trim().length < 100) {
      console.log('Testo troppo corto per analisi:', text.length)
      return null
    }

    // Usa Claude per estrarre informazioni strutturate dal testo SOLO se ANTHROPIC_API_KEY è presente
    if (process.env.ANTHROPIC_API_KEY) {
      try {
        const anthropic = require('@anthropic-ai/sdk')
        const client = new anthropic({
          apiKey: process.env.ANTHROPIC_API_KEY
        })

        const prompt = `
Analizza questo testo di presentazione di una startup e estrai le informazioni chiave.
Anche se il testo è limitato, estrai il massimo possibile e riempi i campi mancanti con inferenze ragionevoli.

TESTO DEL DOCUMENTO:
${text.substring(0, 3000)} // Limitiamo a 3000 caratteri per evitare prompt troppo lunghi

Estrai informazioni e rispondi SOLO con un JSON valido in questo formato:

{
  "title": "Nome della startup o progetto (se non presente, crea un titolo basato sul contenuto)",
  "description": "Descrizione del progetto basata sul testo",
  "questionnaire": {
    "target_market": "Descrizione del mercato target inferita dal testo, anche se limitata",
    "value_proposition": "Value proposition principale del progetto",
    "business_model": "Modello di business descritto o inferito",
    "competitive_advantage": "Vantaggi competitivi menzionati o inferiti",
    "team_experience": "Informazioni sul team se disponibili, altrimenti 'Da definire'",
    "funding_needed": "Informazioni sui finanziamenti se disponibili, altrimenti 'Da valutare'",
    "timeline": "Timeline di sviluppo se disponibile, altrimenti 'Da pianificare'",
    "main_challenges": "Sfide principali identificate o inferite dal settore"
  }
}

IMPORTANTE: Anche se alcune informazioni non sono esplicite, usa il contesto per fare inferenze ragionevoli. Rispondi SOLO con il JSON.
`

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
            throw new Error('Informazioni insufficienti estratte dal documento')
          }
          
          return extractedInfo
        } catch (parseError) {
          console.error('Errore parsing JSON estratto:', parseError)
          console.error('Response text:', responseText)
          // Fallback alla versione manuale
        }

      } catch (apiError) {
        console.error('Errore API Claude per estrazione:', apiError)
        // Fallback alla versione manuale
      }
    }

    // FALLBACK: Estrazione manuale semplificata
    console.log('Usando estrazione manuale fallback')
    
    const lines = text.split('\n').filter(line => line.trim().length > 0)
    const firstLine = lines[0] || 'Progetto Startup'
    
    // Estrae il titolo (prima riga o primi 50 caratteri)
    const title = firstLine.length > 50 ? firstLine.substring(0, 50) + '...' : firstLine
    
    // Usa i primi paragrafi come descrizione
    const description = text.substring(0, 300).trim() + (text.length > 300 ? '...' : '')
    
    // Estrazione manuale migliorata
    const extractedInfo: IdeaAnalysisInput = {
      title: title || 'Progetto Startup',
      description: description || 'Progetto imprenditoriale da analizzare',
      questionnaire: {
        target_market: extractFromTextAdvanced(text, ['mercato', 'clienti', 'target', 'customers', 'utenti']) || 'Mercato da definire - analisi necessaria per identificare segmenti di clientela e dimensioni del mercato',
        value_proposition: extractFromTextAdvanced(text, ['valore', 'vantaggio', 'beneficio', 'value', 'soluzione', 'problema']) || 'Value proposition da sviluppare - necessario identificare il valore unico offerto ai clienti',
        business_model: extractFromTextAdvanced(text, ['ricavi', 'monetizzazione', 'business model', 'prezzo', 'costi', 'entrate']) || 'Modello di business da strutturare - definire fonti di ricavo e strategia di pricing',
        competitive_advantage: extractFromTextAdvanced(text, ['competitivo', 'differenziazione', 'unico', 'innovazione', 'concorrenza']) || 'Vantaggio competitivo da evidenziare - analisi della differenziazione rispetto ai competitor',
        team_experience: extractFromTextAdvanced(text, ['team', 'esperienza', 'competenze', 'fondatori', 'skills']) || 'Esperienza del team da valutare - definire competenze chiave e gap da colmare',
        funding_needed: extractFromTextAdvanced(text, ['finanziamento', 'capitale', 'investimento', 'funding', 'soldi']) || 'Finanziamenti da quantificare - stimare fabbisogno di capitale per sviluppo e crescita',
        timeline: extractFromTextAdvanced(text, ['tempo', 'sviluppo', 'roadmap', 'milestone', 'piano']) || 'Timeline da pianificare - definire milestones di sviluppo prodotto e go-to-market',
        main_challenges: extractFromTextAdvanced(text, ['sfide', 'rischi', 'difficoltà', 'ostacoli', 'problemi']) || 'Sfide principali da identificare - analisi rischi di mercato, tecnici e finanziari'
      }
    }
    
    return extractedInfo

  } catch (error) {
    console.error('Errore estrazione informazioni robusta:', error)
    return null
  }
}

function extractFromTextAdvanced(text: string, keywords: string[]): string | null {
  const lowerText = text.toLowerCase()
  
  for (const keyword of keywords) {
    const index = lowerText.indexOf(keyword.toLowerCase())
    if (index !== -1) {
      // Prende il paragrafo che contiene la keyword con contesto più ampio
      const start = Math.max(0, index - 150)
      const end = Math.min(text.length, index + 300)
      let extract = text.substring(start, end).trim()
      
      // Pulisce l'estratto
      extract = extract.replace(/\s+/g, ' ').trim()
      
      if (extract.length > 30) {
        return extract
      }
    }
  }
  
  // Se non trova keywords specifiche, cerca nei primi paragrafi
  const paragraphs = text.split('\n').filter(p => p.trim().length > 50)
  if (paragraphs.length > 0) {
    return paragraphs[0].trim().substring(0, 200) + '...'
  }
  
  return null
}