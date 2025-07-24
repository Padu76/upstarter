'use client'

import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { 
  ArrowLeft, TrendingUp, AlertCircle, CheckCircle, Target, Users, DollarSign, 
  Clock, Download, Share, Star, ThumbsUp, ThumbsDown, Plus, Upload, FileText, 
  AlertTriangle, Info, Lightbulb, Presentation, FileCheck, Edit3, MessageSquare,
  BarChart3, PieChart, LineChart, Activity, Shield, Zap, Building2, Rocket,
  Brain, TrendingDown, Award, Flag, ChevronRight, ExternalLink
} from 'lucide-react'
import { useSession } from 'next-auth/react'
import AICoach from '@/components/AICoach'

interface ProfessionalAnalysis {
  overall_score: number
  valuation_range: {
    min: number
    max: number
    recommended: number
  }
  berkus_analysis: any
  scorecard_analysis: any
  risk_factor_analysis: any
  market_analysis: any
  competitive_analysis: any
  financial_analysis: any
  team_analysis: any
  product_analysis: any
  investment_readiness: any
  recommendations: string[]
  missing_areas: string[]
  next_steps: any
  executive_summary?: string
}

export default function ProfessionalAnalysisPage() {
  const params = useParams()
  const router = useRouter()
  const { data: session } = useSession()
  const [analysis, setAnalysis] = useState<any>(null)
  const [professionalData, setProfessionalData] = useState<ProfessionalAnalysis | null>(null)
  const [activeTab, setActiveTab] = useState('overview')
  const [loading, setLoading] = useState(true)
  const [showAICoach, setShowAICoach] = useState(false)
  const [project, setProject] = useState<any>(null)

  useEffect(() => {
    loadAnalysis()
  }, [params.id])

  const loadAnalysis = () => {
    try {
      const analysisId = params.id as string
      const storedAnalysis = localStorage.getItem(`analysis_${analysisId}`)
      
      if (storedAnalysis) {
        const parsedAnalysis = JSON.parse(storedAnalysis)
        setAnalysis(parsedAnalysis)
        
        // Estrai l'analisi professionale
        if (parsedAnalysis.analysis_data?.professional_analysis) {
          setProfessionalData(parsedAnalysis.analysis_data.professional_analysis)
        } else if (parsedAnalysis.professional_analysis) {
          setProfessionalData(parsedAnalysis.professional_analysis)
        }

        // Carica il progetto associato
        const projects = JSON.parse(localStorage.getItem('projects') || '[]')
        const relatedProject = projects.find((p: any) => p.analysis_id === analysisId)
        if (relatedProject) {
          setProject(relatedProject)
        }
      }
    } catch (error) {
      console.error('Error loading analysis:', error)
    } finally {
      setLoading(false)
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

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) {
      return `€${(amount / 1000000).toFixed(1)}M`
    } else if (amount >= 1000) {
      return `€${(amount / 1000).toFixed(0)}K`
    }
    return `€${amount.toLocaleString()}`
  }

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-green-600 bg-green-100'
      case 'medium': return 'text-yellow-600 bg-yellow-100'
      case 'high': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getScoreCategory = (score: number) => {
    if (score >= 80) return { label: 'Eccellente', color: 'text-green-600' }
    if (score >= 70) return { label: 'Molto Buono', color: 'text-green-600' }
    if (score >= 60) return { label: 'Buono', color: 'text-yellow-600' }
    if (score >= 50) return { label: 'Sufficiente', color: 'text-yellow-600' }
    return { label: 'Da Migliorare', color: 'text-red-600' }
  }

  const handleImproveProject = (improvements: any) => {
    console.log('Improvements to apply:', improvements)
    setShowAICoach(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Caricamento analisi professionale...</p>
        </div>
      </div>
    )
  }

  if (!professionalData) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Analisi Non Disponibile</h2>
            <p className="text-gray-600 mb-6">L'analisi professionale per questo progetto non è disponibile o è stata rimossa.</p>
            <button
              onClick={() => router.push('/dashboard')}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Torna alla Dashboard
            </button>
          </div>
        </div>
      </div>
    )
  }

  const scoreCategory = getScoreCategory(professionalData.overall_score)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/dashboard')}
                className="flex items-center text-gray-600 hover:text-blue-600 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Dashboard
              </button>
              <div className="border-l border-gray-300 h-6"></div>
              <h1 className="text-2xl font-bold text-gray-900">
                {analysis?.title || 'Analisi Professionale'}
              </h1>
            </div>
            <div className="flex items-center space-x-3">
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreBackground(professionalData.overall_score)} ${getScoreColor(professionalData.overall_score)}`}>
                Score: {professionalData.overall_score}/100
              </div>
              <span className={`text-sm font-medium ${scoreCategory.color}`}>
                {scoreCategory.label}
              </span>
              <button
                onClick={() => setShowAICoach(true)}
                className="flex items-center px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 transition-colors"
              >
                <Brain className="w-4 h-4 mr-2" />
                AI Coach
              </button>
              <button className="flex items-center px-4 py-2 text-blue-600 hover:text-blue-700 transition-colors">
                <Download className="w-4 h-4 mr-2" />
                Esporta Report
              </button>
              <button className="flex items-center px-4 py-2 text-blue-600 hover:text-blue-700 transition-colors">
                <Share className="w-4 h-4 mr-2" />
                Condividi
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* AI Coach Suggestion Bar */}
      {professionalData.overall_score < 80 && (
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 border-b border-purple-200">
          <div className="max-w-7xl mx-auto px-6 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Brain className="w-5 h-5 text-purple-600" />
                <div>
                  <p className="text-sm font-medium text-purple-900">
                    Il tuo progetto può migliorare! 
                    <span className="ml-1 text-purple-600">Score potenziale: {Math.min(professionalData.overall_score + 25, 100)}/100</span>
                  </p>
                  <p className="text-xs text-purple-700">
                    L'AI Coach può guidarti passo-passo per ottimizzare le aree più critiche
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowAICoach(true)}
                className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
              >
                <Zap className="w-4 h-4 mr-2" />
                Migliora Ora
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Panoramica', icon: BarChart3 },
              { id: 'valuation', label: 'Valutazione', icon: DollarSign },
              { id: 'market', label: 'Mercato', icon: TrendingUp },
              { id: 'competitive', label: 'Competitività', icon: Target },
              { id: 'financial', label: 'Finanziario', icon: PieChart },
              { id: 'team', label: 'Team', icon: Users },
              { id: 'product', label: 'Prodotto', icon: Rocket },
              { id: 'risks', label: 'Rischi', icon: Shield },
              { id: 'recommendations', label: 'Raccomandazioni', icon: Lightbulb }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-4 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <tab.icon className="w-4 h-4 mr-2" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Executive Summary */}
            {professionalData.executive_summary && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Executive Summary</h3>
                <div className="prose max-w-none text-gray-700">
                  <div className="whitespace-pre-line">{professionalData.executive_summary}</div>
                </div>
              </div>
            )}

            {/* Score Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Score Complessivo</h3>
                  <Activity className="w-5 h-5 text-blue-600" />
                </div>
                <div className="text-center">
                  <div className={`text-4xl font-bold ${getScoreColor(professionalData.overall_score)}`}>
                    {professionalData.overall_score}
                  </div>
                  <div className="text-gray-600 text-sm mt-1">su 100</div>
                  <div className="mt-2">
                    <span className={`text-sm font-medium ${scoreCategory.color}`}>
                      {scoreCategory.label}
                    </span>
                  </div>
                  <div className="mt-4">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${professionalData.overall_score}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Valutazione</h3>
                  <DollarSign className="w-5 h-5 text-green-600" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Minima:</span>
                    <span className="font-semibold">{formatCurrency(professionalData.valuation_range.min)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Raccomandata:</span>
                    <span className="font-semibold text-green-600">{formatCurrency(professionalData.valuation_range.recommended)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Massima:</span>
                    <span className="font-semibold">{formatCurrency(professionalData.valuation_range.max)}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Investment Readiness</h3>
                  <Flag className="w-5 h-5 text-purple-600" />
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Pitch Deck:</span>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getScoreBackground(professionalData.investment_readiness.pitch_deck_quality.score)} ${getScoreColor(professionalData.investment_readiness.pitch_deck_quality.score)}`}>
                      {professionalData.investment_readiness.pitch_deck_quality.score}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Business Plan:</span>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getScoreBackground(professionalData.investment_readiness.business_plan_completeness.score)} ${getScoreColor(professionalData.investment_readiness.business_plan_completeness.score)}`}>
                      {professionalData.investment_readiness.business_plan_completeness.score}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Due Diligence:</span>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getScoreBackground(professionalData.investment_readiness.due_diligence_readiness.score)} ${getScoreColor(professionalData.investment_readiness.due_diligence_readiness.score)}`}>
                      {professionalData.investment_readiness.due_diligence_readiness.score}%
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-gray-600">Berkus Method</span>
                  <Award className="w-4 h-4 text-yellow-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {formatCurrency(professionalData.berkus_analysis.total_valuation)}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {professionalData.berkus_analysis.summary || 'Valutazione basata su 5 fattori chiave'}
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-gray-600">Scorecard</span>
                  <BarChart3 className="w-4 h-4 text-blue-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {professionalData.scorecard_analysis.weighted_score}/100
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {professionalData.scorecard_analysis.summary || 'Score ponderato per fattori'}
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-gray-600">Market Size</span>
                  <TrendingUp className="w-4 h-4 text-green-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {formatCurrency(professionalData.market_analysis.som_analysis.size)}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  SOM - {professionalData.market_analysis.som_analysis.confidence}% confidence
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-gray-600">Risk Level</span>
                  <Shield className="w-4 h-4 text-red-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {professionalData.risk_factor_analysis.total_risk_adjustment > 0 ? '+' : ''}{professionalData.risk_factor_analysis.total_risk_adjustment}%
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {professionalData.risk_factor_analysis.summary || 'Aggiustamento per rischi'}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Prossime Azioni Immediate</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {professionalData.next_steps.immediate_actions.map((action: any, index: number) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        action.priority === 'high' ? 'bg-red-100 text-red-600' :
                        action.priority === 'medium' ? 'bg-yellow-100 text-yellow-600' :
                        'bg-green-100 text-green-600'
                      }`}>
                        {action.priority === 'high' ? 'Alta' : action.priority === 'medium' ? 'Media' : 'Bassa'}
                      </span>
                      <span className="text-xs text-gray-500">{action.timeline}</span>
                    </div>
                    <p className="text-sm text-gray-700">{action.action}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB VALUTAZIONE */}
        {activeTab === 'valuation' && (
          <div className="space-y-8">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Valutazione Professionale</h3>
              
              {/* Valuation Range */}
              <div className="mb-8">
                <h4 className="text-md font-semibold text-gray-800 mb-4">Range di Valutazione</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-red-50 rounded-lg">
                    <div className="text-2xl font-bold text-red-600 mb-1">
                      {formatCurrency(professionalData.valuation_range.min)}
                    </div>
                    <div className="text-sm text-red-700">Valutazione Minima</div>
                    <div className="text-xs text-gray-500 mt-2">Scenario conservativo</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600 mb-1">
                      {formatCurrency(professionalData.valuation_range.recommended)}
                    </div>
                    <div className="text-sm text-green-700">Valutazione Raccomandata</div>
                    <div className="text-xs text-gray-500 mt-2">Scenario più probabile</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600 mb-1">
                      {formatCurrency(professionalData.valuation_range.max)}
                    </div>
                    <div className="text-sm text-blue-700">Valutazione Massima</div>
                    <div className="text-xs text-gray-500 mt-2">Scenario ottimistico</div>
                  </div>
                </div>
              </div>

              {/* Berkus Method */}
              <div className="mb-8">
                <h4 className="text-md font-semibold text-gray-800 mb-4">Metodo Berkus</h4>
                <div className="space-y-4">
                  {Object.entries(professionalData.berkus_analysis).filter(([key]) => key !== 'total_valuation' && key !== 'summary').map(([key, value]: [string, any]) => (
                    <div key={key} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-medium text-gray-900 capitalize">
                          {key.replace(/_/g, ' ')}
                        </h5>
                        <span className="text-lg font-bold text-green-600">
                          {formatCurrency(value.score)}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600 mb-2">
                        Max: {formatCurrency(value.max)}
                      </div>
                      <p className="text-sm text-gray-700">{value.reasoning}</p>
                    </div>
                  ))}
                  <div className="border-t pt-4">
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-semibold text-gray-900">Valutazione Totale Berkus:</span>
                      <span className="text-2xl font-bold text-green-600">
                        {formatCurrency(professionalData.berkus_analysis.total_valuation)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Scorecard Method */}
              <div className="mb-8">
                <h4 className="text-md font-semibold text-gray-800 mb-4">Metodo Scorecard</h4>
                <div className="space-y-4">
                  {Object.entries(professionalData.scorecard_analysis).filter(([key]) => !['weighted_score', 'summary'].includes(key)).map(([key, value]: [string, any]) => (
                    <div key={key} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-medium text-gray-900 capitalize">
                          {key.replace(/_/g, ' ')}
                        </h5>
                        <div className="text-right">
                          <span className={`px-2 py-1 rounded text-sm font-medium ${getScoreBackground(value.score)} ${getScoreColor(value.score)}`}>
                            {value.score}/100
                          </span>
                          <div className="text-xs text-gray-500 mt-1">Peso: {value.weight}%</div>
                        </div>
                      </div>
                      <p className="text-sm text-gray-700">{value.reasoning}</p>
                    </div>
                  ))}
                  <div className="border-t pt-4">
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-semibold text-gray-900">Score Scorecard Pesato:</span>
                      <span className={`text-2xl font-bold ${getScoreColor(professionalData.scorecard_analysis.weighted_score)}`}>
                        {professionalData.scorecard_analysis.weighted_score}/100
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB MERCATO */}
        {activeTab === 'market' && (
          <div className="space-y-8">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Analisi di Mercato</h3>
              
              {/* TAM/SAM/SOM */}
              <div className="mb-8">
                <h4 className="text-md font-semibold text-gray-800 mb-4">Dimensioni di Mercato (TAM/SAM/SOM)</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-blue-50 rounded-lg p-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600 mb-2">
                        {formatCurrency(professionalData.market_analysis.tam_analysis.size)}
                      </div>
                      <div className="text-sm font-medium text-blue-700 mb-2">TAM - Total Addressable Market</div>
                      <div className="text-xs text-gray-600 mb-3">
                        Confidence: {professionalData.market_analysis.tam_analysis.confidence}%
                      </div>
                      <p className="text-xs text-gray-700">{professionalData.market_analysis.tam_analysis.reasoning}</p>
                    </div>
                  </div>
                  <div className="bg-green-50 rounded-lg p-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600 mb-2">
                        {formatCurrency(professionalData.market_analysis.sam_analysis.size)}
                      </div>
                      <div className="text-sm font-medium text-green-700 mb-2">SAM - Serviceable Addressable Market</div>
                      <div className="text-xs text-gray-600 mb-3">
                        Confidence: {professionalData.market_analysis.sam_analysis.confidence}%
                      </div>
                      <p className="text-xs text-gray-700">{professionalData.market_analysis.sam_analysis.reasoning}</p>
                    </div>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-purple-600 mb-2">
                        {formatCurrency(professionalData.market_analysis.som_analysis.size)}
                      </div>
                      <div className="text-sm font-medium text-purple-700 mb-2">SOM - Serviceable Obtainable Market</div>
                      <div className="text-xs text-gray-600 mb-3">
                        Confidence: {professionalData.market_analysis.som_analysis.confidence}%
                      </div>
                      <p className="text-xs text-gray-700">{professionalData.market_analysis.som_analysis.reasoning}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Market Growth */}
              <div className="mb-8">
                <h4 className="text-md font-semibold text-gray-800 mb-4">Crescita di Mercato</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Tasso di Crescita Annuo:</span>
                      <span className="text-lg font-bold text-green-600">
                        +{professionalData.market_analysis.market_growth.rate}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Sostenibilità:</span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getScoreBackground(professionalData.market_analysis.market_growth.sustainability)} ${getScoreColor(professionalData.market_analysis.market_growth.sustainability)}`}>
                        {professionalData.market_analysis.market_growth.sustainability}%
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 mt-3">{professionalData.market_analysis.market_growth.reasoning}</p>
                  </div>
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Stadio di Maturità:</span>
                      <span className="text-lg font-semibold text-blue-600">
                        {professionalData.market_analysis.market_maturity.stage}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Score Maturità:</span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getScoreBackground(professionalData.market_analysis.market_maturity.score)} ${getScoreColor(professionalData.market_analysis.market_maturity.score)}`}>
                        {professionalData.market_analysis.market_maturity.score}/100
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 mt-3">{professionalData.market_analysis.market_maturity.reasoning}</p>
                  </div>
                </div>
              </div>

              {/* Customer Validation */}
              <div className="mb-8">
                <h4 className="text-md font-semibold text-gray-800 mb-4">Validazione Cliente</h4>
                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-md font-medium text-gray-700">Score Validazione Cliente:</span>
                    <span className={`px-3 py-1 rounded-lg text-lg font-bold ${getScoreBackground(professionalData.market_analysis.customer_validation.score)} ${getScoreColor(professionalData.market_analysis.customer_validation.score)}`}>
                      {professionalData.market_analysis.customer_validation.score}/100
                    </span>
                  </div>
                  <div className="space-y-2">
                    {professionalData.market_analysis.customer_validation.evidence.map((evidence: string, index: number) => (
                      <div key={index} className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{evidence}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB COMPETITIVITÀ */}
        {activeTab === 'competitive' && (
          <div className="space-y-8">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Analisi Competitiva</h3>
              
              {/* Competitive Position */}
              <div className="mb-8">
                <h4 className="text-md font-semibold text-gray-800 mb-4">Posizionamento Competitivo</h4>
                <div className="border rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-md font-medium text-gray-700">Score Posizionamento:</span>
                    <span className={`px-3 py-1 rounded-lg text-lg font-bold ${getScoreBackground(professionalData.competitive_analysis.competitive_position.score)} ${getScoreColor(professionalData.competitive_analysis.competitive_position.score)}`}>
                      {professionalData.competitive_analysis.competitive_position.score}/100
                    </span>
                  </div>
                  <p className="text-sm text-gray-700">{professionalData.competitive_analysis.competitive_position.reasoning}</p>
                </div>
              </div>

              {/* Differentiation */}
              <div className="mb-8">
                <h4 className="text-md font-semibold text-gray-800 mb-4">Differenziazione</h4>
                <div className="border rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-md font-medium text-gray-700">Score Differenziazione:</span>
                    <span className={`px-3 py-1 rounded-lg text-lg font-bold ${getScoreBackground(professionalData.competitive_analysis.differentiation.score)} ${getScoreColor(professionalData.competitive_analysis.differentiation.score)}`}>
                      {professionalData.competitive_analysis.differentiation.score}/100
                    </span>
                  </div>
                  <div className="space-y-2">
                    <span className="text-sm font-medium text-gray-800">Fattori Unici:</span>
                    {professionalData.competitive_analysis.differentiation.unique_factors.map((factor: string, index: number) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Star className="w-4 h-4 text-yellow-500 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{factor}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Barriers to Entry */}
              <div className="mb-8">
                <h4 className="text-md font-semibold text-gray-800 mb-4">Barriere all'Ingresso</h4>
                <div className="border rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-md font-medium text-gray-700">Score Barriere:</span>
                    <span className={`px-3 py-1 rounded-lg text-lg font-bold ${getScoreBackground(professionalData.competitive_analysis.barriers_to_entry.score)} ${getScoreColor(professionalData.competitive_analysis.barriers_to_entry.score)}`}>
                      {professionalData.competitive_analysis.barriers_to_entry.score}/100
                    </span>
                  </div>
                  <div className="space-y-2">
                    <span className="text-sm font-medium text-gray-800">Barriere Identificate:</span>
                    {professionalData.competitive_analysis.barriers_to_entry.barriers.map((barrier: string, index: number) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Shield className="w-4 h-4 text-blue-600 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{barrier}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Competitive Advantages */}
              <div className="mb-8">
                <h4 className="text-md font-semibold text-gray-800 mb-4">Vantaggi Competitivi</h4>
                <div className="border rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-md font-medium text-gray-700">Sostenibilità Vantaggi:</span>
                    <span className={`px-3 py-1 rounded-lg text-sm font-medium ${professionalData.competitive_analysis.competitive_advantages.sustainable ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                      {professionalData.competitive_analysis.competitive_advantages.sustainable ? 'Sostenibili' : 'Da Consolidare'}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <span className="text-sm font-medium text-gray-800">Vantaggi Chiave:</span>
                    {professionalData.competitive_analysis.competitive_advantages.advantages.map((advantage: string, index: number) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Target className="w-4 h-4 text-green-600 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{advantage}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Threat Level */}
              <div className="mb-8">
                <h4 className="text-md font-semibold text-gray-800 mb-4">Livello di Minaccia</h4>
                <div className="border rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-md font-medium text-gray-700">Score Minacce:</span>
                    <span className={`px-3 py-1 rounded-lg text-lg font-bold ${getScoreBackground(professionalData.competitive_analysis.threat_level.score)} ${getScoreColor(professionalData.competitive_analysis.threat_level.score)}`}>
                      {professionalData.competitive_analysis.threat_level.score}/100
                    </span>
                  </div>
                  <div className="space-y-2">
                    <span className="text-sm font-medium text-gray-800">Minacce Principali:</span>
                    {professionalData.competitive_analysis.threat_level.threats.map((threat: string, index: number) => (
                      <div key={index} className="flex items-center space-x-2">
                        <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{threat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB FINANZIARIO */}
        {activeTab === 'financial' && (
          <div className="space-y-8">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Analisi Finanziaria</h3>
              
              {/* Revenue Model */}
              <div className="mb-8">
                <h4 className="text-md font-semibold text-gray-800 mb-4">Modello di Ricavi</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Chiarezza Modello:</span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getScoreBackground(professionalData.financial_analysis.revenue_model.clarity)} ${getScoreColor(professionalData.financial_analysis.revenue_model.clarity)}`}>
                        {professionalData.financial_analysis.revenue_model.clarity}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Scalabilità:</span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getScoreBackground(professionalData.financial_analysis.revenue_model.scalability)} ${getScoreColor(professionalData.financial_analysis.revenue_model.scalability)}`}>
                        {professionalData.financial_analysis.revenue_model.scalability}%
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 mt-3">{professionalData.financial_analysis.revenue_model.reasoning}</p>
                  </div>
                  <div className="border rounded-lg p-4">
                    <h5 className="font-medium text-gray-900 mb-3">Unit Economics</h5>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">LTV/CAC Ratio:</span>
                        <span className="font-semibold text-green-600">{professionalData.financial_analysis.unit_economics.ltv_cac_ratio}x</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Payback Period:</span>
                        <span className="font-semibold text-blue-600">{professionalData.financial_analysis.unit_economics.payback_period} mesi</span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 mt-3">{professionalData.financial_analysis.unit_economics.reasoning}</p>
                  </div>
                </div>
              </div>

              {/* Financial Projections */}
              <div className="mb-8">
                <h4 className="text-md font-semibold text-gray-800 mb-4">Proiezioni Finanziarie</h4>
                <div className="border rounded-lg p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">Realismo Proiezioni:</span>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getScoreBackground(professionalData.financial_analysis.financial_projections.realism)} ${getScoreColor(professionalData.financial_analysis.financial_projections.realism)}`}>
                          {professionalData.financial_analysis.financial_projections.realism}%
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Tasso di Crescita:</span>
                        <span className="font-semibold text-green-600">+{professionalData.financial_analysis.financial_projections.growth_rate}%</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700">{professionalData.financial_analysis.financial_projections.reasoning}</p>
                </div>
              </div>

              {/* Funding Requirements */}
              <div className="mb-8">
                <h4 className="text-md font-semibold text-gray-800 mb-4">Fabbisogni di Finanziamento</h4>
                <div className="border rounded-lg p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">Importo Richiesto:</span>
                        <span className="text-lg font-bold text-blue-600">{formatCurrency(professionalData.financial_analysis.funding_requirements.amount)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Runway Stimato:</span>
                        <span className="font-semibold text-green-600">{professionalData.financial_analysis.funding_requirements.runway} mesi</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <span className="text-sm font-medium text-gray-800">Milestone Principali:</span>
                    <div className="mt-2 space-y-1">
                      {professionalData.financial_analysis.funding_requirements.milestones.map((milestone: string, index: number) => (
                        <div key={index} className="flex items-center space-x-2">
                          <Flag className="w-3 h-3 text-blue-600 flex-shrink-0" />
                          <span className="text-sm text-gray-700">{milestone}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Path to Profitability */}
              <div className="mb-8">
                <h4 className="text-md font-semibold text-gray-800 mb-4">Percorso verso la Profittabilità</h4>
                <div className="border rounded-lg p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">Timeline:</span>
                        <span className="font-semibold text-purple-600">{professionalData.financial_analysis.path_to_profitability.timeline} mesi</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Probabilità:</span>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getScoreBackground(professionalData.financial_analysis.path_to_profitability.probability)} ${getScoreColor(professionalData.financial_analysis.path_to_profitability.probability)}`}>
                          {professionalData.financial_analysis.path_to_profitability.probability}%
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700">{professionalData.financial_analysis.path_to_profitability.reasoning}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB TEAM */}
        {activeTab === 'team' && (
          <div className="space-y-8">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Analisi del Team</h3>
              
              {/* Founder Market Fit */}
              <div className="mb-8">
                <h4 className="text-md font-semibold text-gray-800 mb-4">Founder-Market Fit</h4>
                <div className="border rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-md font-medium text-gray-700">Score Founder-Market Fit:</span>
                    <span className={`px-3 py-1 rounded-lg text-lg font-bold ${getScoreBackground(professionalData.team_analysis.founder_market_fit.score)} ${getScoreColor(professionalData.team_analysis.founder_market_fit.score)}`}>
                      {professionalData.team_analysis.founder_market_fit.score}/100
                    </span>
                  </div>
                  <p className="text-sm text-gray-700">{professionalData.team_analysis.founder_market_fit.reasoning}</p>
                </div>
              </div>

              {/* Team Completeness */}
              <div className="mb-8">
                <h4 className="text-md font-semibold text-gray-800 mb-4">Completezza del Team</h4>
                <div className="border rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-md font-medium text-gray-700">Score Completezza:</span>
                    <span className={`px-3 py-1 rounded-lg text-lg font-bold ${getScoreBackground(professionalData.team_analysis.team_completeness.score)} ${getScoreColor(professionalData.team_analysis.team_completeness.score)}`}>
                      {professionalData.team_analysis.team_completeness.score}/100
                    </span>
                  </div>
                  <div className="mt-4">
                    <span className="text-sm font-medium text-gray-800">Ruoli Mancanti:</span>
                    <div className="mt-2 space-y-1">
                      {professionalData.team_analysis.team_completeness.missing_roles.map((role: string, index: number) => (
                        <div key={index} className="flex items-center space-x-2">
                          <Users className="w-3 h-3 text-orange-600 flex-shrink-0" />
                          <span className="text-sm text-gray-700">{role}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Experience Relevance */}
              <div className="mb-8">
                <h4 className="text-md font-semibold text-gray-800 mb-4">Rilevanza dell'Esperienza</h4>
                <div className="border rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-md font-medium text-gray-700">Score Esperienza:</span>
                    <span className={`px-3 py-1 rounded-lg text-lg font-bold ${getScoreBackground(professionalData.team_analysis.experience_relevance.score)} ${getScoreColor(professionalData.team_analysis.experience_relevance.score)}`}>
                      {professionalData.team_analysis.experience_relevance.score}/100
                    </span>
                  </div>
                  <div className="mt-4">
                    <span className="text-sm font-medium text-gray-800">Esperienze Chiave:</span>
                    <div className="mt-2 space-y-1">
                      {professionalData.team_analysis.experience_relevance.key_experiences.map((experience: string, index: number) => (
                        <div key={index} className="flex items-center space-x-2">
                          <Award className="w-3 h-3 text-blue-600 flex-shrink-0" />
                          <span className="text-sm text-gray-700">{experience}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Track Record */}
              <div className="mb-8">
                <h4 className="text-md font-semibold text-gray-800 mb-4">Track Record</h4>
                <div className="border rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-md font-medium text-gray-700">Score Track Record:</span>
                    <span className={`px-3 py-1 rounded-lg text-lg font-bold ${getScoreBackground(professionalData.team_analysis.track_record.score)} ${getScoreColor(professionalData.team_analysis.track_record.score)}`}>
                      {professionalData.team_analysis.track_record.score}/100
                    </span>
                  </div>
                  <div className="mt-4">
                    <span className="text-sm font-medium text-gray-800">Successi Precedenti:</span>
                    <div className="mt-2 space-y-1">
                      {professionalData.team_analysis.track_record.previous_successes.map((success: string, index: number) => (
                        <div key={index} className="flex items-center space-x-2">
                          <Star className="w-3 h-3 text-yellow-600 flex-shrink-0" />
                          <span className="text-sm text-gray-700">{success}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Advisors Board */}
              <div className="mb-8">
                <h4 className="text-md font-semibold text-gray-800 mb-4">Advisory Board</h4>
                <div className="border rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-md font-medium text-gray-700">Score Advisory:</span>
                    <span className={`px-3 py-1 rounded-lg text-lg font-bold ${getScoreBackground(professionalData.team_analysis.advisors_board.score)} ${getScoreColor(professionalData.team_analysis.advisors_board.score)}`}>
                      {professionalData.team_analysis.advisors_board.score}/100
                    </span>
                  </div>
                  <p className="text-sm text-gray-700">{professionalData.team_analysis.advisors_board.advisory_strength}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB PRODOTTO */}
        {activeTab === 'product' && (
          <div className="space-y-8">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Analisi del Prodotto</h3>
              
              {/* Product Market Fit */}
              <div className="mb-8">
                <h4 className="text-md font-semibold text-gray-800 mb-4">Product-Market Fit</h4>
                <div className="border rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-md font-medium text-gray-700">Score PMF:</span>
                    <span className={`px-3 py-1 rounded-lg text-lg font-bold ${getScoreBackground(professionalData.product_analysis.product_market_fit.score)} ${getScoreColor(professionalData.product_analysis.product_market_fit.score)}`}>
development_stage.score}/100
                    </span>
                  </div>
                  <p className="text-sm text-gray-700">{professionalData.product_analysis.development_stage.reasoning}</p>
                </div>
              </div>

              {/* IP Protection */}
              <div className="mb-8">
                <h4 className="text-md font-semibold text-gray-800 mb-4">Protezione IP</h4>
                <div className="border rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-md font-medium text-gray-700">Score Protezione IP:</span>
                    <span className={`px-3 py-1 rounded-lg text-lg font-bold ${getScoreBackground(professionalData.product_analysis.ip_protection.score)} ${getScoreColor(professionalData.product_analysis.ip_protection.score)}`}>
                      {professionalData.product_analysis.ip_protection.score}/100
                    </span>
                  </div>
                  <div className="mt-4">
                    <span className="text-sm font-medium text-gray-800">Protezioni Attuali:</span>
                    <div className="mt-2 space-y-1">
                      {professionalData.product_analysis.ip_protection.protections.map((protection: string, index: number) => (
                        <div key={index} className="flex items-center space-x-2">
                          <Shield className="w-3 h-3 text-blue-600 flex-shrink-0" />
                          <span className="text-sm text-gray-700">{protection}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Scalability */}
              <div className="mb-8">
                <h4 className="text-md font-semibold text-gray-800 mb-4">Scalabilità</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Scalabilità Tecnica:</span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getScoreBackground(professionalData.product_analysis.scalability.technical)} ${getScoreColor(professionalData.product_analysis.scalability.technical)}`}>
                        {professionalData.product_analysis.scalability.technical}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Scalabilità Business:</span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getScoreBackground(professionalData.product_analysis.scalability.business)} ${getScoreColor(professionalData.product_analysis.scalability.business)}`}>
                        {professionalData.product_analysis.scalability.business}%
                      </span>
                    </div>
                  </div>
                  <div className="border rounded-lg p-4">
                    <p className="text-sm text-gray-700">{professionalData.product_analysis.scalability.reasoning}</p>
                  </div>
                </div>
              </div>

              {/* User Traction */}
              <div className="mb-8">
                <h4 className="text-md font-semibold text-gray-800 mb-4">Trazione Utenti</h4>
                <div className="border rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-md font-medium text-gray-700">Score Trazione:</span>
                    <span className={`px-3 py-1 rounded-lg text-lg font-bold ${getScoreBackground(professionalData.product_analysis.user_traction.score)} ${getScoreColor(professionalData.product_analysis.user_traction.score)}`}>
                      {professionalData.product_analysis.user_traction.score}/100
                    </span>
                  </div>
                  <div className="mt-4">
                    <span className="text-sm font-medium text-gray-800">Metriche Trazione:</span>
                    <div className="mt-2 space-y-1">
                      {professionalData.product_analysis.user_traction.metrics.map((metric: string, index: number) => (
                        <div key={index} className="flex items-center space-x-2">
                          <Activity className="w-3 h-3 text-green-600 flex-shrink-0" />
                          <span className="text-sm text-gray-700">{metric}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB RISCHI */}
        {activeTab === 'risks' && (
          <div className="space-y-8">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Analisi dei Rischi</h3>
              
              {/* Risk Overview */}
              <div className="mb-8">
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold text-gray-900">Aggiustamento Rischio Totale:</span>
                    <span className={`text-2xl font-bold ${professionalData.risk_factor_analysis.total_risk_adjustment > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {professionalData.risk_factor_analysis.total_risk_adjustment > 0 ? '+' : ''}{professionalData.risk_factor_analysis.total_risk_adjustment}%
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">{professionalData.risk_factor_analysis.summary}</p>
                </div>
              </div>

              {/* Individual Risk Factors */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Management Risk */}
                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h5 className="font-medium text-gray-900">Rischio Management</h5>
                    <span className={`px-2 py-1 rounded text-xs font-medium capitalize ${getRiskColor(professionalData.risk_factor_analysis.management_risk.level)}`}>
                      {professionalData.risk_factor_analysis.management_risk.level}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Impatto:</span>
                    <span className={`font-semibold ${professionalData.risk_factor_analysis.management_risk.impact > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {professionalData.risk_factor_analysis.management_risk.impact > 0 ? '+' : ''}{professionalData.risk_factor_analysis.management_risk.impact}%
                    </span>
                  </div>
                  <p className="text-sm text-gray-700">{professionalData.risk_factor_analysis.management_risk.description}</p>
                </div>

                {/* Market Risk */}
                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h5 className="font-medium text-gray-900">Rischio Mercato</h5>
                    <span className={`px-2 py-1 rounded text-xs font-medium capitalize ${getRiskColor(professionalData.risk_factor_analysis.market_risk.level)}`}>
                      {professionalData.risk_factor_analysis.market_risk.level}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Impatto:</span>
                    <span className={`font-semibold ${professionalData.risk_factor_analysis.market_risk.impact > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {professionalData.risk_factor_analysis.market_risk.impact > 0 ? '+' : ''}{professionalData.risk_factor_analysis.market_risk.impact}%
                    </span>
                  </div>
                  <p className="text-sm text-gray-700">{professionalData.risk_factor_analysis.market_risk.description}</p>
                </div>

                {/* Technology Risk */}
                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h5 className="font-medium text-gray-900">Rischio Tecnologico</h5>
                    <span className={`px-2 py-1 rounded text-xs font-medium capitalize ${getRiskColor(professionalData.risk_factor_analysis.technology_risk.level)}`}>
                      {professionalData.risk_factor_analysis.technology_risk.level}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Impatto:</span>
                    <span className={`font-semibold ${professionalData.risk_factor_analysis.technology_risk.impact > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {professionalData.risk_factor_analysis.technology_risk.impact > 0 ? '+' : ''}{professionalData.risk_factor_analysis.technology_risk.impact}%
                    </span>
                  </div>
                  <p className="text-sm text-gray-700">{professionalData.risk_factor_analysis.technology_risk.description}</p>
                </div>

                {/* Competitive Risk */}
                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h5 className="font-medium text-gray-900">Rischio Competitivo</h5>
                    <span className={`px-2 py-1 rounded text-xs font-medium capitalize ${getRiskColor(professionalData.risk_factor_analysis.competitive_risk.level)}`}>
                      {professionalData.risk_factor_analysis.competitive_risk.level}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Impatto:</span>
                    <span className={`font-semibold ${professionalData.risk_factor_analysis.competitive_risk.impact > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {professionalData.risk_factor_analysis.competitive_risk.impact > 0 ? '+' : ''}{professionalData.risk_factor_analysis.competitive_risk.impact}%
                    </span>
                  </div>
                  <p className="text-sm text-gray-700">{professionalData.risk_factor_analysis.competitive_risk.description}</p>
                </div>

                {/* Financial Risk */}
                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h5 className="font-medium text-gray-900">Rischio Finanziario</h5>
                    <span className={`px-2 py-1 rounded text-xs font-medium capitalize ${getRiskColor(professionalData.risk_factor_analysis.financial_risk.level)}`}>
                      {professionalData.risk_factor_analysis.financial_risk.level}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Impatto:</span>
                    <span className={`font-semibold ${professionalData.risk_factor_analysis.financial_risk.impact > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {professionalData.risk_factor_analysis.financial_risk.impact > 0 ? '+' : ''}{professionalData.risk_factor_analysis.financial_risk.impact}%
                    </span>
                  </div>
                  <p className="text-sm text-gray-700">{professionalData.risk_factor_analysis.financial_risk.description}</p>
                </div>

                {/* Regulatory Risk */}
                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h5 className="font-medium text-gray-900">Rischio Regolatorio</h5>
                    <span className={`px-2 py-1 rounded text-xs font-medium capitalize ${getRiskColor(professionalData.risk_factor_analysis.regulatory_risk.level)}`}>
                      {professionalData.risk_factor_analysis.regulatory_risk.level}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Impatto:</span>
                    <span className={`font-semibold ${professionalData.risk_factor_analysis.regulatory_risk.impact > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {professionalData.risk_factor_analysis.regulatory_risk.impact > 0 ? '+' : ''}{professionalData.risk_factor_analysis.regulatory_risk.impact}%
                    </span>
                  </div>
                  <p className="text-sm text-gray-700">{professionalData.risk_factor_analysis.regulatory_risk.description}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB RACCOMANDAZIONI */}
        {activeTab === 'recommendations' && (
          <div className="space-y-8">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Raccomandazioni Strategiche</h3>
              
              {/* Priority Recommendations */}
              <div className="mb-8">
                <h4 className="text-md font-semibold text-gray-800 mb-4">Raccomandazioni Prioritarie</h4>
                <div className="space-y-4">
                  {professionalData.recommendations.map((recommendation: string, index: number) => (
                    <div key={index} className="flex items-start space-x-4 p-4 bg-blue-50 rounded-lg">
                      <div className="flex-shrink-0">
                        <span className="flex items-center justify-center w-6 h-6 bg-blue-600 text-white rounded-full text-sm font-medium">
                          {index + 1}
                        </span>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-700">{recommendation}</p>
                      </div>
                      <Lightbulb className="w-5 h-5 text-blue-600 flex-shrink-0" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Missing Areas */}
              <div className="mb-8">
                <h4 className="text-md font-semibold text-gray-800 mb-4">Aree Mancanti da Sviluppare</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {professionalData.missing_areas.map((area: string, index: number) => (
                    <div key={index} className="flex items-center space-x-3 p-3 border rounded-lg">
                      <AlertTriangle className="w-5 h-5 text-orange-500 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{area}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Next Steps */}
              <div className="mb-8">
                <h4 className="text-md font-semibold text-gray-800 mb-4">Prossimi Passi Strutturati</h4>
                
                {/* Immediate Actions */}
                <div className="mb-6">
                  <h5 className="font-medium text-gray-800 mb-3">Azioni Immediate (1-2 settimane)</h5>
                  <div className="space-y-3">
                    {professionalData.next_steps.immediate_actions.map((action: any, index: number) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            action.priority === 'high' ? 'bg-red-100 text-red-600' :
                            action.priority === 'medium' ? 'bg-yellow-100 text-yellow-600' :
                            'bg-green-100 text-green-600'
                          }`}>
                            Priorità {action.priority === 'high' ? 'Alta' : action.priority === 'medium' ? 'Media' : 'Bassa'}
                          </span>
                          <span className="text-xs text-gray-500">{action.timeline}</span>
                        </div>
                        <p className="text-sm text-gray-700">{action.action}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pitch Preparation */}
                <div className="mb-6">
                  <h5 className="font-medium text-gray-800 mb-3">Preparazione Pitch ({professionalData.next_steps.pitch_preparation.timeline})</h5>
                  <div className="space-y-2">
                    {professionalData.next_steps.pitch_preparation.tasks.map((task: string, index: number) => (
                      <div key={index} className="flex items-center space-x-3 p-2 bg-green-50 rounded">
                        <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{task}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Business Plan Completion */}
                <div className="mb-6">
                  <h5 className="font-medium text-gray-800 mb-3">Completamento Business Plan ({professionalData.next_steps.business_plan_completion.timeline})</h5>
                  <div className="space-y-2">
                    {professionalData.next_steps.business_plan_completion.tasks.map((task: string, index: number) => (
                      <div key={index} className="flex items-center space-x-3 p-2 bg-blue-50 rounded">
                        <FileText className="w-4 h-4 text-blue-600 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{task}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Investment Readiness */}
                <div className="mb-6">
                  <h5 className="font-medium text-gray-800 mb-3">Investment Readiness ({professionalData.next_steps.investment_readiness.timeline})</h5>
                  <div className="space-y-2">
                    {professionalData.next_steps.investment_readiness.tasks.map((task: string, index: number) => (
                      <div key={index} className="flex items-center space-x-3 p-2 bg-purple-50 rounded">
                        <DollarSign className="w-4 h-4 text-purple-600 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{task}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Call to Action */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6">
                <div className="text-center">
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Pronto per il Prossimo Livello?</h4>
                  <p className="text-sm text-gray-600 mb-4">
                    Utilizza l'AI Coach per implementare queste raccomandazioni con un percorso guidato personalizzato
                  </p>
                  <button
                    onClick={() => setShowAICoach(true)}
                    className="flex items-center px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:from-purple-600 hover:to-blue-600 transition-colors mx-auto"
                  >
                    <Brain className="w-5 h-5 mr-2" />
                    Avvia AI Coach Guidato
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* AI Coach Modal */}
      {showAICoach && (
        <AICoach
          project={project}
          analysis={analysis}
          onImprove={handleImproveProject}
          onClose={() => setShowAICoach(false)}
        />
      )}
    </div>
  )
}product_market_fit.score}/100
                    </span>
                  </div>
                  <div className="mt-4">
                    <span className="text-sm font-medium text-gray-800">Evidenze PMF:</span>
                    <div className="mt-2 space-y-1">
                      {professionalData.product_analysis.product_market_fit.evidence.map((evidence: string, index: number) => (
                        <div key={index} className="flex items-center space-x-2">
                          <CheckCircle className="w-3 h-3 text-green-600 flex-shrink-0" />
                          <span className="text-sm text-gray-700">{evidence}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Development Stage */}
              <div className="mb-8">
                <h4 className="text-md font-semibold text-gray-800 mb-4">Stadio di Sviluppo</h4>
                <div className="border rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-md font-medium text-gray-700">Stadio Attuale:</span>
                    <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-lg text-sm font-medium">
                      {professionalData.product_analysis.development_stage.stage}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-md font-medium text-gray-700">Score Sviluppo:</span>
                    <span className={`px-3 py-1 rounded-lg text-lg font-bold ${getScoreBackground(professionalData.product_analysis.development_stage.score)} ${getScoreColor(professionalData.product_analysis.development_stage.score)}`}>
                      {professionalData.product_analysis.