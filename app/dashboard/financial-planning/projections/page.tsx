'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  ArrowLeft, ArrowRight, CheckCircle, TrendingUp, 
  Download, Save, RefreshCw, Wand2, Eye, Calculator,
  DollarSign, BarChart3, Target, Calendar, AlertTriangle,
  Info, Lightbulb, FileText, PieChart, Activity, HelpCircle
} from 'lucide-react'

interface ProjectionData {
  id: string
  title: string
  description: string
  iconName: string
  completed: boolean
  fields: { [key: string]: string | number }
}

interface FieldConfig {
  label: string
  description: string
  type: 'select' | 'number' | 'text'
  options?: string[]
  placeholder?: string
  suffix?: string
  min?: number
  max?: number
  step?: number
  tip?: string
}

export default function FinancialProjectionsWizard() {
  const { data: session } = useSession()
  const router = useRouter()
  const [currentSection, setCurrentSection] = useState(0)
  const [isGenerating, setIsGenerating] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [projectionData, setProjectionData] = useState<any[]>([])
  const [showHelp, setShowHelp] = useState<string | null>(null)

  const getIcon = (iconName: string, className: string) => {
    switch (iconName) {
      case 'Target':
        return <Target className={className} />
      case 'DollarSign':
        return <DollarSign className={className} />
      case 'Calculator':
        return <Calculator className={className} />
      case 'TrendingUp':
        return <TrendingUp className={className} />
      case 'BarChart3':
        return <BarChart3 className={className} />
      default:
        return <FileText className={className} />
    }
  }

  // Configurazione campi guidata
  const fieldConfigs: { [key: string]: { [key: string]: FieldConfig } } = {
    'business-model': {
      businessType: {
        label: 'Tipo di Business',
        description: 'Seleziona il modello di business che meglio descrive la tua startup',
        type: 'select',
        options: ['SaaS B2B', 'SaaS B2C', 'E-commerce', 'Marketplace', 'App Mobile', 'Servizi Professionali', 'Prodotto Fisico', 'Piattaforma'],
        tip: 'Il tipo di business influenza tutte le metriche successive. Scegli quello più simile al tuo modello.'
      },
      revenueModel: {
        label: 'Modello di Revenue',
        description: 'Come generi ricavi dalla tua attività',
        type: 'select',
        options: ['Subscription mensile', 'Subscription annuale', 'Freemium + Premium', 'Commission per transazione', 'One-time payment', 'Advertising', 'Licensing', 'Misto'],
        tip: 'I modelli ricorrenti (subscription) sono più attraenti per gli investitori perché garantiscono prevedibilità.'
      },
      customerSegments: {
        label: 'Segmenti Clienti',
        description: 'Chi sono i tuoi clienti target principali',
        type: 'select',
        options: ['PMI (10-50 dipendenti)', 'Aziende medie (50-250 dipendenti)', 'Enterprise (250+ dipendenti)', 'Consumatori giovani (18-35)', 'Consumatori adulti (35-55)', 'Professionisti', 'Freelancer', 'Startup'],
        tip: 'Definire chiaramente il target aiuta a calcolare CAC e LTV più accurati.'
      },
      pricingStrategy: {
        label: 'Strategia Pricing',
        description: 'Come strutturi i prezzi dei tuoi prodotti/servizi',
        type: 'select',
        options: ['Freemium (base gratis + premium)', 'Tiered pricing (3 piani)', 'Usage-based (pay per use)', 'Flat rate (prezzo fisso)', 'Custom enterprise', 'Commission-based'],
        tip: 'Il freemium funziona bene per SaaS, mentre l\'usage-based è ideale per API e servizi scalabili.'
      },
      averageOrderValue: {
        label: 'Valore Medio Ordine',
        description: 'Quanto spende in media un cliente per acquisto/mese',
        type: 'number',
        placeholder: '2400',
        suffix: '€',
        min: 1,
        max: 100000,
        step: 10,
        tip: 'Per subscription: prezzo mensile. Per one-time: valore medio transazione. Sii realistico basandoti su competitor.'
      },
      customerAcquisitionCost: {
        label: 'Costo Acquisizione Cliente (CAC)',
        description: 'Quanto costa acquisire un nuovo cliente (marketing + sales)',
        type: 'number',
        placeholder: '350',
        suffix: '€',
        min: 1,
        max: 50000,
        step: 10,
        tip: 'Include costi marketing, sales, onboarding. Regola generale: CAC dovrebbe essere < 1/3 del LTV.'
      },
      customerLifetimeValue: {
        label: 'Lifetime Value Cliente (LTV)',
        description: 'Valore totale che un cliente genera durante la relazione',
        type: 'number',
        placeholder: '12000',
        suffix: '€',
        min: 1,
        max: 500000,
        step: 100,
        tip: 'Per subscription: (Prezzo mensile × Mesi di retention). Rapporto LTV/CAC dovrebbe essere > 3:1.'
      },
      monthlyChurnRate: {
        label: 'Tasso Abbandono Mensile',
        description: 'Percentuale clienti che smettono di usare il servizio ogni mese',
        type: 'number',
        placeholder: '5',
        suffix: '%',
        min: 0,
        max: 50,
        step: 0.5,
        tip: 'SaaS B2B: 2-7%. SaaS B2C: 5-15%. Più basso è, meglio è per la crescita sostenibile.'
      }
    },
    'revenue-assumptions': {
      launchMonth: {
        label: 'Mese di Lancio',
        description: 'In quale mese inizierai a generare i primi ricavi',
        type: 'select',
        options: ['Mese 1 (subito)', 'Mese 2', 'Mese 3', 'Mese 4', 'Mese 5', 'Mese 6'],
        tip: 'Considera il tempo necessario per completare MVP, primi test e acquisire i primi clienti.'
      },
      initialCustomers: {
        label: 'Clienti Iniziali',
        description: 'Numero di clienti paganti che prevedi di avere al lancio',
        type: 'number',
        placeholder: '25',
        min: 0,
        max: 1000,
        step: 1,
        tip: 'Include beta tester, early adopters, pre-order. Sii conservativo ma realistico.'
      },
      monthlyGrowthRate: {
        label: 'Crescita Mensile',
        description: 'Percentuale di crescita clienti prevista ogni mese',
        type: 'number',
        placeholder: '15',
        suffix: '%',
        min: 0,
        max: 100,
        step: 1,
        tip: 'Startups tipiche: 5-20% mensile. 15% mensile = 435% crescita annua. Sii realistico!'
      },
      seasonalityFactor: {
        label: 'Fattore Stagionalità',
        description: 'Variazione stagionale del business (0 = stabile, >0 = stagionale)',
        type: 'number',
        placeholder: '10',
        suffix: '%',
        min: 0,
        max: 50,
        step: 5,
        tip: 'E-commerce: alta stagionalità. B2B software: bassa stagionalità. Considera il tuo settore.'
      },
      priceGrowthRate: {
        label: 'Crescita Prezzi Annua',
        description: 'Aumento prezzi annuale previsto (inflation + value)',
        type: 'number',
        placeholder: '8',
        suffix: '%',
        min: 0,
        max: 30,
        step: 1,
        tip: 'Include inflazione (3-5%) + aumento valore prodotto. SaaS tipicamente 5-15% annuo.'
      },
      marketSaturation: {
        label: 'Saturazione Mercato',
        description: 'Numero massimo clienti raggiungibili nel tuo mercato',
        type: 'number',
        placeholder: '10000',
        min: 100,
        max: 10000000,
        step: 100,
        tip: 'TAM/prezzo medio. Esempio: mercato €10M, prezzo €1000 = 10K clienti max.'
      },
      conversionRate: {
        label: 'Tasso Conversione',
        description: 'Percentuale visitatori/lead che diventano clienti paganti',
        type: 'number',
        placeholder: '12',
        suffix: '%',
        min: 0.1,
        max: 50,
        step: 0.1,
        tip: 'SaaS B2B: 10-20%. E-commerce: 2-5%. Freemium: 1-5%. Dipende dal settore e prezzo.'
      },
      retentionRate: {
        label: 'Tasso Retention',
        description: 'Percentuale clienti che rimangono attivi ogni mese',
        type: 'number',
        placeholder: '90',
        suffix: '%',
        min: 50,
        max: 99,
        step: 1,
        tip: 'Opposto del churn rate. 90% retention = 10% churn. Obiettivo: >85% per SaaS B2B.'
      }
    },
    'cost-structure': {
      fixedCostsMonthly: {
        label: 'Costi Fissi Mensili',
        description: 'Costi che sostieni ogni mese indipendentemente dalle vendite',
        type: 'number',
        placeholder: '15000',
        suffix: '€',
        min: 0,
        max: 1000000,
        step: 100,
        tip: 'Include: affitti, stipendi base, software, assicurazioni. Costi che hai anche con 0 clienti.'
      },
      variableCostPercentage: {
        label: 'Costi Variabili',
        description: 'Percentuale dei ricavi spesa in costi variabili (COGS)',
        type: 'number',
        placeholder: '35',
        suffix: '%',
        min: 0,
        max: 80,
        step: 1,
        tip: 'SaaS: 10-30%. E-commerce: 40-70%. Include: hosting, payment fees, produzione, shipping.'
      },
      salariesMonthly: {
        label: 'Stipendi Mensili',
        description: 'Costo totale stipendi team per mese',
        type: 'number',
        placeholder: '45000',
        suffix: '€',
        min: 0,
        max: 2000000,
        step: 1000,
        tip: 'Include stipendi, contributi, benefit. Pianifica crescita team nei prossimi 3 anni.'
      },
      marketingBudget: {
        label: 'Budget Marketing',
        description: 'Spesa mensile per marketing e acquisizione clienti',
        type: 'number',
        placeholder: '8000',
        suffix: '€',
        min: 0,
        max: 500000,
        step: 100,
        tip: 'Regola generale: 15-25% dei ricavi. Include: advertising, content, events, PR.'
      },
      technologyCosts: {
        label: 'Costi Tecnologia',
        description: 'Spesa mensile per infrastruttura e software',
        type: 'number',
        placeholder: '3500',
        suffix: '€',
        min: 0,
        max: 100000,
        step: 50,
        tip: 'Include: cloud hosting, software licenses, API costs, security, backup.'
      },
      operationalCosts: {
        label: 'Costi Operativi',
        description: 'Altri costi operativi mensili (amministrazione, legale, ecc.)',
        type: 'number',
        placeholder: '2500',
        suffix: '€',
        min: 0,
        max: 100000,
        step: 50,
        tip: 'Include: commercialista, avvocato, assicurazioni, utilities, travel.'
      },
      oneTimeInvestments: {
        label: 'Investimenti Una Tantum',
        description: 'Investimenti iniziali necessari per partire',
        type: 'number',
        placeholder: '150000',
        suffix: '€',
        min: 0,
        max: 10000000,
        step: 1000,
        tip: 'Include: sviluppo MVP, setup iniziale, attrezzature, inventory iniziale.'
      },
      hirePlan: {
        label: 'Piano Assunzioni',
        description: 'Quando e chi assumerai nei prossimi 24 mesi',
        type: 'text',
        placeholder: '2 sviluppatori Q1, 1 sales Q2, 1 marketing Q3',
        tip: 'Pianifica le assunzioni chiave che ti serviranno per crescere. Sii specifico sui ruoli e tempistiche.'
      }
    }
  }

  // Financial Projections Sections
  const sections: ProjectionData[] = [
    {
      id: 'business-model',
      title: 'Modello di Business',
      description: 'Definisci il tuo modello di revenue e unit economics',
      iconName: 'Target',
      completed: false,
      fields: {
        businessType: '',
        revenueModel: '',
        customerSegments: '',
        pricingStrategy: '',
        averageOrderValue: 0,
        customerAcquisitionCost: 0,
        customerLifetimeValue: 0,
        monthlyChurnRate: 0
      }
    },
    {
      id: 'revenue-assumptions',
      title: 'Assunzioni Revenue',
      description: 'Parametri chiave per le proiezioni di ricavi',
      iconName: 'DollarSign',
      completed: false,
      fields: {
        launchMonth: 1,
        initialCustomers: 0,
        monthlyGrowthRate: 0,
        seasonalityFactor: 0,
        priceGrowthRate: 0,
        marketSaturation: 0,
        conversionRate: 0,
        retentionRate: 0
      }
    },
    {
      id: 'cost-structure',
      title: 'Struttura Costi',
      description: 'Costi fissi, variabili e investimenti',
      iconName: 'Calculator',
      completed: false,
      fields: {
        fixedCostsMonthly: 0,
        variableCostPercentage: 0,
        salariesMonthly: 0,
        marketingBudget: 0,
        technologyCosts: 0,
        operationalCosts: 0,
        oneTimeInvestments: 0,
        hirePlan: ''
      }
    },
    {
      id: 'growth-scenarios',
      title: 'Scenari di Crescita',
      description: 'Modella diversi scenari di crescita',
      iconName: 'TrendingUp',
      completed: false,
      fields: {
        conservativeGrowth: 0,
        realisticGrowth: 0,
        optimisticGrowth: 0,
        marketRisk: '',
        competitionRisk: '',
        operationalRisk: '',
        mitigationStrategies: ''
      }
    },
    {
      id: 'funding-needs',
      title: 'Fabbisogno Finanziario',
      description: 'Calcola il funding necessario e runway',
      iconName: 'BarChart3',
      completed: false,
      fields: {
        initialInvestment: 0,
        monthlyBurnRate: 0,
        breakEvenMonth: 0,
        fundingRounds: '',
        useOfFunds: '',
        milestones: '',
        exitStrategy: ''
      }
    }
  ]

  const [sectionData, setSectionData] = useState<ProjectionData[]>(sections)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedData = localStorage.getItem('upstarter-financial-projections')
      if (savedData) {
        try {
          const parsed = JSON.parse(savedData)
          setSectionData(parsed.sections || sections)
          setCurrentSection(parsed.currentSection || 0)
          if (parsed.lastSaved) {
            setLastSaved(new Date(parsed.lastSaved))
          }
        } catch (error) {
          console.error('Error loading saved projections:', error)
        }
      }
    }
    generateProjectionCharts()
  }, [])

  const generateProjectionCharts = () => {
    const months: any[] = []
    const baseRevenue = 10000
    const growthRate = 0.15
    
    for (let i = 0; i < 36; i++) {
      const month = i + 1
      const revenue = baseRevenue * Math.pow(1 + growthRate, i) * (1 + 0.1 * Math.sin(i * 0.5))
      const costs = revenue * 0.6 + 15000
      const profit = revenue - costs
      
      months.push({
        month: `M${month}`,
        monthNumber: month,
        revenue: Math.round(revenue),
        costs: Math.round(costs),
        profit: Math.round(profit),
        cumulativeProfit: months.reduce((sum, m) => sum + (m.profit || 0), profit),
        customers: Math.round(50 * Math.pow(1.1, i)),
        burnRate: costs > revenue ? Math.round(costs - revenue) : 0
      })
    }
    
    setProjectionData(months)
  }

  const saveToLocalStorage = () => {
    if (typeof window !== 'undefined') {
      const dataToSave = {
        sections: sectionData,
        currentSection,
        lastSaved: new Date().toISOString()
      }
      localStorage.setItem('upstarter-financial-projections', JSON.stringify(dataToSave))
      setLastSaved(new Date())
    }
  }

  const updateSectionField = (sectionIndex: number, field: string, value: string | number) => {
    const newSectionData = [...sectionData]
    newSectionData[sectionIndex].fields[field] = value
    
    const requiredFields = Object.keys(newSectionData[sectionIndex].fields).filter(f => 
      typeof newSectionData[sectionIndex].fields[f] === 'number' ? 
      newSectionData[sectionIndex].fields[f] > 0 : 
      String(newSectionData[sectionIndex].fields[f]).trim() !== ''
    )
    const totalFields = Object.keys(newSectionData[sectionIndex].fields).length
    newSectionData[sectionIndex].completed = requiredFields.length >= Math.ceil(totalFields * 0.7)
    
    setSectionData(newSectionData)
    
    if (sectionIndex <= 2) {
      generateProjectionCharts()
    }
    
    setTimeout(() => {
      saveToLocalStorage()
    }, 1000)
  }

  const generateAIContent = async (sectionIndex: number) => {
    setIsGenerating(true)
    
    setTimeout(() => {
      const section = sectionData[sectionIndex]
      const mockContent: { [key: string]: { [key: string]: string | number } } = {
        'business-model': {
          businessType: 'SaaS B2B',
          revenueModel: 'Subscription mensile',
          customerSegments: 'PMI (10-50 dipendenti)',
          pricingStrategy: 'Freemium (base gratis + premium)',
          averageOrderValue: 2400,
          customerAcquisitionCost: 350,
          customerLifetimeValue: 12000,
          monthlyChurnRate: 5
        },
        'revenue-assumptions': {
          launchMonth: 'Mese 3',
          initialCustomers: 25,
          monthlyGrowthRate: 15,
          seasonalityFactor: 10,
          priceGrowthRate: 8,
          marketSaturation: 10000,
          conversionRate: 12,
          retentionRate: 90
        },
        'cost-structure': {
          fixedCostsMonthly: 15000,
          variableCostPercentage: 35,
          salariesMonthly: 45000,
          marketingBudget: 8000,
          technologyCosts: 3500,
          operationalCosts: 2500,
          oneTimeInvestments: 150000,
          hirePlan: '2 sviluppatori Q1, 1 sales Q2, 1 marketing Q3'
        }
      }

      if (mockContent[section.id]) {
        Object.entries(mockContent[section.id]).forEach(([field, value]) => {
          updateSectionField(sectionIndex, field, value)
        })
      }
      
      setIsGenerating(false)
    }, 2500)
  }

  const nextSection = () => {
    if (currentSection < sectionData.length - 1) {
      setCurrentSection(currentSection + 1)
    }
  }

  const prevSection = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1)
    }
  }

  const completedSections = sectionData.filter(section => section.completed).length
  const progressPercentage = (completedSections / sectionData.length) * 100

  const exportProjections = () => {
    alert('Proiezioni Finanziarie esportate in Excel!')
  }

  const currentSectionData = sectionData[currentSection]
  const currentFieldConfigs = fieldConfigs[currentSectionData.id] || {}

  // Calculate key metrics
  const breakEvenMonth = projectionData.find(m => m.cumulativeProfit > 0)?.monthNumber || 36
  const maxBurnRate = Math.max(...projectionData.slice(0, breakEvenMonth).map(m => m.burnRate))
  const yearOneRevenue = projectionData.slice(0, 12).reduce((sum, m) => sum + m.revenue, 0)
  const yearThreeRevenue = projectionData.slice(24, 36).reduce((sum, m) => sum + m.revenue, 0)

  const chartData = projectionData.slice(0, 24)
  const maxRevenue = Math.max(...chartData.map(m => m.revenue))
  const maxCosts = Math.max(...chartData.map(m => m.costs))
  const maxValue = Math.max(maxRevenue, maxCosts)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-4">
              <Link href="/dashboard/financial-planning" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
                <ArrowLeft className="w-4 h-4" />
                Financial Planning
              </Link>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-600" />
                <span className="font-semibold text-gray-900">Proiezioni Finanziarie</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-3">
                <div className="text-sm text-gray-600">
                  Progresso: {completedSections}/{sectionData.length}
                </div>
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
              </div>

              <button
                onClick={saveToLocalStorage}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors text-sm"
              >
                <Save className="w-4 h-4" />
                Salva
              </button>

              <button
                onClick={exportProjections}
                className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
              >
                <Download className="w-4 h-4" />
                Esporta Excel
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-12 gap-8">
          {/* Sidebar - Sections Overview */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-24">
              <div className="flex items-center gap-2 mb-6">
                <TrendingUp className="w-5 h-5 text-green-600" />
                <h2 className="font-semibold text-gray-900">Wizard Guidato</h2>
              </div>
              
              <div className="space-y-2">
                {sectionData.map((section, index) => (
                  <button
                    key={section.id}
                    onClick={() => setCurrentSection(index)}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-all ${
                      index === currentSection
                        ? 'bg-green-50 border border-green-200 text-green-900'
                        : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      section.completed 
                        ? 'bg-green-100 text-green-600' 
                        : index === currentSection
                        ? 'bg-green-100 text-green-600'
                        : 'bg-gray-100 text-gray-400'
                    }`}>
                      {section.completed ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : (
                        getIcon(section.iconName, "w-4 h-4")
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">{section.title}</div>
                      <div className="text-xs text-gray-500">
                        Passo {index + 1} di {sectionData.length}
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {/* Key Metrics */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Metriche Live</h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Break-even:</span>
                    <span className="font-medium text-gray-900">Mese {breakEvenMonth}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Max Burn:</span>
                    <span className="font-medium text-red-600">€{maxBurnRate.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Revenue Y1:</span>
                    <span className="font-medium text-green-600">€{(yearOneRevenue/1000).toFixed(0)}K</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Revenue Y3:</span>
                    <span className="font-medium text-green-600">€{(yearThreeRevenue/1000).toFixed(0)}K</span>
                  </div>
                </div>
              </div>

              {lastSaved && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="text-xs text-gray-500">
                    Salvato: {lastSaved.toLocaleTimeString('it-IT')}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Main Content - Guided Form */}
          <div className="lg:col-span-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              {/* Section Header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      {getIcon(currentSectionData.iconName, "w-5 h-5 text-green-600")}
                    </div>
                    <div>
                      <h1 className="text-xl font-semibold text-gray-900">
                        {currentSectionData.title}
                      </h1>
                      <p className="text-sm text-gray-500">
                        {currentSectionData.description}
                      </p>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => generateAIContent(currentSection)}
                    disabled={isGenerating}
                    className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-green-700 hover:to-blue-700 transition-all disabled:opacity-50"
                  >
                    {isGenerating ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <Wand2 className="w-4 h-4" />
                    )}
                    {isGenerating ? 'Generando...' : 'AI Assist'}
                  </button>
                </div>
              </div>

              {/* Guided Form Fields */}
              <div className="p-6">
                <div className="space-y-8">
                  {Object.entries(currentSectionData.fields).map(([field, value]) => {
                    const config = currentFieldConfigs[field]
                    if (!config) return null

                    return (
                      <div key={field} className="relative">
                        <div className="flex items-center gap-2 mb-3">
                          <label className="text-sm font-semibold text-gray-900">
                            {config.label}
                          </label>
                          {config.tip && (
                            <button
                              onClick={() => setShowHelp(showHelp === field ? null : field)}
                              className="text-gray-400 hover:text-blue-600 transition-colors"
                            >
                              <HelpCircle className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                        
                        <p className="text-sm text-gray-600 mb-3">{config.description}</p>

                        {config.type === 'select' ? (
                          <select
                            value={value as string}
                            onChange={(e) => updateSectionField(currentSection, field, e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors text-gray-900"
                          >
                            <option value="">Seleziona un\'opzione...</option>
                            {config.options?.map((option) => (
                              <option key={option} value={option}>{option}</option>
                            ))}
                          </select>
                        ) : config.type === 'number' ? (
                          <div className="relative">
                            <input
                              type="number"
                              value={value as number}
                              onChange={(e) => updateSectionField(currentSection, field, parseFloat(e.target.value) || 0)}
                              placeholder={config.placeholder}
                              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors pr-12"
                              min={config.min}
                              max={config.max}
                              step={config.step}
                            />
                            {config.suffix && (
                              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                                {config.suffix}
                              </span>
                            )}
                          </div>
                        ) : (
                          <input
                            type="text"
                            value={value as string}
                            onChange={(e) => updateSectionField(currentSection, field, e.target.value)}
                            placeholder={config.placeholder}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                          />
                        )}

                        {/* Help tooltip */}
                        {showHelp === field && config.tip && (
                          <div className="mt-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                            <div className="flex items-start gap-2">
                              <Lightbulb className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                              <div>
                                <div className="text-sm font-medium text-blue-900 mb-1">Suggerimento</div>
                                <div className="text-sm text-blue-800">{config.tip}</div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>

                {/* Navigation Buttons */}
                <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
                  <button
                    onClick={prevSection}
                    disabled={currentSection === 0}
                    className="flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Precedente
                  </button>

                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span>{currentSection + 1}</span>
                    <span>/</span>
                    <span>{sectionData.length}</span>
                  </div>

                  <button
                    onClick={nextSection}
                    disabled={currentSection === sectionData.length - 1}
                    className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Successiva
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Charts Panel */}
          <div className="lg:col-span-3">
            <div className="space-y-6">
              {/* Revenue Growth Chart */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                  <h3 className="font-semibold text-gray-900">Crescita Revenue</h3>
                </div>
                <div className="h-32 relative">
                  <div className="absolute inset-0 flex items-end justify-between">
                    {chartData.slice(0, 8).map((data, index) => (
                      <div key={index} className="flex flex-col items-center">
                        <div
                          className="w-3 bg-green-500 rounded-t-sm"
                          style={{
                            height: `${(data.revenue / maxValue) * 100}px`,
                            minHeight: '4px'
                          }}
                        ></div>
                        <div className="text-xs text-gray-500 mt-1">
                          M{index + 1}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Quick Insights */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Insights Automatici</h3>
                <div className="space-y-3">
                  {breakEvenMonth <= 18 && (
                    <div className="flex items-start gap-2 p-3 bg-green-50 rounded-lg">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                      <div className="text-sm">
                        <div className="font-medium text-green-900">Break-even rapido!</div>
                        <div className="text-green-700">Raggiungi profittabilità in {breakEvenMonth} mesi</div>
                      </div>
                    </div>
                  )}
                  
                  {maxBurnRate > 50000 && (
                    <div className="flex items-start gap-2 p-3 bg-orange-50 rounded-lg">
                      <AlertTriangle className="w-4 h-4 text-orange-600 mt-0.5" />
                      <div className="text-sm">
                        <div className="font-medium text-orange-900">Burn rate alto</div>
                        <div className="text-orange-700">Considera strategie per ridurre costi</div>
                      </div>
                    </div>
                  )}

                  <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg">
                    <Info className="w-4 h-4 text-blue-600 mt-0.5" />
                    <div className="text-sm">
                      <div className="font-medium text-blue-900">Crescita prevista</div>
                      <div className="text-blue-700">{((yearThreeRevenue/yearOneRevenue - 1) * 100).toFixed(0)}% in 3 anni</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Export Options */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Export</h3>
                <div className="space-y-2">
                  <button
                    onClick={exportProjections}
                    className="w-full flex items-center justify-center gap-2 bg-green-50 text-green-600 px-3 py-2 rounded-lg hover:bg-green-100 transition-colors text-sm"
                  >
                    <Download className="w-4 h-4" />
                    Excel Investor-Ready
                  </button>
                  <button
                    onClick={() => alert('PDF con grafici esportato!')}
                    className="w-full flex items-center justify-center gap-2 bg-blue-50 text-blue-600 px-3 py-2 rounded-lg hover:bg-blue-100 transition-colors text-sm"
                  >
                    <FileText className="w-4 h-4" />
                    PDF Presentation
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}