'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { 
  BarChart3, CheckCircle, Clock, TrendingUp, Users, DollarSign, 
  Plus, ArrowRight, FileText, Upload, Edit2, Trash2, Check, X
} from 'lucide-react'
import DocumentAnalyzer from '@/components/DocumentAnalyzer'
import ProjectEditModal from '@/components/ProjectEditModal'

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
}

export default function Dashboard() {
  const { data: session } = useSession()
  const router = useRouter()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [showDocumentAnalyzer, setShowDocumentAnalyzer] = useState(false)
  const [editingProject, setEditingProject] = useState<string | null>(null)
  const [newTitle, setNewTitle] = useState('')
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [showEditModal, setShowEditModal] = useState(false)

  useEffect(() => {
    loadProjects()
  }, [session])

  const loadProjects = () => {
    try {
      const storedProjects = localStorage.getItem('projects')
      if (storedProjects) {
        const parsedProjects = JSON.parse(storedProjects)
        console.log('Loaded projects for user:', session?.user?.email, parsedProjects.length)
        setProjects(parsedProjects)
      }
    } catch (error) {
      console.error('Error loading projects:', error)
    } finally {
      setLoading(false)
    }
  }

  const deleteProject = async (projectId: string) => {
    try {
      // Rimuovi da localStorage
      const projects = JSON.parse(localStorage.getItem('projects') || '[]')
      const updatedProjects = projects.filter((p: any) => p.id !== projectId)
      localStorage.setItem('projects', JSON.stringify(updatedProjects))
      
      // Rimuovi analisi associata
      const project = projects.find((p: any) => p.id === projectId)
      if (project?.analysis_id) {
        localStorage.removeItem(`analysis_${project.analysis_id}`)
        // Rimuovi anche le possibili chiavi con doppio prefisso
        localStorage.removeItem(`analysis_analysis_${project.analysis_id}`)
      }
      
      // Aggiorna stato
      setProjects(updatedProjects)
      
      // Dispatch event per aggiornare sidebar
      window.dispatchEvent(new Event('projectsUpdated'))
      
      console.log('Progetto eliminato con successo')
    } catch (error) {
      console.error('Errore eliminazione progetto:', error)
    }
  }

  const confirmDelete = (project: Project) => {
    const confirmed = window.confirm(
      `Sei sicuro di voler eliminare il progetto "${project.title}"? Questa azione non può essere annullata.`
    )
    if (confirmed) {
      deleteProject(project.id)
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

      // Aggiorna localStorage
      const projects = JSON.parse(localStorage.getItem('projects') || '[]')
      const updatedProjects = projects.map((p: any) => 
        p.id === projectId ? { ...p, title: newTitle.trim(), updated_at: new Date().toISOString() } : p
      )
      localStorage.setItem('projects', JSON.stringify(updatedProjects))

      // Aggiorna anche l'analisi associata
      const project = projects.find((p: any) => p.id === projectId)
      if (project?.analysis_id) {
        const analysisKey = `analysis_${project.analysis_id}`
        const analysisKeyDouble = `analysis_analysis_${project.analysis_id}`
        
        // Prova entrambe le chiavi
        let analysis = JSON.parse(localStorage.getItem(analysisKey) || '{}')
        if (!analysis.id) {
          analysis = JSON.parse(localStorage.getItem(analysisKeyDouble) || '{}')
        }
        
        if (analysis.id) {
          analysis.title = newTitle.trim()
          localStorage.setItem(analysisKey, JSON.stringify(analysis))
          if (localStorage.getItem(analysisKeyDouble)) {
            localStorage.setItem(analysisKeyDouble, JSON.stringify(analysis))
          }
        }
      }

      // Aggiorna stato
      setProjects(updatedProjects)
      setEditingProject(null)
      setNewTitle('')
      
      // Dispatch event per aggiornare sidebar
      window.dispatchEvent(new Event('projectsUpdated'))
      
      console.log('Titolo aggiornato con successo')
    } catch (error) {
      console.error('Errore rinomina progetto:', error)
    }
  }

  const cancelEditing = () => {
    setEditingProject(null)
    setNewTitle('')
  }

  const openEditModal = (project: Project) => {
    setSelectedProject(project)
    setShowEditModal(true)
  }

  const saveProjectChanges = async (updatedProject: Project) => {
    try {
      // Aggiorna localStorage
      const projects = JSON.parse(localStorage.getItem('projects') || '[]')
      const updatedProjects = projects.map((p: any) => 
        p.id === updatedProject.id ? updatedProject : p
      )
      localStorage.setItem('projects', JSON.stringify(updatedProjects))

      // Aggiorna stato
      setProjects(updatedProjects)
      setShowEditModal(false)
      setSelectedProject(null)
      
      // Dispatch event per aggiornare sidebar
      window.dispatchEvent(new Event('projectsUpdated'))
      
      console.log('Progetto aggiornato con successo')
      
      // Potresti voler rigenerare l'analisi qui
      // regenerateAnalysis(updatedProject)
    } catch (error) {
      console.error('Errore aggiornamento progetto:', error)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreBackground = (score: number) => {
    if (score >= 80) return 'bg-green-100'
    if (score >= 60) return 'bg-yellow-100'
    return 'bg-red-100'
  }

  const completedProjects = projects.filter(p => p.status === 'completed').length
  const draftProjects = projects.filter(p => p.status === 'draft').length

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

  if (showDocumentAnalyzer) {
    return (
      <DocumentAnalyzer 
        onAnalysisComplete={(analysis) => {
          loadProjects()
          setShowDocumentAnalyzer(false)
        }}
      />
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600">Benvenuto, {session?.user?.name}</p>
          </div>
          <button
            onClick={() => router.push('/dashboard/guided')}
            className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5 mr-2" />
            Nuova Analisi
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Progetti Totali</h3>
              <BarChart3 className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600">{projects.length}</div>
              <div className="text-gray-600 text-sm mt-1">progetti</div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Analizzati</h3>
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600">{completedProjects}</div>
              <div className="text-gray-600 text-sm mt-1">completati</div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">In Bozza</h3>
              <Clock className="w-5 h-5 text-yellow-600" />
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-yellow-600">{draftProjects}</div>
              <div className="text-gray-600 text-sm mt-1">in lavorazione</div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div 
            className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white cursor-pointer hover:from-blue-600 hover:to-blue-700 transition-all"
            onClick={() => router.push('/dashboard/guided')}
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xl font-semibold">Questionario Guidato</h3>
                <p className="text-blue-100 mt-1">Analisi rapida della tua startup</p>
              </div>
              <FileText className="w-8 h-8 text-blue-100" />
            </div>
          </div>

          <div 
            className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white cursor-pointer hover:from-green-600 hover:to-green-700 transition-all"
            onClick={() => setShowDocumentAnalyzer(true)}
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xl font-semibold">Analisi Documento</h3>
                <p className="text-green-100 mt-1">Upload del business plan</p>
              </div>
              <Upload className="w-8 h-8 text-green-100" />
            </div>
          </div>
        </div>

        {/* Projects List */}
        <div className="bg-white rounded-xl shadow-lg">
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-xl font-semibold text-gray-900">Progetti Recenti</h2>
            <button
              onClick={() => router.push('/dashboard/projects')}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              Vedi tutti
            </button>
          </div>

          <div className="divide-y">
            {projects.length === 0 ? (
              <div className="p-8 text-center">
                <div className="text-gray-400 mb-4">
                  <BarChart3 className="w-12 h-12 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Nessun progetto ancora</h3>
                <p className="text-gray-600 mb-4">Inizia creando la tua prima analisi startup</p>
                <button
                  onClick={() => router.push('/dashboard/guided')}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Crea Primo Progetto
                </button>
              </div>
            ) : (
              projects.slice(0, 5).map((project) => (
                <div key={project.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      {editingProject === project.id ? (
                        <div className="flex items-center space-x-2">
                          <input
                            type="text"
                            value={newTitle}
                            onChange={(e) => setNewTitle(e.target.value)}
                            className="flex-1 px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Nome progetto"
                            autoFocus
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                saveTitle(project.id)
                              }
                            }}
                          />
                          <button
                            onClick={() => saveTitle(project.id)}
                            className="text-green-600 hover:text-green-800"
                            title="Salva"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={cancelEditing}
                            className="text-gray-600 hover:text-gray-800"
                            title="Annulla"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900">{project.title}</h3>
                            <div className="flex items-center space-x-4 mt-1">
                              <span className="text-sm text-gray-500">
                                {new Date(project.created_at).toLocaleDateString('it-IT')}
                              </span>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                project.type === 'professional' ? 'bg-purple-100 text-purple-600' :
                                project.type === 'guided' ? 'bg-blue-100 text-blue-600' :
                                'bg-green-100 text-green-600'
                              }`}>
                                {project.type === 'professional' ? 'Professionale' :
                                 project.type === 'guided' ? 'Guidata' : 'Documento'}
                              </span>
                            </div>
                          </div>
                          <button
                            onClick={() => startEditing(project)}
                            className="text-gray-400 hover:text-blue-600 transition-colors"
                            title="Rinomina progetto"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-3 ml-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreBackground(project.score)} ${getScoreColor(project.score)}`}>
                        {project.score}/100
                      </span>
                      
                      <button
                        onClick={() => openEditModal(project)}
                        className="text-blue-600 hover:text-blue-800 transition-colors"
                        title="Modifica progetto"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      
                      <button
                        onClick={() => router.push(`/dashboard/analysis/${project.analysis_id}`)}
                        className="text-blue-600 hover:text-blue-800 transition-colors"
                        title="Visualizza analisi"
                      >
                        <ArrowRight className="w-4 h-4" />
                      </button>
                      
                      <button
                        onClick={() => confirmDelete(project)}
                        className="text-red-600 hover:text-red-800 transition-colors"
                        title="Elimina progetto"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && selectedProject && (
        <ProjectEditModal
          project={selectedProject}
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false)
            setSelectedProject(null)
          }}
          onSave={saveProjectChanges}
        />
      )}
    </div>
  )
}