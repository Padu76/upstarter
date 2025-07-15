'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { 
  Plus, BarChart3, FileText, TrendingUp, Users, DollarSign, 
  Clock, Star, ArrowRight, Zap, Target, Brain, Award,
  AlertCircle, CheckCircle, Calendar, Upload
} from 'lucide-react'

interface Project {
  id: string
  title: string
  description: string
  score: number
  status: 'draft' | 'analyzed' | 'archived'
  type: 'standard' | 'professional'
  source: 'form' | 'document' | 'document_professional'
  created_at: string
  analysis_id?: string
}

interface DashboardStats {
  total: number
  analyzed: number
  draft: number
  avgScore: number
}

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [projects, setProjects] = useState<Project[]>([])
  const [stats, setStats] = useState<DashboardStats>({ total: 0, analyzed: 0, draft: 0, avgScore: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (status === 'loading') return
    if (!session) {
      router.push('/auth/signin')
      return
    }
    loadDashboardData()
  }, [session, status])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Carica progetti dal localStorage
      const localProjects = loadLocalProjects()
      
      // Se non ci sono progetti locali, prova a caricare dall'API
      if (localProjects.length === 0) {
        await loadProjectsFromAPI()
      } else {
        setProjects(localProjects)
        calculateStats(localProjects)
      }

    } catch (error) {
      console.error('Error loading dashboard data:', error)
      setError('Errore nel caricamento dei dati')
    } finally {
      setLoading(false)
    }
  }

  const loadLocalProjects = (): Project[] => {
    try {
      // Carica dalla lista progetti
      const projectsList = JSON.parse(localStorage.getItem('projects') || '[]')
      
      // Carica anche dalle analisi salvate
      const analysisProjects: Project[] = []
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key && key.startsWith('analysis_')) {
          try {
            const analysisData = JSON.parse(localStorage.getItem(key) || '{}')
            if (analysisData.title && analysisData.id) {
              analysisProjects.push({
                id: analysisData.project_id || analysisData.id,
                title: analysisData.title || 'Progetto Senza Titolo',
                description: analysisData.description || 'Analisi professionale',
                score: analysisData.overall_score || 0,
                status: 'analyzed' as const,
                type: analysisData.type || 'professional' as const,
                source: analysisData.source || 'document_professional' as const,
                created_at: analysisData.created_at || new Date().toISOString(),
                analysis_id: key
              })
            }
          } catch (e) {
            console.warn('Error parsing analysis data for key:', key)
          }
        }
      }

      // Combina e deduplica progetti
      const allProjects = [...projectsList, ...analysisProjects]
      const uniqueProjects = allProjects.filter((project, index, self) => 
        index === self.findIndex(p => p.id === project.id)
      )

      // Ordina per data di creazione (più recenti prima)
      return uniqueProjects.sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )

    } catch (error) {
      console.error('Error loading local projects:', error)
      return []
    }
  }

  const loadProjectsFromAPI = async () => {
    try {
      const response = await fetch('/api/projects')
      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setProjects(data.projects || [])
          setStats(data.stats || { total: 0, analyzed: 0, draft: 0, avgScore: 0 })
        }
      }
    } catch (error) {
      console.error('Error loading projects from API:', error)
    }
  }

  const calculateStats = (projectList: Project[]) => {
    const total = projectList.length
    const analyzed = projectList.filter(p => p.status === 'analyzed').length
    const draft = projectList.filter(p => p.status === 'draft').length
    const avgScore = total > 0 
      ? Math.round(projectList.reduce((acc, p) => acc + (p.score || 0), 0) / total)
      : 0

    setStats({ total, analyzed, draft, avgScore })
  }

  const handleProjectClick = (project: Project) => {
    // Usa URL corretti basati sul tipo di progetto
    if (project.analysis_id) {
      // Se ha analysis_id, vai alla pagina di analisi
      const analysisId = project.analysis_id.replace('analysis_', '')
      router.push(`/dashboard/analysis/${analysisId}`)
    } else if (project.type === 'professional' || project.source === 'document_professional') {
      // Se è professionale, prova con l'ID del progetto
      router.push(`/dashboard/analysis/${project.id}`)
    } else {
      // Fallback per progetti standard
      router.push(`/dashboard/projects/${project.id}`)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100'
    if (score >= 60) return 'text-yellow-600 bg-yellow-100'
    if (score >= 40) return 'text-orange-600 bg-orange-100'
    return 'text-red-600 bg-red-100'
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'analyzed': return <CheckCircle className="w-4 h-4 text-green-600" />
      case 'draft': return <Clock className="w-4 h-4 text-yellow-600" />
      default: return <AlertCircle className="w-4 h-4 text-gray-600" />
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Caricamento dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600 mt-1">
                Benvenuto, {session?.user?.name || session?.user?.email}
              </p>
            </div>
            <button
              onClick={() => router.push('/dashboard/new-idea')}
              className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
            >
              <Plus className="w-5 h-5 mr-2" />
              Nuova Analisi
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
            <AlertCircle className="w-5 h-5 text-red-500 mr-3" />
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Progetti Totali</p>
                <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <BarChart3 className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Analizzati</p>
                <p className="text-3xl font-bold text-green-600">{stats.analyzed}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">In Bozza</p>
                <p className="text-3xl font-bold text-yellow-600">{stats.draft}</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-full">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Score Medio</p>
                <p className="text-3xl font-bold text-purple-600">{stats.avgScore}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div 
            onClick={() => router.push('/dashboard/new-idea')}
            className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white cursor-pointer hover:from-blue-600 hover:to-blue-700 transition-all transform hover:-translate-y-1"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold mb-2">Questionario Guidato</h3>
                <p className="text-blue-100">Analisi rapida della tua startup</p>
              </div>
              <FileText className="w-8 h-8 text-blue-200" />
            </div>
          </div>

          <div 
            onClick={() => router.push('/dashboard/new-idea')}
            className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white cursor-pointer hover:from-green-600 hover:to-green-700 transition-all transform hover:-translate-y-1"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold mb-2">Analisi Documento</h3>
                <p className="text-green-100">Upload del business plan</p>
              </div>
              <Upload className="w-8 h-8 text-green-200" />
            </div>
          </div>
        </div>

        {/* Recent Projects */}
        <div className="bg-white rounded-xl shadow-lg">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Progetti Recenti</h2>
              {projects.length > 0 && (
                <button 
                  onClick={() => router.push('/dashboard/projects')}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  Vedi tutti
                </button>
              )}
            </div>
          </div>

          <div className="p-6">
            {projects.length === 0 ? (
              <div className="text-center py-12">
                <Brain className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Nessun progetto ancora</h3>
                <p className="text-gray-600 mb-6">Inizia analizzando la tua prima idea startup</p>
                <button
                  onClick={() => router.push('/dashboard/new-idea')}
                  className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Crea Primo Progetto
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {projects.slice(0, 5).map((project) => (
                  <div
                    key={project.id}
                    onClick={() => handleProjectClick(project)}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 cursor-pointer transition-all"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        {getStatusIcon(project.status)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-lg font-medium text-gray-900 truncate">
                          {project.title || 'Progetto Senza Titolo'}
                        </h4>
                        <p className="text-sm text-gray-600 truncate">
                          {project.description || 'Nessuna descrizione'}
                        </p>
                        <div className="flex items-center space-x-4 mt-2">
                          <span className="text-xs text-gray-500">
                            {new Date(project.created_at).toLocaleDateString('it-IT')}
                          </span>
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            project.type === 'professional' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                          }`}>
                            {project.type === 'professional' ? 'Professionale' : 'Standard'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      {project.score > 0 && (
                        <div className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(project.score)}`}>
                          {project.score}/100
                        </div>
                      )}
                      <ArrowRight className="w-5 h-5 text-gray-400" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}