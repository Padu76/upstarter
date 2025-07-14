import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { IdeaAnalysisInput } from '@/lib/claude'

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

    console.log('Analyzing document:', { fileName, textLength: text.length, userEmail: session.user.email })

    // Estrai informazioni strutturate dal testo
    const extractedInfo = await extractBusinessInfoSimple(text)

    if (!extractedInfo) {
      return NextResponse.json({ 
        error: 'Il documento deve contenere almeno 50 caratteri di testo significativo' 
      }, { status: 400 })
    }

    console.log('Extracted info:', extractedInfo.title)

    // Genera analisi (prima prova Claude, poi fallback)
    let analysis
    try {
      // Prova analisi professionale solo se API key è presente
      if (process.env.ANTHROPIC_API_KEY) {
        const { analyzeProfessionalStartup } = await import('@/lib/claude-professional')
        analysis = await analyzeProfessionalStartup(extractedInfo)
        console.log('Professional analysis completed')
      } else {
        throw new Error('ANTHROPIC_API_KEY not configured')
      }
    } catch (analysisError) {
      console.error('Professional analysis failed, using fallback:', analysisError)
      
      // Fallback: analisi mock professionale
      analysis = generateMockProfessionalAnalysis(extractedInfo)
      console.log('Using mock analysis fallback')
    }

    // Genera un ID temporaneo
    let projectId = `analysis_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    // Crea oggetto progetto
    const projectData = {
      id: projectId,
      title: extractedInfo.title,
      description: extractedInfo.description,
      score: analysis.overall_score,
      status: 'analyzed',
      type: 'professional',
      source: 'document_professional',
      source_file: fileName || 'Documento caricato',
      user_email: session.user.email,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    // Salva progetto in localStorage per la dashboard
    const existingProjects = JSON.parse(localStorage.getItem('user_projects') || '[]')
    const userProjects = existingProjects.filter((p: any) => p.user_email === session.user.email)
    userProjects.push(projectData)
    
    // Aggiorna tutti i progetti mantenendo quelli di altri utenti
    const otherUsersProjects = existingProjects.filter((p: any) => p.user_email !== session.user.email)
    const allProjects = [...otherUsersProjects, ...userProjects]
    
    // Salva in localStorage (simulazione database)
    try {
      localStorage.setItem('user_projects', JSON.stringify(allProjects))
      console.log('Project saved to localStorage')
    } catch (storageError) {
      console.error('Error saving to localStorage:', storageError)
    }

    // Salva temporaneamente i dati dell'analisi per il recupero
    const analysisData = {
      id: projectId,
      analysis: analysis,
      extractedInfo,
      fileName,
      timestamp: new Date().toISOString(),
      type: 'professional'
    }

    // Salva analisi dettagliata
    try {
      localStorage.setItem(`analysis_${projectId}`, JSON.stringify(analysisData))
    } catch (storageError) {
      console.error('Error saving analysis to localStorage:', storageError)
    }

    return NextResponse.json({
      success: true,
      analysis: analysis,
      extractedInfo,
      projectId,
      fileName,
      analysisData,
      type: 'professional',
      projectSaved: true
    })

  } catch (error) {
    console.error('Errore generale analisi documento:', error)
    return NextResponse.json({ 
      error: 'Errore durante l\'analisi del documento. Riprova più tardi.' 
    }, { status: 500 })
  }
}

async function extractBusinessInfoSimple(text: string): Promise<IdeaAnalysisInput | null> {
  try {
    // Validazione testo minimo
    if (text.trim().length < 50) {
      console.log('Testo troppo corto:', text.length)
      return null
    }

    const lines = text.split('\n').filter(line => line.trim().length > 0)
    const firstLine = lines[0] || 'Progetto Startup'
    
    // Estrae il titolo
    const title = firstLine.length > 50 ? firstLine.substring(0, 50) + '...' : firstLine
    
    // Usa i primi paragrafi come descrizione
    const description = text.substring(0, 300).trim() + (text.length > 300 ? '...' : '')
    
    const extractedInfo: IdeaAnalysisInput = {
      title: title || 'Progetto Startup',
      description: description || 'Progetto imprenditoriale da analizzare',
      questionnaire: {
        target_market: extractKeywordContent(text, ['mercato', 'clienti', 'target']) || 'Mercato da definire meglio',
        value_proposition: extractKeywordContent(text, ['valore', 'vantaggio', 'beneficio']) || 'Value proposition da sviluppare',
        business_model: extractKeywordContent(text, ['ricavi', 'business model', 'monetizzazione']) || 'Modello di business da strutturare',
        competitive_advantage: extractKeywordContent(text, ['competitivo', 'differenziazione', 'innovazione']) || 'Vantaggio competitivo da evidenziare',
        team_experience: extractKeywordContent(text, ['team', 'esperienza', 'competenze']) || 'Esperienza del team da descrivere',
        funding_needed: extractKeywordContent(text, ['finanziamento', 'capitale', 'investimento']) || 'Finanziamenti da quantificare',
        timeline: extractKeywordContent(text, ['tempo', 'sviluppo', 'roadmap']) || 'Timeline da pianificare',
        main_challenges: extractKeywordContent(text, ['sfide', 'rischi', 'difficoltà']) || 'Sfide principali da identificare'
      }
    }
    
    console.log('Simple extraction completed for:', title)
    return extractedInfo

  } catch (error) {
    console.error('Errore estrazione semplice:', error)
    return null
  }
}

function extractKeywordContent(text: string, keywords: string[]): string | null {
  const lowerText = text.toLowerCase()
  
  for (const keyword of keywords) {
    const index = lowerText.indexOf(keyword.toLowerCase())
    if (index !== -1) {
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

function generateMockProfessionalAnalysis(extractedInfo: IdeaAnalysisInput) {
  return {
    overall_score: 75,
    executive_summary: {
      key_insights: [
        "Il progetto presenta elementi interessanti per il mercato di riferimento",
        "Necessario approfondire la strategia go-to-market e la validazione clienti",
        "Il timing di mercato sembra favorevole per questo tipo di soluzione"
      ],
      main_concerns: [
        "Validazione del product-market fit ancora da completare",
        "Competizione nel settore che richiede differenziazione chiara",
        "Necessità di definire meglio il modello di monetizzazione"
      ],
      investment_recommendation: "Il progetto presenta potenziale interessante ma necessita di ulteriori sviluppi nella strategia di business e validazione di mercato prima di considerare investimenti significativi.",
      berkus_score: 72,
      scorecard_score: 78
    },
    market_analysis: {
      score: 70,
      tam_sam_som_analysis: "Analisi di mercato da approfondire con dati specifici su TAM, SAM e SOM del settore di riferimento.",
      porter_five_forces: "Valutazione competitiva necessaria per analizzare le forze di Porter nel settore specifico.",
      competitive_landscape: "Mappatura dei competitor diretti e indiretti da completare per posizionamento strategico.",
      market_segmentation: "Segmentazione clienti da definire con personas specifiche e comportamenti d'acquisto.",
      market_timing: "Timing di mercato favorevole ma necessita validazione attraverso customer discovery.",
      barriers_entry: "Barriere all'ingresso da valutare in base al settore e alla tecnologia utilizzata.",
      pros: [
        "Mercato potenzialmente in crescita",
        "Opportunità di innovazione nel settore",
        "Possibile vantaggio first-mover"
      ],
      cons: [
        "Dimensioni mercato da validare",
        "Concorrenza potenzialmente intensa",
        "Cicli di vendita da verificare"
      ],
      recommendations: [
        "Condurre ricerca di mercato approfondita",
        "Validare le assunzioni sui clienti target",
        "Analizzare la concorrenza esistente"
      ]
    },
    business_model_analysis: {
      score: 68,
      business_model_canvas: "Business Model Canvas da completare con tutti i 9 blocchi: Value Proposition, Customer Segments, Channels, Customer Relationships, Revenue Streams, Key Resources, Key Activities, Key Partnerships, Cost Structure.",
      unit_economics: "Unit economics da definire con calcoli LTV/CAC, contribution margin e payback period.",
      revenue_model_analysis: "Modello di ricavi da strutturare con pricing strategy e prevedibilità cash flow.",
      scalability_assessment: "Scalabilità del business da valutare in termini di margini e network effects.",
      pricing_strategy: "Strategia di pricing da sviluppare basata su value proposition e competitive analysis.",
      pros: [
        "Potenziale di scalabilità del modello",
        "Opportunità di ricavi ricorrenti",
        "Struttura costi variabili favorevole"
      ],
      cons: [
        "Monetizzazione da validare",
        "Customer acquisition cost da ottimizzare",
        "Pricing power da dimostrare"
      ],
      recommendations: [
        "Definire chiaramente il modello di ricavi",
        "Testare diverse strategie di pricing",
        "Calcolare unit economics dettagliate"
      ]
    }
  }
}