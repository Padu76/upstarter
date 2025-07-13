'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { 
  Lightbulb, 
  Users, 
  TrendingUp, 
  Target, 
  Plus, 
  ArrowRight, 
  BarChart3, 
  Clock, 
  Star,
  MessageCircle,
  UserPlus,
  CheckCircle,
  AlertCircle,
  Trophy
} from 'lucide-react'

interface Project {
  id: string
  title: string
  description: string
  score: number
  status: 'draft' | 'analyzing' | 'completed'
  created_at: string
  last_updated: string
}

interface DashboardStats {
  total_projects: number
  avg_score: number
  completed_analyses: number
  improvement_tasks: number
  matches_found: number
  messages_received: number
}

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [projects, setProjects] = useState<Project[]>([])
  const [stats, setStats] = useState<DashboardStats>({
    total_projects: 0,
    avg_score: 0,
    completed_analyses: 0,
    improvement_tasks: 0,
    matches_found: 0,
    messages_received: 0
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    }
  }, [status, router])

  useEffect(() => {
    if (session?.user) {
      fetchDashboardData()
    }
  }, [session])

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true)
      // Simulate API calls
      const mockProjects: Project[] = [
        {
          id: '1',
          title: 'EcoFood Delivery',
          description: 'Piattaforma di delivery sostenibile con packaging biodegradabile',
          score: 78,
          status: 'completed',
          created_at: '2025-01-10',
          last_updated: '2025-01-12'
        },
        {
          id: '2', 
          title: 'AI Study Buddy',
          description: 'Assistente AI per studenti universitari',
          score: 0,
          status: 'draft',
          created_at: '2025-01-13',
          last_updated: '2025-01-13'
        }
      ]

      const mockStats: DashboardStats = {
        total_projects: 2,
        avg_score: 78,
        completed_analyses: 1,
        improvement_tasks: 5,
        matches_found: 3,
        messages_received: 2
      }

      setProjects(mockProjects)
      setStats(mockStats)
    } catch (error) {
      console.error('Errore nel caricamento dati:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">Completata</span>
      case 'analyzing':
        return <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">In analisi</span>
      case 'draft':
        return <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs font-medium rounded-full">Bozza</span>
      default:
        return null
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    if (score >= 40) return 'text-orange-600'
    return 'text-red-600'
  }

  if (status === 'loading' || isLoading) {
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
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Ciao, {session?.user?.name?.split(' ')[0]}! 👋
              </h1>
              <p className="text-gray-600">Ecco un riepilogo delle tue attività</p>
            </div>
            <button
              onClick={() => router.push('/dashboard/new-idea')}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Nuova Idea
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Progetti Totali</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total_projects}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Lightbulb className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Score Medio</p>
                <p className={`text-2xl font-bold ${getScoreColor(stats.avg_score)}`}>
                  {stats.avg_score > 0 ? `${stats.avg_score}%` : '-'}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <BarChart3 className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Match Trovati</p>
                <p className="text-2xl font-bold text-gray-900">{stats.matches_found}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Task Attivi</p>
                <p className="text-2xl font-bold text-gray-900">{stats.improvement_tasks}</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-lg">
                <Target className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Projects List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm">
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-900">I Tuoi Progetti</h2>
                <button
                  onClick={() => router.push('/dashboard/projects')}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  Vedi tutti
                </button>
              </div>
              <div className="p-6">
                {projects.length === 0 ? (
                  <div className="text-center py-8">
                    <Lightbulb className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Nessun progetto ancora</h3>
                    <p className="text-gray-600 mb-4">Inizia creando la tua prima idea startup!</p>
                    <button
                      onClick={() => router.push('/dashboard/new-idea')}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Crea Prima Idea
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {projects.map((project) => (
                      <div key={project.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                           onClick={() => router.push(`/dashboard/projects/${project.id}`)}>
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold text-gray-900">{project.title}</h3>
                          {getStatusBadge(project.status)}
                        </div>
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{project.description}</p>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-4">
                            {project.score > 0 && (
                              <div className="flex items-center gap-1">
                                <Star className="w-4 h-4 text-yellow-500" />
                                <span className={`text-sm font-medium ${getScoreColor(project.score)}`}>
                                  {project.score}%
                                </span>
                              </div>
                            )}
                            <div className="flex items-center gap-1 text-gray-500 text-xs">
                              <Clock className="w-3 h-3" />
                              {new Date(project.last_updated).toLocaleDateString('it-IT')}
                            </div>
                          </div>
                          <ArrowRight className="w-4 h-4 text-gray-400" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Quick Actions & Notifications */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Azioni Rapide</h2>
              </div>
              <div className="p-6 space-y-3">
                <button
                  onClick={() => router.push('/dashboard/new-idea')}
                  className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Plus className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Nuova Idea</p>
                    <p className="text-sm text-gray-600">Analizza una nuova startup idea</p>
                  </div>
                </button>

                <button
                  onClick={() => router.push('/dashboard/teamup')}
                  className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <UserPlus className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Trova Team</p>
                    <p className="text-sm text-gray-600">Cerca co-founder e collaboratori</p>
                  </div>
                </button>

                <button
                  onClick={() => router.push('/dashboard/improvement')}
                  className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <div className="p-2 bg-green-100 rounded-lg">
                    <TrendingUp className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Piano Miglioramento</p>
                    <p className="text-sm text-gray-600">Continua i task assegnati</p>
                  </div>
                </button>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Attività Recenti</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="p-1 bg-green-100 rounded-full">
                      <CheckCircle className="w-3 h-3 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">Analisi completata per "EcoFood Delivery"</p>
                      <p className="text-xs text-gray-500">2 giorni fa</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-1 bg-blue-100 rounded-full">
                      <MessageCircle className="w-3 h-3 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">Nuovo messaggio da un potenziale co-founder</p>
                      <p className="text-xs text-gray-500">3 giorni fa</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-1 bg-yellow-100 rounded-full">
                      <Trophy className="w-3 h-3 text-yellow-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">Hai raggiunto un score di 78%!</p>
                      <p className="text-xs text-gray-500">1 settimana fa</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tips */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <AlertCircle className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">💡 Suggerimento</h3>
                  <p className="text-sm text-gray-600">
                    Per aumentare il tuo score, completa l'analisi di mercato e definisci meglio il tuo business model.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}