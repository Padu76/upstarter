'use client'

import { ArrowLeft, Plus, BarChart3, Clock, CheckCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function ProjectsPage() {
  const router = useRouter()

  // Mock projects data
  const projects = [
    {
      id: 'professional_1752497012339_yb7tnc8m3',
      title: 'EcoTech Solutions',
      description: 'Piattaforma IoT per Smart Cities con focus sostenibilità',
      score: 82,
      status: 'analyzed',
      type: 'professional',
      createdAt: '2025-01-14T13:30:00Z',
      fileName: 'Business Plan EcoTech.docx'
    }
  ]

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

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">I Miei Progetti</h1>
          <p className="text-gray-600 mt-1">Gestisci e monitora le tue analisi startup</p>
        </div>
        <Link
          href="/dashboard/new-idea"
          className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
        >
          <Plus className="w-5 h-5" />
          Nuova Analisi
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
      </div>

      {/* Projects List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Progetti Recenti</h2>
        </div>

        <div className="p-6">
          {projects.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Nessun progetto ancora</h3>
              <p className="text-gray-600 mb-4">
                Inizia analizzando la tua prima idea startup
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
                      <p className="text-gray-600 text-sm mb-3">{project.description}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>Score: <span className="font-medium text-blue-600">{project.score}%</span></span>
                        <span>•</span>
                        <span>{new Date(project.createdAt).toLocaleDateString('it-IT')}</span>
                        {project.fileName && (
                          <>
                            <span>•</span>
                            <span>📄 {project.fileName}</span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="text-2xl font-bold text-gray-900">{project.score}</div>
                        <div className="text-xs text-gray-500">Score</div>
                      </div>
                      <Link
                        href={`/dashboard/analysis/${project.id}`}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-semibold text-sm"
                      >
                        Vedi Analisi
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}