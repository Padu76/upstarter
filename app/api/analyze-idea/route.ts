import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { AirtableService, TABLES } from '@/lib/airtable'
import { analyzeIdea } from '@/lib/claude'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { title, description, questionnaire } = body

    // Validate input
    if (!title || !description || !questionnaire) {
      return NextResponse.json(
        { error: 'Missing required fields' }, 
        { status: 400 }
      )
    }

    // Analyze with Claude AI
    const analysis = await analyzeIdea({ title, description, questionnaire })

    // Save project to Airtable
    const project = await AirtableService.create(TABLES.PROJECTS, {
      user_id: session.user.id,
      title,
      description,
      status: 'draft',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })

    // Save analysis to Airtable
    const savedAnalysis = await AirtableService.create(TABLES.IDEAS_ANALYSIS, {
      project_id: project.id,
      questionnaire_data: JSON.stringify(questionnaire),
      ai_analysis: JSON.stringify(analysis),
      overall_score: analysis.overall_score,
      created_at: new Date().toISOString()
    })

    return NextResponse.json({
      success: true,
      project_id: project.id,
      analysis_id: savedAnalysis.id,
      analysis
    })

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    )
  }
}