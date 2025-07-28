'use client'

import { useState } from 'react'
import { Rocket, ArrowRight, CheckCircle, X, ChevronRight, Award, Zap, TrendingUp, Target, Clock, Building, Home } from 'lucide-react'

export default function StartupReadinessTest() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<number[]>([])
  const [showResults, setShowResults] = useState(false)

  // Quiz Questions
  const quizQuestions = [
    {
      id: 1,
      question: "Il tuo business può crescere senza aumentare proporzionalmente i costi?",
      options: [
        { text: "Sì, è principalmente digitale/software", points: 25 },
        { text: "Parzialmente, ha componenti scalabili", points: 15 },
        { text: "No, richiede risorse proporzionali", points: 5 },
        { text: "Non sono sicuro", points: 0 }
      ]
    },
    {
      id: 2,
      question: "Qual è la dimensione del tuo mercato target?",
      options: [
        { text: "Oltre €100M (mercato globale)", points: 25 },
        { text: "€10M - €100M (mercato nazionale)", points: 20 },
        { text: "€1M - €10M (mercato regionale)", points: 10 },
        { text: "Meno di €1M (mercato locale)", points: 5 }
      ]
    },
    {
      id: 3,
      question: "Cosa rende unica la tua proposta di valore?",
      options: [
        { text: "Innovazione tecnologica rivoluzionaria", points: 25 },
        { text: "Nuovo modello di business", points: 20 },
        { text: "Esperienza utente superiore", points: 15 },
        { text: "Prezzo più competitivo", points: 10 }
      ]
    },
    {
      id: 4,
      question: "Che crescita annuale è realistica per il tuo business?",
      options: [
        { text: "Oltre 100% (crescita esponenziale)", points: 25 },
        { text: "50-100% (crescita molto alta)", points: 20 },
        { text: "20-50% (crescita sostenuta)", points: 15 },
        { text: "Meno del 20% (crescita moderata)", points: 10 }
      ]
    },
    {
      id: 5,
      question: "Di quanto capitale hai bisogno per crescere significativamente?",
      options: [
        { text: "€1M+ (scaling ambizioso)", points: 25 },
        { text: "€200K - €1M (espansione media)", points: 20 },
        { text: "€50K - €200K (crescita graduale)", points: 15 },
        { text: "Meno di €50K (bootstrap)", points: 10 }
      ]
    },
    {
      id: 6,
      question: "Come generi ricavi ricorrenti?",
      options: [
        { text: "Subscription/SaaS model", points: 25 },
        { text: "Commission/Marketplace", points: 20 },
        { text: "Freemium con upgrade", points: 15 },
        { text: "Vendite one-time", points: 10 }
      ]
    }
  ]

  const handleAnswerSelect = (points: number) => {
    const newAnswers = [...answers, points]
    setAnswers(newAnswers)

    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      setShowResults(true)
    }
  }

  const calculateScore = () => {
    return answers.reduce((sum, points) => sum + points, 0)
  }

  const getResultData = () => {
    const score = calculateScore()
    const percentage = Math.round((score / 150) * 100)

    if (percentage >= 70) {
      return {
        type: 'startup',
        title: '🚀 STARTUP POTENTIAL',
        subtitle: 'Congratulazioni! La tua idea ha forte potenziale startup!',
        color: 'from-green-500 to-emerald-600',
        bgColor: 'from-green-50 to-emerald-50',
        textColor: 'text-green-700',
        score: percentage,
        features: [
          '✅ Scalabilità elevata',
          '✅ Mercato significativo',
          '✅ Crescita potenziale alta',
          '✅ Modello investibile'
        ],
        ctas: [
          { text: 'Analizza la tua idea completa', href: '/dashboard/new-idea', color: 'bg-green-600 hover:bg-green-700' },
          { text: 'Trova co-founder', href: '/team-up', color: 'bg-purple-600 hover:bg-purple-700' },
          { text: 'Crea pitch deck', href: '/pitch-builder', color: 'bg-orange-600 hover:bg-orange-700' }
        ]
      }
    } else if (percentage >= 40) {
      return {
        type: 'scalable',
        title: '⚡ SCALABLE BUSINESS',
        subtitle: 'Buona idea imprenditoriale con potenziale di crescita!',
        color: 'from-blue-500 to-indigo-600',
        bgColor: 'from-blue-50 to-indigo-50',
        textColor: 'text-blue-700',
        score: percentage,
        features: [
          '⚠️ Alcune limitazioni alla scalabilità',
          '✅ Mercato valido',
          '⚠️ Crescita moderata',
          '💡 Potenziale da ottimizzare'
        ],
        ctas: [
          { text: 'Ottimizza il modello', href: '/dashboard/new-idea', color: 'bg-blue-600 hover:bg-blue-700' },
          { text: 'Valuta partnership', href: '/team-up', color: 'bg-purple-600 hover:bg-purple-700' }
        ]
      }
    } else {
      return {
        type: 'traditional',
        title: '🏪 TRADITIONAL BUSINESS',
        subtitle: 'Ottima idea per business tradizionale!',
        color: 'from-gray-500 to-slate-600',
        bgColor: 'from-gray-50 to-slate-50',
        textColor: 'text-gray-700',
        score: percentage,
        features: [
          'ℹ️ Modello non adatto a startup scaling',
          '✅ Può essere profittevole localmente',
          '⚠️ Limitazioni geografiche/settoriali',
          '💼 Focus su profittabilità'
        ],
        ctas: [
          { text: 'Considera franchising', href: '/dashboard/new-idea', color: 'bg-gray-600 hover:bg-gray-700' },
          { text: 'Espansione graduale', href: '/team-up', color: 'bg-purple-600 hover:bg-purple-700' }
        ]
      }
    }
  }

  const resetQuiz = () => {
    setCurrentQuestion(0)
    setAnswers([])
    setShowResults(false)
  }

  // Results Page
  if (showResults) {
    const result = getResultData()
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
            {/* Header */}
            <div className={`bg-gradient-to-r ${result.color} p-8 text-white text-center`}>
              <div className="text-6xl font-bold mb-2">{result.score}%</div>
              <h2 className="text-2xl font-bold mb-2">{result.title}</h2>
              <p className="text-xl opacity-90">{result.subtitle}</p>
            </div>

            {/* Results Content */}
            <div className="p-8">
              <div className={`bg-gradient-to-r ${result.bgColor} rounded-xl p-6 mb-6`}>
                <h3 className={`font-semibold ${result.textColor} mb-4`}>Analisi della tua idea:</h3>
                <div className="space-y-2">
                  {result.features.map((feature, index) => (
                    <div key={index} className={`${result.textColor} text-sm`}>
                      {feature}
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-4">Prossimi passi consigliati:</h3>
                <div className="space-y-3">
                  {result.ctas.map((cta, index) => (
                    <a
                      key={index}
                      href={cta.href}
                      className={`block text-center ${cta.color} text-white px-6 py-3 rounded-lg transition-colors font-medium`}
                    >
                      {cta.text}
                    </a>
                  ))}
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={resetQuiz}
                    className="flex-1 border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  >
                    Rifai il test
                  </button>
                  <a
                    href="/"
                    className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium text-center"
                  >
                    Torna alla homepage
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Quiz Page
  const question = quizQuestions[currentQuestion]
  const progress = ((currentQuestion + 1) / quizQuestions.length) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-600 rounded-lg">
                <Award className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">Startup Readiness Test</h1>
                <p className="text-sm text-gray-500">Scopri il potenziale della tua idea</p>
              </div>
            </div>
            <a
              href="/"
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline">Homepage</span>
            </a>
          </div>
        </div>
      </div>

      {/* Quiz Content */}
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] p-4">
        <div className="max-w-2xl mx-auto w-full">
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
            {/* Progress Bar */}
            <div className="bg-gray-200 h-2">
              <div 
                className="bg-gradient-to-r from-orange-500 to-red-600 h-2 transition-all duration-500"
                style={{ width: `${progress}%` }}
              ></div>
            </div>

            {/* Quiz Header */}
            <div className="p-8 border-b border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="text-sm text-gray-500">
                  Domanda {currentQuestion + 1} di {quizQuestions.length}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Clock className="w-4 h-4" />
                  <span>~3 min</span>
                </div>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                {question.question}
              </h2>
            </div>

            {/* Quiz Options */}
            <div className="p-8">
              <div className="space-y-4">
                {question.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(option.points)}
                    className="w-full text-left p-4 border-2 border-gray-200 rounded-xl hover:border-orange-300 hover:bg-orange-50 transition-all duration-200 group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-gray-900 group-hover:text-orange-900 font-medium">
                        {option.text}
                      </span>
                      <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-orange-500" />
                    </div>
                  </button>
                ))}
              </div>

              {/* Quiz Info Footer */}
              <div className="mt-8 p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl">
                <div className="flex items-center justify-center gap-6 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Completamente gratuito</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-blue-600" />
                    <span>Report istantaneo</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Info */}
          <div className="mt-8 text-center">
            <p className="text-gray-500 text-sm">
              Questo test ti aiuterà a capire se la tua idea ha le caratteristiche per diventare una startup scalabile
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}