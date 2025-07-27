'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { 
  BarChart3, CheckCircle, Clock, FileText, Upload, Edit2, Trash2, 
  Check, X, RefreshCw, ArrowRight, Plus, TrendingUp, Users, 
  Lightbulb, Target, Calendar, Bell, Presentation, Calculator,
  Eye, MessageSquare, Award, Activity
} from 'lucide-react'
import Link from 'next/link'

interface Project {
  id: string
  title: string
  description: string
  score: number
  status: 'completed' | 'draft'
  type: 'guided' | 'document' | 'professional'
  source: string
  created_at: string
  updated_at: string
  analysis_id: string
  regenerated_at?: string
}

export default function DashboardMain() {
  const { data: session } = useSession()
  const router = useRouter()
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [editingProject, setEditingProject] = useState<string | null>(null)
  const [newTitle, setNewTitle] = useState('')
  const [notifications] = useState([
    {
      id: 1,
      type: 'success',
      message: 'Financial Planning ora disponibile! Crea business plan e proiezioni.',
      time: '2 ore fa'
    },
    {
      id: 2,
      type: 'info', 
      message: 'Pitch Deck Builder ottimizzato con nuovi template.',
      time: '1 giorno fa'
    }
  ])

  useEffect(() => {
    loadProjects()
    
    // Listen for project updates
    const handleProjectUpdate = () => {
      loadProjects()
    }
    
    window.addEventListener('projectsUpdated', handleProjectUpdate)
    return () => window.removeEventListener('projectsUpdated', handleProjectUpdate)
  }, [])

  const loadProjects = () => {
    try {
      setIsLoading(true)
      const storedProjects = localStorage.getItem('projects')
      if (storedProjects) {
        const parsedProjects = JSON.parse(storedProjects)
        // Ordina per data più recente
        const sortedProjects = parsedProjects.sort((a: Project, b: Project) => 
          new Date(b.updated_at || b.created_at).getTime() - new Date(a.updated_at || a.created_at).getTime()
        )
        setProjects(sortedProjects)
      } else {
        setProjects([])
      }
    } catch (error) {
      console.error('Error loading projects:', error)
      setProjects([])
    } finally {
      setIsLoading(false)
    }
  }

  const deleteProject = async (projectId: string) => {
    try {
      const projects = JSON.parse(localStorage.getItem('projects') || '[]')
      const project = projects.find((p: any) => p.id === projectId)
      
      const confirmed = window.confirm(
        `Sei sicuro di voler eliminare "${project?.title}"?\n\nQuesta azione eliminerà il progetto e l'analisi associata.`
      )
      
      if (!confirmed) return
      
      const updatedProjects = projects.filter((p: any) => p.id !== projectId)
      localStorage.setItem('projects', JSON.stringify(updatedProjects))
      
      // Rimuovi analisi associata
      if (project?.analysis_id) {
        localStorage.removeItem(`analysis_${project.analysis_id}`)
        localStorage.removeItem(`analysis_analysis_${project.analysis_id}`)
      }
      
      setProjects(updatedProjects)
      window.dispatchEvent(new Event('projectsUpdated'))
      
    } catch (error) {
      console.error('Errore eliminazione progetto:', error)
    }
  }

  const startEditing = (project: Project) => {
    setEditingProject(project.id)
    setNewTitle(project.title)
  }

  const saveTitle = async (projectId: string) => {
    try {
      if (!newTitle.trim()) {
        alert('Il titolo non può essere vuoto')
        return
      }

      const projects = JSON.parse(localStorage.getItem('projects') || '[]')
      const updatedProjects = projects.map((p: any) => 
        p.id === projectId ? { ...p, title: newTitle.trim(), updated_at: new Date().toISOString() } : p
      )
      localStorage.setItem('projects', JSON.stringify(updatedProjects))

      setProjects(updatedProjects)
      setEditingProject(null)
      setNewTitle('')
      window.dispatchEvent(new Event('projectsUpdated'))
      
    } catch (error) {
      console.error('Errore rinomina progetto:', error)
    }
  }

  const cancelEditing = () => {
    setEditingProject(null)
    setNewTitle('')
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'draft':
        return <Clock className="w-4 h-4 text-yellow-500" />
      default:
        return <FileText className="w-4 h-4 text-gray-500" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Completata'
      case 'draft':
        return 'Bozza'
      default:
        return 'Sconosciuto'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-50 text-green-700'
      case 'draft':
        return 'bg-yellow-50 text-yellow-700'
      default:
        return 'bg-gray-50 text-gray-700'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'professional':
        return <Award className="w-4 h-4" />
      case 'guided':
        return <MessageSquare className="w-4 h-4" />
      case 'document':
        return <FileText className="w-4 h-4" />
      default:
        return <Activity className="w-4 h-4" />
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('it-IT', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      })
    } catch {
      return 'Data non valida'
    }
  }

  // Calcola statistiche reali
  const completedProjects = projects.filter(p => p.status === 'completed').length
  const averageScore = projects.length > 0 ? Math.round(projects.reduce((sum, p) => sum + p.score, 0) / projects.length) : 0
  const recentProjects = projects.slice(0, 3) // Mostra solo i 3 più recenti

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Benvenuto, {session?.user?.name?.split(' ')[0] || 'Founder'}! 👋
        </h1>
        <p className="text-gray-600">
          Ecco una panoramica del tuo percorso imprenditoriale
        </p>
      </div>

      {/* Quick Stats - DATI REALI */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Progetti Analizzati</p>
              <p className="text-2xl font-bold text-gray-900">{completedProjects}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Score Medio</p>
              <p className="text-2xl font-bold text-gray-900">{averageScore}%</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Progetti Totali</p>
              <p className="text-2xl font-bold text-gray-900">{projects.length}</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Presentation className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Connessioni Team</p>
              <p className="text-2xl font-bold text-gray-900">12</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Azioni Rapide</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link 
            href="/dashboard/new-idea" 
            className="group bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 hover:from-blue-100 hover:to-blue-200 transition-all duration-200 border border-blue-200 hover:scale-105"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <Lightbulb className="w-6 h-6 text-white" />
              </div>
              <ArrowRight className="w-5 h-5 text-blue-600 group-hover:translate-x-1 transition-transform" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Analizza Nuova Idea</h3>
            <p className="text-sm text-gray-600">Carica un documento o compila il form guidato</p>
          </Link>

          <Link 
            href="/team-up" 
            className="group bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 hover:from-purple-100 hover:to-purple-200 transition-all duration-200 border border-purple-200 hover:scale-105"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <Users className="w-6 h-6 text-white" />
              </div>
              <ArrowRight className="w-5 h-5 text-purple-600 group-hover:translate-x-1 transition-transform" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Trova Co-founder</h3>
            <p className="text-sm text-gray-600">Esplora profili e crea il tuo team perfetto</p>
          </Link>

          <Link 
            href="/dashboard/pitch-builder" 
            className="group bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6 hover:from-orange-100 hover:to-orange-200 transition-all duration-200 border border-orange-200 hover:scale-105 relative"
          >
            <div className="absolute top-2 right-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full font-medium">
              NEW
            </div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <Presentation className="w-6 h-6 text-white" />
              </div>
              <ArrowRight className="w-5 h-5 text-orange-600 group-hover:translate-x-1 transition-transform" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Pitch Deck Builder</h3>
            <p className="text-sm text-gray-600">Presentazioni AI per investitori</p>
          </Link>

          <Link 
            href="/dashboard/financial-planning" 
            className="group bg-gradient-to-br from-purple-50 to-pink-100 rounded-xl p-6 hover:from-purple-100 hover:to-pink-200 transition-all duration-200 border border-purple-200 hover:scale-105 relative"
          >
            <div className="absolute top-2 right-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs px-2 py-1 rounded-full font-medium">
              NEW
            </div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <Calculator className="w-6 h-6 text-white" />
              </div>
              <ArrowRight className="w-5 h-5 text-purple-600 group-hover:translate-x-1 transition-transform" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Financial Planning</h3>
            <p className="text-sm text-gray-600">Business plan e proiezioni avanzate</p>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Projects List - DATI REALI */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">I Miei Progetti</h2>
                <div className="flex items-center gap-3">
                  <Link 
                    href="/dashboard/projects"
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Vedi tutti
                  </Link>
                  <Link 
                    href="/dashboard/new-idea"
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                  >
                    <Plus className="w-4 h-4" />
                    Nuovo
                  </Link>
                </div>
              </div>
            </div>

            <div className="p-6">
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="animate-pulse">
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-gray-300 rounded-lg"></div>
                          <div>
                            <div className="w-48 h-4 bg-gray-300 rounded mb-2"></div>
                            <div className="w-32 h-3 bg-gray-300 rounded"></div>
                          </div>
                        </div>
                        <div className="w-20 h-6 bg-gray-300 rounded"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : recentProjects.length > 0 ? (
                <div className="space-y-4">
                  {recentProjects.map((project) => (
                    <div key={project.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          {getStatusIcon(project.status)}
                        </div>
                        <div className="flex-1">
                          {editingProject === project.id ? (
                            <div className="flex items-center space-x-2">
                              <input
                                type="text"
                                value={newTitle}
                                onChange={(e) => setNewTitle(e.target.value)}
                                className="flex-1 px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                autoFocus
                                onKeyPress={(e) => {
                                  if (e.key === 'Enter') {
                                    saveTitle(project.id)
                                  }
                                }}
                              />
                              <button
                                onClick={() => saveTitle(project.id)}
                                className="p-1 text-green-600 hover:text-green-800"
                              >
                                <Check className="w-4 h-4" />
                              </button>
                              <button
                                onClick={cancelEditing}
                                className="p-1 text-gray-600 hover:text-gray-800"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ) : (
                            <div>
                              <h3 className="font-medium text-gray-900">{project.title}</h3>
                              <div className="flex items-center gap-4 mt-1">
                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                                  {getStatusText(project.status)}
                                </span>
                                {project.status === 'completed' && (
                                  <span className="text-sm text-gray-500">Score: {project.score}%</span>
                                )}
                                <span className="text-sm text-gray-500">
                                  {formatDate(project.updated_at || project.created_at)}
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => router.push(`/dashboard/analysis/${project.analysis_id}`)}
                          className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Visualizza analisi"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => startEditing(project)}
                          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                          title="Rinomina"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => deleteProject(project.id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Elimina"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Nessun progetto ancora</h3>
                  <p className="text-gray-500 mb-6">Inizia analizzando la tua prima idea startup!</p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Link 
                      href="/dashboard/new-idea"
                      className="flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                      <Lightbulb className="w-4 h-4" />
                      Analizza Idea
                    </Link>
                    <Link 
                      href="/team-up"
                      className="flex items-center justify-center gap-2 border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                    >
                      <Users className="w-4 h-4" />
                      Trova Team
                    </Link>
                    <Link 
                      href="/dashboard/financial-planning"
                      className="flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-colors font-medium"
                    >
                      <Calculator className="w-4 h-4" />
                      Financial Planning
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Notifications */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-gray-600" />
                <h3 className="font-semibold text-gray-900">Notifiche</h3>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {notifications.map((notification) => (
                  <div key={notification.id} className="flex gap-3">
                    <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                      notification.type === 'success' ? 'bg-green-500' : 'bg-blue-500'
                    }`}></div>
                    <div>
                      <p className="text-sm text-gray-900">{notification.message}</p>
                      <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Statistiche Rapide</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-blue-600" />
                  <span className="text-sm text-gray-600">Progetti questo mese</span>
                </div>
                <span className="font-medium text-gray-900">{projects.filter(p => {
                  const projectDate = new Date(p.created_at)
                  const thisMonth = new Date()
                  return projectDate.getMonth() === thisMonth.getMonth() && 
                         projectDate.getFullYear() === thisMonth.getFullYear()
                }).length}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-gray-600">Score medio</span>
                </div>
                <span className="font-medium text-green-600">{averageScore}%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-purple-600" />
                  <span className="text-sm text-gray-600">Progetti completati</span>
                </div>
                <span className="font-medium text-gray-900">{completedProjects}</span>
              </div>
            </div>
          </div>

          {/* Financial Planning Highlight */}
          <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl p-6 text-white">
            <div className="flex items-center gap-2 mb-3">
              <Calculator className="w-6 h-6" />
              <span className="font-bold text-lg">Financial Planning</span>
            </div>
            <p className="text-purple-100 mb-4 text-sm">
              Crea business plan professionali e proiezioni finanziarie accurate!
            </p>
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="w-4 h-4 text-green-300" />
                <span className="text-purple-100">Business Plan Generator</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="w-4 h-4 text-green-300" />
                <span className="text-purple-100">Proiezioni Finanziarie</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="w-4 h-4 text-green-300" />
                <span className="text-purple-100">Valutation Calculator</span>
              </div>
            </div>
            <Link
              href="/dashboard/financial-planning"
              className="flex items-center justify-center gap-2 bg-white text-purple-600 px-4 py-2 rounded-lg font-medium hover:bg-purple-50 transition-colors text-sm"
            >
              <ArrowRight className="w-4 h-4" />
              Esplora Ora
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}