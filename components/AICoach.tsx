'use client'

import { useState, useEffect, useRef } from 'react'
import { 
  Brain, TrendingUp, Users, Target, DollarSign, Lightbulb, 
  ChevronRight, CheckCircle, AlertCircle, Info, Star,
  ArrowRight, X, RefreshCw, Zap, BookOpen, HelpCircle,
  Upload, FileText, File, Plus, ChevronLeft, Save,
  BarChart3, Activity, Award, Shield, Rocket, MessageSquare
} from 'lucide-react'
import { ProfessionalStartupAnalyzer } from '@/lib/professional-startup-analyzer'

interface AICoachProps {
  project: any
  analysis: any
  onImprove: (improvements: any) => void
  onClose: () => void
}

interface MissingArea {
  id: string
  title: string
  description: string
  impact: 'high' | 'medium' | 'low'
  category: 'team' | 'market' | 'product' | 'financial' | 'competitive'
  currentScore: number
  targetScore: number
  scoreImprovement: number
  questions: string[]
  formFields: FormField[]
  completed: boolean
  data?: any
}

interface FormField {
  id: string
  label: string
  type: 'text' | 'textarea' | 'select' | 'number' | 'file'
  required: boolean
  options?: string[]
  placeholder?: string
  validation?: string
}

interface WizardStep {
  area: MissingArea
  formData: Record<string, any>
  documents: File[]
}

export default function AICoach({ project, analysis, onImprove, onClose }: AICoachProps) {
  const [missingAreas, setMissingAreas] = useState<MissingArea[]>([])
  const [showWizard, setShowWizard] = useState(false)
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [wizardSteps, setWizardSteps] = useState<WizardStep[]>([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisProgress, setAnalysisProgress] = useState('')
  const [beforeAfterData, setBeforeAfterData] = useState<any>(null)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    analyzeMissingAreas()
  }, [analysis])

  const analyzeMissingAreas = () => {
    console.log('🔍 Analyzing missing areas from:', analysis)
    
    const professionalData = analysis?.professional_analysis || analysis?.analysis_data?.professional_analysis
    if (!professionalData) {
      console.warn('⚠️ No professional analysis data found')
      return
    }

    const areas: MissingArea[] = []

    // 1. MARKET ANALYSIS
    if (safeGet(professionalData, 'market_analysis.som_analysis.confidence', 0) < 70) {
      areas.push({
        id: 'market_analysis',
        title: 'Analisi di Mercato Dettagliata',
        description: 'Quantifica TAM/SAM/SOM con fonti autorevoli e valida la domanda di mercato',
        impact: 'high',
        category: 'market',
        currentScore: safeGet(professionalData, 'market_analysis.som_analysis.confidence', 40),
        targetScore: 85,
        scoreImprovement: 15,
        questions: [
          'Quali sono le dimensioni del tuo mercato totale (TAM)?',
          'Quale porzione puoi effettivamente servire (SAM)?',
          'Quanto mercato puoi realisticamente catturare (SOM)?',
          'Quali fonti autorevoli supportano questi dati?'
        ],
        formFields: [
          { id: 'tam_size', label: 'TAM - Total Addressable Market', type: 'text', required: true, placeholder: 'es. €10B fonte IDC 2024' },
          { id: 'sam_size', label: 'SAM - Serviceable Addressable Market', type: 'text', required: true, placeholder: 'es. €1B mercato europeo' },
          { id: 'som_size', label: 'SOM - Serviceable Obtainable Market', type: 'text', required: true, placeholder: 'es. €50M target 3 anni' },
          { id: 'market_sources', label: 'Fonti Autorevoli', type: 'textarea', required: true, placeholder: 'IDC, Gartner, Statista, report di settore...' },
          { id: 'market_validation', label: 'Come hai validato la domanda?', type: 'textarea', required: true, placeholder: 'Interviste clienti, survey, pilot, LOI...' },
          { id: 'target_segments', label: 'Segmenti Target Prioritari', type: 'textarea', required: false, placeholder: 'Early adopters, enterprise, SMB...' }
        ],
        completed: false
      })
    }

    // 2. COMPETITIVE ANALYSIS
    if (safeGet(professionalData, 'competitive_analysis.competitive_position.score', 0) < 70) {
      areas.push({
        id: 'competitive_analysis',
        title: 'Analisi Competitiva Strutturata',
        description: 'Identifica competitor, definisci positioning e crea vantaggio competitivo sostenibile',
        impact: 'high',
        category: 'competitive',
        currentScore: safeGet(professionalData, 'competitive_analysis.competitive_position.score', 45),
        targetScore: 80,
        scoreImprovement: 12,
        questions: [
          'Chi sono i tuoi competitor diretti e indiretti?',
          'Cosa ti rende diverso e difficile da copiare?',
          'Quali barriere crei per proteggere il tuo vantaggio?',
          'Come ti posizioni vs la concorrenza?'
        ],
        formFields: [
          { id: 'direct_competitors', label: 'Competitor Diretti', type: 'textarea', required: true, placeholder: 'Lista competitor che fanno la stessa cosa...' },
          { id: 'indirect_competitors', label: 'Competitor Indiretti', type: 'textarea', required: true, placeholder: 'Alternative che risolvono lo stesso problema...' },
          { id: 'competitive_advantage', label: 'Vantaggio Competitivo Unico', type: 'textarea', required: true, placeholder: 'Cosa ti rende difficile da copiare...' },
          { id: 'barriers_to_entry', label: 'Barriere all\'Ingresso', type: 'textarea', required: true, placeholder: 'IP, network effects, switching costs, know-how...' },
          { id: 'positioning_statement', label: 'Positioning Statement', type: 'textarea', required: false, placeholder: 'Per [target] che [need], siamo [category] che [benefit] perché [reason]' }
        ],
        completed: false
      })
    }

    // 3. TEAM STRENGTHENING
    if (safeGet(professionalData, 'team_analysis.team_completeness.score', 0) < 75) {
      areas.push({
        id: 'team_strengthening',
        title: 'Rafforzamento Team',
        description: 'Completa il team con competenze chiave e advisory board qualificato',
        impact: 'high',
        category: 'team',
        currentScore: safeGet(professionalData, 'team_analysis.team_completeness.score', 50),
        targetScore: 85,
        scoreImprovement: 13,
        questions: [
          'Quali ruoli chiave mancano nel tuo team?',
          'Qual è il track record del team attuale?',
          'Chi potrebbero essere advisor strategici?',
          'Come documenti le competenze del team?'
        ],
        formFields: [
          { id: 'current_team', label: 'Team Attuale (ruoli e competenze)', type: 'textarea', required: true, placeholder: 'CEO: 10 anni fintech, CTO: ex-Google...' },
          { id: 'missing_roles', label: 'Ruoli Mancanti Prioritari', type: 'textarea', required: true, placeholder: 'Head of Sales, Marketing Manager, advisor settoriale...' },
          { id: 'track_record', label: 'Track Record e Successi Precedenti', type: 'textarea', required: true, placeholder: 'Exit, IPO, scale-up, expertise riconosciuta...' },
          { id: 'advisors', label: 'Advisory Board', type: 'textarea', required: false, placeholder: 'Nomi, ruoli, expertise, come contribuiscono...' },
          { id: 'hiring_plan', label: 'Piano Assunzioni prossimi 12 mesi', type: 'textarea', required: false, placeholder: 'Priorità, timeline, budget...' }
        ],
        completed: false
      })
    }

    // 4. FINANCIAL MODEL
    if (safeGet(professionalData, 'financial_analysis.revenue_model.clarity', 0) < 75) {
      areas.push({
        id: 'financial_model',
        title: 'Modello Finanziario Dettagliato',
        description: 'Definisci unit economics, proiezioni realistiche e path to profitability',
        impact: 'high',
        category: 'financial',
        currentScore: safeGet(professionalData, 'financial_analysis.revenue_model.clarity', 55),
        targetScore: 85,
        scoreImprovement: 14,
        questions: [
          'Quanto vale un cliente nel tempo (LTV)?',
          'Quanto costa acquisire un cliente (CAC)?',
          'Qual è il tuo modello di ricavi?',
          'Quando raggiungerai la profittabilità?'
        ],
        formFields: [
          { id: 'revenue_model', label: 'Modello di Ricavi', type: 'select', required: true, options: ['Abbonamento mensile', 'Abbonamento annuale', 'Freemium', 'Commissione per transazione', 'Licenza', 'Marketplace', 'Altro'] },
          { id: 'ltv', label: 'LTV - Lifetime Value per cliente', type: 'text', required: true, placeholder: 'es. €2,400 (24 mesi retention)' },
          { id: 'cac', label: 'CAC - Customer Acquisition Cost', type: 'text', required: true, placeholder: 'es. €600 (payback 6 mesi)' },
          { id: 'unit_economics', label: 'Unit Economics e Margini', type: 'textarea', required: true, placeholder: 'Margini lordi, contribuzione, break-even per cliente...' },
          { id: 'revenue_projections', label: 'Proiezioni Ricavi 3 anni', type: 'textarea', required: true, placeholder: 'Y1: €100K, Y2: €500K, Y3: €2M...' },
          { id: 'profitability_path', label: 'Path to Profitability', type: 'textarea', required: true, placeholder: 'Timeline, milestone, assumzioni chiave...' }
        ],
        completed: false
      })
    }

    // 5. PRODUCT VALIDATION
    if (safeGet(professionalData, 'product_analysis.product_market_fit.score', 0) < 70) {
      areas.push({
        id: 'product_validation',
        title: 'Validazione Prodotto-Mercato',
        description: 'Dimostra product-market fit con feedback clienti e metriche di trazione',
        impact: 'medium',
        category: 'product',
        currentScore: safeGet(professionalData, 'product_analysis.product_market_fit.score', 50),
        targetScore: 80,
        scoreImprovement: 10,
        questions: [
          'Quanti clienti hanno testato il prodotto?',
          'Qual è il feedback ricevuto?',
          'Quali metriche dimostrano il fit?',
          'Cosa dicono i clienti del value?'
        ],
        formFields: [
          { id: 'product_stage', label: 'Stadio Attuale Prodotto', type: 'select', required: true, options: ['Idea/Concept', 'Prototipo', 'MVP', 'Prodotto funzionante', 'Prodotto completo'] },
          { id: 'customer_feedback', label: 'Feedback Clienti Raccolto', type: 'textarea', required: true, placeholder: 'Interviste, survey, testimonial, case studies...' },
          { id: 'validation_metrics', label: 'Metriche di Validazione', type: 'textarea', required: true, placeholder: 'NPS, retention rate, usage metrics, churn...' },
          { id: 'pmf_evidence', label: 'Evidenze Product-Market Fit', type: 'textarea', required: true, placeholder: 'Organic growth, referrals, repeat purchases...' },
          { id: 'product_roadmap', label: 'Roadmap Prodotto', type: 'textarea', required: false, placeholder: 'Prossime features, timeline, priorità...' }
        ],
        completed: false
      })
    }

    // Ordina per impatto
    areas.sort((a, b) => {
      const impactOrder = { high: 3, medium: 2, low: 1 }
      return impactOrder[b.impact] - impactOrder[a.impact]
    })

    setMissingAreas(areas)
    console.log(`✅ Found ${areas.length} missing areas for improvement`)
  }

  const startGuidedImprovement = () => {
    const priorityAreas = missingAreas.filter(area => area.impact === 'high').slice(0, 3)
    const steps: WizardStep[] = priorityAreas.map(area => ({
      area,
      formData: {},
      documents: []
    }))
    
    setWizardSteps(steps)
    setCurrentStepIndex(0)
    setShowWizard(true)
  }

  const updateFormData = (fieldId: string, value: any) => {
    setWizardSteps(prev => {
      const updated = [...prev]
      updated[currentStepIndex].formData[fieldId] = value
      return updated
    })
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    const files = Array.from(e.dataTransfer.files)
    handleFiles(files)
  }

  const handleFiles = (files: File[]) => {
    const validFiles = files.filter(file => {
      const validTypes = ['text/plain', 'application/pdf', 
                         'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                         'application/msword']
      const validExtensions = ['.txt', '.pdf', '.doc', '.docx']
      
      return validTypes.includes(file.type) || 
             validExtensions.some(ext => file.name.toLowerCase().endsWith(ext))
    })

    setWizardSteps(prev => {
      const updated = [...prev]
      updated[currentStepIndex].documents.push(...validFiles)
      return updated
    })
  }

  const removeDocument = (index: number) => {
    setWizardSteps(prev => {
      const updated = [...prev]
      updated[currentStepIndex].documents.splice(index, 1)
      return updated
    })
  }

  const validateCurrentStep = (): boolean => {
    const currentStep = wizardSteps[currentStepIndex]
    const requiredFields = currentStep.area.formFields.filter(field => field.required)
    
    return requiredFields.every(field => {
      const value = currentStep.formData[field.id]
      return value && value.toString().trim().length > 0
    })
  }

  const nextStep = () => {
    if (!validateCurrentStep()) {
      alert('Completa tutti i campi obbligatori prima di continuare')
      return
    }

    if (currentStepIndex < wizardSteps.length - 1) {
      setCurrentStepIndex(prev => prev + 1)
    } else {
      processImprovements()
    }
  }

  const prevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1)
    }
  }

  const processImprovements = async () => {
    setIsAnalyzing(true)
    setAnalysisProgress('Preparazione dati per rianalisi...')

    try {
      // 1. Estrai testo da documenti
      const documentContents: Record<string, string> = {}
      
      for (const step of wizardSteps) {
        for (const doc of step.documents) {
          setAnalysisProgress(`Elaborazione documento: ${doc.name}`)
          const content = await extractTextFromFile(doc)
          documentContents[doc.name] = content
        }
      }

      // 2. Combina dati esistenti con nuovi dati
      setAnalysisProgress('Integrazione dati con analisi esistente...')
      const enhancedData = combineDataForReanalysis(wizardSteps, documentContents)

      // 3. Rilancia analisi professionale
      setAnalysisProgress('Rianalisi professionale in corso...')
      const analyzer = new ProfessionalStartupAnalyzer()
      const newAnalysis = await analyzer.analyzeFromQuestionnaire(enhancedData)

      // 4. Calcola miglioramenti
      const originalScore = analysis?.professional_analysis?.overall_score || 0
      const newScore = newAnalysis.overall_score
      
      setBeforeAfterData({
        before: {
          score: originalScore,
          valuation: analysis?.professional_analysis?.valuation_range?.recommended || 0,
          areas: missingAreas.map(area => ({ name: area.title, score: area.currentScore }))
        },
        after: {
          score: newScore,
          valuation: newAnalysis.valuation_range.recommended,
          areas: missingAreas.map(area => ({ name: area.title, score: area.targetScore }))
        },
        improvement: {
          scoreGain: newScore - originalScore,
          valuationGain: newAnalysis.valuation_range.recommended - (analysis?.professional_analysis?.valuation_range?.recommended || 0),
          areasImproved: wizardSteps.length
        }
      })

      // 5. Salva analisi aggiornata
      setAnalysisProgress('Salvataggio risultati...')
      await saveUpdatedAnalysis(newAnalysis)

      // 6. Callback per aggiornare il progetto
      onImprove({
        newAnalysis,
        beforeAfterData,
        areasImproved: wizardSteps.map(step => step.area.id)
      })

      setAnalysisProgress('Analisi completata con successo!')
      
    } catch (error) {
      console.error('❌ Error processing improvements:', error)
      setAnalysisProgress('Errore durante l\'analisi. Riprova.')
    } finally {
      setTimeout(() => {
        setIsAnalyzing(false)
        setShowWizard(false)
      }, 2000)
    }
  }

  const extractTextFromFile = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const extension = file.name.toLowerCase().split('.').pop()
      
      if (extension === 'txt') {
        const reader = new FileReader()
        reader.onload = (e) => resolve(e.target?.result as string)
        reader.onerror = () => reject(new Error('Errore lettura file TXT'))
        reader.readAsText(file)
      } else if (extension === 'pdf') {
        // TODO: Implementare estrazione PDF con pdf-parse
        resolve(`[PDF Content from ${file.name}]`)
      } else if (extension === 'doc' || extension === 'docx') {
        const reader = new FileReader()
        reader.onload = async (e) => {
          try {
            const mammoth = await import('mammoth')
            const result = await mammoth.extractRawText({ 
              arrayBuffer: e.target?.result as ArrayBuffer 
            })
            resolve(result.value)
          } catch (error) {
            reject(new Error('Errore estrazione Word'))
          }
        }
        reader.readAsArrayBuffer(file)
      } else {
        reject(new Error('Formato file non supportato'))
      }
    })
  }

  const combineDataForReanalysis = (steps: WizardStep[], documents: Record<string, string>) => {
    // Crea struttura dati compatibile con QuestionnaireData
    const baseData = {
      project_name: project?.title || 'Progetto Migliorato',
      project_description: project?.description || 'Progetto con dati integrati',
      problem_solution: Object.values(documents).join('\n\n') || 'Soluzione migliorata',
      // Campi obbligatori per QuestionnaireData
      team_size: '2 persone',
      team_experience: 'Esperienza in crescita',
      target_market: 'Mercato target definito',
      market_validation: 'Validazione in corso',
      product_stage: 'MVP',
      unique_value: 'Valore unico in sviluppo',
      competitors: 'Competitor identificati',
      competitive_advantage: 'Vantaggio competitivo definito',
      business_model: 'Modello di business strutturato',
      funding_needs: '500K EUR',
      // Campi opzionali
      team_advisors: '',
      market_size: '',
      customer_feedback: '',
      revenue_projections: '',
      current_revenue: ''
    }

    // Integra dati dai form con override dei valori base
    steps.forEach(step => {
      const formData = step.formData
      
      switch (step.area.id) {
        case 'market_analysis':
          Object.assign(baseData, {
            target_market: formData.target_segments || baseData.target_market,
            market_size: formData.tam_size ? `TAM: ${formData.tam_size}, SAM: ${formData.sam_size}, SOM: ${formData.som_size}` : '',
            market_validation: formData.market_validation || baseData.market_validation
          })
          break
        case 'competitive_analysis':
          Object.assign(baseData, {
            competitors: formData.direct_competitors ? `${formData.direct_competitors}\n${formData.indirect_competitors}` : baseData.competitors,
            competitive_advantage: formData.competitive_advantage || baseData.competitive_advantage
          })
          break
        case 'team_strengthening':
          Object.assign(baseData, {
            team_size: formData.current_team ? (formData.current_team.length > 200 ? '5+ persone' : '3-4 persone') : baseData.team_size,
            team_experience: formData.track_record || baseData.team_experience,
            team_advisors: formData.advisors || ''
          })
          break
        case 'financial_model':
          Object.assign(baseData, {
            business_model: formData.revenue_model || baseData.business_model,
            revenue_projections: formData.revenue_projections || '',
            funding_needs: formData.ltv ? '750K EUR' : baseData.funding_needs,
            current_revenue: formData.ltv ? 'Ricavi in crescita' : ''
          })
          break
        case 'product_validation':
          Object.assign(baseData, {
            product_stage: formData.product_stage || baseData.product_stage,
            unique_value: formData.pmf_evidence ? 'Valore unico validato con evidenze' : baseData.unique_value,
            customer_feedback: formData.customer_feedback || ''
          })
          break
      }
    })

    return baseData
  }

  const saveUpdatedAnalysis = async (newAnalysis: any) => {
    const analysisId = analysis?.id || `analysis_${Date.now()}`
    const updatedAnalysis = {
      ...analysis,
      professional_analysis: newAnalysis,
      overall_score: newAnalysis.overall_score,
      updated_at: new Date().toISOString(),
      ai_coach_improvements: {
        applied_at: new Date().toISOString(),
        areas_improved: wizardSteps.map(step => step.area.id),
        before_score: analysis?.professional_analysis?.overall_score || 0,
        after_score: newAnalysis.overall_score
      }
    }

    localStorage.setItem(`analysis_${analysisId}`, JSON.stringify(updatedAnalysis))
    console.log('💾 Updated analysis saved to localStorage')
  }

  const safeGet = (obj: any, path: string, defaultValue: any = 0) => {
    return path.split('.').reduce((current, key) => current?.[key] ?? defaultValue, obj)
  }

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-red-100 text-red-700 border-red-200'
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200'
      case 'low': return 'bg-green-100 text-green-700 border-green-200'
      default: return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'team': return <Users className="w-5 h-5" />
      case 'market': return <TrendingUp className="w-5 h-5" />
      case 'product': return <Rocket className="w-5 h-5" />
      case 'financial': return <DollarSign className="w-5 h-5" />
      case 'competitive': return <Target className="w-5 h-5" />
      default: return <Lightbulb className="w-5 h-5" />
    }
  }

  const getFileIcon = (fileName: string) => {
    const ext = fileName.toLowerCase().split('.').pop()
    switch (ext) {
      case 'pdf': return <File className="w-4 h-4 text-red-600" />
      case 'doc':
      case 'docx': return <FileText className="w-4 h-4 text-blue-600" />
      case 'txt': return <FileText className="w-4 h-4 text-gray-600" />
      default: return <File className="w-4 h-4 text-gray-600" />
    }
  }

  // BEFORE/AFTER RESULTS MODAL
  if (beforeAfterData) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto m-4">
          <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-green-500 to-green-600 text-white">
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-6 h-6" />
              <h2 className="text-2xl font-bold">Progetto Migliorato con Successo!</h2>
            </div>
            <button onClick={onClose} className="text-white hover:text-gray-200">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="p-6">
            {/* Miglioramenti Principali */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="text-center p-6 bg-blue-50 rounded-lg">
                <div className="flex items-center justify-center mb-2">
                  <BarChart3 className="w-8 h-8 text-blue-600 mr-2" />
                  <div className="text-right">
                    <div className="text-sm text-gray-600">Score</div>
                    <div className="flex items-center">
                      <span className="text-lg text-red-600 mr-2">{beforeAfterData.before.score}</span>
                      <ArrowRight className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="text-2xl font-bold text-green-600">{beforeAfterData.after.score}</span>
                    </div>
                  </div>
                </div>
                <div className="text-green-600 font-semibold">
                  +{beforeAfterData.improvement.scoreGain} punti
                </div>
              </div>

              <div className="text-center p-6 bg-green-50 rounded-lg">
                <div className="flex items-center justify-center mb-2">
                  <DollarSign className="w-8 h-8 text-green-600 mr-2" />
                  <div className="text-right">
                    <div className="text-sm text-gray-600">Valutazione</div>
                    <div className="flex items-center">
                      <span className="text-sm text-red-600 mr-2">
                        €{(beforeAfterData.before.valuation / 1000000).toFixed(1)}M
                      </span>
                      <ArrowRight className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="text-2xl font-bold text-green-600">
                        €{(beforeAfterData.after.valuation / 1000000).toFixed(1)}M
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-green-600 font-semibold">
                  +€{((beforeAfterData.improvement.valuationGain) / 1000000).toFixed(1)}M
                </div>
              </div>

              <div className="text-center p-6 bg-purple-50 rounded-lg">
                <div className="flex items-center justify-center mb-2">
                  <Award className="w-8 h-8 text-purple-600 mr-2" />
                  <div className="text-right">
                    <div className="text-sm text-gray-600">Aree Migliorate</div>
                    <div className="text-2xl font-bold text-purple-600">
                      {beforeAfterData.improvement.areasImproved}
                    </div>
                  </div>
                </div>
                <div className="text-purple-600 font-semibold">
                  Aree critiche potenziate
                </div>
              </div>
            </div>

            {/* Dettagli Miglioramenti */}
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Dettaglio Miglioramenti per Area</h3>
              <div className="space-y-3">
                {beforeAfterData.before.areas.map((area: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg">
                    <span className="font-medium text-gray-700">{area.name}</span>
                    <div className="flex items-center space-x-3">
                      <span className="text-sm text-red-600">{area.score}</span>
                      <ArrowRight className="w-4 h-4 text-gray-400" />
                      <span className="text-sm font-bold text-green-600">
                        {beforeAfterData.after.areas[index]?.score || area.score}
                      </span>
                      <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">
                        +{(beforeAfterData.after.areas[index]?.score || area.score) - area.score}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Call to Action */}
            <div className="text-center">
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  🎉 Il tuo progetto è ora molto più attraente per gli investitori!
                </h3>
                <p className="text-gray-600">
                  I dati sono stati integrati e l'analisi aggiornata. Puoi vedere i risultati completi nell'analisi dettagliata.
                </p>
              </div>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => window.location.reload()}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                >
                  <Activity className="w-5 h-5 mr-2" />
                  Visualizza Analisi Aggiornata
                </button>
                <button
                  onClick={onClose}
                  className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Chiudi
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ANALYZING MODAL
  if (isAnalyzing) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full m-4 p-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto mb-6"></div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Rianalisi Professionale in Corso
            </h3>
            <p className="text-gray-600 mb-6">{analysisProgress}</p>
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center justify-center space-x-4 text-sm text-blue-800">
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  <span>Dati integrati</span>
                </div>
                <div className="flex items-center">
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  <span>Rianalisi AI</span>
                </div>
                <div className="flex items-center opacity-50">
                  <Save className="w-4 h-4 mr-2" />
                  <span>Salvataggio</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // WIZARD MODAL
  if (showWizard && wizardSteps.length > 0) {
    const currentStep = wizardSteps[currentStepIndex]
    const area = currentStep.area

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto m-4">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <div className="flex items-center space-x-3">
              <Brain className="w-6 h-6" />
              <div>
                <h2 className="text-2xl font-bold">Percorso di Miglioramento Guidato</h2>
                <p className="text-purple-100 text-sm">
                  Step {currentStepIndex + 1} di {wizardSteps.length}
                </p>
              </div>
            </div>
            <button onClick={() => setShowWizard(false)} className="text-white hover:text-gray-200">
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="bg-gray-100 h-2">
            <div 
              className="bg-purple-600 h-2 transition-all duration-300"
              style={{ width: `${((currentStepIndex + 1) / wizardSteps.length) * 100}%` }}
            />
          </div>

          <div className="p-6">
            {/* Step Header */}
            <div className="mb-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className={`p-3 rounded-lg ${getImpactColor(area.impact)}`}>
                  {getCategoryIcon(area.category)}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">{area.title}</h3>
                  <p className="text-gray-600">{area.description}</p>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-600">Miglioramento Score</div>
                  <div className="text-lg font-bold text-green-600">+{area.scoreImprovement}</div>
                </div>
              </div>

              {/* Questions */}
              <div className="bg-blue-50 rounded-lg p-4 mb-6">
                <h4 className="font-semibold text-blue-900 mb-2 flex items-center">
                  <HelpCircle className="w-4 h-4 mr-2" />
                  Domande Guida
                </h4>
                <div className="space-y-1">
                  {area.questions.map((question, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <span className="text-blue-600 font-semibold text-sm">{index + 1}.</span>
                      <span className="text-sm text-blue-800">{question}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Form Fields */}
            <div className="space-y-4 mb-6">
              {area.formFields.map((field) => (
                <div key={field.id}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {field.label}
                    {field.required && <span className="text-red-500 ml-1">*</span>}
                  </label>
                  
                  {field.type === 'text' && (
                    <input
                      type="text"
                      value={currentStep.formData[field.id] || ''}
                      onChange={(e) => updateFormData(field.id, e.target.value)}
                      placeholder={field.placeholder}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  )}
                  
                  {field.type === 'textarea' && (
                    <textarea
                      value={currentStep.formData[field.id] || ''}
                      onChange={(e) => updateFormData(field.id, e.target.value)}
                      placeholder={field.placeholder}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  )}
                  
                  {field.type === 'select' && (
                    <select
                      value={currentStep.formData[field.id] || ''}
                      onChange={(e) => updateFormData(field.id, e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="">Seleziona...</option>
                      {field.options?.map((option) => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  )}
                </div>
              ))}
            </div>

            {/* Document Upload */}
            <div className="mb-6">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                <Upload className="w-4 h-4 mr-2" />
                Documenti di Supporto (Opzionale)
              </h4>
              
              <div
                className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors ${
                  dragActive ? 'border-purple-500 bg-purple-50' : 'border-gray-300 hover:border-gray-400'
                }`}
                onDragEnter={(e) => { e.preventDefault(); setDragActive(true) }}
                onDragLeave={(e) => { e.preventDefault(); setDragActive(false) }}
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
              >
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600 mb-2">
                  Trascina documenti qui o clicca per selezionare
                </p>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-sm text-purple-600 hover:text-purple-700"
                >
                  Seleziona File
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept=".txt,.pdf,.doc,.docx"
                  onChange={(e) => handleFiles(Array.from(e.target.files || []))}
                  className="hidden"
                />
                <p className="text-xs text-gray-400 mt-1">
                  PDF, DOC, DOCX, TXT (max 10MB)
                </p>
              </div>

              {/* Document List */}
              {currentStep.documents.length > 0 && (
                <div className="mt-3 space-y-2">
                  {currentStep.documents.map((doc, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <div className="flex items-center space-x-2">
                        {getFileIcon(doc.name)}
                        <span className="text-sm text-gray-700">{doc.name}</span>
                        <span className="text-xs text-gray-500">
                          ({(doc.size / 1024 / 1024).toFixed(2)} MB)
                        </span>
                      </div>
                      <button
                        onClick={() => removeDocument(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-6 border-t bg-gray-50">
            <button
              onClick={prevStep}
              disabled={currentStepIndex === 0}
              className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Indietro
            </button>
            
            <div className="text-sm text-gray-600">
              {currentStepIndex + 1} di {wizardSteps.length}
            </div>
            
            <button
              onClick={nextStep}
              disabled={!validateCurrentStep()}
              className="flex items-center px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {currentStepIndex === wizardSteps.length - 1 ? 'Rianalizza Progetto' : 'Avanti'}
              <ChevronRight className="w-4 h-4 ml-1" />
            </button>
          </div>
        </div>
      </div>
    )
  }

  // MAIN AI COACH INTERFACE
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto m-4">
        <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <div className="flex items-center space-x-3">
            <Brain className="w-6 h-6" />
            <div>
              <h2 className="text-2xl font-bold">AI Coach - Miglioramento Professionale</h2>
              <p className="text-purple-100 text-sm">Ottimizza il tuo progetto con dati reali e rianalisi AI</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white hover:text-gray-200">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Score Potential Overview */}
        <div className="p-6 border-b bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-sm text-gray-600 mb-1">Score Attuale</div>
              <div className="text-3xl font-bold text-red-600">
                {analysis?.professional_analysis?.overall_score || 0}
              </div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-600 mb-1">Score Potenziale</div>
              <div className="text-3xl font-bold text-green-600">
                {Math.min((analysis?.professional_analysis?.overall_score || 0) + 
                  missingAreas.reduce((sum, area) => sum + area.scoreImprovement, 0), 100)}
              </div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-600 mb-1">Miglioramento</div>
              <div className="text-3xl font-bold text-purple-600">
                +{missingAreas.reduce((sum, area) => sum + area.scoreImprovement, 0)}
              </div>
            </div>
          </div>
        </div>

        <div className="p-6">
          {missingAreas.length === 0 ? (
            <div className="text-center py-12">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Progetto Già Ottimizzato!
              </h3>
              <p className="text-gray-600 mb-6">
                Il tuo progetto ha già raggiunto un ottimo livello in tutte le aree principali.
              </p>
              <button
                onClick={onClose}
                className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Chiudi
              </button>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Aree di Miglioramento Identificate
                </h3>
                <p className="text-gray-600">
                  Completa le aree mancanti per ottenere una rianalisi professionale con score aggiornato
                </p>
              </div>

              <div className="space-y-4 mb-8">
                {missingAreas.map((area) => (
                  <div key={area.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${getImpactColor(area.impact)}`}>
                          {getCategoryIcon(area.category)}
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{area.title}</h4>
                          <p className="text-sm text-gray-600">{area.description}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-600">Potenziale</div>
                        <div className="text-lg font-bold text-green-600">+{area.scoreImprovement}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">
                        Score: {area.currentScore} → {area.targetScore}
                      </span>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getImpactColor(area.impact)}`}>
                          {area.impact === 'high' ? 'Alta Priorità' : area.impact === 'medium' ? 'Media Priorità' : 'Bassa Priorità'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Call to Action */}
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-6 text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  🚀 Pronto per il Miglioramento?
                </h3>
                <p className="text-gray-600 mb-4">
                  Il percorso guidato ti aiuterà a completare le aree mancanti con form specifici e upload documenti. 
                  Alla fine riceverai una rianalisi professionale con il tuo nuovo score!
                </p>
                <div className="flex justify-center space-x-4">
                  <button
                    onClick={startGuidedImprovement}
                    className="flex items-center px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-colors shadow-lg"
                  >
                    <Zap className="w-5 h-5 mr-2" />
                    Inizia Percorso Guidato
                  </button>
                  <button
                    onClick={onClose}
                    className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Chiudi
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}