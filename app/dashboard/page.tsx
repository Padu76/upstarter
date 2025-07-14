'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Plus, TrendingUp, Users, Brain, ArrowRight, Lightbulb, Target, Rocket } from 'lucide-react'

export default function DashboardPage() {
  const [projects] = useState([
    {
      id: 1,
      title: "EcoDelivery",
      description: "Servizio di consegna sostenibile per e-commerce",
      score: 87,
      status: "analyzed",
      createdAt: "2024-03-15"
    },
    {
      id: 2,
      title: "HealthAI",
      description: "AI per diagnostica medica preventiva",
      score: 92,
      status: "in_progress",
      createdAt: "2024-03-10"
    }
  ])

  const stats = {
    totalProjects: projects.length,
    avgScore: Math.round(projects.reduce((acc, p) => acc + p.score, 0) / projects.length) || 0,
    completedAnalyses: projects.filter(p => p.status === 'analyzed').length,
    activeProjects: projects.filter(p => p.status === 'in_progress').length
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Monitora i tuoi progetti e scopri nuove opportunità</p>
        </div>
        <Link
          href="/dashboard/new-idea"
          className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
        >
          <Plus className="w-5 h-5" />
          Nuova Idea
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Lightbulb className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Progetti Totali</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalProjects}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Score Medio</p>
              <p className="text-2xl font-bold text-gray-900">{stats.avgScore}%</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Brain className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Analisi Complete</p>
              <p className="text-2xl font-bold text-gray-900">{stats.completedAnalyses}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Rocket className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Progetti Attivi</p>
              <p className="text-2xl font-bold text-gray-900">{stats.activeProjects}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-6">
        <Link
          href="/dashboard/new-idea"
          className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-6 hover:from-blue-100 hover:to-blue-200 transition-all group"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-blue-600 rounded-lg">
              <Target className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold text-gray-900">Analizza Nuova Idea</h3>
          </div>
          <p className="text-gray-600 text-sm mb-4">
            Ottieni un feedback dettagliato sulla tua startup idea con il nostro sistema AI
          </p>
          <div className="flex items-center gap-2 text-blue-600 font-medium group-hover:gap-3 transition-all">
            <span>Inizia Analisi</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </Link>

        <Link
          href="/dashboard/teamup"
          className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-xl p-6 hover:from-purple-100 hover:to-purple-200 transition-all group"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-purple-600 rounded-lg">
              <Users className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold text-gray-900">Trova Co-founder</h3>
          </div>
          <p className="text-gray-600 text-sm mb-4">
            Connettiti con sviluppatori, designer e altri imprenditori per il tuo team
          </p>
          <div className="flex items-center gap-2 text-purple-600 font-medium group-hover:gap-3 transition-all">
            <span>Esplora TeamUp</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </Link>

        <Link
          href="/dashboard/investors"
          className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl p-6 hover:from-green-100 hover:to-green-200 transition-all group"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-green-600 rounded-lg">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold text-gray-900">Trova Investitori</h3>
          </div>
          <p className="text-gray-600 text-sm mb-4">
            Presenta il tuo progetto a investitori interessati al tuo settore
          </p>
          <div className="flex items-center gap-2 text-green-600 font-medium group-hover:gap-3 transition-all">
            <span>Cerca Investitori</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </Link>
      </div>

      {/* Recent Projects */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Progetti Recenti</h2>
            <Link href="/dashboard/projects" className="text-blue-600 hover:text-blue-700 font-medium">
              Vedi tutti
            </Link>
          </div>
        </div>

        <div className="p-6">
          {projects.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lightbulb className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Nessun progetto ancora</h3>
              <p className="text-gray-600 mb-4">
                Inizia analizzando la tua prima idea startup per ottenere feedback dettagliato
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
                <div key={project.id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">{project.title}</h3>
                      <p className="text-gray-600 text-sm mb-2">{project.description}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>Score: <span className="font-medium text-blue-600">{project.score}%</span></span>
                        <span>•</span>
                        <span>{new Date(project.createdAt).toLocaleDateString('it-IT')}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        project.status === 'analyzed' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {project.status === 'analyzed' ? 'Analizzato' : 'In Progress'}
                      </span>
                      <Link
                        href={`/dashboard/projects/${project.id}`}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        <ArrowRight className="w-4 h-4" />
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