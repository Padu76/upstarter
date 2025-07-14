import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 })
    }

    // Mock projects per ora
    const mockProjects = [
      {
        id: 'analysis_1752497012339_yb7tnc8m3',
        title: 'EcoTech Solutions',
        description: 'Piattaforma IoT per Smart Cities con focus sostenibilità ambientale',
        score: 75,
        status: 'analyzed',
        type: 'professional',
        source: 'document_professional',
        source_file: 'Business Plan.docx',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ]

    return NextResponse.json({
      success: true,
      projects: mockProjects
    })

  } catch (error) {
    console.error('Errore API projects:', error)
    return NextResponse.json({ 
      success: true,
      projects: [] // Restituisci array vuoto in caso di errore
    })
  }
}