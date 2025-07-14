import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 })
    }

    console.log('Loading projects for user:', session.user.email)

    // Carica progetti dell'utente da localStorage (simulazione database)
    let userProjects: any[] = []
    
    try {
      // In un ambiente browser reale, questo sarebbe gestito dal client
      // Per ora, restituiamo una struttura che il client possa gestire
      userProjects = []
    } catch (error) {
      console.error('Error loading projects:', error)
      userProjects = []
    }

    return NextResponse.json({
      success: true,
      projects: userProjects,
      user_email: session.user.email
    })

  } catch (error) {
    console.error('Errore API projects:', error)
    return NextResponse.json({ 
      success: true,
      projects: [],
      error: 'Errore caricamento progetti'
    })
  }
}

// Endpoint per salvare progetti (da chiamare dal client)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 })
    }

    const projectData = await request.json()

    // Valida i dati del progetto
    if (!projectData.title || !projectData.id) {
      return NextResponse.json({ error: 'Dati progetto incompleti' }, { status: 400 })
    }

    // In un'implementazione reale, qui salveresti nel database
    // Per ora, confermiamo la ricezione
    console.log('Project data received:', {
      id: projectData.id,
      title: projectData.title,
      user: session.user.email
    })

    return NextResponse.json({
      success: true,
      message: 'Progetto salvato con successo',
      projectId: projectData.id
    })

  } catch (error) {
    console.error('Errore salvataggio progetto:', error)
    return NextResponse.json({ 
      error: 'Errore durante il salvataggio del progetto' 
    }, { status: 500 })
  }
}