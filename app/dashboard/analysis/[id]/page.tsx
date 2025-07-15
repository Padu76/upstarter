'use client'

import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { 
  ArrowLeft, TrendingUp, AlertCircle, CheckCircle, Target, Users, DollarSign, 
  Clock, Download, Share, Star, ThumbsUp, ThumbsDown, Plus, Upload, FileText, 
  AlertTriangle, Info, Lightbulb, Presentation, FileCheck, Edit3, MessageSquare,
  BarChart3, PieChart, LineChart, Activity, Shield, Zap, Building2, Rocket,
  Brain, TrendingDown, Award, Flag
} from 'lucide-react'
import { useSession } from 'next-auth/react'

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

        {activeTab === 'valuation' && (
          <div className="space-y-8">
            {/* Valuation Methods */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Berkus Method */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Metodo Berkus</h3>
                <div className="space-y-4">
                  {Object.entries(professionalData.berkus_analysis).map(([key, value]: [string, any]) => {
                    if (key === 'total_valuation' || key === 'summary') return null
                    return (
                      <div key={key} className="border-b pb-3">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium text-gray-700 capitalize">
                            {key.replace('_', ' ')}
                          </span>
                          <span className="font-semibold">{formatCurrency(value.score)}</span>
                        </div>
                        <p className="text-xs text-gray-600">{value.reasoning}</p>
                      </div>
                    )
                  })}
                  <div className="pt-3 border-t">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-gray-900">Valutazione Totale:</span>
                      <span className="text-xl font-bold text-green-600">
                        {formatCurrency(professionalData.berkus_analysis.total_valuation)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Scorecard Method */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Metodo Scorecard</h3>
                <div className="space-y-4">
                  {Object.entries(professionalData.scorecard_analysis).map(([key, value]: [string, any]) => {
                    if (key === 'weighted_score' || key === 'summary') return null
                    return (
                      <div key={key} className="border-b pb-3">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium text-gray-700 capitalize">
                            {key.replace('_', ' ')}
                          </span>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-500">{value.weight}%</span>
                            <span className="font-semibold">{value.score}/100</span>
                          </div>
                        </div>
                        <p className="text-xs text-gray-600">{value.reasoning}</p>
                      </div>
                    )
                  })}
                  <div className="pt-3 border-t">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-gray-900">Score Pesato:</span>
                      <span className="text-xl font-bold text-blue-600">
                        {professionalData.scorecard_analysis.weighted_score}/100
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Valuation Range */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Range di Valutazione</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <div className="text-sm text-red-600 font-medium mb-1">Valutazione Minima</div>
                  <div className="text-2xl font-bold text-red-700">
                    {formatCurrency(professionalData.valuation_range.min)}
                  </div>
                  <div className="text-xs text-red-500 mt-1">Scenario pessimistico</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-sm text-green-600 font-medium mb-1">Valutazione Raccomandata</div>
                  <div className="text-2xl font-bold text-green-700">
                    {formatCurrency(professionalData.valuation_range.recommended)}
                  </div>
                  <div className="text-xs text-green-500 mt-1">Scenario realistico</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-sm text-blue-600 font-medium mb-1">Valutazione Massima</div>
                  <div className="text-2xl font-bold text-blue-700">
                    {formatCurrency(professionalData.valuation_range.max)}
                  </div>
                  <div className="text-xs text-blue-500 mt-1">Scenario ottimistico</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'market' && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Analisi di Mercato</h3>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-sm text-blue-600 font-medium mb-1">TAM</div>
                  <div className="text-2xl font-bold text-blue-700">
                    {formatCurrency(professionalData.market_analysis.tam_analysis.size)}
                  </div>
                  <div className="text-xs text-blue-500 mt-1">
                    {professionalData.market_analysis.tam_analysis.confidence}% confidence
                  </div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-sm text-green-600 font-medium mb-1">SAM</div>
                  <div className="text-2xl font-bold text-green-700">
                    {formatCurrency(professionalData.market_analysis.sam_analysis.size)}
                  </div>
                  <div className="text-xs text-green-500 mt-1">
                    {professionalData.market_analysis.sam_analysis.confidence}% confidence
                  </div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-sm text-purple-600 font-medium mb-1">SOM</div>
                  <div className="text-2xl font-bold text-purple-700">
                    {formatCurrency(professionalData.market_analysis.som_analysis.size)}
                  </div>
                  <div className="text-xs text-purple-500 mt-1">
                    {professionalData.market_analysis.som_analysis.confidence}% confidence
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Crescita di Mercato</h4>
                  <div className="text-2xl font-bold text-green-600 mb-1">
                    {professionalData.market_analysis.market_growth.rate}%
                  </div>
                  <p className="text-sm text-gray-600">{professionalData.market_analysis.market_growth.reasoning}</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Maturità Mercato</h4>
                  <div className="text-lg font-bold text-blue-600 mb-1">
                    {professionalData.market_analysis.market_maturity.stage}
                  </div>
                  <p className="text-sm text-gray-600">{professionalData.market_analysis.market_maturity.reasoning}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'competitive' && (
          <div className="space-y-8">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Analisi Competitiva Dettagliata</h3>
              
              {/* Posizione Competitiva */}
              <div className="mb-8">
                <h4 className="text-md font-semibold text-gray-900 mb-4">Posizionamento Competitivo</h4>
                <div className="bg-blue-50 p-4 rounded-lg mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-gray-700">Score Posizionamento:</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreBackground(professionalData.competitive_analysis.competitive_position.score)} ${getScoreColor(professionalData.competitive_analysis.competitive_position.score)}`}>
                      {professionalData.competitive_analysis.competitive_position.score}/100
                    </span>
                  </div>
                  <p className="text-sm text-gray-700">{professionalData.competitive_analysis.competitive_position.reasoning}</p>
                </div>
              </div>

              {/* Differenziazione */}
              <div className="mb-8">
                <h4 className="text-md font-semibold text-gray-900 mb-4">Fattori di Differenziazione</h4>
                <div className="bg-green-50 p-4 rounded-lg mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-gray-700">Score Differenziazione:</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreBackground(professionalData.competitive_analysis.differentiation.score)} ${getScoreColor(professionalData.competitive_analysis.differentiation.score)}`}>
                      {professionalData.competitive_analysis.differentiation.score}/100
                    </span>
                  </div>
                  <div className="mt-3">
                    <p className="text-sm font-medium text-gray-700 mb-2">Fattori Unici Identificati:</p>
                    <ul className="list-disc list-inside space-y-1">
                      {professionalData.competitive_analysis.differentiation.unique_factors.map((factor: string, index: number) => (
                        <li key={index} className="text-sm text-gray-600">{factor}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Barriere all'Ingresso */}
              <div className="mb-8">
                <h4 className="text-md font-semibold text-gray-900 mb-4">Barriere all'Ingresso</h4>
                <div className="bg-purple-50 p-4 rounded-lg mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-gray-700">Forza Barriere:</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreBackground(professionalData.competitive_analysis.barriers_to_entry.score)} ${getScoreColor(professionalData.competitive_analysis.barriers_to_entry.score)}`}>
                      {professionalData.competitive_analysis.barriers_to_entry.score}/100
                    </span>
                  </div>
                  <div className="mt-3">
                    <p className="text-sm font-medium text-gray-700 mb-2">Barriere Identificate:</p>
                    <ul className="list-disc list-inside space-y-1">
                      {professionalData.competitive_analysis.barriers_to_entry.barriers.map((barrier: string, index: number) => (
                        <li key={index} className="text-sm text-gray-600">{barrier}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Vantaggi Competitivi */}
              <div className="mb-8">
                <h4 className="text-md font-semibold text-gray-900 mb-4">Vantaggi Competitivi</h4>
                <div className="bg-yellow-50 p-4 rounded-lg mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-gray-700">Sostenibilità:</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      professionalData.competitive_analysis.competitive_advantages.sustainable 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {professionalData.competitive_analysis.competitive_advantages.sustainable ? 'Sostenibile' : 'Da Consolidare'}
                    </span>
                  </div>
                  <div className="mt-3">
                    <p className="text-sm font-medium text-gray-700 mb-2">Vantaggi Attuali:</p>
                    <ul className="list-disc list-inside space-y-1">
                      {professionalData.competitive_analysis.competitive_advantages.advantages.map((advantage: string, index: number) => (
                        <li key={index} className="text-sm text-gray-600">{advantage}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Minacce Competitive */}
              <div>
                <h4 className="text-md font-semibold text-gray-900 mb-4">Minacce Competitive</h4>
                <div className="bg-red-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-gray-700">Livello Minaccia:</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreBackground(100 - professionalData.competitive_analysis.threat_level.score)} ${getScoreColor(100 - professionalData.competitive_analysis.threat_level.score)}`}>
                      {professionalData.competitive_analysis.threat_level.score}/100
                    </span>
                  </div>
                  <div className="mt-3">
                    <p className="text-sm font-medium text-gray-700 mb-2">Principali Minacce:</p>
                    <ul className="list-disc list-inside space-y-1">
                      {professionalData.competitive_analysis.threat_level.threats.map((threat: string, index: number) => (
                        <li key={index} className="text-sm text-gray-600">{threat}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'financial' && (
          <div className="space-y-8">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Analisi Finanziaria Dettagliata</h3>
              
              {/* Modello di Ricavi */}
              <div className="mb-8">
                <h4 className="text-md font-semibold text-gray-900 mb-4">Modello di Ricavi</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-gray-700">Chiarezza Modello:</span>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreBackground(professionalData.financial_analysis.revenue_model.clarity)} ${getScoreColor(professionalData.financial_analysis.revenue_model.clarity)}`}>
                        {professionalData.financial_analysis.revenue_model.clarity}/100
                      </span>
                    </div>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-gray-700">Scalabilità:</span>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreBackground(professionalData.financial_analysis.revenue_model.scalability)} ${getScoreColor(professionalData.financial_analysis.revenue_model.scalability)}`}>
                        {professionalData.financial_analysis.revenue_model.scalability}/100
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-700 mt-3">{professionalData.financial_analysis.revenue_model.reasoning}</p>
              </div>

              {/* Unit Economics */}
              <div className="mb-8">
                <h4 className="text-md font-semibold text-gray-900 mb-4">Unit Economics</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <div className="text-center">
                      <span className="text-sm text-gray-600">LTV/CAC Ratio</span>
                      <div className="text-2xl font-bold text-purple-600">
                        {professionalData.financial_analysis.unit_economics.ltv_cac_ratio.toFixed(1)}
                      </div>
                      <span className="text-xs text-gray-500">
                        {professionalData.financial_analysis.unit_economics.ltv_cac_ratio >= 3 ? 'Ottimo' : 'Da Migliorare'}
                      </span>
                    </div>
                  </div>
                  <div className="bg-orange-50 p-4 rounded-lg">
                    <div className="text-center">
                      <span className="text-sm text-gray-600">Payback Period</span>
                      <div className="text-2xl font-bold text-orange-600">
                        {professionalData.financial_analysis.unit_economics.payback_period} mesi
                      </div>
                      <span className="text-xs text-gray-500">
                        {professionalData.financial_analysis.unit_economics.payback_period <= 12 ? 'Ottimo' : 'Da Ottimizzare'}
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-700 mt-3">{professionalData.financial_analysis.unit_economics.reasoning}</p>
              </div>

              {/* Proiezioni Finanziarie */}
              <div className="mb-8">
                <h4 className="text-md font-semibold text-gray-900 mb-4">Proiezioni Finanziarie</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-gray-700">Realismo Proiezioni:</span>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreBackground(professionalData.financial_analysis.financial_projections.realism)} ${getScoreColor(professionalData.financial_analysis.financial_projections.realism)}`}>
                        {professionalData.financial_analysis.financial_projections.realism}/100
                      </span>
                    </div>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="text-center">
                      <span className="text-sm text-gray-600">Tasso di Crescita</span>
                      <div className="text-2xl font-bold text-blue-600">
                        {professionalData.financial_analysis.financial_projections.growth_rate}%
                      </div>
                      <span className="text-xs text-gray-500">Annuale</span>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-700 mt-3">{professionalData.financial_analysis.financial_projections.reasoning}</p>
              </div>

              {/* Fabbisogno di Finanziamento */}
              <div className="mb-8">
                <h4 className="text-md font-semibold text-gray-900 mb-4">Fabbisogno di Finanziamento</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <div className="text-center">
                      <span className="text-sm text-gray-600">Importo Richiesto</span>
                      <div className="text-2xl font-bold text-yellow-600">
                        {formatCurrency(professionalData.financial_analysis.funding_requirements.amount)}
                      </div>
                    </div>
                  </div>
                  <div className="bg-red-50 p-4 rounded-lg">
                    <div className="text-center">
                      <span className="text-sm text-gray-600">Runway</span>
                      <div className="text-2xl font-bold text-red-600">
                        {professionalData.financial_analysis.funding_requirements.runway} mesi
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Milestone per il Finanziamento:</p>
                  <ul className="list-disc list-inside space-y-1">
                    {professionalData.financial_analysis.funding_requirements.milestones.map((milestone: string, index: number) => (
                      <li key={index} className="text-sm text-gray-600">{milestone}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Percorso verso Profittabilità */}
              <div>
                <h4 className="text-md font-semibold text-gray-900 mb-4">Percorso verso Profittabilità</h4>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                    <div className="text-center">
                      <span className="text-sm text-gray-600">Timeline</span>
                      <div className="text-xl font-bold text-gray-700">
                        {professionalData.financial_analysis.path_to_profitability.timeline} mesi
                      </div>
                    </div>
                    <div className="text-center">
                      <span className="text-sm text-gray-600">Probabilità</span>
                      <div className="text-xl font-bold text-gray-700">
                        {professionalData.financial_analysis.path_to_profitability.probability}%
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700">{professionalData.financial_analysis.path_to_profitability.reasoning}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'team' && (
          <div className="space-y-8">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Analisi del Team</h3>
              
              {/* Founder-Market Fit */}
              <div className="mb-8">
                <h4 className="text-md font-semibold text-gray-900 mb-4">Founder-Market Fit</h4>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-gray-700">Score Founder-Market Fit:</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreBackground(professionalData.team_analysis.founder_market_fit.score)} ${getScoreColor(professionalData.team_analysis.founder_market_fit.score)}`}>
                      {professionalData.team_analysis.founder_market_fit.score}/100
                    </span>
                  </div>
                  <p className="text-sm text-gray-700">{professionalData.team_analysis.founder_market_fit.reasoning}</p>
                </div>
              </div>

              {/* Completezza del Team */}
              <div className="mb-8">
                <h4 className="text-md font-semibold text-gray-900 mb-4">Completezza del Team</h4>
                <div className="bg-green-50 p-4 rounded-lg mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-gray-700">Score Completezza:</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreBackground(professionalData.team_analysis.team_completeness.score)} ${getScoreColor(professionalData.team_analysis.team_completeness.score)}`}>
                      {professionalData.team_analysis.team_completeness.score}/100
                    </span>
                  </div>
                  <div className="mt-3">
                    <p className="text-sm font-medium text-gray-700 mb-2">Ruoli Mancanti:</p>
                    <ul className="list-disc list-inside space-y-1">
                      {professionalData.team_analysis.team_completeness.missing_roles.map((role: string, index: number) => (
                        <li key={index} className="text-sm text-red-600">{role}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Rilevanza dell'Esperienza */}
              <div className="mb-8">
                <h4 className="text-md font-semibold text-gray-900 mb-4">Rilevanza dell'Esperienza</h4>
                <div className="bg-purple-50 p-4 rounded-lg mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-gray-700">Score Esperienza:</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreBackground(professionalData.team_analysis.experience_relevance.score)} ${getScoreColor(professionalData.team_analysis.experience_relevance.score)}`}>
                      {professionalData.team_analysis.experience_relevance.score}/100
                    </span>
                  </div>
                  <div className="mt-3">
                    <p className="text-sm font-medium text-gray-700 mb-2">Esperienze Chiave:</p>
                    <ul className="list-disc list-inside space-y-1">
                      {professionalData.team_analysis.experience_relevance.key_experiences.map((exp: string, index: number) => (
                        <li key={index} className="text-sm text-gray-600">{exp}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Track Record */}
              <div className="mb-8">
                <h4 className="text-md font-semibold text-gray-900 mb-4">Track Record</h4>
                <div className="bg-yellow-50 p-4 rounded-lg mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-gray-700">Score Track Record:</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreBackground(professionalData.team_analysis.track_record.score)} ${getScoreColor(professionalData.team_analysis.track_record.score)}`}>
                      {professionalData.team_analysis.track_record.score}/100
                    </span>
                  </div>
                  <div className="mt-3">
                    <p className="text-sm font-medium text-gray-700 mb-2">Successi Precedenti:</p>
                    <ul className="list-disc list-inside space-y-1">
                      {professionalData.team_analysis.track_record.previous_successes.map((success: string, index: number) => (
                        <li key={index} className="text-sm text-gray-600">{success}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Advisory Board */}
              <div>
                <h4 className="text-md font-semibold text-gray-900 mb-4">Advisory Board</h4>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-gray-700">Forza Advisory:</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreBackground(professionalData.team_analysis.advisors_board.score)} ${getScoreColor(professionalData.team_analysis.advisors_board.score)}`}>
                      {professionalData.team_analysis.advisors_board.score}/100
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 mt-2">{professionalData.team_analysis.advisors_board.advisory_strength}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'product' && (
          <div className="space-y-8">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Analisi del Prodotto</h3>
              
              {/* Product-Market Fit */}
              <div className="mb-8">
                <h4 className="text-md font-semibold text-gray-900 mb-4">Product-Market Fit</h4>
                <div className="bg-blue-50 p-4 rounded-lg mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-gray-700">Score PMF:</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreBackground(professionalData.product_analysis.product_market_fit.score)} ${getScoreColor(professionalData.product_analysis.product_market_fit.score)}`}>
                      {professionalData.product_analysis.product_market_fit.score}/100
                    </span>
                  </div>
                  <div className="mt-3">
                    <p className="text-sm font-medium text-gray-700 mb-2">Evidenze PMF:</p>
                    <ul className="list-disc list-inside space-y-1">
                      {professionalData.product_analysis.product_market_fit.evidence.map((evidence: string, index: number) => (
                        <li key={index} className="text-sm text-gray-600">{evidence}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Stadio di Sviluppo */}
              <div className="mb-8">
                <h4 className="text-md font-semibold text-gray-900 mb-4">Stadio di Sviluppo</h4>
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                    <div>
                      <span className="text-sm text-gray-600">Stadio Attuale:</span>
                      <div className="text-lg font-bold text-green-600">
                        {professionalData.product_analysis.development_stage.stage}
                      </div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Score Sviluppo:</span>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ml-2 ${getScoreBackground(professionalData.product_analysis.development_stage.score)} ${getScoreColor(professionalData.product_analysis.development_stage.score)}`}>
                        {professionalData.product_analysis.development_stage.score}/100
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700">{professionalData.product_analysis.development_stage.reasoning}</p>
                </div>
              </div>

              {/* Protezione IP */}
              <div className="mb-8">
                <h4 className="text-md font-semibold text-gray-900 mb-4">Protezione Proprietà Intellettuale</h4>
                <div className="bg-purple-50 p-4 rounded-lg mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-gray-700">Score IP Protection:</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreBackground(professionalData.product_analysis.ip_protection.score)} ${getScoreColor(professionalData.product_analysis.ip_protection.score)}`}>
                      {professionalData.product_analysis.ip_protection.score}/100
                    </span>
                  </div>
                  <div className="mt-3">
                    <p className="text-sm font-medium text-gray-700 mb-2">Protezioni Attuali:</p>
                    <ul className="list-disc list-inside space-y-1">
                      {professionalData.product_analysis.ip_protection.protections.map((protection: string, index: number) => (
                        <li key={index} className="text-sm text-gray-600">{protection}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Scalabilità */}
              <div className="mb-8">
                <h4 className="text-md font-semibold text-gray-900 mb-4">Scalabilità</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="text-center">
                      <span className="text-sm text-gray-600">Scalabilità Tecnica</span>
                      <div className="text-2xl font-bold text-blue-600">
                        {professionalData.product_analysis.scalability.technical}/100
                      </div>
                    </div>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="text-center">
                      <span className="text-sm text-gray-600">Scalabilità Business</span>
                      <div className="text-2xl font-bold text-green-600">
                        {professionalData.product_analysis.scalability.business}/100
                      </div>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-700 mt-3">{professionalData.product_analysis.scalability.reasoning}</p>
              </div>

              {/* Trazione Utenti */}
              <div>
                <h4 className="text-md font-semibold text-gray-900 mb-4">Trazione Utenti</h4>
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-gray-700">Score Trazione:</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreBackground(professionalData.product_analysis.user_traction.score)} ${getScoreColor(professionalData.product_analysis.user_traction.score)}`}>
                      {professionalData.product_analysis.user_traction.score}/100
                    </span>
                  </div>
                  <div className="mt-3">
                    <p className="text-sm font-medium text-gray-700 mb-2">Metriche di Trazione:</p>
                    <ul className="list-disc list-inside space-y-1">
                      {professionalData.product_analysis.user_traction.metrics.map((metric: string, index: number) => (
                        <li key={index} className="text-sm text-gray-600">{metric}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'risks' && (
          <div className="space-y-8">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Analisi dei Rischi</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(professionalData.risk_factor_analysis).map(([key, value]: [string, any]) => {
                  if (key === 'total_risk_adjustment' || key === 'summary') return null
                  return (
                    <div key={key} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-medium text-gray-700 capitalize">
                          {key.replace('_', ' ')}
                        </span>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getRiskColor(value.level)}`}>
                          {value.level === 'low' ? 'Basso' : value.level === 'medium' ? 'Medio' : 'Alto'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{value.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">Impatto sulla valutazione:</span>
                        <span className={`text-sm font-semibold ${value.impact > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {value.impact > 0 ? '+' : ''}{value.impact}%
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-gray-900">Aggiustamento Rischio Totale:</span>
                  <span className={`text-lg font-bold ${professionalData.risk_factor_analysis.total_risk_adjustment > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {professionalData.risk_factor_analysis.total_risk_adjustment > 0 ? '+' : ''}{professionalData.risk_factor_analysis.total_risk_adjustment}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'recommendations' && (
          <div className="space-y-8">
            {/* Recommendations */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Raccomandazioni Strategiche</h3>
              <div className="space-y-4">
                {professionalData.recommendations.map((rec: string, index: number) => (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                    <Lightbulb className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-gray-700">{rec}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Missing Areas */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Aree da Sviluppare</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {professionalData.missing_areas.map((area: string, index: number) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-red-50 rounded-lg">
                    <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{area}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Next Steps */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Prossimi Passi</h3>
              <div className="space-y-6">
                {Object.entries(professionalData.next_steps).map(([key, value]: [string, any]) => {
                  if (key === 'immediate_actions') return null
                  return (
                    <div key={key}>
                      <h4 className="font-medium text-gray-900 mb-3 capitalize">
                        {key.replace('_', ' ')} ({value.timeline})
                      </h4>
                      <div className="space-y-2">
                        {value.tasks.map((task: string, index: number) => (
                          <div key={index} className="flex items-center space-x-3 p-2 bg-gray-50 rounded">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            <span className="text-sm text-gray-700">{task}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}