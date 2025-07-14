import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import airtableService from '@/lib/airtable'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 })
    }

    console.log('Loading projects for user:', session.user.email)

    let userProjects: any[] = []
    let usingDatabase = false

    // Prova a caricare da Airtable se configurato
    if (process.env.AIRTABLE_API_KEY && process.env.AIRTABLE_BASE_ID) {
      try {
        console.log('Loading from Airtable...')
        
        // Trova l'utente
        const user = await airtableService.findUserByEmail(session.user.email)
        
        if (user) {
          // Carica progetti dell'utente
          const projects = await airtableService.findProjectsByUser(user.id!)
          
          userProjects = projects.map(project => ({
            id: project.id,
            title: project.title,
            description: project.description,
            score: project.score,
            status: project.status,
            type: project.type,
            source: project.source,
            source_file: project.source_file,
            user_email: session.user.email,
            created_at: project.created_at,
            updated_at: project.updated_at,
            saved_to_database: true
          }))
          
          usingDatabase = true
          console.log(`Loaded ${userProjects.length} projects from Airtable`)
        } else {
          console.log('User not found in Airtable')
        }
        
      } catch (airtableError) {
        console.error('Error loading from Airtable:', airtableError)
        // Fallback a localStorage verrà gestito dal client
      }
    }

    return NextResponse.json({
      success: true,
      projects: userProjects,
      user_email: session.user.email,
      using_database: usingDatabase,
      fallback_to_localstorage: !usingDatabase
    })

  } catch (error) {
    console.error('Errore API projects:', error)
    return NextResponse.json({ 
      success: true,
      projects: [],
      error: 'Errore caricamento progetti',
      fallback_to_localstorage: true
    })
  }
}

// Endpoint per eliminare un progetto
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const projectId = searchParams.get('id')

    if (!projectId) {
      return NextResponse.json({ error: 'ID progetto mancante' }, { status: 400 })
    }

    let deletedFromDatabase = false

    // Prova a eliminare da Airtable se configurato
    if (process.env.AIRTABLE_API_KEY && process.env.AIRTABLE_BASE_ID) {
      try {
        console.log('Deleting from Airtable:', projectId)
        
        const success = await airtableService.deleteProject(projectId)
        if (success) {
          deletedFromDatabase = true
          console.log('Successfully deleted from Airtable')
        }
        
      } catch (airtableError) {
        console.error('Error deleting from Airtable:', airtableError)
        // Il client gestirà l'eliminazione da localStorage
      }
    }

    return NextResponse.json({
      success: true,
      deleted_from_database: deletedFromDatabase,
      project_id: projectId
    })

  } catch (error) {
    console.error('Errore eliminazione progetto:', error)
    return NextResponse.json({ 
      error: 'Errore durante l\'eliminazione del progetto' 
    }, { status: 500 })
  }
}

// Endpoint per salvare progetti (fallback da localStorage)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 })
    }

    const { projects } = await request.json()

    if (!Array.isArray(projects)) {
      return NextResponse.json({ error: 'Formato progetti non valido' }, { status: 400 })
    }

    let savedProjects = 0

    // Salva in Airtable se configurato
    if (process.env.AIRTABLE_API_KEY && process.env.AIRTABLE_BASE_ID) {
      try {
        console.log('Syncing projects to Airtable...')
        
        // Inizializza utente
        const user = await airtableService.initializeUser(
          session.user.email,
          session.user.name || undefined
        )
        
        for (const project of projects) {
          try {
            // Controlla se il progetto esiste già
            const existingProjects = await airtableService.findRecords('Projects', {
              filterByFormula: `{title} = "${project.title}"`
            })
            
            if (existingProjects.length === 0) {
              await airtableService.createProject({
                user_id: user.id!,
                title: project.title,
                description: project.description,
                score: project.score,
                status: project.status,
                type: project.type,
                source: project.source,
                source_file: project.source_file,
                created_at: project.created_at,
                updated_at: project.updated_at
              })
              savedProjects++
            }
          } catch (projectError) {
            console.error('Error saving individual project:', projectError)
          }
        }
        
        console.log(`Synced ${savedProjects} projects to Airtable`)
        
      } catch (airtableError) {
        console.error('Error syncing to Airtable:', airtableError)
      }
    }

    return NextResponse.json({
      success: true,
      synced_projects: savedProjects,
      message: `${savedProjects} progetti sincronizzati con il database`
    })

  } catch (error) {
    console.error('Errore sincronizzazione progetti:', error)
    return NextResponse.json({ 
      error: 'Errore durante la sincronizzazione dei progetti' 
    }, { status: 500 })
  }
}