import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { IdeaAnalysisInput } from '@/lib/claude'
import airtableService from '@/lib/airtable'

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 Starting document analysis...')
    
    // Verifica autenticazione
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      console.log('❌ No authenticated user found')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userEmail = session.user.email
    const userName = session.user.name || userEmail.split('@')[0]
    
    console.log('✅ User authenticated:', userEmail)

    // Parse request body
    const { fileName, text } = await request.json()
    
    if (!fileName || !text) {
      console.log('❌ Missing fileName or text')
      return NextResponse.json({ error: 'fileName e text sono richiesti' }, { status: 400 })
    }

    console.log('📄 Processing document:', { fileName, textLength: text.length })

    // STEP 1: Estrazione informazioni dal testo
    console.log('🔍 Step 1: Extracting information from text...')
    
    const extractedInfo = await extractTextInfo(text)
    console.log('✅ Information extracted:', extractedInfo)

    // STEP 2: Analisi professionale con Claude
    console.log('🤖 Step 2: Professional analysis with Claude...')
    
    const analysis = await performProfessionalAnalysis(extractedInfo, text)
    console.log('✅ Professional analysis completed:', analysis)

    // STEP 3: Genera ID univoco per il progetto
    const projectId = `proj_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
    const analysisId = `analysis_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`

    console.log('🔢 Generated IDs:', { projectId, analysisId })

    // STEP 4: Salvataggio in Airtable
    console.log('💾 Step 4: Saving to Airtable...')
    
    let savedProject = null
    let savedAnalysis = null

    try {
      // Crea progetto in Airtable
      savedProject = await airtableService.createProject({
        title: extractedInfo.title,
        description: extractedInfo.description,
        source: 'document_professional',
        source_file: fileName,
        status: 'analyzed',
        score: Math.round(analysis.overall_score),
        type: 'professional'
      }, userEmail)

      console.log('✅ Project saved to Airtable:', savedProject.id)

      // Crea analisi in Airtable
      savedAnalysis = await airtableService.createAnalysis({
        overall_score: Math.round(analysis.overall_score),
        analysis_data: JSON.stringify(analysis),
        missing_areas: JSON.stringify(analysis.missing_areas || []),
        completeness_score: Math.round(analysis.completeness_score || 70)
      }, savedProject.id)

      console.log('✅ Analysis saved to Airtable:', savedAnalysis.id)

      // Salva informazioni aggiuntive se presenti
      if (analysis.additional_info && analysis.additional_info.length > 0) {
        for (const info of analysis.additional_info) {
          await airtableService.createAdditionalInfo({
            category: info.category,
            content: info.content,
            priority: info.priority || 'important',
            step_required: info.step_required || 'business_plan'
          }, savedProject.id)
        }
        console.log('✅ Additional info saved to Airtable')
      }

    } catch (airtableError) {
      console.error('⚠️ Airtable save failed, continuing with localStorage fallback:', airtableError)
      // Continua anche se Airtable fallisce
    }

    // STEP 5: Prepara dati per response
    const projectData = {
      id: savedProject?.id || projectId,
      title: extractedInfo.title,
      description: extractedInfo.description,
      score: Math.round(analysis.overall_score),
      status: 'analyzed',
      type: 'professional',
      source: 'document_professional',
      source_file: fileName,
      user_email: userEmail,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    const analysisData = {
      id: savedAnalysis?.id || analysisId,
      project_id: savedProject?.id || projectId,
      overall_score: Math.round(analysis.overall_score),
      analysis_data: analysis,
      missing_areas: analysis.missing_areas || [],
      completeness_score: Math.round(analysis.completeness_score || 70),
      created_at: new Date().toISOString()
    }

    console.log('🎉 Analysis completed successfully!')

    return NextResponse.json({
      success: true,
      projectData,
      analysisData,
      extractedInfo,
      analysis,
      saved_to_airtable: !!savedProject
    })

  } catch (error) {
    console.error('❌ Error in analyze-document API:', error)
    return NextResponse.json({ 
      error: 'Errore durante l\'analisi del documento. Riprova più tardi.',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// Funzione per estrarre informazioni dal testo
async function extractTextInfo(text: string): Promise<any> {
  try {
    // Estrazione semplificata - migliora secondo necessità
    const lines = text.split('\n').filter(line => line.trim().length > 0)
    
    // Cerca titolo (prima linea significativa o linea con parole chiave)
    let title = 'Startup Project'
    const titleKeywords = ['startup', 'business', 'company', 'project', 'idea', 'venture']
    
    for (const line of lines.slice(0, 10)) {
      if (line.trim().length > 10 && line.trim().length < 100) {
        const hasKeyword = titleKeywords.some(keyword => 
          line.toLowerCase().includes(keyword)
        )
        if (hasKeyword || lines.indexOf(line) === 0) {
          title = line.trim()
          break
        }
      }
    }

    // Genera descrizione dai primi paragrafi
    const description = lines.slice(0, 3).join(' ').substring(0, 300) + '...'

    return {
      title,
      description,
      content: text,
      extractedAt: new Date().toISOString()
    }

  } catch (error) {
    console.error('Error extracting text info:', error)
    return {
      title: 'Documento Analizzato',
      description: 'Analisi automatica del documento caricato',
      content: text,
      extractedAt: new Date().toISOString()
    }
  }
}

// Funzione per analisi professionale
async function performProfessionalAnalysis(extractedInfo: any, text: string): Promise<any> {
  try {
    // Importa il servizio Claude professionale
    const { analyzeProfessionalStartup } = await import('@/lib/claude-professional')
    
    const input: IdeaAnalysisInput = {
      businessIdea: extractedInfo.title,
      targetMarket: 'Da definire',
      businessModel: 'Da definire',
      competitiveAdvantage: 'Da definire',
      teamBackground: 'Da definire',
      fundingNeeds: 'Da definire',
      timeline: 'Da definire',
      additionalInfo: text
    }

    const analysis = await analyzeProfessionalStartup(input)
    
    // Calcola completeness score basato sui dati disponibili
    const completenessScore = calculateCompletenessScore(text)
    
    return {
      ...analysis,
      completeness_score: completenessScore,
      analysis_type: 'professional',
      processed_at: new Date().toISOString()
    }

  } catch (error) {
    console.error('Error in professional analysis:', error)
    
    // Fallback analysis se Claude non funziona
    return {
      overall_score: 65,
      executive_summary: 'Analisi automatica del documento caricato. Il progetto mostra potenziale ma necessita di approfondimenti.',
      market_analysis: 'Analisi di mercato da completare con dati specifici.',
      competitive_analysis: 'Analisi competitiva da approfondire.',
      team_analysis: 'Informazioni sul team da integrare.',
      financial_analysis: 'Proiezioni finanziarie da sviluppare.',
      risk_analysis: 'Valutazione dei rischi da completare.',
      recommendations: [
        'Completare l\'analisi di mercato',
        'Definire chiaramente il business model',
        'Sviluppare proiezioni finanziarie dettagliate'
      ],
      missing_areas: [
        'Ricerca di mercato dettagliata',
        'Analisi competitiva approfondita',
        'Piano finanziario completo'
      ],
      completeness_score: 50,
      analysis_type: 'fallback',
      processed_at: new Date().toISOString()
    }
  }
}

// Funzione per calcolare completeness score
function calculateCompletenessScore(text: string): number {
  const keywords = {
    market: ['mercato', 'market', 'target', 'clienti', 'customers'],
    business: ['business', 'modello', 'model', 'revenue', 'ricavi'],
    team: ['team', 'founder', 'fondatore', 'competenze', 'experience'],
    financial: ['finanziario', 'financial', 'budget', 'investimenti', 'funding'],
    product: ['prodotto', 'product', 'servizio', 'service', 'soluzione'],
    competition: ['competitori', 'competitor', 'concorrenza', 'competitive']
  }

  let score = 0
  const textLower = text.toLowerCase()

  Object.entries(keywords).forEach(([category, words]) => {
    const hasKeywords = words.some(word => textLower.includes(word))
    if (hasKeywords) score += 15
  })

  // Bonus per lunghezza del testo
  if (text.length > 1000) score += 10
  if (text.length > 5000) score += 10

  return Math.min(score, 100)
}