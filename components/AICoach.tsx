'use client'

import { useState, useEffect } from 'react'
import { 
  Brain, TrendingUp, Users, Target, DollarSign, Lightbulb, 
  ChevronRight, CheckCircle, AlertCircle, Info, Star,
  ArrowRight, X, RefreshCw, Zap, BookOpen, HelpCircle
} from 'lucide-react'

interface AICoachProps {
  project: any
  analysis: any
  onImprove: (improvements: any) => void
  onClose: () => void
}

interface Improvement {
  id: string
  title: string
  description: string
  impact: 'high' | 'medium' | 'low'
  scoreImprovement: number
  category: 'team' | 'market' | 'product' | 'financial' | 'competitive'
  currentScore: number
  targetScore: number
  examples: string[]
  questions: string[]
  completed: boolean
}

export default function AICoach({ project, analysis, onImprove, onClose }: AICoachProps) {
  const [improvements, setImprovements] = useState<Improvement[]>([])
  const [selectedImprovement, setSelectedImprovement] = useState<Improvement | null>(null)
  const [showGuide, setShowGuide] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [potentialScore, setPotentialScore] = useState(0)

  useEffect(() => {
    generateImprovements()
  }, [project, analysis])

  const generateImprovements = () => {
    const currentAnalysis = analysis?.professional_analysis || analysis
    if (!currentAnalysis) return

    const improvements: Improvement[] = []

    // 1. TEAM ANALYSIS
    if (currentAnalysis.team_analysis?.founder_market_fit?.score < 70) {
      improvements.push({
        id: 'team_improvement',
        title: 'Rafforzare il Team',
        description: 'Il team necessita di competenze aggiuntive e track record più solido',
        impact: 'high',
        scoreImprovement: 15,
        category: 'team',
        currentScore: currentAnalysis.team_analysis.founder_market_fit.score,
        targetScore: 85,
        examples: [
          'Aggiungi un CTO con esperienza in startup tech',
          'Includi un advisor con exit nel settore',
          'Specifica precedenti successi del team',
          'Documenta le competenze complementari'
        ],
        questions: [
          'Quali sono i ruoli chiave mancanti nel team?',
          'Quali successi precedenti ha il team?',
          'Chi potrebbero essere advisor strategici?',
          'Quali competenze tecniche mancano?'
        ],
        completed: false
      })
    }

    // 2. MARKET ANALYSIS
    if (currentAnalysis.market_analysis?.som_analysis?.confidence < 70) {
      improvements.push({
        id: 'market_improvement',
        title: 'Analisi di Mercato Dettagliata',
        description: 'Serve una ricerca di mercato più approfondita con dati quantitativi',
        impact: 'high',
        scoreImprovement: 12,
        category: 'market',
        currentScore: currentAnalysis.market_analysis.som_analysis.confidence,
        targetScore: 80,
        examples: [
          'TAM: €50B (fonte: IDC Report 2024)',
          'SAM: €5B (mercato europeo specifico)',
          'SOM: €500M (target realistico 3 anni)',
          'Crescita: +15% annuo (trend settore)'
        ],
        questions: [
          'Quali sono le fonti autorevoli per il tuo mercato?',
          'Come si sta evolvendo il mercato?',
          'Quali sono i driver di crescita?',
          'Dove trovi i dati di mercato più affidabili?'
        ],
        completed: false
      })
    }

    // 3. COMPETITIVE ANALYSIS
    if (currentAnalysis.competitive_analysis?.competitive_position?.score < 65) {
      improvements.push({
        id: 'competitive_improvement',
        title: 'Vantaggio Competitivo',
        description: 'Definire chiaramente il vantaggio competitivo sostenibile',
        impact: 'medium',
        scoreImprovement: 10,
        category: 'competitive',
        currentScore: currentAnalysis.competitive_analysis.competitive_position.score,
        targetScore: 80,
        examples: [
          'Tecnologia proprietaria con IP protection',
          'First-mover advantage con network effect',
          'Costi operativi inferiori del 40%',
          'Esclusività partnerships strategiche'
        ],
        questions: [
          'Cosa ti rende unico vs competitors?',
          'Quali barriere all\'ingresso crei?',
          'Come proteggi il tuo vantaggio?',
          'Perché è difficile copiarti?'
        ],
        completed: false
      })
    }

    // 4. FINANCIAL MODEL
    if (currentAnalysis.financial_analysis?.revenue_model?.clarity < 70) {
      improvements.push({
        id: 'financial_improvement',
        title: 'Modello Finanziario',
        description: 'Definire unit economics e proiezioni realistiche',
        impact: 'high',
        scoreImprovement: 13,
        category: 'financial',
        currentScore: currentAnalysis.financial_analysis.revenue_model.clarity,
        targetScore: 85,
        examples: [
          'LTV: €2,400 (retention 24 mesi)',
          'CAC: €600 (payback 6 mesi)',
          'Margini: 80% (SaaS model)',
          'Crescita: +300% Y1, +150% Y2'
        ],
        questions: [
          'Quanto vale un cliente nel tempo?',
          'Quanto costa acquisire un cliente?',
          'Quali sono i tuoi margini reali?',
          'Come scale i ricavi?'
        ],
        completed: false
      })
    }

    // 5. PRODUCT DEVELOPMENT
    if (currentAnalysis.product_analysis?.product_market_fit?.score < 65) {
      improvements.push({
        id: 'product_improvement',
        title: 'Product-Market Fit',
        description: 'Validare il prodotto con clienti reali e feedback',
        impact: 'medium',
        scoreImprovement: 8,
        category: 'product',
        currentScore: currentAnalysis.product_analysis.product_market_fit.score,
        targetScore: 80,
        examples: [
          'Pilot con 10 clienti enterprise',
          'NPS score > 8/10',
          'Retention rate 85%+ dopo 6 mesi',
          'Feedback positivo su core feature'
        ],
        questions: [
          'Quanti clienti hanno testato il prodotto?',
          'Qual è il feedback ricevuto?',
          'Quale metric dimostra il PMF?',
          'Cosa dicono i clienti del value?'
        ],
        completed: false
      })
    }

    // Ordina per impatto
    improvements.sort((a, b) => {
      const impactOrder = { high: 3, medium: 2, low: 1 }
      return impactOrder[b.impact] - impactOrder[a.impact]
    })

    setImprovements(improvements)
    
    // Calcola score potenziale
    const currentScore = currentAnalysis.overall_score || 0
    const totalImprovement = improvements.reduce((sum, imp) => sum + imp.scoreImprovement, 0)
    setPotentialScore(Math.min(currentScore + totalImprovement, 100))
  }

  const startGuide = (improvement: Improvement) => {
    setSelectedImprovement(improvement)
    setShowGuide(true)
    setCurrentStep(0)
  }

  const completeImprovement = (improvementId: string) => {
    setImprovements(prev => 
      prev.map(imp => 
        imp.id === improvementId 
          ? { ...imp, completed: true }
          : imp
      )
    )
    setShowGuide(false)
    setSelectedImprovement(null)
  }

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-red-100 text-red-700'
      case 'medium': return 'bg-yellow-100 text-yellow-700'
      case 'low': return 'bg-green-100 text-green-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getImpactIcon = (impact: string) => {
    switch (impact) {
      case 'high': return <AlertCircle className="w-4 h-4" />
      case 'medium': return <Info className="w-4 h-4" />
      case 'low': return <CheckCircle className="w-4 h-4" />
      default: return <Info className="w-4 h-4" />
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'team': return <Users className="w-5 h-5" />
      case 'market': return <TrendingUp className="w-5 h-5" />
      case 'product': return <Target className="w-5 h-5" />
      case 'financial': return <DollarSign className="w-5 h-5" />
      case 'competitive': return <Zap className="w-5 h-5" />
      default: return <Lightbulb className="w-5 h-5" />
    }
  }

  if (showGuide && selectedImprovement) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto m-4">
          <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <div className="flex items-center space-x-3">
              <Brain className="w-6 h-6" />
              <h2 className="text-2xl font-bold">Guida al Miglioramento</h2>
            </div>
            <button onClick={() => setShowGuide(false)} className="text-white hover:text-gray-200">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="p-6">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-900">{selectedImprovement.title}</h3>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getImpactColor(selectedImprovement.impact)}`}>
                  +{selectedImprovement.scoreImprovement} punti
                </span>
              </div>
              <p className="text-gray-600 mb-4">{selectedImprovement.description}</p>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-red-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-600">Score Attuale</div>
                  <div className="text-2xl font-bold text-red-600">{selectedImprovement.currentScore}</div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-600">Score Obiettivo</div>
                  <div className="text-2xl font-bold text-green-600">{selectedImprovement.targetScore}</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Examples */}
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-3 flex items-center">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Esempi di Miglioramento
                </h4>
                <div className="space-y-2">
                  {selectedImprovement.examples.map((example, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <Star className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-blue-800">{example}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Questions */}
              <div className="bg-purple-50 rounded-lg p-4">
                <h4 className="font-semibold text-purple-900 mb-3 flex items-center">
                  <HelpCircle className="w-4 h-4 mr-2" />
                  Domande Guida
                </h4>
                <div className="space-y-2">
                  {selectedImprovement.questions.map((question, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <ChevronRight className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-purple-800">{question}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
              <h4 className="font-semibold text-yellow-900 mb-2">💡 Suggerimento del Coach</h4>
              <p className="text-sm text-yellow-800">
                {selectedImprovement.category === 'team' && 
                  'Inizia identificando i ruoli chiave mancanti, poi cerca advisor nel settore. Un team forte può aumentare il tuo score di 15+ punti!'
                }
                {selectedImprovement.category === 'market' && 
                  'Usa fonti autorevoli come IDC, Gartner, Statista. Dati quantitativi e trend di crescita rendono la tua analisi molto più credibile.'
                }
                {selectedImprovement.category === 'competitive' && 
                  'Identifica cosa ti rende difficile da copiare. Tecnologia, partnerships, know-how: ogni barriera aumenta il tuo valore.'
                }
                {selectedImprovement.category === 'financial' && 
                  'Calcola LTV/CAC ratio, margini e crescita. Investitori vogliono vedere unit economics sostenibili e scalabili.'
                }
                {selectedImprovement.category === 'product' && 
                  'Feedback dei clienti è oro. Testimonial, case studies, e metriche di retention dimostrano il product-market fit.'
                }
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between p-6 border-t bg-gray-50">
            <div className="text-sm text-gray-600">
              Completa questo miglioramento per aumentare il tuo score
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowGuide(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Chiudi
              </button>
              <button
                onClick={() => completeImprovement(selectedImprovement.id)}
                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Implementato
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto m-4">
        <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <div className="flex items-center space-x-3">
            <Brain className="w-6 h-6" />
            <div>
              <h2 className="text-2xl font-bold">AI Coach - Miglioramento Guidato</h2>
              <p className="text-purple-100 text-sm">Ottimizza il tuo progetto passo dopo passo</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white hover:text-gray-200">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Score Overview */}
        <div className="p-6 border-b bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-sm text-gray-600 mb-1">Score Attuale</div>
              <div className="text-3xl font-bold text-red-600">{analysis?.professional_analysis?.overall_score || 0}</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-600 mb-1">Score Potenziale</div>
              <div className="text-3xl font-bold text-green-600">{potentialScore}</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-600 mb-1">Miglioramento</div>
              <div className="text-3xl font-bold text-purple-600">+{potentialScore - (analysis?.professional_analysis?.overall_score || 0)}</div>
            </div>
          </div>
        </div>

        {/* Improvements List */}
        <div className="p-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Aree di Miglioramento Prioritarie</h3>
            <p className="text-gray-600">Segui questi suggerimenti per ottimizzare il tuo score</p>
          </div>

          <div className="space-y-4">
            {improvements.map((improvement) => (
              <div key={improvement.id} className={`border rounded-lg p-4 ${improvement.completed ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'}`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${improvement.completed ? 'bg-green-100' : 'bg-gray-100'}`}>
                      {improvement.completed ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        getCategoryIcon(improvement.category)
                      )}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{improvement.title}</h4>
                      <p className="text-sm text-gray-600">{improvement.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getImpactColor(improvement.impact)}`}>
                      {getImpactIcon(improvement.impact)}
                      <span className="ml-1">+{improvement.scoreImprovement}</span>
                    </span>
                    {!improvement.completed && (
                      <button
                        onClick={() => startGuide(improvement)}
                        className="flex items-center px-3 py-1 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm"
                      >
                        <Brain className="w-4 h-4 mr-1" />
                        Guida
                      </button>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">
                    Score: {improvement.currentScore} → {improvement.targetScore}
                  </span>
                  {improvement.completed && (
                    <span className="text-green-600 font-medium">✓ Completato</span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {improvements.length === 0 && (
            <div className="text-center py-8">
              <Brain className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Progetto Ottimizzato!</h3>
              <p className="text-gray-600">Il tuo progetto ha già un ottimo punteggio in tutte le aree principali.</p>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between p-6 border-t bg-gray-50">
          <div className="text-sm text-gray-600">
            Implementa i suggerimenti per massimizzare il tuo score
          </div>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            Chiudi Coach
          </button>
        </div>
      </div>
    </div>
  )
}