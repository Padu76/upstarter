import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { AirtableService, TABLES } from '@/lib/airtable'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user from Airtable
    const users = await AirtableService.findRecords(TABLES.USERS, {
      filterByFormula: `{email} = "${session.user.email}"`
    })

    if (users.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const userId = users[0].id

    // Get user's projects
    const projects = await AirtableService.findRecords(TABLES.PROJECTS, {
      filterByFormula: `{user_id} = "${userId}"`,
      sort: [{ field: 'created_at', direction: 'desc' }]
    })

    return NextResponse.json({
      success: true,
      projects: projects.map(project => ({
        id: project.id,
        title: project.fields.title,
        description: project.fields.description,
        status: project.fields.status,
        score: project.fields.score,
        created_at: project.fields.created_at,
        updated_at: project.fields.updated_at
      }))
    })

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({
      error: 'Internal server error'
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { title, description } = body

    if (!title || !description) {
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

    // Create project
    const project = await AirtableService.createRecord(TABLES.PROJECTS, {
      user_id: userId,
      title,
      description,
      status: 'draft',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })

    return NextResponse.json({
      success: true,
      project: {
        id: project.id,
        title: project.fields.title,
        description: project.fields.description,
        status: project.fields.status,
        score: project.fields.score,
        created_at: project.fields.created_at,
        updated_at: project.fields.updated_at
      }
    })

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({
      error: 'Internal server error'
    }, { status: 500 })
  }
}