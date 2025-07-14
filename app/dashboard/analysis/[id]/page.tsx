'use client'

import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { ArrowLeft, TrendingUp, AlertCircle, CheckCircle, Target, Users, DollarSign, Clock, Download, Share } from 'lucide-react'

interface AnalysisData {
  id: string
  analysis: any
  extractedInfo: any
  fileName?: string
  timestamp: string
}

export default function AnalysisPage() {
  const params = useParams()
  const router = useRouter()
  const analysisId = params.id as string
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Carica i dati dell'analisi da localStorage
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
          // Se non troviamo dati in localStorage, generiamo dati di esempio
          setAnalysisData(generateMockData(analysisId))
        }
      } catch (error) {
        console.error('Errore caricamento analisi:', error)
      } finally {
        setLoading(false)
      }
    }

    loadAnalysisData()
  }, [analysisId])

  // Genera dati mock per testing quando localStorage è vuoto
  const generateMockData = (id: string): AnalysisData => ({
    id,
    timestamp: new Date().toISOString(),
    fileName: 'Documento analizzato',
    extractedInfo: {
      title: 'Progetto Startup Innovativo',
      description: 'Una startup che rivoluziona il settore della tecnologia.'
    },
    analysis: {
      overall_score: 78,
      swot_analysis: {
        strengths: ["Idea innovativa", "Mercato in crescita", "Team motivato"],
        weaknesses: ["Esperienza limitata", "Budget ristretto"],
        opportunities: ["Mercato emergente", "Pochi competitor diretti"],
        threats: ["Concorrenza established", "Cambiamenti normativi"]
      },
      detailed_feedback: {
        market_analysis: {
          score: 75,
          feedback: "Il mercato target mostra potenziale interessante con una crescita prevista del 15% annuo.",
          recommendations: ["Approfondire ricerca di mercato", "Identificare nicchie specifiche"]
        },
        business_model: {
          score: 70,
          feedback: "Il modello di business ha fondamenta solide ma necessita di maggiore definizione.",
          recommendations: ["Sviluppare pricing strategy", "Diversificare fonti di ricavo"]
        },
        team_assessment: {
          score: 80,
          feedback: "Il team mostra competenze complementari e buona motivazione.",
          missing_roles: ["CTO tecnico", "Marketing specialist"]
        },
        financial_viability: {
          score: 85,
          feedback: "Le proiezioni finanziarie sono realistiche e mostrano potenziale di crescita.",
          recommendations: ["Pianificare fundraising", "Ottimizzare costi operativi"]
        }
      },
      next_steps: [
        "Validare l'idea con potenziali clienti",
        "Sviluppare un MVP (Minimum Viable Product)",
        "Completare il team con le competenze mancanti",
        "Preparare pitch deck per investitori"
      ]
    }
  })

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Caricamento analisi...</p>
          </div>
        </div>
      </div>
    )
  }

  // Se l'ID è null o non troviamo dati
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
            Non riusciamo a trovare l'analisi richiesta. Questo può succedere se:
          </p>
          <ul className="text-left max-w-md mx-auto space-y-2 text-gray-600 mb-8">
            <li>• Il documento non è stato processato correttamente</li>
            <li>• C'è stato un errore durante il caricamento</li>
            <li>• Il link non è valido</li>
          </ul>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => router.push('/dashboard/new-idea')}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              Prova di Nuovo
            </button>
            <button
              onClick={() => router.push('/dashboard')}
              className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
            >
              Torna alla Dashboard
            </button>
          </div>
        </div>
      </div>
    )
  }

  const { analysis, extractedInfo } = analysisData

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100'
    if (score >= 60) return 'text-orange-600 bg-orange-100'
    return 'text-red-600 bg-red-100'
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
            <p className="text-gray-600">{extractedInfo.description}</p>
            {analysisData.fileName && (
              <p className="text-sm text-gray-500 mt-1">
                Fonte: {analysisData.fileName} • {new Date(analysisData.timestamp).toLocaleString('it-IT')}
              </p>
            )}
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
              <Share className="w-4 h-4" />
              Condividi
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Download className="w-4 h-4" />
              Esporta PDF
            </button>
          </div>
        </div>
      </div>

      {/* Overall Score */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Punteggio Complessivo</h2>
            <p className="text-gray-600">Valutazione generale della tua idea startup</p>
          </div>
          <div className="text-right">
            <div className={`inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-lg ${getScoreColor(analysis.overall_score)}`}>
              {getScoreIcon(analysis.overall_score)}
              {analysis.overall_score}%
            </div>
          </div>
        </div>
      </div>

      {/* SWOT Analysis */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Analisi SWOT</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              Punti di Forza
            </h3>
            <ul className="space-y-2">
              {analysis.swot_analysis.strengths.map((strength: string, index: number) => (
                <li key={index} className="text-green-700 text-sm">• {strength}</li>
              ))}
            </ul>
          </div>

          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <h3 className="font-semibold text-orange-800 mb-3 flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              Debolezze
            </h3>
            <ul className="space-y-2">
              {analysis.swot_analysis.weaknesses.map((weakness: string, index: number) => (
                <li key={index} className="text-orange-700 text-sm">• {weakness}</li>
              ))}
            </ul>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
              <Target className="w-5 h-5" />
              Opportunità
            </h3>
            <ul className="space-y-2">
              {analysis.swot_analysis.opportunities.map((opportunity: string, index: number) => (
                <li key={index} className="text-blue-700 text-sm">• {opportunity}</li>
              ))}
            </ul>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h3 className="font-semibold text-red-800 mb-3 flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              Minacce
            </h3>
            <ul className="space-y-2">
              {analysis.swot_analysis.threats.map((threat: string, index: number) => (
                <li key={index} className="text-red-700 text-sm">• {threat}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Detailed Feedback */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Target className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Analisi di Mercato</h3>
              <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-sm font-medium ${getScoreColor(analysis.detailed_feedback.market_analysis.score)}`}>
                {getScoreIcon(analysis.detailed_feedback.market_analysis.score)}
                {analysis.detailed_feedback.market_analysis.score}%
              </div>
            </div>
          </div>
          <p className="text-gray-600 text-sm mb-4">{analysis.detailed_feedback.market_analysis.feedback}</p>
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-2">Raccomandazioni:</h4>
            <ul className="space-y-1">
              {analysis.detailed_feedback.market_analysis.recommendations.map((rec: string, index: number) => (
                <li key={index} className="text-sm text-gray-600">• {rec}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Modello di Business</h3>
              <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-sm font-medium ${getScoreColor(analysis.detailed_feedback.business_model.score)}`}>
                {getScoreIcon(analysis.detailed_feedback.business_model.score)}
                {analysis.detailed_feedback.business_model.score}%
              </div>
            </div>
          </div>
          <p className="text-gray-600 text-sm mb-4">{analysis.detailed_feedback.business_model.feedback}</p>
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-2">Raccomandazioni:</h4>
            <ul className="space-y-1">
              {analysis.detailed_feedback.business_model.recommendations.map((rec: string, index: number) => (
                <li key={index} className="text-sm text-gray-600">• {rec}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Valutazione Team</h3>
              <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-sm font-medium ${getScoreColor(analysis.detailed_feedback.team_assessment.score)}`}>
                {getScoreIcon(analysis.detailed_feedback.team_assessment.score)}
                {analysis.detailed_feedback.team_assessment.score}%
              </div>
            </div>
          </div>
          <p className="text-gray-600 text-sm mb-4">{analysis.detailed_feedback.team_assessment.feedback}</p>
          {analysis.detailed_feedback.team_assessment.missing_roles && (
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-2">Ruoli mancanti:</h4>
              <ul className="space-y-1">
                {analysis.detailed_feedback.team_assessment.missing_roles.map((role: string, index: number) => (
                  <li key={index} className="text-sm text-gray-600">• {role}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-orange-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Sostenibilità Finanziaria</h3>
              <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-sm font-medium ${getScoreColor(analysis.detailed_feedback.financial_viability.score)}`}>
                {getScoreIcon(analysis.detailed_feedback.financial_viability.score)}
                {analysis.detailed_feedback.financial_viability.score}%
              </div>
            </div>
          </div>
          <p className="text-gray-600 text-sm mb-4">{analysis.detailed_feedback.financial_viability.feedback}</p>
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-2">Raccomandazioni:</h4>
            <ul className="space-y-1">
              {analysis.detailed_feedback.financial_viability.recommendations.map((rec: string, index: number) => (
                <li key={index} className="text-sm text-gray-600">• {rec}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Next Steps */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Clock className="w-6 h-6 text-blue-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900">Prossimi Passi</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {analysis.next_steps.map((step: string, index: number) => (
            <div key={index} className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
              <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold mt-0.5">
                {index + 1}
              </div>
              <p className="text-gray-700 text-sm">{step}</p>
            </div>
          ))}
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
            onClick={() => router.push('/dashboard/teamup')}
            className="flex-1 border border-gray-300 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
          >
            Trova Co-founder
          </button>
          <button
            onClick={() => router.push('/dashboard/investors')}
            className="flex-1 border border-gray-300 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
          >
            Cerca Investitori
          </button>
        </div>
      </div>
    </div>
  )
}