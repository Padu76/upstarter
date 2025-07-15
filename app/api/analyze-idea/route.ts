import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { analyzeIdea, IdeaAnalysisInput } from '@/lib/claude'
import airtableService from '@/lib/airtable'

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 Starting idea analysis...')
    
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
    const formData = await request.json()
    
    if (!formData.businessIdea) {
      console.log('❌ Missing business idea')
      return NextResponse.json({ error: 'Business idea è richiesta' }, { status: 400 })
    }

    console.log('📝 Processing form data:', Object.keys(formData))

    // STEP 1: Prepara input per Claude
    const input: IdeaAnalysisInput = {
      businessIdea: formData.businessIdea,
      targetMarket: formData.targetMarket || 'Da definire',
      businessModel: formData.businessModel || 'Da definire',
      competitiveAdvantage: formData.competitiveAdvantage || 'Da definire',
      teamBackground: formData.teamBackground || 'Da definire',
      fundingNeeds: formData.fundingNeeds || 'Da definire',
      timeline: formData.timeline || 'Da definire',
      additionalInfo: formData.additionalInfo || ''
    }

    console.log('🤖 Step 1: Analyzing idea with Claude...')

    // STEP 2: Analisi con Claude
    const analysis = await analyzeIdea(input)
    console.log('✅ Claude analysis completed')

    // STEP 3: Genera ID univoco per il progetto
    const projectId = `proj_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
    const analysisId = `analysis_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`

    console.log('🔢 Generated IDs:', { projectId, analysisId })

    // STEP 4: Salvataggio in Airtable
    console.log('💾 Step 4: Saving to Airtable...')
    
    let savedProject = null
    let savedAnalysis = null

    try {
      // Crea o ottieni utente
      const user = await airtableService.getOrCreateUser(userEmail, userName, 'startup')
      console.log('✅ User ready:', user.id)

      // Crea progetto in Airtable
      savedProject = await airtableService.createProject({
        title: formData.businessIdea,
        description: formData.targetMarket ? `Target: ${formData.targetMarket}` : 'Analisi da form',
        source: 'form',
        status: 'analyzed',
        score: Math.round(analysis.overall_score || 65),
        type: 'standard'
      }, userEmail)

      console.log('✅ Project saved to Airtable:', savedProject.id)

      // Crea analisi in Airtable
      savedAnalysis = await airtableService.createAnalysis({
        overall_score: Math.round(analysis.overall_score || 65),
        analysis_data: JSON.stringify(analysis),
        missing_areas: JSON.stringify(analysis.missing_areas || []),
        completeness_score: Math.round(analysis.completeness_score || 60)
      }, savedProject.id)

      console.log('✅ Analysis saved to Airtable:', savedAnalysis.id)

      // Salva informazioni aggiuntive se presenti
      if (formData.additionalInfo) {
        await airtableService.createAdditionalInfo({
          category: 'additional_context',
          content: formData.additionalInfo,
          priority: 'important',
          step_required: 'pitch'
        }, savedProject.id)
        console.log('✅ Additional info saved to Airtable')
      }

    } catch (airtableError) {
      console.error('⚠️ Airtable save failed, continuing with localStorage fallback:', airtableError)
      // Continua anche se Airtable fallisce
    }

    // STEP 5: Prepara dati per response
    const projectData = {
      id: savedProject?.id || projectId,
      title: formData.businessIdea,
      description: formData.targetMarket ? `Target: ${formData.targetMarket}` : 'Analisi da form',
      score: Math.round(analysis.overall_score || 65),
      status: 'analyzed',
      type: 'standard',
      source: 'form',
      user_email: userEmail,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    const analysisData = {
      id: savedAnalysis?.id || analysisId,
      project_id: savedProject?.id || projectId,
      overall_score: Math.round(analysis.overall_score || 65),
      analysis_data: analysis,
      missing_areas: analysis.missing_areas || [],
      completeness_score: Math.round(analysis.completeness_score || 60),
      created_at: new Date().toISOString()
    }

    console.log('🎉 Form analysis completed successfully!')

    return NextResponse.json({
      success: true,
      projectData,
      analysisData,
      analysis,
      saved_to_airtable: !!savedProject
    })

  } catch (error) {
    console.error('❌ Error in analyze-idea API:', error)
    return NextResponse.json({ 
      error: 'Errore durante l\'analisi dell\'idea. Riprova più tardi.',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}