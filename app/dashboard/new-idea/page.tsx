'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Lightbulb, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle, 
  Loader2, 
  Target, 
  Users, 
  DollarSign,
  AlertCircle,
  Sparkles
} from 'lucide-react'

interface IdeaFormData {
  title: string
  description: string
  target_market: string
  value_proposition: string
  business_model: string
  competitive_advantage: string
  team_experience: string
  funding_needed: string
  timeline: string
  main_challenges: string
}

export default function NewIdeaPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [formData, setFormData] = useState<IdeaFormData>({
    title: '',
    description: '',
    target_market: '',
    value_proposition: '',
    business_model: '',
    competitive_advantage: '',
    team_experience: '',
    funding_needed: '',
    timeline: '',
    main_challenges: ''
  })

  const steps = [
    {
      id: 1,
      title: 'Idea Base',
      description: 'Descrivi la tua idea in modo generale',
      icon: Lightbulb,
      fields: ['title', 'description']
    },
    {
      id: 2,
      title: 'Mercato & Valore',
      description: 'Definisci il mercato di riferimento e la value proposition',
      icon: Target,
      fields: ['target_market', 'value_proposition']
    },
    {
      id: 3,
      title: 'Business Model',
      description: 'Come pensi di monetizzare e battere la concorrenza',
      icon: DollarSign,
      fields: ['business_model', 'competitive_advantage']
    },
    {
      id: 4,
      title: 'Team & Risorse',
      description: 'Esperienza del team e risorse necessarie',
      icon: Users,
      fields: ['team_experience', 'funding_needed', 'timeline', 'main_challenges']
    }
  ]

  const handleInputChange = (field: keyof IdeaFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const getCurrentStepFields = () => {
    const step = steps.find(s => s.id === currentStep)
    return step?.fields || []
  }

  const isCurrentStepValid = () => {
    const fields = getCurrentStepFields()
    return fields.every(field => formData[field as keyof IdeaFormData].trim() !== '')
  }

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleAnalyze = async () => {
    setIsAnalyzing(true)
    try {
      const response = await fetch('/api/analyze-idea', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          questionnaire: {
            target_market: formData.target_market,
            value_proposition: formData.value_proposition,
            business_model: formData.business_model,
            competitive_advantage: formData.competitive_advantage,
            team_experience: formData.team_experience,
            funding_needed: formData.funding_needed,
            timeline: formData.timeline,
            main_challenges: formData.main_challenges
          }
        })
      })

      if (response.ok) {
        const result = await response.json()
        router.push(`/dashboard/projects/${result.project_id}`)
      } else {
        throw new Error('Errore durante l&apos;analisi')
      }
    } catch (error) {
      console.error('Errore:', error)
      alert('Si è verificato un errore durante l&apos;analisi. Riprova.')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Titolo della tua idea *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="es. EcoFood Delivery, AI Study Buddy, FinTech per PMI..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descrizione dettagliata *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Descrivi la tua idea in dettaglio: cosa fa, come funziona, che problema risolve..."
                rows={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mercato di riferimento *
              </label>
              <textarea
                value={formData.target_market}
                onChange={(e) => handleInputChange('target_market', e.target.value)}
                placeholder="Chi sono i tuoi clienti target? Dimensione del mercato, caratteristiche demografiche, comportamenti..."
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Value Proposition *
              </label>
              <textarea
                value={formData.value_proposition}
                onChange={(e) => handleInputChange('value_proposition', e.target.value)}
                placeholder="Che valore unico offri? Perché i clienti dovrebbero scegliere te invece di alternative esistenti?"
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Modello di Business *
              </label>
              <textarea
                value={formData.business_model}
                onChange={(e) => handleInputChange('business_model', e.target.value)}
                placeholder="Come generi ricavi? Subscription, marketplace, freemium, vendita diretta, commissioni..."
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Vantaggio Competitivo *
              </label>
              <textarea
                value={formData.competitive_advantage}
                onChange={(e) => handleInputChange('competitive_advantage', e.target.value)}
                placeholder="Cosa ti rende unico? Tecnologia proprietaria, network effects, first-mover advantage..."
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Esperienza del Team *
              </label>
              <textarea
                value={formData.team_experience}
                onChange={(e) => handleInputChange('team_experience', e.target.value)}
                placeholder="Background ed esperienze rilevanti del team fondatore..."
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Funding Necessario *
              </label>
              <input
                type="text"
                value={formData.funding_needed}
                onChange={(e) => handleInputChange('funding_needed', e.target.value)}
                placeholder="es. €100K per MVP, €500K per Serie A..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Timeline di Sviluppo *
              </label>
              <input
                type="text"
                value={formData.timeline}
                onChange={(e) => handleInputChange('timeline', e.target.value)}
                placeholder="es. MVP in 6 mesi, lancio in 12 mesi..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Principali Sfide *
              </label>
              <textarea
                value={formData.main_challenges}
                onChange={(e) => handleInputChange('main_challenges', e.target.value)}
                placeholder="Quali sono i principali rischi e sfide che prevedi?"
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-blue-100 rounded-lg">
            <Sparkles className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Analizza la Tua Idea</h1>
            <p className="text-gray-600">L&apos;AI di Claude analizzerà la tua startup idea e ti darà feedback dettagliato</p>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className={`
                flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors
                ${currentStep >= step.id 
                  ? 'bg-blue-600 border-blue-600 text-white' 
                  : 'border-gray-300 text-gray-500'
                }
              `}>
                {currentStep > step.id ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  <step.icon className="w-5 h-5" />
                )}
              </div>
              {index < steps.length - 1 && (
                <div className={`
                  w-full h-0.5 mx-4 transition-colors
                  ${currentStep > step.id ? 'bg-blue-600' : 'bg-gray-300'}
                `} />
              )}
            </div>
          ))}
        </div>
        <div className="mt-4">
          <h2 className="text-lg font-semibold text-gray-900">
            {steps[currentStep - 1]?.title}
          </h2>
          <p className="text-sm text-gray-600">
            {steps[currentStep - 1]?.description}
          </p>
        </div>
      </div>

      {/* Form Content */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
        {renderStepContent()}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between items-center">
        <button
          onClick={handlePrevious}
          disabled={currentStep === 1}
          className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Indietro
        </button>

        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span>{currentStep} di {steps.length}</span>
        </div>

        {currentStep < steps.length ? (
          <button
            onClick={handleNext}
            disabled={!isCurrentStepValid()}
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Avanti
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={handleAnalyze}
            disabled={!isCurrentStepValid() || isAnalyzing}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Analisi in corso...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Analizza con AI
              </>
            )}
          </button>
        )}
      </div>

      {/* Info Box */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <h3 className="font-semibold text-blue-900 mb-1">💡 Come funziona l&apos;analisi AI</h3>
            <p className="text-sm text-blue-800">
              Claude AI analizzerà la tua idea utilizzando framework consolidati come il Business Model Canvas, 
              analisi SWOT e valutazione del mercato. Riceverai un report dettagliato con score, 
              feedback specifici e un piano di miglioramento personalizzato.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}