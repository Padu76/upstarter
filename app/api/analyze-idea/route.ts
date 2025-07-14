import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { AirtableService, TABLES } from '@/lib/airtable'
import { analyzeIdea } from '@/lib/claude'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { title, description, questionnaire } = body

    if (!title || !description || !questionnaire) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Get user from Airtable
    const users = await AirtableService.findRecords(TABLES.USERS, {
      filterByFormula: `{email} = "${session.user.email}"`
    })

    if (users.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const userId = users[0].id

    // Create project record
    const project = await AirtableService.createRecord(TABLES.PROJECTS, {
      user_id: userId,
      title,
      description,
      status: 'analyzing',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })

    // Analyze idea with Claude AI
    try {
      const analysis = await analyzeIdea({
        title,
        description,
        questionnaire
      })

      // Save analysis to Airtable
      await AirtableService.createRecord(TABLES.IDEAS_ANALYSIS, {
        project_id: project.id,
        overall_score: analysis.overall_score,
        swot_analysis: JSON.stringify(analysis.swot_analysis),
        detailed_feedback: JSON.stringify(analysis.detailed_feedback),
        next_steps: JSON.stringify(analysis.next_steps),
        created_at: new Date().toISOString()
      })

      // Update project status
      await AirtableService.updateRecord(TABLES.PROJECTS, project.id, {
        status: 'completed',
        score: analysis.overall_score,
        updated_at: new Date().toISOString()
      })

      return NextResponse.json({
        success: true,
        project_id: project.id,
        analysis
      })

    } catch (aiError) {
      console.error('Claude AI analysis error:', aiError)
      
      // Update project status to show error
      await AirtableService.updateRecord(TABLES.PROJECTS, project.id, {
        status: 'draft',
        updated_at: new Date().toISOString()
      })

      return NextResponse.json({
        error: 'AI analysis failed. Please try again.',
        project_id: project.id
      }, { status: 500 })
    }

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({
      error: 'Internal server error'
    }, { status: 500 })
  }
}