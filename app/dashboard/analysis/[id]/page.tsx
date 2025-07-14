'use client'

import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { ArrowLeft, TrendingUp, AlertCircle, CheckCircle, Target, Users, DollarSign, Clock, Download, Share, Star, ThumbsUp, ThumbsDown } from 'lucide-react'

interface AnalysisData {
  id: string
  analysis: any
  extractedInfo: any
  fileName?: string
  timestamp: string
  type: 'professional'
}

export default function AnalysisPage() {
  const params = useParams()
  const router = useRouter()
  const analysisId = params.id as string
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadAnalysisData = () => {
      try {
        if (!analysisId || analysisId === 'null') {
          setLoading(false)
          return
        }

        const stored = localStorage.getItem(`analysis_${analysisId}`)
        if (stored) {
          const data = JSON.parse(stored)
          setAnalysisData(data)
        } else {
          // Genera dati mock per testing
          setAnalysisData(generateMockAnalysisData(analysisId))
        }
      } catch (error) {
        console.error('Errore caricamento analisi:', error)
        setError('Errore nel caricamento dell\'analisi')
        // Fallback ai mock data
        setAnalysisData(generateMockAnalysisData(analysisId))
      } finally {
        setLoading(false)
      }
    }

    loadAnalysisData()
  }, [analysisId])

  const generateMockAnalysisData = (id: string): AnalysisData => ({
    id,
    timestamp: new Date().toISOString(),
    fileName: 'Business Plan Esempio.docx',
    type: 'professional',
    extractedInfo: {
      title: 'EcoTech Solutions - Smart Cities IoT',
      description: 'Piattaforma IoT per la gestione intelligente di infrastrutture urbane con focus su sostenibilità ambientale e efficienza energetica.'
    },
    analysis: {
      overall_score: 78,
      executive_summary: {
        key_insights: [
          "Mercato smart cities in crescita del 18.7% CAGR con forte spinta regulatory",
          "Team tecnico solido con expertise comprovata in IoT e sostenibilità", 
          "Business model B2B scalabile con recurring revenue potenziale"
        ],
        main_concerns: [
          "Competizione intensa da parte di incumbent tech giants",
          "Necessità di partnership con enti pubblici per accelerare adoption",
          "Dependency da fornitori hardware specializzati"
        ],
        investment_recommendation: "INVESTIMENTO RACCOMANDATO con valutazione appropriata per round Series A. La startup presenta fundamentals solidi, team competente e posizionamento strategico in mercato ad alta crescita.",
        berkus_score: 75,
        scorecard_score: 81
      },
      market_analysis: {
        score: 82,
        tam_sam_som_analysis: "TAM: €185B (Global Smart Cities Market), SAM: €28B (EU Smart Infrastructure), SOM: €420M (Target cities 100k+ abitanti in IT/DE/FR). Crescita TAM: 18.7% CAGR 2024-2029.",
        competitive_landscape: "Direct competitors: IBM Smart Cities, Cisco Smart+Connected, Siemens MindSphere. Market opportunity nella specializzazione sustainability-first approach.",
        pros: [
          "Mercato in crescita accelerata (+18.7% CAGR) con supporto istituzionale forte",
          "Positioning unico su sustainability vs generic IoT players",
          "Timing ottimale con EU Green Deal e PNRR funds"
        ],
        cons: [
          "Sales cycle lunghi (12-24 mesi) con enti pubblici", 
          "Competizione da tech giants con risorse superiori",
          "Dependency da policy changes e budget pubblici"
        ],
        recommendations: [
          "Focus geografico EU per sfruttare regulatory tailwinds",
          "Partnership strategiche con system integrator",
          "Sviluppo case studies ROI quantificabili"
        ]
      },
      business_model_analysis: {
        score: 74,
        business_model_canvas: "Value Prop: Riduzione costi energetici 25-40%, compliance automatizzata. Revenue: SaaS €50-200/sensor/anno + setup €10-50k. Scalability attraverso network effects.",
        unit_economics: "LTV: €180k (avg customer), CAC: €45k (B2B sales), LTV/CAC: 4.0x. Payback period: 14 mesi. Contribution margin: 72%.",
        pros: [
          "Recurring revenue model (75%) garantisce predictable cash flow",
          "Unit economics solidi con LTV/CAC 4.0x",
          "Scalability elevata con marginal costs decrescenti"
        ],
        cons: [
          "Setup costs elevati possono limitare adoption rate",
          "Dependency da volume per target margins",
          "Revenue concentration risk con large customers"
        ],
        recommendations: [
          "Introdurre pricing tier intermedio per mid-market",
          "Sviluppare marketplace revenue stream",
          "Implementare usage-based billing per retention"
        ]
      }
    }
  })

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Caricamento analisi professionale...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!analysisId || analysisId === 'null' || !analysisData) {
    return (
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Torna Indietro
        </button>

        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Analisi Non Trovata</h1>
          <p className="text-gray-600 mb-6">
            Non riusciamo a trovare l'analisi richiesta. Prova a caricare di nuovo il documento.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => router.push('/dashboard/new-idea')}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              Nuova Analisi
            </button>
            <button
              onClick={() => router.push('/dashboard')}
              className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
            >
              Dashboard
            </button>
          </div>
        </div>
      </div>
    )
  }

  const { analysis, extractedInfo } = analysisData

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100 border-green-200'
    if (score >= 60) return 'text-orange-600 bg-orange-100 border-orange-200'
    return 'text-red-600 bg-red-100 border-red-200'
  }

  const getScoreIcon = (score: number) => {
    if (score >= 80) return <CheckCircle className="w-5 h-5" />
    if (score >= 60) return <AlertCircle className="w-5 h-5" />
    return <AlertCircle className="w-5 h-5" />
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Torna alla Dashboard
        </button>
        
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{extractedInfo.title}</h1>
            <p className="text-gray-600 max-w-2xl">{extractedInfo.description}</p>
            {analysisData.fileName && (
              <p className="text-sm text-gray-500 mt-2">
                📄 {analysisData.fileName} • {new Date(analysisData.timestamp).toLocaleString('it-IT')}
              </p>
            )}
            {error && (
              <p className="text-orange-600 text-sm mt-1">⚠️ {error} (mostrando dati di esempio)</p>
            )}
          </div>
          
          <div className="flex items-center gap-4">
            <div className={`flex items-center gap-2 px-4 py-2 rounded-full border ${getScoreColor(analysis.overall_score)}`}>
              <Star className="w-5 h-5 fill-current" />
              <span className="font-semibold">{analysis.overall_score}/100</span>
            </div>
            <div className="flex gap-2">
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                <Share className="w-4 h-4" />
                Condividi
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Download className="w-4 h-4" />
                Esporta
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Executive Summary */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Executive Summary</h2>
        
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="font-semibold text-green-800 mb-4 flex items-center gap-2">
              <ThumbsUp className="w-5 h-5" />
              Key Insights
            </h3>
            <ul className="space-y-3">
              {analysis.executive_summary.key_insights.map((insight: string, index: number) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700 text-sm">{insight}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-red-800 mb-4 flex items-center gap-2">
              <ThumbsDown className="w-5 h-5" />
              Main Concerns
            </h3>
            <ul className="space-y-3">
              {analysis.executive_summary.main_concerns.map((concern: string, index: number) => (
                <li key={index} className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700 text-sm">{concern}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="p-6 bg-blue-50 border border-blue-200 rounded-lg mb-6">
          <h3 className="font-semibold text-blue-900 mb-3">Raccomandazione di Investimento</h3>
          <p className="text-blue-800 text-sm leading-relaxed">{analysis.executive_summary.investment_recommendation}</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-gray-900">{analysis.executive_summary.berkus_score}</div>
            <div className="text-sm text-gray-600">Berkus Score</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-gray-900">{analysis.executive_summary.scorecard_score}</div>
            <div className="text-sm text-gray-600">Scorecard Score</div>
          </div>
        </div>
      </div>

      {/* Market Analysis */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Analisi di Mercato</h2>
          <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${getScoreColor(analysis.market_analysis.score)}`}>
            {getScoreIcon(analysis.market_analysis.score)}
            <span className="font-semibold">{analysis.market_analysis.score}%</span>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">TAM/SAM/SOM Analysis</h3>
            <p className="text-gray-700 text-sm leading-relaxed">{analysis.market_analysis.tam_sam_som_analysis}</p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Competitive Landscape</h3>
            <p className="text-gray-700 text-sm leading-relaxed">{analysis.market_analysis.competitive_landscape}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-semibold text-green-800 mb-3">Punti di Forza</h4>
              <ul className="space-y-2">
                {analysis.market_analysis.pros.map((pro: string, index: number) => (
                  <li key={index} className="text-green-700 text-sm">• {pro}</li>
                ))}
              </ul>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h4 className="font-semibold text-red-800 mb-3">Debolezze</h4>
              <ul className="space-y-2">
                {analysis.market_analysis.cons.map((con: string, index: number) => (
                  <li key={index} className="text-red-700 text-sm">• {con}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-800 mb-3">Raccomandazioni</h4>
            <ul className="space-y-2">
              {analysis.market_analysis.recommendations.map((rec: string, index: number) => (
                <li key={index} className="text-blue-700 text-sm">• {rec}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Business Model Analysis */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Business Model Analysis</h2>
          <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${getScoreColor(analysis.business_model_analysis.score)}`}>
            {getScoreIcon(analysis.business_model_analysis.score)}
            <span className="font-semibold">{analysis.business_model_analysis.score}%</span>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Business Model Canvas</h3>
            <p className="text-gray-700 text-sm leading-relaxed">{analysis.business_model_analysis.business_model_canvas}</p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Unit Economics</h3>
            <p className="text-gray-700 text-sm leading-relaxed">{analysis.business_model_analysis.unit_economics}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-semibold text-green-800 mb-3">Punti di Forza</h4>
              <ul className="space-y-2">
                {analysis.business_model_analysis.pros.map((pro: string, index: number) => (
                  <li key={index} className="text-green-700 text-sm">• {pro}</li>
                ))}
              </ul>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h4 className="font-semibold text-red-800 mb-3">Debolezze</h4>
              <ul className="space-y-2">
                {analysis.business_model_analysis.cons.map((con: string, index: number) => (
                  <li key={index} className="text-red-700 text-sm">• {con}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-800 mb-3">Raccomandazioni</h4>
            <ul className="space-y-2">
              {analysis.business_model_analysis.recommendations.map((rec: string, index: number) => (
                <li key={index} className="text-blue-700 text-sm">• {rec}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Prossime Azioni</h3>
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => router.push('/dashboard/new-idea')}
            className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
          >
            Analizza Nuova Idea
          </button>
          <button
            onClick={() => router.push('/dashboard/projects')}
            className="flex-1 border border-gray-300 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
          >
            I Miei Progetti
          </button>
          <button
            onClick={() => router.push('/dashboard')}
            className="flex-1 border border-gray-300 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
          >
            Torna alla Dashboard
          </button>
        </div>
      </div>
    </div>
  )
}