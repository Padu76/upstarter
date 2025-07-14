'use client'

import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { 
  ArrowLeft, TrendingUp, AlertCircle, CheckCircle, Target, Users, DollarSign, Clock, 
  Download, Share, Star, ThumbsUp, ThumbsDown, Plus, Upload, FileText, 
  AlertTriangle, Info, Lightbulb, Presentation, FileCheck, Edit3, 
  MessageSquare, BookOpen, TrendingDown, Eye, EyeOff
} from 'lucide-react'

interface AnalysisData {
  id: string
  analysis: any
  extractedInfo: any
  fileName?: string
  timestamp: string
  type: 'professional'
  completeness?: number
  missingAreas?: MissingInfo[]
}

interface MissingInfo {
  category: string
  items: string[]
  priority: 'critical' | 'important' | 'nice-to-have'
  description: string
  forStage: 'pitch' | 'business-plan' | 'both'
}

interface AdditionalInfo {
  category: string
  content: string
  timestamp: string
}

export default function AnalysisPage() {
  const params = useParams()
  const router = useRouter()
  const analysisId = params.id as string
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('analysis')
  const [showAdditionalInfoForm, setShowAdditionalInfoForm] = useState(false)
  const [additionalInfos, setAdditionalInfos] = useState<AdditionalInfo[]>([])
  const [newInfoCategory, setNewInfoCategory] = useState('')
  const [newInfoContent, setNewInfoContent] = useState('')
  const [showUploadForm, setShowUploadForm] = useState(false)

  useEffect(() => {
    const loadAnalysisData = () => {
      try {
        if (!analysisId || analysisId === 'null') {
          setLoading(false)
          return
        }

        const stored = localStorage.getItem(`analysis_${analysisId}`)
        const additionalStored = localStorage.getItem(`additional_info_${analysisId}`)
        
        if (stored) {
          const data = JSON.parse(stored)
          setAnalysisData(enhanceAnalysisWithCompleteness(data))
        } else {
          setAnalysisData(generateProgressiveAnalysisData(analysisId))
        }

        if (additionalStored) {
          setAdditionalInfos(JSON.parse(additionalStored))
        }
        
      } catch (error) {
        console.error('Errore caricamento analisi:', error)
        setError('Errore nel caricamento dell\'analisi')
        setAnalysisData(generateProgressiveAnalysisData(analysisId))
      } finally {
        setLoading(false)
      }
    }

    loadAnalysisData()
  }, [analysisId])

  const enhanceAnalysisWithCompleteness = (data: AnalysisData): AnalysisData => {
    const completeness = calculateCompleteness(data.extractedInfo)
    const missingAreas = generateMissingAreas(data.extractedInfo, completeness)
    
    return {
      ...data,
      completeness,
      missingAreas
    }
  }

  const calculateCompleteness = (extractedInfo: any): number => {
    const requiredFields = [
      'title', 'description', 'target_market', 'value_proposition', 
      'business_model', 'competitive_advantage', 'team_experience', 
      'funding_needed', 'timeline', 'main_challenges'
    ]
    
    let completedFields = 0
    let totalWeight = 0
    
    // Peso diverso per ogni campo
    const fieldWeights = {
      title: 5,
      description: 10,
      target_market: 15,
      value_proposition: 15,
      business_model: 15,
      competitive_advantage: 10,
      team_experience: 10,
      funding_needed: 10,
      timeline: 5,
      main_challenges: 5
    }
    
    requiredFields.forEach(field => {
      const weight = fieldWeights[field as keyof typeof fieldWeights]
      totalWeight += weight
      
      const value = field === 'title' || field === 'description' 
        ? extractedInfo[field] 
        : extractedInfo.questionnaire?.[field]
      
      if (value && value.length > 20 && !value.includes('Da definire') && !value.includes('Da approfondire')) {
        completedFields += weight
      }
    })
    
    return Math.round((completedFields / totalWeight) * 100)
  }

  const generateMissingAreas = (extractedInfo: any, completeness: number): MissingInfo[] => {
    const missing: MissingInfo[] = []
    
    // Analisi campi critici mancanti
    if (!extractedInfo.questionnaire?.target_market || extractedInfo.questionnaire.target_market.includes('Da definire')) {
      missing.push({
        category: 'Analisi di Mercato',
        items: [
          'Dimensioni del mercato (TAM/SAM/SOM) con numeri specifici',
          'Segmentazione clientela dettagliata con personas',
          'Ricerca competitiva approfondita con positioning map',
          'Analisi dei trend di mercato e drivers di crescita'
        ],
        priority: 'critical',
        description: 'Fondamentale per validare l\'opportunità di business',
        forStage: 'pitch'
      })
    }

    if (!extractedInfo.questionnaire?.business_model || extractedInfo.questionnaire.business_model.includes('Da strutturare')) {
      missing.push({
        category: 'Modello di Business',
        items: [
          'Revenue streams dettagliati con pricing strategy',
          'Unit economics: LTV, CAC, contribution margin',
          'Business Model Canvas completo',
          'Proiezioni finanziarie 3-5 anni'
        ],
        priority: 'critical',
        description: 'Essenziale per dimostrare sostenibilità economica',
        forStage: 'pitch'
      })
    }

    if (!extractedInfo.questionnaire?.team_experience || extractedInfo.questionnaire.team_experience.includes('Da descrivere')) {
      missing.push({
        category: 'Team & Execution',
        items: [
          'CV dettagliati del team fondatore',
          'Track record e successi precedenti',
          'Competenze tecniche e di settore',
          'Advisory board e mentor strategici',
          'Piano di hiring e organizzazione'
        ],
        priority: 'important',
        description: 'Cruciale per la fiducia degli investitori',
        forStage: 'pitch'
      })
    }

    if (completeness < 60) {
      missing.push({
        category: 'Strategia Go-to-Market',
        items: [
          'Customer acquisition strategy con canali specifici',
          'Partnerships strategiche identificate',
          'Piano di marketing e comunicazione',
          'Roadmap di sviluppo prodotto',
          'Strategie di retention e upselling'
        ],
        priority: 'important',
        description: 'Necessario per il scaling del business',
        forStage: 'business-plan'
      })
    }

    if (completeness < 80) {
      missing.push({
        category: 'Aspetti Finanziari Avanzati',
        items: [
          'Cash flow projections mensili',
          'Scenario analysis (best/base/worst case)',
          'Break-even analysis dettagliata',
          'Working capital requirements',
          'Exit strategy e valuation benchmarks'
        ],
        priority: 'important',
        description: 'Richiesto per business plan completo',
        forStage: 'business-plan'
      })

      missing.push({
        category: 'Risk Assessment',
        items: [
          'Analisi SWOT approfondita',
          'Risk mitigation strategies',
          'Sensitivity analysis sui key drivers',
          'Contingency plans operativi',
          'Compliance e aspetti legali'
        ],
        priority: 'nice-to-have',
        description: 'Dimostra maturità strategica del progetto',
        forStage: 'business-plan'
      })
    }

    return missing
  }

  const generateProgressiveAnalysisData = (id: string): AnalysisData => {
    const mockExtractedInfo = {
      title: 'EcoTech Solutions - Smart Cities IoT',
      description: 'Piattaforma IoT per la gestione intelligente di infrastrutture urbane con focus su sostenibilità ambientale.',
      questionnaire: {
        target_market: 'Smart cities e enti pubblici - mercato da definire meglio con dimensioni specifiche',
        value_proposition: 'Riduzione costi energetici attraverso IoT - value proposition da approfondire',
        business_model: 'Modello SaaS - da strutturare pricing e revenue streams',
        competitive_advantage: 'Tecnologia IoT proprietaria - vantaggio competitivo da evidenziare',
        team_experience: 'Team tecnico - esperienza da descrivere dettagliatamente',
        funding_needed: 'Finanziamenti da quantificare per sviluppo e crescita',
        timeline: 'Roadmap da pianificare con milestones specifiche',
        main_challenges: 'Sfide tecniche e di mercato da identificare'
      }
    }

    const completeness = calculateCompleteness(mockExtractedInfo)
    const missingAreas = generateMissingAreas(mockExtractedInfo, completeness)

    return {
      id,
      timestamp: new Date().toISOString(),
      fileName: 'Business Plan Draft.docx',
      type: 'professional',
      extractedInfo: mockExtractedInfo,
      completeness,
      missingAreas,
      analysis: {
        overall_score: Math.max(40, completeness - 10), // Score minimo 40
        preliminary_assessment: generatePreliminaryAssessment(completeness),
        executive_summary: {
          initial_impression: completeness > 70 
            ? "Il progetto presenta elementi promettenti ma necessita di approfondimenti strategici"
            : "Il progetto è in fase iniziale e richiede sviluppo sostanziale prima della valutazione finale",
          key_strengths: [
            "Settore IoT in forte crescita con opportunità significative",
            "Focus su sostenibilità allineato ai trend ESG",
            "Mercato smart cities supportato da policy EU"
          ],
          immediate_concerns: [
            "Informazioni insufficienti per valutazione completa",
            "Necessità di validazione product-market fit",
            "Business model e monetizzazione da strutturare"
          ],
          next_steps_priority: missingAreas.filter(area => area.priority === 'critical').map(area => area.category)
        }
      }
    }
  }

  const generatePreliminaryAssessment = (completeness: number): string => {
    if (completeness >= 80) {
      return "ANALISI AVANZATA POSSIBILE: Il progetto contiene informazioni sufficienti per una valutazione approfondita. Alcune aree potrebbero beneficiare di ulteriori dettagli per ottimizzare la strategia."
    } else if (completeness >= 60) {
      return "ANALISI INTERMEDIA: Il progetto presenta elementi interessanti ma necessita di informazioni aggiuntive critiche per una valutazione completa. Focus su business model e mercato."
    } else if (completeness >= 40) {
      return "ANALISI PRELIMINARE: Il progetto è in fase iniziale. Sono necessarie informazioni fondamentali per procedere con una valutazione significativa. Priorità su mercato e value proposition."
    } else {
      return "PROGETTO EMBRIONALE: Informazioni insufficienti per una valutazione meaningful. Necessario sviluppo sostanziale del concept prima di procedere con analisi dettagliata."
    }
  }

  const handleAddAdditionalInfo = () => {
    if (!newInfoCategory || !newInfoContent) return

    const newInfo: AdditionalInfo = {
      category: newInfoCategory,
      content: newInfoContent,
      timestamp: new Date().toISOString()
    }

    const updatedInfos = [...additionalInfos, newInfo]
    setAdditionalInfos(updatedInfos)
    localStorage.setItem(`additional_info_${analysisId}`, JSON.stringify(updatedInfos))

    // Reset form
    setNewInfoCategory('')
    setNewInfoContent('')
    setShowAdditionalInfoForm(false)

    // Ricalcola completeness se ha aggiunto info critiche
    if (analysisData) {
      const enhanced = enhanceAnalysisWithCompleteness(analysisData)
      setAnalysisData(enhanced)
    }
  }

  const getCompletenessColor = (completeness: number) => {
    if (completeness >= 80) return 'bg-green-500'
    if (completeness >= 60) return 'bg-yellow-500'
    if (completeness >= 40) return 'bg-orange-500'
    return 'bg-red-500'
  }

  const getCompletenessLabel = (completeness: number) => {
    if (completeness >= 80) return 'Analisi Completa'
    if (completeness >= 60) return 'Informazioni Sufficienti'
    if (completeness >= 40) return 'Analisi Preliminare'
    return 'Progetto Embrionale'
  }

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'critical': return <AlertTriangle className="w-4 h-4 text-red-500" />
      case 'important': return <AlertCircle className="w-4 h-4 text-orange-500" />
      case 'nice-to-have': return <Info className="w-4 h-4 text-blue-500" />
      default: return <Info className="w-4 h-4" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'border-red-200 bg-red-50'
      case 'important': return 'border-orange-200 bg-orange-50'
      case 'nice-to-have': return 'border-blue-200 bg-blue-50'
      default: return 'border-gray-200 bg-gray-50'
    }
  }

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Caricamento consulenza strategica...</p>
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

  const { analysis, extractedInfo, completeness = 0, missingAreas = [] } = analysisData

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
          </div>
          
          <div className="flex items-center gap-4">
            {/* Completeness Badge */}
            <div className="text-right">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-16 bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all ${getCompletenessColor(completeness)}`}
                    style={{ width: `${completeness}%` }}
                  />
                </div>
                <span className="text-sm font-semibold text-gray-700">{completeness}%</span>
              </div>
              <p className="text-xs text-gray-500">{getCompletenessLabel(completeness)}</p>
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

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="flex space-x-8 overflow-x-auto">
          {[
            { id: 'analysis', label: 'Analisi Attuale', icon: TrendingUp },
            { id: 'missing', label: 'Aree da Sviluppare', icon: AlertTriangle, badge: missingAreas.length },
            { id: 'roadmap', label: 'Roadmap Sviluppo', icon: Target },
            { id: 'additional', label: 'Info Aggiuntive', icon: Plus, badge: additionalInfos.length }
          ].map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-4 px-2 border-b-2 font-medium text-sm whitespace-nowrap transition-colors relative ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
                {tab.badge && tab.badge > 0 && (
                  <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {tab.badge}
                  </span>
                )}
              </button>
            )
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="space-y-8">
        
        {/* Analysis Tab */}
        {activeTab === 'analysis' && (
          <div className="space-y-8">
            {/* Preliminary Assessment */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className={`p-2 rounded-lg ${completeness >= 60 ? 'bg-green-100' : 'bg-orange-100'}`}>
                  {completeness >= 60 ? (
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  ) : (
                    <AlertCircle className="w-6 h-6 text-orange-600" />
                  )}
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Valutazione Preliminare</h2>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <p className="text-blue-800 font-medium leading-relaxed">
                  {analysis.preliminary_assessment}
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
                    <ThumbsUp className="w-5 h-5" />
                    Elementi Positivi
                  </h3>
                  <ul className="space-y-2">
                    {analysis.executive_summary.key_strengths.map((strength: string, index: number) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700 text-sm">{strength}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-orange-800 mb-3 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5" />
                    Aree di Attenzione
                  </h3>
                  <ul className="space-y-2">
                    {analysis.executive_summary.immediate_concerns.map((concern: string, index: number) => (
                      <li key={index} className="flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700 text-sm">{concern}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {analysis.executive_summary.next_steps_priority && analysis.executive_summary.next_steps_priority.length > 0 && (
                <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <h3 className="font-semibold text-red-800 mb-2">Priorità Immediate</h3>
                  <p className="text-red-700 text-sm">
                    Focus su: {analysis.executive_summary.next_steps_priority.join(', ')}
                  </p>
                </div>
              )}
            </div>

            {/* Score Overview */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Score Attuale</h2>
              <div className="flex items-center justify-center">
                <div className="relative">
                  <div className="w-32 h-32 rounded-full border-8 border-gray-200 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-gray-900">{analysis.overall_score}</div>
                      <div className="text-sm text-gray-500">/ 100</div>
                    </div>
                  </div>
                  <div 
                    className={`absolute inset-0 rounded-full border-8 ${getCompletenessColor(analysis.overall_score)} border-transparent transition-all`}
                    style={{
                      background: `conic-gradient(from 0deg, ${analysis.overall_score >= 80 ? '#10b981' : analysis.overall_score >= 60 ? '#f59e0b' : '#ef4444'} ${analysis.overall_score * 3.6}deg, transparent 0deg)`
                    }}
                  />
                </div>
              </div>
              <div className="text-center mt-4">
                <p className="text-gray-600">
                  {analysis.overall_score >= 80 ? 'Progetto maturo, pronto per investimenti' :
                   analysis.overall_score >= 60 ? 'Progetto promettente, necessita sviluppo' :
                   analysis.overall_score >= 40 ? 'Progetto in fase iniziale' :
                   'Progetto embrionale'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Missing Areas Tab */}
        {activeTab === 'missing' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Aree da Sviluppare per Analisi Completa</h2>
              
              {missingAreas.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Analisi Completa!</h3>
                  <p className="text-gray-600">Il tuo progetto contiene tutte le informazioni necessarie per una valutazione approfondita.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {missingAreas.map((area, index) => (
                    <div key={index} className={`border-2 rounded-lg p-4 ${getPriorityColor(area.priority)}`}>
                      <div className="flex items-start gap-3 mb-3">
                        {getPriorityIcon(area.priority)}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-gray-900">{area.category}</h3>
                            <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                              area.forStage === 'pitch' ? 'bg-blue-100 text-blue-800' :
                              area.forStage === 'business-plan' ? 'bg-purple-100 text-purple-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {area.forStage === 'pitch' ? 'Per Pitch' :
                               area.forStage === 'business-plan' ? 'Per Business Plan' :
                               'Entrambi'}
                            </span>
                          </div>
                          <p className="text-gray-700 text-sm mb-3">{area.description}</p>
                          <ul className="space-y-1">
                            {area.items.map((item, itemIndex) => (
                              <li key={itemIndex} className="flex items-start gap-2">
                                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0" />
                                <span className="text-gray-600 text-sm">{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Roadmap Tab */}
        {activeTab === 'roadmap' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Roadmap di Sviluppo</h2>
              
              <div className="space-y-8">
                {/* Step 1: Pitch Deck */}
                <div className="relative">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold">
                      1
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                        <Presentation className="w-5 h-5" />
                        Preparazione Pitch Deck
                      </h3>
                      <p className="text-gray-600 text-sm">Focus su validazione concept e primo interesse investitori</p>
                    </div>
                  </div>
                  
                  <div className="ml-14">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                      <h4 className="font-medium text-blue-900 mb-2">Elementi Critici per il Pitch:</h4>
                      <ul className="space-y-1">
                        {missingAreas
                          .filter(area => area.forStage === 'pitch' || area.forStage === 'both')
                          .slice(0, 3)
                          .map((area, index) => (
                            <li key={index} className="text-blue-800 text-sm">• {area.category}</li>
                          ))}
                      </ul>
                    </div>
                    <div className="text-sm text-gray-600">
                      <strong>Timeline:</strong> 2-4 settimane | <strong>Milestone:</strong> Pitch deck 10-12 slide pronto
                    </div>
                  </div>
                </div>

                {/* Step 2: Business Plan */}
                <div className="relative">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center font-semibold">
                      2
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                        <FileCheck className="w-5 h-5" />
                        Business Plan Completo
                      </h3>
                      <p className="text-gray-600 text-sm">Documenting completo per due diligence investitori</p>
                    </div>
                  </div>
                  
                  <div className="ml-14">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                      <h4 className="font-medium text-green-900 mb-2">Sviluppo Business Plan:</h4>
                      <ul className="space-y-1">
                        {missingAreas
                          .filter(area => area.forStage === 'business-plan' || area.forStage === 'both')
                          .slice(0, 3)
                          .map((area, index) => (
                            <li key={index} className="text-green-800 text-sm">• {area.category}</li>
                          ))}
                      </ul>
                    </div>
                    <div className="text-sm text-gray-600">
                      <strong>Timeline:</strong> 6-8 settimane | <strong>Milestone:</strong> Business plan esecutivo 30-40 pagine
                    </div>
                  </div>
                </div>

                {/* Step 3: Investment Ready */}
                <div className="relative">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-10 h-10 bg-purple-600 text-white rounded-full flex items-center justify-center font-semibold">
                      3
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5" />
                        Investment Ready
                      </h3>
                      <p className="text-gray-600 text-sm">Preparazione round di finanziamento</p>
                    </div>
                  </div>
                  
                  <div className="ml-14">
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                      <h4 className="font-medium text-purple-900 mb-2">Documenti per Investitori:</h4>
                      <ul className="space-y-1 text-purple-800 text-sm">
                        <li>• Pitch deck finale</li>
                        <li>• Executive summary</li>
                        <li>• Financial model dettagliato</li>
                        <li>• Market research completa</li>
                        <li>• Legal documents</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Additional Info Tab */}
        {activeTab === 'additional' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Informazioni Aggiuntive</h2>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowUploadForm(!showUploadForm)}
                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Upload className="w-4 h-4" />
                    Carica Documento
                  </button>
                  <button
                    onClick={() => setShowAdditionalInfoForm(!showAdditionalInfoForm)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Aggiungi Info
                  </button>
                </div>
              </div>

              {/* Upload Form */}
              {showUploadForm && (
                <div className="mb-6 p-4 border border-gray-200 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-3">Carica Documentazione Integrativa</h3>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600 mb-2">Trascina i file qui o clicca per selezionare</p>
                    <p className="text-sm text-gray-500">Supportati: PDF, DOCX, XLSX, PPT</p>
                    <button className="mt-3 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                      Seleziona File
                    </button>
                  </div>
                </div>
              )}

              {/* Additional Info Form */}
              {showAdditionalInfoForm && (
                <div className="mb-6 p-4 border border-gray-200 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-3">Aggiungi Informazioni</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Categoria</label>
                      <select
                        value={newInfoCategory}
                        onChange={(e) => setNewInfoCategory(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Seleziona categoria...</option>
                        <option value="Mercato">Analisi di Mercato</option>
                        <option value="Business Model">Business Model</option>
                        <option value="Team">Team & Competenze</option>
                        <option value="Finanze">Aspetti Finanziari</option>
                        <option value="Prodotto">Prodotto & Tecnologia</option>
                        <option value="Strategia">Strategia & Go-to-Market</option>
                        <option value="Altro">Altro</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Informazioni Dettagliate</label>
                      <textarea
                        value={newInfoContent}
                        onChange={(e) => setNewInfoContent(e.target.value)}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Inserisci informazioni dettagliate..."
                      />
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={handleAddAdditionalInfo}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Aggiungi
                      </button>
                      <button
                        onClick={() => setShowAdditionalInfoForm(false)}
                        className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Annulla
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Additional Info List */}
              {additionalInfos.length > 0 ? (
                <div className="space-y-4">
                  {additionalInfos.map((info, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900">{info.category}</h4>
                        <span className="text-sm text-gray-500">
                          {new Date(info.timestamp).toLocaleDateString('it-IT')}
                        </span>
                      </div>
                      <p className="text-gray-700 text-sm leading-relaxed">{info.content}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Nessuna informazione aggiuntiva</h3>
                  <p className="text-gray-600">Aggiungi dettagli per migliorare la qualità dell'analisi</p>
                </div>
              )}
            </div>
          </div>
        )}

      </div>

      {/* Action Buttons */}
      <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Prossime Azioni Consigliate</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <button
            onClick={() => setActiveTab('missing')}
            className="flex items-center gap-3 p-4 border border-orange-300 text-orange-700 rounded-lg hover:bg-orange-50 transition-colors"
          >
            <AlertTriangle className="w-5 h-5" />
            <div className="text-left">
              <div className="font-semibold">Completa Analisi</div>
              <div className="text-sm">Sviluppa aree mancanti</div>
            </div>
          </button>
          
          <button
            onClick={() => setActiveTab('additional')}
            className="flex items-center gap-3 p-4 border border-blue-300 text-blue-700 rounded-lg hover:bg-blue-50 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <div className="text-left">
              <div className="font-semibold">Aggiungi Info</div>
              <div className="text-sm">Fornisci dettagli extra</div>
            </div>
          </button>
          
          <button
            onClick={() => router.push('/dashboard/new-idea')}
            className="flex items-center gap-3 p-4 border border-green-300 text-green-700 rounded-lg hover:bg-green-50 transition-colors"
          >
            <Lightbulb className="w-5 h-5" />
            <div className="text-left">
              <div className="font-semibold">Nuova Analisi</div>
              <div className="text-sm">Analizza altra idea</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}