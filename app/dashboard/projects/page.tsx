'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, Plus, BarChart3, Clock, CheckCircle, Loader, Trash2, Eye, Calendar } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Link from 'next/link'

interface Project {
  id: string
  title: string
  description: string
  score: number
  status: string
  type: string
  source: string
  source_file?: string
  user_email: string
  created_at: string
  updated_at: string
}

export default function ProjectsPage() {
  const router = useRouter()
  const { data: session } = useSession()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (session?.user?.email) {
      loadUserProjects()
    }
  }, [session])

  const loadUserProjects = () => {
    try {
      setLoading(true)
      
      // Carica progetti dell'utente da localStorage
      const allProjects = JSON.parse(localStorage.getItem('user_projects') || '[]')
      const userProjects = allProjects.filter((project: Project) => 
        project.user_email === session?.user?.email
      )
      
      // Ordina per data di creazione (più recenti prima)
      const sortedProjects = userProjects.sort((a: Project, b: Project) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )
      
      setProjects(sortedProjects)
      console.log('Loaded projects for user:', session?.user?.email, sortedProjects.length)
      
    } catch (error) {
      console.error('Errore caricamento progetti:', error)
      setError('Errore nel caricamento dei progetti')
      setProjects([])
    } finally {
      setLoading(false)
    }
  }

  const deleteProject = (projectId: string) => {
    try {
      // Rimuovi da localStorage
      const allProjects = JSON.parse(localStorage.getItem('user_projects') || '[]')
      const updatedProjects = allProjects.filter((project: Project) => project.id !== projectId)
      localStorage.setItem('user_projects', JSON.stringify(updatedProjects))
      
      // Rimuovi anche l'analisi dettagliata
      localStorage.removeItem(`analysis_${projectId}`)
      localStorage.removeItem(`additional_info_${projectId}`)
      
      // Aggiorna stato locale
      setProjects(projects.filter(project => project.id !== projectId))
      
      console.log('Project deleted:', projectId)
    } catch (error) {
      console.error('Errore eliminazione progetto:', error)
      setError('Errore durante l\'eliminazione del progetto')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'analyzed': return 'bg-green-100 text-green-800'
      case 'draft': return 'bg-orange-100 text-orange-800'
      case 'archived': return 'bg-gray-100 text-gray-800'
      default: return 'bg-blue-100 text-blue-800'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'analyzed': return 'Analizzato'
      case 'draft': return 'Bozza'
      case 'archived': return 'Archiviato'
      default: return 'In Progress'
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-orange-600'
    return 'text-red-600'
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('it-IT', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Caricamento progetti...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">I Miei Progetti</h1>
          <p className="text-gray-600 mt-1">
            Gestisci e monitora le tue analisi startup
            {session?.user?.email && (
              <span className="text-sm ml-2 text-blue-600">({session.user.email})</span>
            )}
          </p>
          {error && (
            <p className="text-red-600 text-sm mt-1">⚠️ {error}</p>
          )}
        </div>
        <div className="flex gap-3">
          <button
            onClick={loadUserProjects}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
          >
            <Clock className="w-4 h-4" />
            Aggiorna
          </button>
          <Link
            href="/dashboard/new-idea"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
          >
            <Plus className="w-5 h-5" />
            Nuova Analisi
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <BarChart3 className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Progetti Totali</p>
              <p className="text-2xl font-bold text-gray-900">{projects.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Analisi Complete</p>
              <p className="text-2xl font-bold text-gray-900">
                {projects.filter(p => p.status === 'analyzed').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Clock className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Score Medio</p>
              <p className="text-2xl font-bold text-gray-900">
                {projects.length > 0 ? Math.round(projects.reduce((acc, p) => acc + p.score, 0) / projects.length) : 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Calendar className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Ultimo Progetto</p>
              <p className="text-sm font-bold text-gray-900">
                {projects.length > 0 ? formatDate(projects[0].created_at).split(',')[0] : 'Nessuno'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Projects List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">I Tuoi Progetti</h2>
            {projects.length > 0 && (
              <span className="text-sm text-gray-500">
                {projects.length} progetto{projects.length !== 1 ? 'i' : ''}
              </span>
            )}
          </div>
        </div>

        <div className="p-6">
          {projects.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Nessun progetto ancora</h3>
              <p className="text-gray-600 mb-6">
                Inizia analizzando la tua prima idea startup caricando un documento o compilando il questionario
              </p>
              <Link
                href="/dashboard/new-idea"
                className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
              >
                <Plus className="w-5 h-5" />
                Analizza Prima Idea
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {projects.map((project) => (
                <div key={project.id} className="border border-gray-200 rounded-lg p-6 hover:border-blue-300 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-gray-900">{project.title}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                          {getStatusLabel(project.status)}
                        </span>
                        {project.type === 'professional' && (
                          <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
                            Analisi VC
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">{project.description}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>Score: <span className={`font-medium ${getScoreColor(project.score)}`}>{project.score}%</span></span>
                        <span>•</span>
                        <span>{formatDate(project.created_at)}</span>
                        {project.source_file && (
                          <>
                            <span>•</span>
                            <span>📄 {project.source_file}</span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className={`text-2xl font-bold ${getScoreColor(project.score)}`}>
                          {project.score}
                        </div>
                        <div className="text-xs text-gray-500">Score</div>
                      </div>
                      <div className="flex gap-2">
                        <Link
                          href={`/dashboard/analysis/${project.id}`}
                          className="flex items-center gap-1 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors font-semibold text-sm"
                        >
                          <Eye className="w-4 h-4" />
                          Vedi
                        </Link>
                        <button
                          onClick={() => {
                            if (confirm('Sei sicuro di voler eliminare questo progetto?')) {
                              deleteProject(project.id)
                            }
                          }}
                          className="flex items-center gap-1 border border-red-300 text-red-600 px-3 py-2 rounded-lg hover:bg-red-50 transition-colors font-semibold text-sm"
                        >
                          <Trash2 className="w-4 h-4" />
                          Elimina
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      {projects.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="font-semibold text-blue-900 mb-3">🚀 Prossimi Passi</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <Link
              href="/dashboard/new-idea"
              className="flex items-center gap-3 p-4 bg-white border border-blue-200 rounded-lg hover:border-blue-300 transition-colors"
            >
              <Plus className="w-5 h-5 text-blue-600" />
              <div>
                <div className="font-medium text-gray-900">Nuova Analisi</div>
                <div className="text-sm text-gray-600">Analizza un'altra idea</div>
              </div>
            </Link>
            
            <Link
              href="/dashboard/teamup"
              className="flex items-center gap-3 p-4 bg-white border border-blue-200 rounded-lg hover:border-blue-300 transition-colors"
            >
              <CheckCircle className="w-5 h-5 text-blue-600" />
              <div>
                <div className="font-medium text-gray-900">Trova Co-founder</div>
                <div className="text-sm text-gray-600">Completa il team</div>
              </div>
            </Link>
            
            <Link
              href="/dashboard/investors"
              className="flex items-center gap-3 p-4 bg-white border border-blue-200 rounded-lg hover:border-blue-300 transition-colors"
            >
              <BarChart3 className="w-5 h-5 text-blue-600" />
              <div>
                <div className="font-medium text-gray-900">Cerca Investitori</div>
                <div className="text-sm text-gray-600">Trova finanziamenti</div>
              </div>
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}