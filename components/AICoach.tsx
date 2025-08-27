'use client'

import { useState, useEffect, useRef } from 'react'
import { 
  Brain, TrendingUp, Users, Target, DollarSign, Lightbulb, 
  ChevronRight, CheckCircle, AlertCircle, Info, Star,
  ArrowRight, X, RefreshCw, Zap, BookOpen, HelpCircle,
  Upload, FileText, File, Plus, ChevronLeft, Save,
  BarChart3, Activity, Award, Shield, Rocket, MessageSquare,
  Eye, AlertTriangle, Sparkles, Download, Share2, Copy,
  TrendingDown, PieChart, LineChart, Calendar, Clock,
  Settings, Filter, Search, Globe, Heart, ThumbsUp
} from 'lucide-react'

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
  validationRules?: ValidationRule[]
}

interface FormField {
  id: string
  label: string
  type: 'text' | 'textarea' | 'select' | 'number' | 'file'
  required: boolean
  options?: string[]
  placeholder?: string
  validation?: string
  smartHelp?: string
}

interface ValidationRule {
  field: string
  rule: 'min_length' | 'numeric_range' | 'logical_check' | 'format_check'
  params: any
  message: string
}

interface WizardStep {
  area: MissingArea
  formData: Record<string, any>
  documents: File[]
  documentContents: Record<string, string>
  validationErrors: Record<string, string>
  smartInsights: string[]
}

interface DocumentAnalysis {
  content: string
  insights: string[]
  extractedData: Record<string, any>
  relevanceScore: number
}

interface ConsultiveReport {
  recommendations: Recommendation[]
  actionPlan: ActionItem[]
  insights: string[]
  priorityAreas: string[]
  nextSteps: string[]
  resources: Resource[]
}

interface Recommendation {
  area: string
  title: string
  description: string
  impact: 'high' | 'medium' | 'low'
  effort: 'low' | 'medium' | 'high'
  timeline: string
}

interface ActionItem {
  id: string
  task: string
  area: string
  priority: 'high' | 'medium' | 'low'
  timeline: string
  resources: string[]
  success_metrics: string[]
}

interface Resource {
  type: 'article' | 'tool' | 'template' | 'course'
  title: string
  description: string
  url?: string
  category: string
}

export default function AICoach({ project, analysis, onImprove, onClose }: AICoachProps) {
  const [missingAreas, setMissingAreas] = useState<MissingArea[]>([])
  const [showWizard, setShowWizard] = useState(false)
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [wizardSteps, setWizardSteps] = useState<WizardStep[]>([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisProgress, setAnalysisProgress] = useState('')
  const [consultiveReport, setConsultiveReport] = useState<ConsultiveReport | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const [progressSaving, setProgressSaving] = useState(false)
  const [showAnalytics, setShowAnalytics] = useState(false)
  const [showExportOptions, setShowExportOptions] = useState(false)
  const [animationStep, setAnimationStep] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    analyzeMissingAreas()
    loadDraftProgress()
  }, [analysis])

  // LOAD DRAFT PROGRESS
  const loadDraftProgress = () => {
    const draftKey = `ai_coach_draft_${project?.id}`
    const savedDraft = localStorage.getItem(draftKey)
    if (savedDraft) {
      try {
        const draft = JSON.parse(savedDraft)
        if (draft.timestamp && Date.now() - draft.timestamp < 24 * 60 * 60 * 1000) {
          console.log('Found draft progress:', draft)
        }
      } catch (error) {
        console.warn('Invalid draft data')
      }
    }
  }

  // SAVE PROGRESS AUTOMATICALLY
  const saveProgress = () => {
    if (wizardSteps.length === 0) return
    
    setProgressSaving(true)
    const draftKey = `ai_coach_draft_${project?.id}`
    const draftData = {
      currentStepIndex,
      wizardSteps: wizardSteps.map(step => ({
        area: step.area,
        formData: step.formData,
        documentContents: step.documentContents,
        validationErrors: step.validationErrors,
        smartInsights: step.smartInsights
      })),
      timestamp: Date.now()
    }
    
    localStorage.setItem(draftKey, JSON.stringify(draftData))
    setTimeout(() => setProgressSaving(false), 1000)
  }

  const analyzeMissingAreas = () => {
    console.log('Analyzing missing areas from:', analysis)
    
    const professionalData = analysis?.professional_analysis || analysis?.analysis_data?.professional_analysis
    if (!professionalData) {
      console.warn('No professional analysis data found')
      return
    }

    const areas: MissingArea[] = []

    // 1. MARKET ANALYSIS - ENHANCED
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
          { 
            id: 'tam_size', 
            label: 'TAM - Total Addressable Market', 
            type: 'text', 
            required: true, 
            placeholder: 'es. €10B fonte IDC 2024',
            smartHelp: 'Il TAM dovrebbe essere basato su fonti autorevoli come IDC, Gartner, Statista. Indica sempre la fonte e l\'anno.'
          },
          { 
            id: 'sam_size', 
            label: 'SAM - Serviceable Addressable Market', 
            type: 'text', 
            required: true, 
            placeholder: 'es. €1B mercato europeo',
            smartHelp: 'Il SAM deve essere una porzione realistica del TAM basata su geografia, segmenti target, capacità di servizio.'
          },
          { 
            id: 'som_size', 
            label: 'SOM - Serviceable Obtainable Market', 
            type: 'text', 
            required: true, 
            placeholder: 'es. €50M target 3 anni',
            smartHelp: 'Il SOM deve essere realisticamente raggiungibile in 3-5 anni considerando competitor e risorse.'
          },
          { 
            id: 'market_sources', 
            label: 'Fonti Autorevoli', 
            type: 'textarea', 
            required: true, 
            placeholder: 'IDC, Gartner, Statista, report di settore...',
            smartHelp: 'Elenca fonti specifiche con nomi di report, date di pubblicazione e link se disponibili.'
          },
          { 
            id: 'market_validation', 
            label: 'Come hai validato la domanda?', 
            type: 'textarea', 
            required: true, 
            placeholder: 'Interviste clienti, survey, pilot, LOI...',
            smartHelp: 'Descrivi metodologia, numero di interviste/survey, risultati quantitativi ottenuti.'
          },
          { 
            id: 'target_segments', 
            label: 'Segmenti Target Prioritari', 
            type: 'textarea', 
            required: false, 
            placeholder: 'Early adopters, enterprise, SMB...',
            smartHelp: 'Definisci chiaramente i segmenti con dimensioni, caratteristiche, priorità di approccio.'
          }
        ],
        validationRules: [
          {
            field: 'tam_size',
            rule: 'logical_check',
            params: { checkType: 'market_size_hierarchy' },
            message: 'Il TAM deve essere maggiore del SAM'
          },
          {
            field: 'market_sources',
            rule: 'min_length',
            params: { minLength: 50 },
            message: 'Fornisci fonti dettagliate con nomi specifici e date'
          }
        ],
        completed: false
      })
    }

    // 2. COMPETITIVE ANALYSIS - ENHANCED
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
          { 
            id: 'direct_competitors', 
            label: 'Competitor Diretti', 
            type: 'textarea', 
            required: true, 
            placeholder: 'Lista competitor che fanno la stessa cosa...',
            smartHelp: 'Lista almeno 3-5 competitor diretti con nomi, dimensioni, funding ricevuto, punti di forza/debolezza.'
          },
          { 
            id: 'indirect_competitors', 
            label: 'Competitor Indiretti', 
            type: 'textarea', 
            required: true, 
            placeholder: 'Alternative che risolvono lo stesso problema...',
            smartHelp: 'Include soluzioni alternative, status quo, workaround che i clienti usano oggi.'
          },
          { 
            id: 'competitive_advantage', 
            label: 'Vantaggio Competitivo Unico', 
            type: 'textarea', 
            required: true, 
            placeholder: 'Cosa ti rende difficile da copiare...',
            smartHelp: 'Deve essere specifico, difficile da replicare, e chiaramente comunicabile. Evita generalismi.'
          },
          { 
            id: 'barriers_to_entry', 
            label: 'Barriere all\'Ingresso', 
            type: 'textarea', 
            required: true, 
            placeholder: 'IP, network effects, switching costs, know-how...',
            smartHelp: 'Barriere concrete che proteggeranno la tua posizione: brevetti, dati proprietari, effetti network, costi switching.'
          },
          { 
            id: 'positioning_statement', 
            label: 'Positioning Statement', 
            type: 'textarea', 
            required: false, 
            placeholder: 'Per [target] che [need], siamo [category] che [benefit] perché [reason]',
            smartHelp: 'Usa il framework: Per [target] che hanno [problema], noi siamo [categoria] che offre [beneficio] perché [differenziatore].'
          }
        ],
        validationRules: [
          {
            field: 'direct_competitors',
            rule: 'min_length',
            params: { minLength: 100 },
            message: 'Analisi competitor troppo superficiale. Aggiungi dettagli su almeno 3-5 competitor.'
          }
        ],
        completed: false
      })
    }

    // 3. TEAM STRENGTHENING - ENHANCED
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
          { 
            id: 'current_team', 
            label: 'Team Attuale (ruoli e competenze)', 
            type: 'textarea', 
            required: true, 
            placeholder: 'CEO: 10 anni fintech, CTO: ex-Google...',
            smartHelp: 'Per ogni membro: ruolo, anni esperienza nel settore, successi precedenti, competenze uniche.'
          },
          { 
            id: 'missing_roles', 
            label: 'Ruoli Mancanti Prioritari', 
            type: 'textarea', 
            required: true, 
            placeholder: 'Head of Sales, Marketing Manager, advisor settoriale...',
            smartHelp: 'Priorità per i prossimi 12 mesi. Indica timeline e strategia di recruiting.'
          },
          { 
            id: 'track_record', 
            label: 'Track Record e Successi Precedenti', 
            type: 'textarea', 
            required: true, 
            placeholder: 'Exit, IPO, scale-up, expertise riconosciuta...',
            smartHelp: 'Successi quantificabili: exit, IPO, scale-up, riconoscimenti, pubblicazioni, brevetti.'
          },
          { 
            id: 'advisors', 
            label: 'Advisory Board', 
            type: 'textarea', 
            required: false, 
            placeholder: 'Nomi, ruoli, expertise, come contribuiscono...',
            smartHelp: 'Advisor con esperienza rilevante al settore, network, credibilità. Indica il loro contributo specifico.'
          },
          { 
            id: 'hiring_plan', 
            label: 'Piano Assunzioni prossimi 12 mesi', 
            type: 'textarea', 
            required: false, 
            placeholder: 'Priorità, timeline, budget...',
            smartHelp: 'Piano realistico con priorità, budget allocato, strategia di recruitment.'
          }
        ],
        completed: false
      })
    }

    // 4. FINANCIAL MODEL - ENHANCED
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
          { 
            id: 'revenue_model', 
            label: 'Modello di Ricavi', 
            type: 'select', 
            required: true, 
            options: ['Abbonamento mensile', 'Abbonamento annuale', 'Freemium', 'Commissione per transazione', 'Licenza', 'Marketplace', 'Altro'],
            smartHelp: 'Scegli il modello più adatto al tuo business. Freemium e abbonamenti funzionano per SaaS, commissioni per marketplace.'
          },
          { 
            id: 'ltv', 
            label: 'LTV - Lifetime Value per cliente', 
            type: 'text', 
            required: true, 
            placeholder: 'es. €2,400 (24 mesi retention)',
            smartHelp: 'LTV = ARPU mensile × Gross Margin % × Tempo di vita medio del cliente. Indica le assunzioni usate.'
          },
          { 
            id: 'cac', 
            label: 'CAC - Customer Acquisition Cost', 
            type: 'text', 
            required: true, 
            placeholder: 'es. €600 (payback 6 mesi)',
            smartHelp: 'CAC = Costi marketing e sales / Nuovi clienti acquisiti. Indica canali di acquisizione principali.'
          },
          { 
            id: 'unit_economics', 
            label: 'Unit Economics e Margini', 
            type: 'textarea', 
            required: true, 
            placeholder: 'Margini lordi, contribuzione, break-even per cliente...',
            smartHelp: 'LTV/CAC ratio dovrebbe essere >3x. Payback period <12 mesi per SaaS. Dettaglia i calcoli.'
          },
          { 
            id: 'revenue_projections', 
            label: 'Proiezioni Ricavi 3 anni', 
            type: 'textarea', 
            required: true, 
            placeholder: 'Y1: €100K, Y2: €500K, Y3: €2M...',
            smartHelp: 'Projections bottom-up basate su clienti, pricing, retention. Indica assunzioni chiave.'
          },
          { 
            id: 'profitability_path', 
            label: 'Path to Profitability', 
            type: 'textarea', 
            required: true, 
            placeholder: 'Timeline, milestone, assumzioni chiave...',
            smartHelp: 'Timeline realistica per EBITDA break-even, milestone intermedi, assunzioni critiche.'
          }
        ],
        validationRules: [
          {
            field: 'ltv',
            rule: 'logical_check',
            params: { checkType: 'ltv_cac_ratio' },
            message: 'Il rapporto LTV/CAC dovrebbe essere almeno 3:1 per essere sostenibile'
          }
        ],
        completed: false
      })
    }

    // 5. PRODUCT VALIDATION - ENHANCED
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
          { 
            id: 'product_stage', 
            label: 'Stadio Attuale Prodotto', 
            type: 'select', 
            required: true, 
            options: ['Idea/Concept', 'Prototipo', 'MVP', 'Prodotto funzionante', 'Prodotto completo'],
            smartHelp: 'MVP = funzionalità core testate con utenti reali. Prodotto funzionante = ready for scale.'
          },
          { 
            id: 'customer_feedback', 
            label: 'Feedback Clienti Raccolto', 
            type: 'textarea', 
            required: true, 
            placeholder: 'Interviste, survey, testimonial, case studies...',
            smartHelp: 'Quantifica: numero interviste, NPS score, testimonial specifici, case studies con risultati misurabili.'
          },
          { 
            id: 'validation_metrics', 
            label: 'Metriche di Validazione', 
            type: 'textarea', 
            required: true, 
            placeholder: 'NPS, retention rate, usage metrics, churn...',
            smartHelp: 'Metriche chiave: retention >40% mese 1, NPS >50, usage frequency, feature adoption.'
          },
          { 
            id: 'pmf_evidence', 
            label: 'Evidenze Product-Market Fit', 
            type: 'textarea', 
            required: true, 
            placeholder: 'Organic growth, referrals, repeat purchases...',
            smartHelp: 'Segnali forti: >40% utenti sarebbero "very disappointed" senza il prodotto, crescita organica, referrals.'
          },
          { 
            id: 'product_roadmap', 
            label: 'Roadmap Prodotto', 
            type: 'textarea', 
            required: false, 
            placeholder: 'Prossime features, timeline, priorità...',
            smartHelp: 'Roadmap data-driven basata su feedback clienti e metriche. Priorità chiare per prossimi 6-12 mesi.'
          }
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
    console.log(`Found ${areas.length} missing areas for improvement`)
  }

  const startGuidedImprovement = () => {
    const priorityAreas = missingAreas.filter(area => area.impact === 'high').slice(0, 3)
    const steps: WizardStep[] = priorityAreas.map(area => ({
      area,
      formData: {},
      documents: [],
      documentContents: {},
      validationErrors: {},
      smartInsights: []
    }))
    
    setWizardSteps(steps)
    setCurrentStepIndex(0)
    setShowWizard(true)
  }

  const updateFormData = (fieldId: string, value: any) => {
    setWizardSteps(prev => {
      const updated = [...prev]
      updated[currentStepIndex].formData[fieldId] = value
      
      // Clear validation error when user starts typing
      if (updated[currentStepIndex].validationErrors[fieldId]) {
        delete updated[currentStepIndex].validationErrors[fieldId]
      }
      
      return updated
    })
    
    // Auto-save progress
    setTimeout(saveProgress, 1000)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    const files = Array.from(e.dataTransfer.files)
    handleFiles(files)
  }

  const handleFiles = async (files: File[]) => {
    const validFiles = files.filter(file => {
      const validTypes = ['text/plain', 'application/pdf', 
                         'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                         'application/msword']
      const validExtensions = ['.txt', '.pdf', '.doc', '.docx']
      
      return validTypes.includes(file.type) || 
             validExtensions.some(ext => file.name.toLowerCase().endsWith(ext))
    })

    // Process files immediately for smart analysis
    for (const file of validFiles) {
      try {
        const content = await extractTextFromFile(file)
        const analysis = await analyzeDocumentContent(content, wizardSteps[currentStepIndex].area.category)
        
        setWizardSteps(prev => {
          const updated = [...prev]
          updated[currentStepIndex].documents.push(file)
          updated[currentStepIndex].documentContents[file.name] = content
          updated[currentStepIndex].smartInsights.push(...analysis.insights)
          return updated
        })
        
        console.log(`Analyzed document: ${file.name}`, analysis)
      } catch (error) {
        console.warn(`Failed to analyze ${file.name}:`, error)
      }
    }
    
    saveProgress()
  }

  const removeDocument = (index: number) => {
    setWizardSteps(prev => {
      const updated = [...prev]
      const removedDoc = updated[currentStepIndex].documents[index]
      updated[currentStepIndex].documents.splice(index, 1)
      delete updated[currentStepIndex].documentContents[removedDoc.name]
      return updated
    })
    saveProgress()
  }

  // INTELLIGENT DOCUMENT ANALYSIS
  const analyzeDocumentContent = async (content: string, category: string): Promise<DocumentAnalysis> => {
    // Simulate intelligent analysis based on category
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const insights: string[] = []
    const extractedData: Record<string, any> = {}
    let relevanceScore = 0
    
    const lowerContent = content.toLowerCase()
    
    switch (category) {
      case 'market':
        if (lowerContent.includes('tam') || lowerContent.includes('market size')) {
          insights.push('Documento contiene dati di mercato (TAM/SAM/SOM)')
          relevanceScore += 30
        }
        if (lowerContent.includes('competitors') || lowerContent.includes('competitive')) {
          insights.push('Informazioni sui competitor identificate')
          relevanceScore += 20
        }
        if (lowerContent.includes('survey') || lowerContent.includes('interview')) {
          insights.push('Evidenze di validazione mercato (survey/interview)')
          relevanceScore += 25
        }
        break
        
      case 'competitive':
        if (lowerContent.includes('competitor') || lowerContent.includes('competition')) {
          insights.push('Analisi competitiva rilevata nel documento')
          relevanceScore += 35
        }
        if (lowerContent.includes('positioning') || lowerContent.includes('differentiation')) {
          insights.push('Elementi di positioning e differenziazione')
          relevanceScore += 25
        }
        break
        
      case 'team':
        if (lowerContent.includes('cv') || lowerContent.includes('resume') || lowerContent.includes('experience')) {
          insights.push('Informazioni sul team e competenze')
          relevanceScore += 40
        }
        if (lowerContent.includes('advisor') || lowerContent.includes('board')) {
          insights.push('Dati su advisory board identificati')
          relevanceScore += 30
        }
        break
        
      case 'financial':
        if (lowerContent.includes('revenue') || lowerContent.includes('financial')) {
          insights.push('Dati finanziari e modello ricavi')
          relevanceScore += 35
        }
        if (lowerContent.includes('ltv') || lowerContent.includes('cac')) {
          insights.push('Metriche LTV/CAC identificate')
          relevanceScore += 40
        }
        break
        
      case 'product':
        if (lowerContent.includes('product') || lowerContent.includes('feature')) {
          insights.push('Informazioni sul prodotto e features')
          relevanceScore += 30
        }
        if (lowerContent.includes('feedback') || lowerContent.includes('user')) {
          insights.push('Feedback utenti e validazione prodotto')
          relevanceScore += 35
        }
        break
    }
    
    // Generic insights
    if (content.length > 1000) {
      insights.push(`Documento dettagliato (${Math.round(content.length / 1000)}k caratteri)`)
      relevanceScore += 10
    }
    
    if (insights.length === 0) {
      insights.push('Documento caricato - contenuto da analizzare manualmente')
      relevanceScore = 10
    }
    
    return {
      content,
      insights,
      extractedData,
      relevanceScore: Math.min(relevanceScore, 100)
    }
  }

  // INTELLIGENT VALIDATION
  const validateCurrentStep = (): boolean => {
    const currentStep = wizardSteps[currentStepIndex]
    const area = currentStep.area
    const errors: Record<string, string> = {}
    
    // Required fields validation
    const requiredFields = area.formFields.filter(field => field.required)
    for (const field of requiredFields) {
      const value = currentStep.formData[field.id]
      if (!value || value.toString().trim().length === 0) {
        errors[field.id] = 'Campo obbligatorio'
        continue
      }
      
      // Smart validation based on field
      if (field.id === 'tam_size' || field.id === 'sam_size' || field.id === 'som_size') {
        if (!value.includes('€') && !value.includes('$') && !value.includes('milion') && !value.includes('billion')) {
          errors[field.id] = 'Specifica la valuta e dimensione (es. €100M, $1B)'
        }
      }
      
      if (field.id === 'market_sources' && value.length < 50) {
        errors[field.id] = 'Fornisci fonti dettagliate con nomi specifici'
      }
      
      if (field.id === 'direct_competitors' && value.length < 100) {
        errors[field.id] = 'Analisi competitor troppo superficiale'
      }
      
      if (field.id === 'ltv' || field.id === 'cac') {
        if (!value.includes('€') && !value.includes('$')) {
          errors[field.id] = 'Specifica la valuta (es. €2,400)'
        }
      }
    }
    
    // Logical validation
    if (area.id === 'market_analysis') {
      const tam = currentStep.formData.tam_size
      const sam = currentStep.formData.sam_size
      const som = currentStep.formData.som_size
      
      if (tam && sam && som) {
        // Simple check if SAM mentions smaller numbers than TAM
        if (sam.includes('B') && tam.includes('M')) {
          errors.sam_size = 'SAM non può essere maggiore del TAM'
        }
        if (som.includes('B') && sam.includes('M')) {
          errors.som_size = 'SOM non può essere maggiore del SAM'
        }
      }
    }
    
    if (area.id === 'financial_model') {
      const ltv = currentStep.formData.ltv
      const cac = currentStep.formData.cac
      
      if (ltv && cac) {
        // Extract numbers for ratio check
        const ltvNum = parseFloat(ltv.replace(/[^\d.]/g, ''))
        const cacNum = parseFloat(cac.replace(/[^\d.]/g, ''))
        
        if (ltvNum && cacNum && ltvNum / cacNum < 3) {
          errors.unit_economics = 'Rapporto LTV/CAC dovrebbe essere almeno 3:1'
        }
      }
    }
    
    // Update validation errors
    setWizardSteps(prev => {
      const updated = [...prev]
      updated[currentStepIndex].validationErrors = errors
      return updated
    })
    
    return Object.keys(errors).length === 0
  }

  const nextStep = () => {
    if (!validateCurrentStep()) {
      return
    }

    if (currentStepIndex < wizardSteps.length - 1) {
      setCurrentStepIndex(prev => prev + 1)
    } else {
      processImprovements()
    }
    
    saveProgress()
  }

  const prevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1)
    }
    saveProgress()
  }

  // CONSULTIVE ANALYSIS - NO SCORE MODIFICATION
  const processImprovements = async () => {
    setIsAnalyzing(true)
    setAnimationStep(0)
    setAnalysisProgress('Inizializzazione AI Coach v2.1 Consultivo...')

    try {
      console.log('Starting CONSULTIVE analysis with:', wizardSteps)

      // Animated progress steps
      setTimeout(() => {
        setAnimationStep(1)
        setAnalysisProgress('Integrazione dati intelligenti...')
      }, 1000)

      setTimeout(() => {
        setAnimationStep(2)
        setAnalysisProgress('Generazione raccomandazioni AI...')
      }, 2000)

      setTimeout(() => {
        setAnimationStep(3)
        setAnalysisProgress('Creazione action plan personalizzato...')
      }, 3000)

      setTimeout(() => {
        setAnimationStep(4)
        setAnalysisProgress('Finalizzazione report consultivo...')
      }, 4000)

      // Generate consultive report instead of modifying analysis
      const consultiveReport = await generateAdvisoryReport()
      
      console.log('Consultive analysis completed:', consultiveReport)

      setTimeout(() => {
        setAnimationStep(5)
        setAnalysisProgress('Report consultivo completato!')
        setConsultiveReport(consultiveReport)
      }, 5000)

      // Clear draft
      const draftKey = `ai_coach_draft_${project?.id}`
      localStorage.removeItem(draftKey)

      // 6. Callback with consultive data
      onImprove({
        consultiveReport,
        areasAnalyzed: wizardSteps.map(step => step.area.id),
        intelligentInsights: wizardSteps.flatMap(step => step.smartInsights),
        type: 'consultive' // Flag to indicate this is consultive only
      })
      
    } catch (error) {
      console.error('Error in consultive analysis:', error)
      const errorMessage = error instanceof Error ? error.message : 'Errore sconosciuto'
      setAnalysisProgress(`Errore: ${errorMessage}`)
    } finally {
      setTimeout(() => {
        setIsAnalyzing(false)
        setShowWizard(false)
      }, 6000)
    }
  }

  // GENERATE ADVISORY REPORT - CONSULTIVE ONLY
  const generateAdvisoryReport = async (): Promise<ConsultiveReport> => {
    // Simulate AI analysis delay
    await new Promise(resolve => setTimeout(resolve, 2000))

    const recommendations: Recommendation[] = []
    const actionPlan: ActionItem[] = []
    const insights: string[] = []
    const priorityAreas: string[] = []
    const resources: Resource[] = []

    // Generate recommendations based on wizard data
    wizardSteps.forEach((step, index) => {
      const area = step.area
      const formData = step.formData
      const documents = step.documents

      priorityAreas.push(area.title)

      // Area-specific recommendations
      switch (area.id) {
        case 'market_analysis':
          recommendations.push({
            area: area.title,
            title: 'Validazione TAM/SAM/SOM con Fonti Terze',
            description: 'Rafforza la tua analisi di mercato con dati da fonti autorevoli come IDC, Gartner, Statista per aumentare credibilità con investitori.',
            impact: 'high',
            effort: 'medium',
            timeline: '4-6 settimane'
          })

          actionPlan.push({
            id: `market_${index}`,
            task: 'Ricerca e acquisizione report di mercato autorevoli',
            area: area.title,
            priority: 'high',
            timeline: '2 settimane',
            resources: ['IDC reports', 'Gartner research', 'Industry analysts'],
            success_metrics: ['3+ fonti autorevoli citate', 'TAM/SAM/SOM validati', 'Confidence score >80%']
          })

          if (formData.tam_size) {
            insights.push(`TAM dichiarato: ${formData.tam_size} - Valida con benchmark di settore`)
          }
          break

        case 'competitive_analysis':
          recommendations.push({
            area: area.title,
            title: 'Matrice Competitiva Dettagliata',
            description: 'Crea una matrice competitiva che evidenzi il tuo posizionamento unico vs competitor diretti e indiretti.',
            impact: 'high',
            effort: 'low',
            timeline: '2-3 settimane'
          })

          actionPlan.push({
            id: `competitive_${index}`,
            task: 'Sviluppa competitive matrix e positioning canvas',
            area: area.title,
            priority: 'high',
            timeline: '3 settimane',
            resources: ['Competitive intelligence tools', 'Industry reports', 'Customer interviews'],
            success_metrics: ['Matrice competitor completa', 'Positioning statement validato', 'Differentiation chiara']
          })
          break

        case 'team_strengthening':
          recommendations.push({
            area: area.title,
            title: 'Advisory Board Strategico',
            description: 'Recluta 2-3 advisor con expertise nel tuo settore per aumentare credibilità e network.',
            impact: 'medium',
            effort: 'high',
            timeline: '3-6 mesi'
          })

          actionPlan.push({
            id: `team_${index}`,
            task: 'Identifica e avvicina potential advisor',
            area: area.title,
            priority: 'medium',
            timeline: '2 mesi',
            resources: ['LinkedIn outreach', 'Industry events', 'Network referrals'],
            success_metrics: ['2+ advisor confermati', 'Advisory agreement firmato', 'Meeting mensili attivi']
          })
          break

        case 'financial_model':
          recommendations.push({
            area: area.title,
            title: 'Unit Economics Validation',
            description: 'Testa e valida le tue assunzioni LTV/CAC con dati reali da pilot o early customers.',
            impact: 'high',
            effort: 'medium',
            timeline: '6-8 settimane'
          })

          actionPlan.push({
            id: `financial_${index}`,
            task: 'Pilot test per validare unit economics',
            area: area.title,
            priority: 'high',
            timeline: '6 settimane',
            resources: ['Analytics tools', 'Customer cohort', 'Financial tracking'],
            success_metrics: ['LTV/CAC ratio >3x validato', 'Payback period <12 mesi', 'Margini confermati']
          })

          if (formData.ltv && formData.cac) {
            const ltvNum = parseFloat(formData.ltv.replace(/[^\d.]/g, ''))
            const cacNum = parseFloat(formData.cac.replace(/[^\d.]/g, ''))
            if (ltvNum && cacNum) {
              const ratio = ltvNum / cacNum
              insights.push(`LTV/CAC ratio: ${ratio.toFixed(1)}x - ${ratio >= 3 ? 'Buono' : 'Da migliorare (target >3x)'}`)
            }
          }
          break

        case 'product_validation':
          recommendations.push({
            area: area.title,
            title: 'Product-Market Fit Validation',
            description: 'Implementa Sean Ellis test e NPS survey per misurare quantitativamente il product-market fit.',
            impact: 'high',
            effort: 'low',
            timeline: '3-4 settimane'
          })

          actionPlan.push({
            id: `product_${index}`,
            task: 'Survey PMF e analisi retention cohorts',
            area: area.title,
            priority: 'high',
            timeline: '4 settimane',
            resources: ['Survey tools', 'Analytics platform', 'Customer interviews'],
            success_metrics: ['>40% "very disappointed" score', 'NPS >50', 'Month 1 retention >40%']
          })
          break
      }

      // Add insights from documents
      if (step.smartInsights.length > 0) {
        insights.push(...step.smartInsights)
      }

      // Add document-based insights
      if (documents.length > 0) {
        insights.push(`${documents.length} documenti analizzati per ${area.title}`)
      }
    })

    // Add general resources
    resources.push(
      {
        type: 'template',
        title: 'Competitive Analysis Canvas',
        description: 'Template per analisi competitiva strutturata',
        category: 'competitive'
      },
      {
        type: 'tool',
        title: 'TAM/SAM/SOM Calculator',
        description: 'Tool per calcolare dimensioni di mercato',
        category: 'market'
      },
      {
        type: 'article',
        title: 'Unit Economics for SaaS',
        description: 'Guida completa per calcolare LTV/CAC',
        category: 'financial'
      }
    )

    // Next steps
    const nextSteps = [
      'Completa le aree prioritarie identificate',
      'Valida assunzioni con dati reali',
      'Prepara documentazione per investitori',
      'Pianifica roadmap esecuzione'
    ]

    return {
      recommendations,
      actionPlan,
      insights,
      priorityAreas,
      nextSteps,
      resources
    }
  }

  // ENHANCED PDF EXTRACTION
  const extractTextFromFile = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const extension = file.name.toLowerCase().split('.').pop()
      
      if (extension === 'txt') {
        const reader = new FileReader()
        reader.onload = (e) => resolve(e.target?.result as string)
        reader.onerror = () => reject(new Error('Errore lettura file TXT'))
        reader.readAsText(file)
      } 
      else if (extension === 'pdf') {
        // Enhanced PDF extraction (placeholder for real implementation)
        resolve(`[PDF CONTENT from ${file.name}]\n\nThis would contain the extracted PDF text using a real PDF parser like pdf-parse or PDF.js. For now, this is a placeholder that simulates PDF content extraction.\n\nFile size: ${(file.size / 1024).toFixed(0)}KB\nEstimated content: Business plan, market analysis, financial projections, team information, competitive landscape, product roadmap, customer validation data.`)
      } 
      else if (extension === 'doc' || extension === 'docx') {
        const reader = new FileReader()
        reader.onload = async (e) => {
          try {
            const mammoth = await import('mammoth')
            const result = await mammoth.extractRawText({ 
              arrayBuffer: e.target?.result as ArrayBuffer 
            })
            resolve(result.value || `[Documento Word ${file.name}]`)
          } catch (error) {
            console.warn('Mammoth extraction failed:', error)
            // Fallback content extraction
            resolve(`[WORD DOCUMENT from ${file.name}]\n\nDocument content would be extracted here using mammoth.js. This placeholder represents the extracted text content that would be analyzed for insights relevant to the startup analysis.`)
          }
        }
        reader.onerror = () => reject(new Error('Errore lettura Word'))
        reader.readAsArrayBuffer(file)
      } 
      else {
        reject(new Error('Formato file non supportato'))
      }
    })
  }

  // EXPORT FUNCTIONS
  const exportToPDF = () => {
    const exportData = {
      project: project?.title || 'Progetto',
      consultiveReport,
      wizardData: wizardSteps.map(step => ({
        area: step.area.title,
        formData: step.formData,
        insights: step.smartInsights
      })),
      timestamp: new Date().toISOString(),
      type: 'consultive_report'
    }
    
    // Create blob and download
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${project?.title || 'progetto'}_ai_coach_consultive_report.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    
    console.log('PDF Export initiated')
  }

  const shareResults = () => {
    const shareData = {
      title: `${project?.title || 'Il mio progetto'} - AI Coach Consultivo v2.1`,
      text: `Ho ricevuto raccomandazioni strategiche da AI Coach! ${consultiveReport?.recommendations.length} raccomandazioni e action plan personalizzato.`,
      url: window.location.href
    }
    
    if (navigator.share) {
      navigator.share(shareData)
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(`${shareData.title}\n${shareData.text}\n${shareData.url}`)
      alert('Link copiato negli appunti!')
    }
    
    console.log('Share initiated')
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

  // CONSULTIVE RESULTS MODAL
  if (consultiveReport) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl shadow-2xl max-w-7xl w-full max-h-[95vh] overflow-y-auto m-4">
          {/* Header */}
          <div className="relative flex items-center justify-between p-8 border-b bg-gradient-to-r from-blue-500 via-purple-500 to-green-600 text-white overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 via-purple-400/20 to-green-400/20 animate-pulse"></div>
            <div className="relative flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Brain className="w-8 h-8" />
                <MessageSquare className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-3xl font-bold">AI Coach v2.1 - Report Consultivo</h2>
                <p className="text-blue-100 text-sm mt-1">Raccomandazioni strategiche e action plan personalizzato</p>
              </div>
            </div>
            <div className="relative flex items-center space-x-3">
              <button
                onClick={() => setShowExportOptions(!showExportOptions)}
                className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
                title="Export & Share"
              >
                <Download className="w-5 h-5" />
              </button>
              <button onClick={onClose} className="text-white hover:text-gray-200 transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          <div className="p-8">
            {/* Summary Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border-2 border-blue-200">
                <Target className="w-10 h-10 text-blue-600 mx-auto mb-3" />
                <div className="text-3xl font-bold text-blue-600">{consultiveReport.recommendations.length}</div>
                <div className="text-sm text-gray-600">Raccomandazioni</div>
              </div>

              <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border-2 border-green-200">
                <CheckCircle className="w-10 h-10 text-green-600 mx-auto mb-3" />
                <div className="text-3xl font-bold text-green-600">{consultiveReport.actionPlan.length}</div>
                <div className="text-sm text-gray-600">Action Items</div>
              </div>

              <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border-2 border-purple-200">
                <Brain className="w-10 h-10 text-purple-600 mx-auto mb-3" />
                <div className="text-3xl font-bold text-purple-600">{consultiveReport.insights.length}</div>
                <div className="text-sm text-gray-600">Insight AI</div>
              </div>

              <div className="text-center p-6 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl border-2 border-orange-200">
                <Award className="w-10 h-10 text-orange-600 mx-auto mb-3" />
                <div className="text-3xl font-bold text-orange-600">{consultiveReport.priorityAreas.length}</div>
                <div className="text-sm text-gray-600">Aree Prioritarie</div>
              </div>
            </div>

            {/* Export Options */}
            {showExportOptions && (
              <div className="mb-8 bg-gradient-to-r from-blue-50 to-green-50 rounded-xl p-6 border border-blue-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                    <Download className="w-6 h-6 mr-2 text-blue-600" />
                    Export & Condivisione
                  </h3>
                  <button
                    onClick={() => setShowExportOptions(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button
                    onClick={exportToPDF}
                    className="flex items-center justify-center p-4 bg-red-100 hover:bg-red-200 rounded-lg border border-red-200 transition-colors"
                  >
                    <File className="w-5 h-5 text-red-600 mr-2" />
                    <div className="text-left">
                      <div className="font-medium text-red-800">Export Report</div>
                      <div className="text-sm text-red-600">JSON completo</div>
                    </div>
                  </button>

                  <button
                    onClick={shareResults}
                    className="flex items-center justify-center p-4 bg-blue-100 hover:bg-blue-200 rounded-lg border border-blue-200 transition-colors"
                  >
                    <Share2 className="w-5 h-5 text-blue-600 mr-2" />
                    <div className="text-left">
                      <div className="font-medium text-blue-800">Condividi</div>
                      <div className="text-sm text-blue-600">Social & Link</div>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      const data = JSON.stringify(consultiveReport, null, 2)
                      navigator.clipboard.writeText(data)
                      alert('Report copiato negli appunti!')
                    }}
                    className="flex items-center justify-center p-4 bg-purple-100 hover:bg-purple-200 rounded-lg border border-purple-200 transition-colors"
                  >
                    <Copy className="w-5 h-5 text-purple-600 mr-2" />
                    <div className="text-left">
                      <div className="font-medium text-purple-800">Copia Report</div>
                      <div className="text-sm text-purple-600">Negli appunti</div>
                    </div>
                  </button>
                </div>
              </div>
            )}

            {/* Recommendations */}
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <Lightbulb className="w-7 h-7 mr-3 text-blue-600" />
                Raccomandazioni Strategiche
              </h3>
              <div className="space-y-4">
                {consultiveReport.recommendations.map((rec, index) => (
                  <div key={index} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-900 text-lg mb-2">{rec.title}</h4>
                        <p className="text-gray-600 mb-3">{rec.description}</p>
                        <div className="text-sm text-blue-600 font-medium">Area: {rec.area}</div>
                      </div>
                      <div className="ml-4 text-right">
                        <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getImpactColor(rec.impact)}`}>
                          {rec.impact === 'high' ? 'Alto Impatto' : rec.impact === 'medium' ? 'Medio Impatto' : 'Basso Impatto'}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">{rec.timeline}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 text-sm">
                      <span className="text-gray-600">
                        <strong>Effort:</strong> {rec.effort === 'high' ? 'Alto' : rec.effort === 'medium' ? 'Medio' : 'Basso'}
                      </span>
                      <span className="text-gray-600">
                        <strong>Timeline:</strong> {rec.timeline}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Plan */}
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <CheckCircle className="w-7 h-7 mr-3 text-green-600" />
                Action Plan Dettagliato
              </h3>
              <div className="space-y-4">
                {consultiveReport.actionPlan.map((action, index) => (
                  <div key={index} className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-900 text-lg mb-2">{action.task}</h4>
                        <div className="text-sm text-green-600 font-medium mb-2">Area: {action.area}</div>
                        <div className="text-sm text-gray-600 mb-3">
                          <strong>Timeline:</strong> {action.timeline}
                        </div>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-sm font-medium ${getImpactColor(action.priority)}`}>
                        {action.priority === 'high' ? 'Alta Priorità' : action.priority === 'medium' ? 'Media Priorità' : 'Bassa Priorità'}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h5 className="font-semibold text-gray-800 mb-2">Risorse Necessarie:</h5>
                        <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                          {action.resources.map((resource, idx) => (
                            <li key={idx}>{resource}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h5 className="font-semibold text-gray-800 mb-2">Metriche di Successo:</h5>
                        <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                          {action.success_metrics.map((metric, idx) => (
                            <li key={idx}>{metric}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Insights */}
            {consultiveReport.insights.length > 0 && (
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <Brain className="w-7 h-7 mr-3 text-purple-600" />
                  Insight AI
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {consultiveReport.insights.map((insight, index) => (
                    <div key={index} className="flex items-start space-x-3 p-4 bg-purple-50 rounded-lg border border-purple-200">
                      <Sparkles className="w-5 h-5 text-purple-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{insight}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Next Steps */}
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <ArrowRight className="w-7 h-7 mr-3 text-orange-600" />
                Prossimi Passi
              </h3>
              <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg p-6 border border-orange-200">
                <div className="space-y-3">
                  {consultiveReport.nextSteps.map((step, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-orange-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </div>
                      <span className="text-gray-700">{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Resources */}
            {consultiveReport.resources.length > 0 && (
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <BookOpen className="w-7 h-7 mr-3 text-indigo-600" />
                  Risorse Consigliate
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {consultiveReport.resources.map((resource, index) => (
                    <div key={index} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start space-x-3">
                        <div className="p-2 bg-indigo-100 rounded-lg">
                          {resource.type === 'article' && <FileText className="w-5 h-5 text-indigo-600" />}
                          {resource.type === 'tool' && <Settings className="w-5 h-5 text-indigo-600" />}
                          {resource.type === 'template' && <File className="w-5 h-5 text-indigo-600" />}
                          {resource.type === 'course' && <BookOpen className="w-5 h-5 text-indigo-600" />}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 mb-1">{resource.title}</h4>
                          <p className="text-sm text-gray-600 mb-2">{resource.description}</p>
                          <div className="text-xs text-indigo-600 font-medium">{resource.category}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Call to Action */}
            <div className="text-center bg-gradient-to-r from-blue-50 via-purple-50 to-green-50 rounded-2xl p-8 border-2 border-blue-200">
              <div className="flex items-center justify-center mb-6">
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <MessageSquare className="w-8 h-8 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-yellow-800" />
                  </div>
                </div>
              </div>
              
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Report Consultivo Completato!
              </h3>
              <p className="text-gray-600 mb-6 max-w-3xl mx-auto leading-relaxed">
                Hai ricevuto raccomandazioni strategiche personalizzate e un action plan dettagliato. 
                L'AI Coach v2.1 ha mantenuto la tua analisi originale intatta, fornendo solo consigli strategici 
                per migliorare le aree prioritarie identificate.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                <button
                  onClick={exportToPDF}
                  className="flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-colors shadow-lg"
                >
                  <Download className="w-5 h-5 mr-2" />
                  Esporta Report
                </button>
                
                <button
                  onClick={shareResults}
                  className="flex items-center px-6 py-4 bg-white text-gray-700 rounded-xl hover:bg-gray-50 transition-colors border-2 border-gray-200"
                >
                  <Share2 className="w-5 h-5 mr-2" />
                  Condividi
                </button>

                <button
                  onClick={onClose}
                  className="flex items-center px-6 py-4 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-colors"
                >
                  Chiudi Report
                </button>
              </div>

              <div className="mt-8 flex items-center justify-center space-x-8 text-sm text-gray-600">
                <div className="flex items-center">
                  <MessageSquare className="w-4 h-4 mr-1 text-blue-600" />
                  <span>Solo Consultivo</span>
                </div>
                <div className="flex items-center">
                  <Shield className="w-4 h-4 mr-1 text-green-600" />
                  <span>Analisi Preservata</span>
                </div>
                <div className="flex items-center">
                  <Brain className="w-4 h-4 mr-1 text-purple-600" />
                  <span>AI-Powered v2.1</span>
                </div>
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
      <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full m-4 p-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-green-500/10 animate-pulse"></div>
          
          <div className="relative text-center">
            <div className="relative mb-8">
              <div className="animate-spin rounded-full h-20 w-20 border-4 border-blue-600 border-t-transparent mx-auto"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <MessageSquare className="w-10 h-10 text-blue-600 animate-pulse" />
              </div>
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              AI Coach v2.1 - Analisi Consultiva
            </h3>
            <p className="text-gray-600 mb-8 text-lg">{analysisProgress}</p>

            <div className="bg-gradient-to-r from-blue-50 via-purple-50 to-green-50 rounded-xl p-6 border-2 border-blue-200">
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 text-sm">
                {[
                  { icon: CheckCircle, label: 'Dati Validati', step: 0 },
                  { icon: Brain, label: 'AI Processing', step: 1 },
                  { icon: Lightbulb, label: 'Raccomandazioni', step: 2 },
                  { icon: CheckCircle, label: 'Action Plan', step: 3 },
                  { icon: MessageSquare, label: 'Report', step: 4 }
                ].map((item, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-all duration-500 ${
                      animationStep >= item.step 
                        ? 'bg-green-100 text-green-600 scale-110' 
                        : animationStep === item.step - 1
                        ? 'bg-blue-100 text-blue-600 animate-pulse'
                        : 'bg-gray-100 text-gray-400'
                    }`}>
                      <item.icon className="w-6 h-6" />
                    </div>
                    <span className={`font-medium transition-colors duration-500 ${
                      animationStep >= item.step ? 'text-green-700' : 'text-gray-600'
                    }`}>
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6">
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-blue-500 via-purple-500 to-green-500 h-3 rounded-full transition-all duration-1000"
                  style={{ width: `${((animationStep + 1) / 5) * 100}%` }}
                ></div>
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
      <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[95vh] overflow-y-auto m-4">
          {/* Header */}
          <div className="relative flex items-center justify-between p-8 border-b bg-gradient-to-r from-purple-500 via-blue-500 to-green-600 text-white overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 via-blue-400/20 to-green-400/20 animate-pulse"></div>
            <div className="relative flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Brain className="w-8 h-8 animate-pulse" />
                <MessageSquare className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-3xl font-bold">AI Coach v2.1 - Wizard Consultivo</h2>
                <p className="text-purple-100 text-sm mt-1">
                  Step {currentStepIndex + 1} di {wizardSteps.length}
                  {progressSaving && <span className="ml-2 animate-pulse">Salvando...</span>}
                </p>
              </div>
            </div>
            <div className="relative">
              <button onClick={() => setShowWizard(false)} className="text-white hover:text-gray-200 transition-colors p-2 rounded-lg hover:bg-white/20">
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="bg-gray-100 h-4 relative overflow-hidden">
            <div 
              className="bg-gradient-to-r from-purple-600 via-blue-600 to-green-600 h-4 transition-all duration-700 ease-out relative"
              style={{ width: `${((currentStepIndex + 1) / wizardSteps.length) * 100}%` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/30 to-transparent animate-pulse"></div>
            </div>
          </div>

          <div className="p-8">
            {/* Step Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className={`p-4 rounded-xl ${getImpactColor(area.impact)} border-2 shadow-lg`}>
                    {getCategoryIcon(area.category)}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">{area.title}</h3>
                    <p className="text-gray-600 mt-1">{area.description}</p>
                  </div>
                </div>
              </div>

              {/* Smart Insights Display */}
              {currentStep.smartInsights.length > 0 && (
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 mb-6 border-2 border-blue-200">
                  <h4 className="font-bold text-blue-900 mb-4 flex items-center">
                    <Brain className="w-5 h-5 mr-2" />
                    Insight AI dai Documenti
                    <div className="ml-auto bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                      {currentStep.smartInsights.length} analisi
                    </div>
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {currentStep.smartInsights.map((insight, index) => (
                      <div key={index} className="flex items-start space-x-3 p-3 bg-white rounded-lg border border-blue-200">
                        <Sparkles className="w-4 h-4 text-blue-600 mt-1 flex-shrink-0" />
                        <span className="text-sm text-blue-800">{insight}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Guiding Questions */}
              <div className="bg-gradient-to-r from-purple-50 via-blue-50 to-green-50 rounded-xl p-6 mb-8 border-2 border-purple-200">
                <h4 className="font-bold text-purple-900 mb-4 flex items-center">
                  <HelpCircle className="w-5 h-5 mr-2" />
                  Domande Guida per Analisi Consultiva
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {area.questions.map((question, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 bg-white rounded-lg border border-purple-200">
                      <span className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                        {index + 1}
                      </span>
                      <span className="text-sm text-purple-800 leading-relaxed">{question}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Form Fields */}
            <div className="space-y-8 mb-8">
              {area.formFields.map((field) => (
                <div key={field.id} className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  <label className="block text-lg font-semibold text-gray-800 mb-3">
                    {field.label}
                    {field.required && <span className="text-red-500 ml-2">*</span>}
                  </label>
                  
                  {field.smartHelp && (
                    <div className="mb-4 p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg border border-blue-200">
                      <div className="flex items-start space-x-2">
                        <Lightbulb className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <div className="font-medium text-blue-900 mb-1">AI Tip</div>
                          <div className="text-sm text-blue-800">{field.smartHelp}</div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {field.type === 'text' && (
                    <div>
                      <input
                        type="text"
                        value={currentStep.formData[field.id] || ''}
                        onChange={(e) => updateFormData(field.id, e.target.value)}
                        placeholder={field.placeholder}
                        className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-500/30 transition-all duration-300 text-lg ${
                          currentStep.validationErrors[field.id] 
                            ? 'border-red-500 bg-red-50 focus:border-red-500' 
                            : 'border-gray-300 focus:border-purple-500'
                        }`}
                      />
                      {currentStep.validationErrors[field.id] && (
                        <div className="flex items-center mt-2 text-red-600 text-sm animate-pulse">
                          <AlertTriangle className="w-4 h-4 mr-2" />
                          {currentStep.validationErrors[field.id]}
                        </div>
                      )}
                    </div>
                  )}
                  
                  {field.type === 'textarea' && (
                    <div>
                      <textarea
                        value={currentStep.formData[field.id] || ''}
                        onChange={(e) => updateFormData(field.id, e.target.value)}
                        placeholder={field.placeholder}
                        rows={5}
                        className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-500/30 transition-all duration-300 text-lg resize-none ${
                          currentStep.validationErrors[field.id] 
                            ? 'border-red-500 bg-red-50 focus:border-red-500' 
                            : 'border-gray-300 focus:border-purple-500'
                        }`}
                      />
                      {currentStep.validationErrors[field.id] && (
                        <div className="flex items-center mt-2 text-red-600 text-sm animate-pulse">
                          <AlertTriangle className="w-4 h-4 mr-2" />
                          {currentStep.validationErrors[field.id]}
                        </div>
                      )}
                    </div>
                  )}
                  
                  {field.type === 'select' && (
                    <div>
                      <select
                        value={currentStep.formData[field.id] || ''}
                        onChange={(e) => updateFormData(field.id, e.target.value)}
                        className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-500/30 transition-all duration-300 text-lg ${
                          currentStep.validationErrors[field.id] 
                            ? 'border-red-500 bg-red-50 focus:border-red-500' 
                            : 'border-gray-300 focus:border-purple-500'
                        }`}
                      >
                        <option value="">Seleziona...</option>
                        {field.options?.map((option) => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                      {currentStep.validationErrors[field.id] && (
                        <div className="flex items-center mt-2 text-red-600 text-sm animate-pulse">
                          <AlertTriangle className="w-4 h-4 mr-2" />
                          {currentStep.validationErrors[field.id]}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Document Upload */}
            <div className="mb-8 bg-white rounded-xl p-8 border border-gray-200 shadow-sm">
              <h4 className="font-bold text-gray-900 mb-6 flex items-center text-xl">
                <Upload className="w-6 h-6 mr-2" />
                Documenti Intelligenti (Analisi AI Automatica)
              </h4>
              
              <div
                className={`border-3 border-dashed rounded-xl p-8 text-center transition-all duration-500 ${
                  dragActive 
                    ? 'border-purple-500 bg-purple-50 scale-105 shadow-lg' 
                    : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                }`}
                onDragEnter={(e) => { e.preventDefault(); setDragActive(true) }}
                onDragLeave={(e) => { e.preventDefault(); setDragActive(false) }}
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
              >
                <div className="flex items-center justify-center mb-4">
                  <div className="relative">
                    <Brain className="w-12 h-12 text-purple-500 mr-3" />
                    <Upload className="w-8 h-8 text-gray-400" />
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                      <Sparkles className="w-3 h-3 text-white" />
                    </div>
                  </div>
                </div>
                <p className="text-lg text-gray-700 mb-2">
                  <strong>AI analizza automaticamente</strong> i tuoi documenti
                </p>
                <p className="text-sm text-gray-600 mb-4">
                  Trascina documenti qui o clicca per selezionare
                </p>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <Upload className="w-5 h-5 mr-2" />
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
                <p className="text-xs text-gray-500 mt-4">
                  PDF, DOC, DOCX, TXT • AI estrae insight automaticamente • Sicuro e privato
                </p>
              </div>

              {/* Document List */}
              {currentStep.documents.length > 0 && (
                <div className="mt-6 space-y-4">
                  <h5 className="font-semibold text-gray-800 flex items-center">
                    <FileText className="w-5 h-5 mr-2 text-blue-600" />
                    Documenti Analizzati ({currentStep.documents.length})
                  </h5>
                  {currentStep.documents.map((doc, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 via-purple-50 to-green-50 rounded-lg border-2 border-blue-200 hover:shadow-md transition-all duration-300">
                      <div className="flex items-center space-x-4">
                        {getFileIcon(doc.name)}
                        <div>
                          <span className="font-medium text-gray-800">{doc.name}</span>
                          <div className="text-sm text-gray-600 flex items-center space-x-4 mt-1">
                            <span>{(doc.size / 1024 / 1024).toFixed(2)} MB</span>
                            <span className="flex items-center">
                              <Brain className="w-3 h-3 mr-1 text-blue-500" />
                              Analizzato da AI
                            </span>
                            <span className="flex items-center">
                              <Sparkles className="w-3 h-3 mr-1 text-purple-500" />
                              {currentStep.smartInsights.length} insight
                            </span>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => removeDocument(index)}
                        className="text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-all duration-200"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-8 border-t bg-gradient-to-r from-gray-50 via-purple-50 to-blue-50">
            <button
              onClick={prevStep}
              disabled={currentStepIndex === 0}
              className="flex items-center px-6 py-3 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:bg-white rounded-lg"
            >
              <ChevronLeft className="w-5 h-5 mr-1" />
              Indietro
            </button>
            
            <div className="flex items-center space-x-6 text-sm text-gray-600">
              <span className="font-medium">{currentStepIndex + 1} di {wizardSteps.length}</span>
              {progressSaving && (
                <div className="flex items-center text-blue-600 animate-pulse">
                  <RefreshCw className="w-4 h-4 mr-1 animate-spin" />
                  Salvando...
                </div>
              )}
            </div>
            
            <button
              onClick={nextStep}
              disabled={!validateCurrentStep()}
              className="flex items-center px-10 py-3 bg-gradient-to-r from-purple-600 via-blue-600 to-green-600 text-white rounded-xl hover:from-purple-700 hover:via-blue-700 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105"
            >
              {currentStepIndex === wizardSteps.length - 1 ? (
                <>
                  <MessageSquare className="w-5 h-5 mr-2" />
                  Genera Report Consultivo
                </>
              ) : (
                <>
                  Continua
                  <ChevronRight className="w-5 h-5 ml-2" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    )
  }

  // MAIN AI COACH INTERFACE
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-7xl w-full max-h-[95vh] overflow-y-auto m-4">
        <div className="relative flex items-center justify-between p-8 border-b bg-gradient-to-r from-blue-500 via-purple-500 to-green-600 text-white overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 via-purple-400/20 to-green-400/20 animate-pulse"></div>
          <div className="relative flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <MessageSquare className="w-8 h-8" />
              <Brain className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-3xl font-bold">AI Coach v2.1 - Modalità Consultiva</h2>
              <p className="text-blue-100 text-sm mt-1">Raccomandazioni strategiche senza modificare la tua analisi originale</p>
            </div>
          </div>
          <button onClick={onClose} className="relative text-white hover:text-gray-200 transition-colors p-2 rounded-lg hover:bg-white/20">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Overview */}
        <div className="p-8 border-b bg-gradient-to-r from-blue-50 via-purple-50 via-green-50 to-orange-50">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              {
                title: 'Score Attuale',
                value: analysis?.professional_analysis?.overall_score || 0,
                subtitle: 'Preservato',
                color: 'blue',
                icon: Shield
              },
              {
                title: 'Raccomandazioni',
                value: missingAreas.length,
                subtitle: 'Strategiche',
                color: 'purple',
                icon: Lightbulb
              },
              {
                title: 'Action Items',
                value: missingAreas.filter(area => area.impact === 'high').length * 2,
                subtitle: 'Personalizzati',
                color: 'green',
                icon: CheckCircle
              },
              {
                title: 'Aree Focus',
                value: missingAreas.filter(area => area.impact === 'high').length,
                subtitle: 'Prioritarie',
                color: 'orange',
                icon: Target
              }
            ].map((metric, index) => (
              <div key={index} className="text-center p-6 bg-white rounded-xl shadow-lg border-2 border-gray-200 transform transition-all duration-500 hover:scale-105 hover:shadow-xl">
                <div className="flex items-center justify-center mb-4">
                  <metric.icon className={`w-8 h-8 text-${metric.color}-600 mr-2`} />
                  <div>
                    <div className="text-sm text-gray-600 mb-1">{metric.title}</div>
                    <div className={`text-4xl font-bold text-${metric.color}-600`}>
                      {metric.value}
                    </div>
                  </div>
                </div>
                <div className="text-xs text-gray-500">{metric.subtitle}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-8">
          {missingAreas.length === 0 ? (
            <div className="text-center py-16">
              <div className="flex items-center justify-center mb-6">
                <CheckCircle className="w-20 h-20 text-green-500 mr-4" />
                <MessageSquare className="w-12 h-12 text-blue-500" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-4">
                Progetto Già Ottimizzato!
              </h3>
              <p className="text-gray-600 mb-8 text-lg max-w-2xl mx-auto">
                Il tuo progetto ha raggiunto un ottimo livello in tutte le aree critiche. 
                Non sono necessarie raccomandazioni aggiuntive al momento.
              </p>
              <button
                onClick={onClose}
                className="px-8 py-4 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-xl hover:from-green-700 hover:to-blue-700 transition-colors shadow-lg"
              >
                Chiudi AI Coach
              </button>
            </div>
          ) : (
            <>
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                  <Target className="w-7 h-7 mr-3 text-purple-600" />
                  Aree per Raccomandazioni Strategiche
                </h3>
                <p className="text-gray-600 text-lg">
                  Il coach consultivo analizzerà queste aree e genererà raccomandazioni personalizzate 
                  e un action plan dettagliato senza modificare la tua analisi esistente.
                </p>
              </div>

              <div className="space-y-6 mb-10">
                {missingAreas.map((area) => (
                  <div key={area.id} className="bg-white border-2 border-gray-200 rounded-xl p-8 hover:shadow-xl transition-all duration-500 hover:border-purple-300 group">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center space-x-6">
                        <div className={`p-4 rounded-xl ${getImpactColor(area.impact)} border-2 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                          {getCategoryIcon(area.category)}
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900 text-xl mb-2">{area.title}</h4>
                          <p className="text-gray-600 text-sm leading-relaxed">{area.description}</p>
                          <div className="flex items-center space-x-4 mt-3 text-sm">
                            <span className="flex items-center text-blue-600">
                              <MessageSquare className="w-4 h-4 mr-1" />
                              Solo raccomandazioni
                            </span>
                            <span className="flex items-center text-green-600">
                              <Shield className="w-4 h-4 mr-1" />
                              Analisi preservata
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right bg-purple-50 p-6 rounded-xl border-2 border-purple-200 shadow-lg">
                        <div className="text-sm text-gray-600 mb-1">Focus Area</div>
                        <div className={`text-2xl font-bold ${area.impact === 'high' ? 'text-red-600' : area.impact === 'medium' ? 'text-yellow-600' : 'text-green-600'}`}>
                          {area.impact === 'high' ? 'Alta' : area.impact === 'medium' ? 'Media' : 'Bassa'}
                        </div>
                        <div className="text-xs text-gray-700">Priorità</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Call to Action */}
              <div className="bg-gradient-to-r from-blue-50 via-purple-50 to-green-50 rounded-2xl p-10 text-center border-2 border-blue-200 shadow-xl">
                <div className="flex items-center justify-center mb-6">
                  <div className="relative">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center animate-pulse">
                      <MessageSquare className="w-10 h-10 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-400 rounded-full flex items-center justify-center">
                      <Shield className="w-5 h-5 text-green-800" />
                    </div>
                  </div>
                </div>
                
                <h3 className="text-3xl font-bold text-gray-900 mb-6">
                  Pronto per il Coach Consultivo?
                </h3>
                <p className="text-gray-600 mb-8 max-w-4xl mx-auto text-lg leading-relaxed">
                  L'AI Coach v2.1 in modalità consultiva manterrà intatta la tua analisi originale 
                  e genererà solo <strong>raccomandazioni strategiche</strong>, 
                  <strong>action plan personalizzato</strong> e <strong>risorse consigliate</strong> 
                  per aiutarti a migliorare le aree identificate.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                  {[
                    { icon: Shield, label: 'Analisi Preservata', color: 'blue' },
                    { icon: Lightbulb, label: 'Raccomandazioni Smart', color: 'purple' },
                    { icon: CheckCircle, label: 'Action Plan Dettagliato', color: 'green' }
                  ].map((feature, index) => (
                    <div key={index} className="flex items-center justify-center p-4 bg-white rounded-xl border-2 border-gray-200 hover:shadow-lg transition-all duration-300 hover:scale-105">
                      <feature.icon className={`w-5 h-5 text-${feature.color}-600 mr-2`} />
                      <span className="font-medium text-gray-800 text-sm">{feature.label}</span>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
                  <button
                    onClick={startGuidedImprovement}
                    className="flex items-center px-12 py-5 bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 text-white rounded-2xl hover:from-blue-700 hover:via-purple-700 hover:to-green-700 transition-all duration-500 shadow-2xl hover:shadow-3xl transform hover:scale-110 text-lg font-bold"
                  >
                    <MessageSquare className="w-6 h-6 mr-3" />
                    Avvia Coach Consultivo
                  </button>
                  <button
                    onClick={onClose}
                    className="px-8 py-5 bg-gray-600 text-white rounded-2xl hover:bg-gray-700 transition-colors text-lg"
                  >
                    Chiudi
                  </button>
                </div>

                <div className="mt-10 flex items-center justify-center space-x-8 text-sm text-gray-600">
                  <div className="flex items-center">
                    <MessageSquare className="w-4 h-4 mr-2 text-blue-600" />
                    <span>Solo Consultivo</span>
                  </div>
                  <div className="flex items-center">
                    <Shield className="w-4 h-4 mr-2 text-green-600" />
                    <span>Score Preservato</span>
                  </div>
                  <div className="flex items-center">
                    <Brain className="w-4 h-4 mr-2 text-purple-600" />
                    <span>AI-Powered v2.1</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}