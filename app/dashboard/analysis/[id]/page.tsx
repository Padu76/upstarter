'use client'

import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { ArrowLeft, TrendingUp, AlertCircle, CheckCircle, Target, Users, DollarSign, Clock, Download, Share, Star, ThumbsUp, ThumbsDown } from 'lucide-react'

interface ProfessionalAnalysisData {
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
  const [analysisData, setAnalysisData] = useState<ProfessionalAnalysisData | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')

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
          // Genera dati mock professionali per testing
          setAnalysisData(generateProfessionalMockData(analysisId))
        }
      } catch (error) {
        console.error('Errore caricamento analisi:', error)
      } finally {
        setLoading(false)
      }
    }

    loadAnalysisData()
  }, [analysisId])

  const generateProfessionalMockData = (id: string): ProfessionalAnalysisData => ({
    id,
    timestamp: new Date().toISOString(),
    fileName: 'Documento Business Plan',
    type: 'professional',
    extractedInfo: {
      title: 'EcoTech Solutions - Piattaforma IoT per Smart Cities',
      description: 'Startup innovativa che sviluppa soluzioni IoT per la gestione intelligente di infrastrutture urbane, con focus su sostenibilità ambientale e efficienza energetica.'
    },
    analysis: {
      overall_score: 82,
      executive_summary: {
        key_insights: [
          "Mercato smart cities in crescita del 18.7% CAGR, con forte spinta regulatory",
          "Team tecnico solido con expertise comprovata in IoT e sostenibilità",
          "Business model B2B2C scalabile con recurring revenue dal 75%"
        ],
        main_concerns: [
          "Competizione intensa da parte di incumbent tech giants",
          "Necessità di partnership con enti pubblici per accelerare adoption",
          "Dependency da fornitori hardware specializzati"
        ],
        investment_recommendation: "INVESTIMENTO RACCOMANDATO con valutazione €8-12M per round Series A. Startup presenta fundamentals solidi, team competente e posizionamento strategico in mercato ad alta crescita. Rischi mitigabili attraverso partnership strategiche.",
        berkus_score: 78,
        scorecard_score: 85
      },
      market_analysis: {
        score: 85,
        tam_sam_som_analysis: "TAM: €185B (Global Smart Cities Market), SAM: €28B (EU Smart Infrastructure), SOM: €420M (Target cities 100k+ abitanti in IT/DE/FR). Crescita TAM: 18.7% CAGR 2024-2029.",
        porter_five_forces: "Potere fornitori: MEDIO (specializzazione hardware). Potere clienti: ALTO (enti pubblici, decisioni centralizzate). Nuovi entranti: MEDIO (barriere tecniche/regulatory). Sostituti: BASSO (poche alternative integrate). Rivalità: ALTA (IBM, Cisco, Siemens).",
        competitive_landscape: "Direct competitors: IBM Smart Cities, Cisco Smart+Connected, Siemens MindSphere. Indirect: Microsoft IoT, AWS IoT. Market share leader: IBM (12%), Cisco (8%). Opportunity: focus verticale su sostenibilità ambientale.",
        market_segmentation: "Early adopters: Smart cities pilota (Milano, Amsterdam, Copenhagen). Mainstream: Città 100k-500k abitanti con budget digitalization. Chasm: passaggio da pilota a deployment large-scale.",
        market_timing: "OTTIMALE: EU Green Deal €1T, PNRR digitalization funds, post-COVID smart city acceleration. Technology adoption: early majority phase. Regulatory tailwinds: EU taxonomy, carbon neutrality targets.",
        barriers_entry: "Capital requirements: €5-15M per R&D, certificazioni, partnerships. Network effects: crescenti con adoption. Switching costs: alti (integrazione infrastrutturale). Regulatory: compliance GDPR, cybersecurity.",
        pros: [
          "Mercato in crescita accelerata (+18.7% CAGR) con supporto istituzionale",
          "Positioning unico su sustainability angle vs generic IoT players",
          "Timing perfetto con EU Green Deal e PNRR funds availability"
        ],
        cons: [
          "Sales cycle lunghi (12-24 mesi) con enti pubblici",
          "Competizione da tech giants con risorse superiori",
          "Dependency da policy changes e budget allocation pubblici"
        ],
        recommendations: [
          "Focus geografico EU per sfruttare regulatory tailwinds",
          "Partnership strategiche con system integrator (Accenture, Deloitte)",
          "Sviluppo case studies quantificabili ROI per accelerare adoption"
        ]
      },
      business_model_analysis: {
        score: 78,
        business_model_canvas: "Value Prop: Riduzione costi energetici 25-40%, compliance automatizzata. Customer Segments: Smart cities, utility companies. Channels: Direct sales, partner network. Revenue: SaaS €50-200/sensor/anno + setup €10-50k. Key Resources: IP portfolio, sensor network.",
        unit_economics: "LTV: €180k (avg customer), CAC: €45k (B2B sales), LTV/CAC: 4.0x. Payback period: 14 mesi. Contribution margin: 72%. Churn rate: <5% annuo (high switching costs).",
        revenue_model_analysis: "Recurring revenue 75% (SaaS subscriptions), One-time 25% (implementation). Predictable revenue stream con annual contracts. Pricing power: MEDIO-ALTO (ROI dimostrabile). Revenue mix optimization: upselling analytics modules.",
        scalability_assessment: "Network effects: crescenti con sensor density. Economies of scale: R&D costs fissi, marginal costs decrescenti. Operational leverage: ALTO (software-driven). Platform potential: marketplace third-party apps.",
        pricing_strategy: "Value-based pricing basato su cost savings. Freemium: basic dashboard gratuito. Premium: advanced analytics €50/sensor/anno. Enterprise: custom solutions €100-200/sensor/anno. Pricing experiments: usage-based billing.",
        pros: [
          "Recurring revenue model (75%) garantisce predictable cash flow",
          "Unit economics solidi con LTV/CAC 4.0x e payback 14 mesi",
          "Scalability elevata con marginal costs decrescenti"
        ],
        cons: [
          "Setup costs elevati possono limitare adoption rate",
          "Dependency da volume per raggiungere target margins",
          "Revenue concentration risk con large enterprise customers"
        ],
        recommendations: [
          "Introdurre pricing tier intermedio per mid-market customers",
          "Sviluppare marketplace revenue stream (commission 10-15%)",
          "Implementare usage-based billing per ottimizzare customer retention"
        ]
      },
      competitive_analysis: {
        score: 72,
        competitive_positioning: "Posizionamento differenziato: 'Sustainability-first IoT platform' vs generic smart city solutions. Focus verticale environmental compliance + energy optimization. David vs Goliath strategy con agility advantage.",
        differentiation_strength: "FORTE su sustainability metrics e carbon footprint tracking. Integrazione nativa EU taxonomy compliance. Purpose-built per environmental use cases vs horizontal platforms generaliste.",
        barriers_to_entry: "IP portfolio: 3 brevetti pending su optimization algorithms. Network effects: moderate ma crescenti. Switching costs: alti post-integration. Brand loyalty: da costruire, focus su thought leadership.",
        competitive_threats: "ALTA: IBM/Cisco potrebbero acquisire startup similari. MEDIA: New entrants ben finanziati. BASSA: Backward integration da utility companies. Response strategy: accelerare product development e customer lock-in.",
        moat_analysis: "Moat MODERATO: IP + customer data + specialized expertise. Strengthening moat: network effects, switching costs, brand recognition. Vulnerability: facilmente replicabile da tech giants con risorse superiori.",
        pros: [
          "First-mover advantage nel sustainability-focused IoT verticale",
          "Team expertise specifico difficilmente replicabile short-term",
          "Customer switching costs elevati post-implementazione"
        ],
        cons: [
          "Moat difensivo ancora debole vs established tech companies",
          "Rischio commodity pricing pressure con market maturity",
          "Vulnerability ad acquisizioni strategic da parte di incumbents"
        ],
        recommendations: [
          "Accelerare IP portfolio development e defensive patents",
          "Focus su customer success per aumentare switching costs",
          "Considerare strategic partnerships vs acquisition targets"
        ]
      },
      team_analysis: {
        score: 80,
        founder_market_fit: "FORTE: CEO ex-Siemens IoT division (8 anni), CTO PhD Politecnico Milano (IoT systems). Domain expertise comprovata. Track record: 2 startup precedenti, 1 exit €15M.",
        team_composition: "Team tecnico senior (avg 8+ anni exp), competenze complementari: IoT hardware, software, sustainability consulting. Gender diversity: 40% women in leadership. Advisory board: ex-executives utilities.",
        experience_assessment: "Background rilevante: ex-Siemens, Schneider Electric, Enel. Track record: scaling IoT solutions da 0 a €50M+ revenue. Execution capability dimostrata in contesti enterprise B2B.",
        execution_capability: "ALTA: team ha delivered complex IoT projects on-time, on-budget. Leadership riconosciuta (speaking EU conferences). Vision clarity: sustainability leadership through technology.",
        missing_competencies: [
          "VP Sales con experience enti pubblici (procurement cycles)",
          "Chief Marketing Officer per brand building e thought leadership",
          "Head of Partnerships per ecosystem development"
        ],
        advisory_board: "Strong advisory: ex-CEO Schneider Electric EU, ex-Director EU Commission Smart Cities initiative, Partner McKinsey Sustainability practice. Network value: customer introductions, regulatory insights.",
        pros: [
          "Team tecnico di livello world-class con track record comprovato",
          "Founder-market fit eccellente con deep domain expertise",
          "Advisory board strategico con network rilevante"
        ],
        cons: [
          "Gap critici in sales/marketing per scaling commerciale",
          "Dependency da founder per customer relationships",
          "Limited bench strength per rapid scaling"
        ],
        recommendations: [
          "Hiring VP Sales con experience public sector entro 6 mesi",
          "Equity incentive plan per attrarre top marketing talent",
          "Succession planning e knowledge transfer processes"
        ]
      },
      financial_analysis: {
        score: 75,
        financial_projections: "Revenue: Y1 €1.2M, Y2 €4.8M, Y3 €12.5M (CAGR 240%). EBITDA positive Y3 (15% margin). Customer growth: 15 → 45 → 120 cities. ARR multiple expansion: €80k → €110k per customer.",
        funding_analysis: "Series A €8-12M target. Use of funds: R&D 40% (€4.8M), Sales/Marketing 35% (€4.2M), Operations 15% (€1.8M), Working capital 10% (€1.2M). Runway: 24 mesi to breakeven.",
        valuation_analysis: "DCF: €45M (10% discount rate). Revenue multiples: 8-12x (SaaS standard), €65-95M. Precedent transactions: IoT startups 6-15x revenue. Target valuation: €75M pre-money Series A.",
        burn_rate_runway: "Current burn: €180k/mese. Post-funding burn: €420k/mese (team scaling). Runway scenarios: Best case 32 mesi, Base case 24 mesi, Worst case 18 mesi. Cash management: conservative approach.",
        path_profitability: "Breakeven: Month 28 (gross revenue €2.1M/mese). Path: achieve 50 customers €40k ARR each. Margin expansion: 45% → 65% gross margin through scale economies. EBITDA positive Month 30.",
        financial_risks: "Customer concentration (top 3 = 55% revenue), Seasonality (Q4 budget cycles), Working capital (hardware procurement), Currency exposure (EU expansion).",
        pros: [
          "Financial projections conservative e achievable based on pipeline",
          "Capital efficiency elevata con path to profitability in 28 mesi",
          "Revenue quality alta con recurring component 75%"
        ],
        cons: [
          "Burn rate elevato durante scaling phase richiede execution perfetta",
          "Customer concentration risk significant con top customers",
          "Working capital requirements underestimated per hardware scaling"
        ],
        recommendations: [
          "Implementare customer diversification strategy (max 15% per customer)",
          "Secure credit facility €2M per working capital flexibility",
          "Monthly financial reporting con scenario planning updates"
        ]
      },
      technology_analysis: {
        score: 83,
        technical_feasibility: "ALTA: tecnologie mature (IoT sensors, edge computing, ML analytics). Architettura cloud-native scalabile. Proof of concept deployati in 3 cities con performance target raggiunti.",
        scalability_architecture: "Microservices architecture su AWS. Auto-scaling capabilities. Edge computing per latency optimization. Database: time-series (InfluxDB) + relational (PostgreSQL). Performance: 10M+ data points/giorno gestibili.",
        ip_portfolio: "3 brevetti pending: optimization algorithms, predictive maintenance, energy efficiency scoring. Freedom to operate analysis completed. Defensive strategy: trade secrets per ML models proprietari.",
        technology_moat: "MODERATO: algorithms proprietari + data advantage + integration complexity. Strengthening moat: ML model improvement con customer data, API ecosystem development.",
        development_roadmap: "Q1: Advanced analytics module. Q2: Mobile app launch. Q3: Marketplace beta. Q4: AI-powered recommendations. 2025: Predictive maintenance, Digital twin integration.",
        technical_risks: "Cybersecurity (critical infrastructure), Sensor hardware reliability, Cloud vendor lock-in, Data privacy compliance, Integration complexity legacy systems.",
        pros: [
          "Architettura tecnica robusta e scalabile modern cloud stack",
          "IP portfolio in development per protezione competitive advantage",
          "Technical team proven track record di delivery complex systems"
        ],
        cons: [
          "Dependency da third-party sensor hardware vendors",
          "Cybersecurity requirements elevati per critical infrastructure",
          "Technical debt accumulation risk durante rapid scaling"
        ],
        recommendations: [
          "Invest in cybersecurity certification (ISO 27001, SOC 2)",
          "Diversification sensor suppliers per supply chain resilience",
          "Technical roadmap review quarterly con architecture evolution"
        ]
      },
      product_analysis: {
        score: 79,
        product_market_fit: "STRONG signals: 3 pilot customers renewed + expanded. NPS score: 67. Customer retention: 95%. Product-market fit indicators: strong word-of-mouth, inbound leads growth 40% QoQ.",
        user_experience: "Dashboard intuitivo con 2 clicks per key insights. Mobile-responsive design. User feedback: 4.6/5 satisfaction. Onboarding time: ridotto da 2 settimane a 3 giorni. Self-service capabilities al 80%.",
        mvp_assessment: "MVP completo con core features. Customer feedback integration continua. Feature requests prioritized per ROI. MVP → Product fit achieved, scaling to platform strategy.",
        feature_roadmap: "Core features complete. Next: Advanced analytics (Q1), Predictive alerts (Q2), Integration marketplace (Q3), Mobile app (Q4). Roadmap driven da customer feedback e competitive analysis.",
        customer_validation: "Strong validation: 3 reference customers, 12 prospects in advanced talks, 2 LOIs signed. Customer interviews: clear ROI demonstrated (25-40% energy savings). Problem-solution fit confermato.",
        pros: [
          "Product-market fit strong con customer retention 95% e NPS 67",
          "User experience ottimizzata con feedback loop efficace",
          "Clear customer validation con ROI dimostrato"
        ],
        cons: [
          "Feature set ancora basic vs enterprise customer requirements",
          "Integration capabilities limitate con legacy systems",
          "Mobile experience da migliorare per field operations"
        ],
        recommendations: [
          "Prioritize enterprise features per large customer acquisition",
          "Develop integration marketplace per ecosystem expansion",
          "Invest in mobile UX per operational efficiency improvement"
        ]
      },
      risk_analysis: {
        score: 68,
        market_risks: [
          "Rallentamento economia EU e riduzione budget digitalization pubblici",
          "Cambiamenti regulatory privacy/cybersecurity con compliance costs aggiuntivi",
          "Competizione pricing pressure da tech giants con deep pockets"
        ],
        technical_risks: [
          "Cybersecurity breach su critical infrastructure con reputational damage",
          "Sensor hardware obsolescence rapida con necessità re-engineering",
          "Cloud vendor lock-in e potential service disruptions"
        ],
        financial_risks: [
          "Customer payment delays typical enti pubblici (60-120 giorni)",
          "Currency exposure EU expansion con potential EUR/USD volatility",
          "Working capital stress da growth acceleration e hardware procurement"
        ],
        team_risks: [
          "Key person dependency su founder per customer relationships",
          "Talent acquisition competitiva in IoT specialists market",
          "Cultural challenges scaling team da 15 a 50+ persone"
        ],
        competitive_risks: [
          "Strategic acquisition target per tech giants eliminando competition",
          "Patent litigation da incumbents per bloccare market development",
          "New entrants ben finanziati con offering simile"
        ],
        regulatory_risks: [
          "GDPR compliance complexity con data processing cross-border",
          "Cybersecurity regulations evolution per critical infrastructure",
          "Environmental regulations changes affecting customer priorities"
        ],
        operational_risks: [
          "Supply chain disruption hardware components critical",
          "Quality issues deployment large-scale con customer churn",
          "Scalability infrastructure challenges rapid customer growth"
        ],
        mitigation_strategies: [
          "Diversification strategy geografica e customer base per risk spreading",
          "Strategic insurance coverage cyber liability e professional indemnity",
          "Emergency fund 6 mesi operating expenses per economic downturns"
        ],
        risk_score_matrix: "RISCHIO COMPLESSIVO: MEDIO-ALTO. Principali fattori: market dependency, competitive pressure, execution risk scaling. Mitigazione possibile attraverso partnerships strategiche e customer diversification."
      },
      growth_strategy: {
        score: 76,
        customer_acquisition: "Channel strategy: Direct sales (60%), Partners (30%), Inbound marketing (10%). CAC optimization: €45k → €35k target through partner channel development. Sales cycle: 12-18 mesi, focus su shortening con POC approach.",
        scaling_strategy: "Geographic expansion: IT → DE/FR → EU. Vertical expansion: smart cities → industrial IoT → smart buildings. Team scaling: 15 → 50 persone in 18 mesi. Operations scalability: cloud-native architecture ready.",
        partnership_opportunities: "Strategic partnerships: System integrators (Accenture, Capgemini), Hardware vendors (Bosch, Schneider), Telco operators (TIM, Vodafone). Revenue sharing models 15-25%. Partner enablement program.",
        geographic_expansion: "Priority markets: Germania (large cities budget), Francia (smart city initiatives), Spagna (EU funds allocation). Market entry: local partnerships + regulatory compliance. Investment: €2M per country.",
        viral_coefficients: "Limited virality B2B model. Growth drivers: customer references, case studies, thought leadership. Word-of-mouth: 40% new leads from existing customers. Conference speaking, industry reports.",
        pros: [
          "Clear geographic expansion strategy con market prioritization",
          "Partnership pipeline development per CAC optimization",
          "Scalable growth model con proven unit economics"
        ],
        cons: [
          "Limited viral growth mechanisms nel B2B enterprise space",
          "Geographic expansion capital intensive con regulatory complexity",
          "Partnership development slow con long relationship building"
        ],
        recommendations: [
          "Accelerate partner program con dedicated partnership manager",
          "Content marketing strategy per thought leadership positioning",
          "Customer success program per reference generation e upselling"
        ]
      },
      investment_perspective: {
        investment_readiness: 85,
        funding_stage_assessment: "Serie A ready: traction dimostrata, product-market fit, team scaling needs. Timing ottimale: pre-accelerated growth phase. Round size appropriato €8-12M per 24 mesi runway.",
        valuation_range: "Target valuation €75M pre-money (10-12x ARR multiple). Valuation range €60-90M based on comparable transactions. Downside protection: liquidation preference, anti-dilution provisions.",
        investor_appeal: "ALTO appeal per: sustainability focus (ESG investing trend), B2B SaaS recurring model, experienced team, large addressable market. Target investors: Tier 1 VC con portfolio IoT/sustainability.",
        due_diligence_flags: [
          "Customer concentration risk (top 3 customers = 55% revenue)",
          "Competitive moat sustainability vs tech giants resources",
          "Team key person dependency e succession planning gaps"
        ],
        investor_recommendations: [
          "Target lead investor con expertise IoT/smart cities per strategic value-add",
          "Include strategic investor (corporate VC utility/tech company) per business development",
          "Maintain 15-20% equity pool per future hiring key executives"
        ],
        exit_scenarios: [
          "Strategic acquisition (5-7 anni): Siemens, Schneider Electric, IBM (€200-500M)",
          "IPO scenario (7-10 anni): public markets SaaS multiples 8-15x revenue",
          "Management buyout (alternativa): private equity backing per growth continuation"
        ]
      },
      detailed_roadmap: {
        immediate_actions: [
          {
            priority: "Critical",
            timeframe: "30 giorni",
            action: "Hiring VP Sales con experience public sector e procurement cycles",
            rationale: "Bottleneck principale per accelerare customer acquisition e shortening sales cycles",
            success_metrics: ["CV screening 50+ candidates", "3 finalist interviews", "Offer letter signed"],
            resources_needed: "€15k budget headhunter, €120k annual package VP Sales"
          },
          {
            priority: "High",
            timeframe: "60 giorni",
            action: "Implementazione cybersecurity certification ISO 27001 process",
            rationale: "Requirement essenziale per enterprise customers e competitive differentiation",
            success_metrics: ["Gap analysis completed", "Implementation roadmap", "Consultant engagement"],
            resources_needed: "€25k consulting fees, 200 ore internal team"
          }
        ],
        next_6_months: [
          {
            milestone: "Series A funding completion €10M",
            description: "Chiusura round Series A con lead investor tier 1 e strategic investor",
            success_metrics: ["Term sheet signed", "Due diligence completed", "Funding wired"],
            funding_required: "€150k transaction costs (legal, advisory)",
            risk_factors: ["Market downturn", "Due diligence issues", "Valuation expectations gap"]
          },
          {
            milestone: "Germania market entry con 5 pilot customers",
            description: "Expansion geografica Germania con partnerships locali e customer acquisition",
            success_metrics: ["Partnership signed", "3 LOIs German cities", "€300k ARR booked"],
            funding_required: "€800k (team hiring, marketing, travel)",
            risk_factors: ["Regulatory compliance", "Local competition", "Cultural adaptation"]
          }
        ],
        year_1_goals: [
          {
            objective: "€12M ARR con 120 customer cities",
            strategy: "Accelerated customer acquisition attraverso sales team scaling e partner channel",
            expected_outcome: "Market leadership position smart cities sustainability vertical",
            kpis: ["120 customers", "€100k average ARR", "95% retention rate", "NPS >70"],
            budget_allocation: "€4M sales/marketing, €3M R&D, €2M operations"
          },
          {
            objective: "Technology platform evolution con marketplace launch",
            strategy: "Platform strategy con third-party integrations e marketplace revenue stream",
            expected_outcome: "€2M additional revenue da marketplace commissions (15% target margin)",
            kpis: ["50 platform partners", "€2M marketplace GMV", "25 integrated applications"],
            budget_allocation: "€2M platform development, €1M partnership program"
          }
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

  const tabs = [
    { id: 'overview', label: 'Overview', icon: TrendingUp },
    { id: 'market', label: 'Mercato', icon: Target },
    { id: 'business', label: 'Business Model', icon: DollarSign },
    { id: 'team', label: 'Team', icon: Users },
    { id: 'financial', label: 'Financial', icon: TrendingUp },
    { id: 'risks', label: 'Rischi', icon: AlertCircle },
    { id: 'roadmap', label: 'Roadmap', icon: Clock }
  ]

  return (
    <div className="max-w-7xl mx-auto">
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

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="flex space-x-8 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-4 px-2 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            )
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="space-y-8">
        
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Executive Summary */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Executive Summary</h2>
              
              <div className="grid md:grid-cols-2 gap-8">
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

              <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-3">Raccomandazione di Investimento</h3>
                <p className="text-blue-800 text-sm leading-relaxed">{analysis.executive_summary.investment_recommendation}</p>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-4">
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

            {/* Quick Scores */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: 'Mercato', score: analysis.market_analysis.score, icon: Target },
                { label: 'Business Model', score: analysis.business_model_analysis.score, icon: DollarSign },
                { label: 'Team', score: analysis.team_analysis.score, icon: Users },
                { label: 'Financial', score: analysis.financial_analysis.score, icon: TrendingUp }
              ].map((item) => {
                const Icon = item.icon
                return (
                  <div key={item.label} className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Icon className="w-5 h-5 text-blue-600" />
                      </div>
                      <span className="font-medium text-gray-900">{item.label}</span>
                    </div>
                    <div className={`text-2xl font-bold ${getScoreColor(item.score).split(' ')[0]}`}>
                      {item.score}%
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Market Analysis Tab */}
        {activeTab === 'market' && (
          <div className="space-y-8">
            <div className="bg-white rounded-xl shadow-lg p-6">
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
                  <h3 className="font-semibold text-gray-900 mb-3">Porter's Five Forces</h3>
                  <p className="text-gray-700 text-sm leading-relaxed">{analysis.market_analysis.porter_five_forces}</p>
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
          </div>
        )}

        {/* Add other tabs similarly... */}
        {/* For brevity, showing structure for other tabs */}
        {activeTab === 'business' && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Business Model Analysis</h2>
            <p className="text-gray-600">Analisi dettagliata del modello di business con Business Model Canvas, Unit Economics e strategie di monetizzazione.</p>
          </div>
        )}

        {activeTab === 'team' && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Team Analysis</h2>
            <p className="text-gray-600">Valutazione completa del team, founder-market fit e competenze richieste.</p>
          </div>
        )}

        {activeTab === 'financial' && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Financial Analysis</h2>
            <p className="text-gray-600">Analisi finanziaria approfondita con proiezioni, valutazione e burn rate.</p>
          </div>
        )}

        {activeTab === 'risks' && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Risk Analysis</h2>
            <p className="text-gray-600">Assessment completo dei rischi e strategie di mitigazione.</p>
          </div>
        )}

        {activeTab === 'roadmap' && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Detailed Roadmap</h2>
            <p className="text-gray-600">Roadmap dettagliata con azioni immediate, obiettivi a 6 mesi e 1 anno.</p>
          </div>
        )}

      </div>

      {/* Action Buttons */}
      <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Prossime Azioni</h3>
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => router.push('/dashboard/new-idea')}
            className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
          >
            Analizza Nuova Idea
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