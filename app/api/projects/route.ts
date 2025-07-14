import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { AirtableService, TABLES } from '@/lib/airtable'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 })
    }

    // Mock projects per ora - sostituiremo con Airtable quando configurato
    const mockProjects = [
      {
        id: 'professional_1752497012339_yb7tnc8m3',
        title: 'EcoTech Solutions',
        description: 'Piattaforma IoT per Smart Cities con focus sostenibilità ambientale e efficienza energetica',
        score: 82,
        status: 'analyzed',
        type: 'professional',
        source: 'document_professional',
        source_file: 'Business Plan EcoTech.docx',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ]

    // Se Airtable è configurato, usa quello
    if (process.env.AIRTABLE_API_KEY && process.env.AIRTABLE_BASE_ID) {
      try {
        // Trova l'utente
        const users = await AirtableService.findRecords(TABLES.USERS, {
          filterByFormula: `{email} = "${session.user.email}"`
        })

        if (users.length > 0) {
          const userId = users[0].id
          
          // Ottieni i progetti dell'utente
          const projects = await AirtableService.findRecords(TABLES.PROJECTS, {
            filterByFormula: `{user_id} = "${userId}"`
          })

          return NextResponse.json({
            success: true,
            projects: projects.map(project => ({
              id: project.id,
              title: project.fields.title,
              description: project.fields.description,
              score: project.fields.score,
              status: project.fields.status,
              type: project.fields.source === 'document_professional' ? 'professional' : 'standard',
              source: project.fields.source,
              source_file: project.fields.source_file,
              created_at: project.fields.created_at,
              updated_at: project.fields.updated_at
            }))
          })
        }
      } catch (dbError) {
        console.error('Errore database:', dbError)
        // Fallback ai mock data
      }
    }

    // Fallback: restituisci mock data
    return NextResponse.json({
      success: true,
      projects: mockProjects
    })

  } catch (error) {
    console.error('Errore API projects:', error)
    return NextResponse.json({ 
      error: 'Errore interno del server' 
    }, { status: 500 })
  }
}