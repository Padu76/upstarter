import { IdeaAnalysisInput } from './claude'

interface ProfessionalAnalysis {
  overall_score: number
  executive_summary: {
    key_insights: string[]
    main_concerns: string[]
    investment_recommendation: string
    berkus_score: number
    scorecard_score: number
  }
  market_analysis: {
    score: number
    tam_sam_som_analysis: string
    porter_five_forces: string
    competitive_landscape: string
    market_segmentation: string
    market_timing: string
    barriers_entry: string
    pros: string[]
    cons: string[]
    recommendations: string[]
  }
  business_model_analysis: {
    score: number
    business_model_canvas: string
    unit_economics: string
    revenue_model_analysis: string
    scalability_assessment: string
    pricing_strategy: string
    pros: string[]
    cons: string[]
    recommendations: string[]
  }
  competitive_analysis: {
    score: number
    competitive_positioning: string
    differentiation_strength: string
    barriers_to_entry: string
    competitive_threats: string
    moat_analysis: string
    pros: string[]
    cons: string[]
    recommendations: string[]
  }
  team_analysis: {
    score: number
    founder_market_fit: string
    team_composition: string
    experience_assessment: string
    execution_capability: string
    missing_competencies: string[]
    advisory_board: string
    pros: string[]
    cons: string[]
    recommendations: string[]
  }
  financial_analysis: {
    score: number
    financial_projections: string
    funding_analysis: string
    valuation_analysis: string
    burn_rate_runway: string
    path_profitability: string
    financial_risks: string
    pros: string[]
    cons: string[]
    recommendations: string[]
  }
  technology_analysis: {
    score: number
    technical_feasibility: string
    scalability_architecture: string
    ip_portfolio: string
    technology_moat: string
    development_roadmap: string
    technical_risks: string
    pros: string[]
    cons: string[]
    recommendations: string[]
  }
  product_analysis: {
    score: number
    product_market_fit: string
    user_experience: string
    mvp_assessment: string
    feature_roadmap: string
    customer_validation: string
    pros: string[]
    cons: string[]
    recommendations: string[]
  }
  risk_analysis: {
    score: number
    market_risks: string[]
    technical_risks: string[]
    financial_risks: string[]
    team_risks: string[]
    competitive_risks: string[]
    regulatory_risks: string[]
    operational_risks: string[]
    mitigation_strategies: string[]
    risk_score_matrix: string
  }
  growth_strategy: {
    score: number
    customer_acquisition: string
    scaling_strategy: string
    partnership_opportunities: string
    geographic_expansion: string
    viral_coefficients: string
    pros: string[]
    cons: string[]
    recommendations: string[]
  }
  investment_perspective: {
    investment_readiness: number
    funding_stage_assessment: string
    valuation_range: string
    investor_appeal: string
    due_diligence_flags: string[]
    investor_recommendations: string[]
    exit_scenarios: string[]
  }
  detailed_roadmap: {
    immediate_actions: Array<{
      priority: 'Critical' | 'High' | 'Medium' | 'Low'
      timeframe: string
      action: string
      rationale: string
      success_metrics: string[]
      resources_needed: string
    }>
    next_6_months: Array<{
      milestone: string
      description: string
      success_metrics: string[]
      funding_required: string
      risk_factors: string[]
    }>
    year_1_goals: Array<{
      objective: string
      strategy: string
      expected_outcome: string
      kpis: string[]
      budget_allocation: string
    }>
  }
}

export async function analyzeProfessionalStartup(idea: IdeaAnalysisInput): Promise<ProfessionalAnalysis> {
  try {
    const anthropic = require('@anthropic-ai/sdk')
    const client = new anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY
    })

    const prompt = `
Sei un consulente senior specializzato in startup e venture capital con 15+ anni di esperienza presso top tier VC firms. 
Analizza questa startup seguendo le metodologie professionali di valutazione (Berkus Method, Scorecard Method, Risk Factor Summation).

USA I SEGUENTI FRAMEWORK DI ANALISI PROFESSIONALE:

1. ANALISI DI MERCATO COMPLETA:
   - Dimensioni TAM/SAM/SOM con calcoli specifici
   - Analisi competitiva dettagliata (Porter's Five Forces)
   - Segmentazione e positioning
   - Market timing e trend analysis
   - Barriere all'entrata e switching costs

2. BUSINESS MODEL CANVAS ANALYSIS:
   - Value Proposition dettagliata
   - Customer Segments e personas
   - Customer Relationships e retention
   - Channels e go-to-market strategy
   - Revenue Streams e pricing power
   - Key Resources e Assets
   - Key Activities e core processes
   - Key Partnerships strategiche
   - Cost Structure e unit economics

3. ANALISI FINANZIARIA AVANZATA:
   - LTV/CAC analysis con payback period
   - Unit economics e contribution margins
   - Burn rate e runway analysis
   - Revenue projections con scenario planning
   - Path to profitability con milestones
   - Valuation usando metodi multipli

4. TECHNOLOGY & IP ASSESSMENT:
   - Technical feasibility e architecture
   - Scalability tecnica e performance
   - IP portfolio e freedom to operate
   - Technology moat e defensibility

5. RISK ASSESSMENT MATRIX:
   - Market risks (timing, adoption, competition)
   - Technology risks (execution, scalability)
   - Team risks (key person, experience)
   - Financial risks (funding, burn, revenue)
   - Regulatory e compliance risks

INFORMAZIONI STARTUP:
Titolo: ${idea.title}
Descrizione: ${idea.description}

DETTAGLI BUSINESS:
- Mercato Target: ${idea.questionnaire.target_market}
- Value Proposition: ${idea.questionnaire.value_proposition}
- Business Model: ${idea.questionnaire.business_model}
- Vantaggio Competitivo: ${idea.questionnaire.competitive_advantage}
- Esperienza Team: ${idea.questionnaire.team_experience}
- Finanziamenti Richiesti: ${idea.questionnaire.funding_needed}
- Timeline: ${idea.questionnaire.timeline}
- Sfide Principali: ${idea.questionnaire.main_challenges}

Fornisci un'analisi ESTREMAMENTE DETTAGLIATA e PROFESSIONALE in formato JSON seguendo ESATTAMENTE questa struttura:

{
  "overall_score": [punteggio 0-100],
  "executive_summary": {
    "key_insights": ["insight chiave 1", "insight chiave 2", "insight chiave 3"],
    "main_concerns": ["preoccupazione 1", "preoccupazione 2", "preoccupazione 3"],
    "investment_recommendation": "raccomandazione di investimento dettagliata"
  },
  "market_analysis": {
    "score": [punteggio 0-100],
    "tam_sam_som_analysis": "Calcola TAM (Total Addressable Market), SAM (Serviceable Addressable Market), SOM (Serviceable Obtainable Market) con stime numeriche specifiche in EUR/USD",
    "porter_five_forces": "Analisi completa delle 5 forze di Porter: potere contrattuale fornitori/clienti, minaccia nuovi entranti/prodotti sostitutivi, intensità rivalità competitiva",
    "competitive_landscape": "Mappa competitiva dettagliata: direct/indirect competitors, market share, positioning matrix, SWOT dei principali player",
    "market_segmentation": "Segmentazione dettagliata: early adopters, mainstream market, chasm analysis, personas specifiche con demographics/psychographics",
    "market_timing": "Market timing analysis: technology adoption curve, market maturity, catalysts, macro trends (regulatory, economic, social)",
    "barriers_entry": "Barriere all'entrata quantificate: capital requirements, network effects, switching costs, regulatory barriers, brand loyalty",
    "pros": ["pro specifico con rationale", "pro specifico con rationale", "pro specifico con rationale"],
    "cons": ["contro specifico con rationale", "contro specifico con rationale", "contro specifico con rationale"],
    "recommendations": ["raccomandazione actionable 1", "raccomandazione actionable 2", "raccomandazione actionable 3"]
  },
  "business_model_analysis": {
    "score": [punteggio 0-100],
    "business_model_canvas": "Analisi completa Business Model Canvas: Value Propositions, Customer Segments, Channels, Customer Relationships, Revenue Streams, Key Resources, Key Activities, Key Partnerships, Cost Structure",
    "unit_economics": "Calcoli dettagliati: LTV (Lifetime Value), CAC (Customer Acquisition Cost), LTV/CAC ratio, payback period, contribution margin, churn rate",
    "revenue_model_analysis": "Analisi revenue streams: recurring vs one-time, predictability, pricing power, monetization timeline, revenue mix optimization",
    "scalability_assessment": "Valutazione scalabilità: network effects, economies of scale, operational leverage, marginal cost structure, platform vs linear business",
    "pricing_strategy": "Analisi pricing: value-based vs cost-based pricing, price elasticity, competitive pricing, freemium/premium models, pricing experiments",
    "pros": ["pro quantificato con metrics", "pro quantificato con metrics", "pro quantificato con metrics"],
    "cons": ["contro con impact assessment", "contro con impact assessment", "contro con impact assessment"],
    "recommendations": ["raccomandazione con ROI/impact", "raccomandazione con ROI/impact", "raccomandazione con ROI/impact"]
  },
  "competitive_analysis": {
    "score": [punteggio 0-100],
    "competitive_positioning": "analisi del posizionamento competitivo, differenziazione, moat",
    "differentiation_strength": "valutazione della forza della differenziazione, unicità value prop",
    "barriers_to_entry": "analisi delle barriere all'ingresso, protezione IP, switching costs",
    "competitive_threats": "identificazione e valutazione delle minacce competitive",
    "pros": ["pro specifico 1", "pro specifico 2", "pro specifico 3"],
    "cons": ["contro specifico 1", "contro specifico 2", "contro specifico 3"],
    "recommendations": ["raccomandazione dettagliata 1", "raccomandazione dettagliata 2", "raccomandazione dettagliata 3"]
  },
  "team_analysis": {
    "score": [punteggio 0-100],
    "founder_market_fit": "analisi del founder-market fit, domain expertise, background relevante",
    "team_composition": "valutazione della composizione del team, complementarità skills",
    "experience_assessment": "assessment dell'esperienza del team, track record, successi precedenti",
    "execution_capability": "valutazione della capacità di esecuzione, leadership, vision",
    "missing_competencies": ["competenza mancante 1", "competenza mancante 2", "competenza mancante 3"],
    "pros": ["pro specifico 1", "pro specifico 2", "pro specifico 3"],
    "cons": ["contro specifico 1", "contro specifico 2", "contro specifico 3"],
    "recommendations": ["raccomandazione dettagliata 1", "raccomandazione dettagliata 2", "raccomandazione dettagliata 3"]
  },
  "financial_analysis": {
    "score": [punteggio 0-100],
    "financial_projections": "Proiezioni dettagliate 3-5 anni: revenue breakdown per segment, OPEX/CAPEX structure, EBITDA progression, cash flow analysis",
    "funding_analysis": "Analisi finanziamento: funding requirements per milestone, use of funds dettagliato, dilution analysis, funding strategy per stage",
    "valuation_analysis": "Valutazione multi-method: DCF analysis, comparable multiples (EV/Revenue, P/E), precedent transactions, risk-adjusted NPV",
    "burn_rate_runway": "Burn rate analysis: monthly burn, runway calculation, scenario planning (best/base/worst case), cash management strategy",
    "path_profitability": "Path to profitability: breakeven analysis, unit economics at scale, margin expansion drivers, profitability milestones",
    "financial_risks": "Risk assessment: working capital requirements, seasonality, customer concentration, forex exposure",
    "pros": ["strength finanziario con numeri", "strength finanziario con numeri", "strength finanziario con numeri"],
    "cons": ["weakness finanziario quantificato", "weakness finanziario quantificato", "weakness finanziario quantificato"],
    "recommendations": ["azione finanziaria specifica", "azione finanziaria specifica", "azione finanziaria specifica"]
  },
  "product_analysis": {
    "score": [punteggio 0-100],
    "product_market_fit": "valutazione del product-market fit, validation signals, user feedback",
    "technical_feasibility": "assessment della fattibilità tecnica, complessità, rischi tecnologici",
    "mvp_assessment": "valutazione dello stato MVP, feature set, user experience",
    "development_roadmap": "analisi della roadmap di sviluppo, priorità, resource allocation",
    "user_experience": "valutazione dell'user experience, usability, design thinking",
    "pros": ["pro specifico 1", "pro specifico 2", "pro specifico 3"],
    "cons": ["contro specifico 1", "contro specifico 2", "contro specifico 3"],
    "recommendations": ["raccomandazione dettagliata 1", "raccomandazione dettagliata 2", "raccomandazione dettagliata 3"]
  },
  "risk_analysis": {
    "score": [punteggio 0-100],
    "market_risks": ["rischio mercato 1", "rischio mercato 2", "rischio mercato 3"],
    "technical_risks": ["rischio tecnico 1", "rischio tecnico 2", "rischio tecnico 3"],
    "financial_risks": ["rischio finanziario 1", "rischio finanziario 2", "rischio finanziario 3"],
    "team_risks": ["rischio team 1", "rischio team 2", "rischio team 3"],
    "competitive_risks": ["rischio competitivo 1", "rischio competitivo 2", "rischio competitivo 3"],
    "regulatory_risks": ["rischio regolamentare 1", "rischio regolamentare 2", "rischio regolamentare 3"],
    "mitigation_strategies": ["strategia di mitigazione dettagliata 1", "strategia di mitigazione dettagliata 2", "strategia di mitigazione dettagliata 3"]
  },
  "growth_strategy": {
    "score": [punteggio 0-100],
    "customer_acquisition": "analisi dettagliata della strategia di customer acquisition, channels, CAC optimization",
    "scaling_strategy": "valutazione della strategia di scaling, operational scalability, systems",
    "partnership_opportunities": "identificazione e valutazione delle opportunità di partnership strategiche",
    "geographic_expansion": "analisi delle opportunità di espansione geografica, priorità mercati",
    "pros": ["pro specifico 1", "pro specifico 2", "pro specifico 3"],
    "cons": ["contro specifico 1", "contro specifico 2", "contro specifico 3"],
    "recommendations": ["raccomandazione dettagliata 1", "raccomandazione dettagliata 2", "raccomandazione dettagliata 3"]
  },
  "investment_perspective": {
    "investment_readiness": [punteggio 0-100],
    "funding_stage_assessment": "assessment dello stage di funding appropriato, readiness per round",
    "valuation_considerations": "considerazioni sulla valutazione, multiples, comparable analysis",
    "investor_appeal": "valutazione dell'appeal per investitori, fit con thesis, risk-return profile",
    "due_diligence_flags": ["red flag 1", "red flag 2", "red flag 3"],
    "investor_recommendations": ["raccomandazione per investitori 1", "raccomandazione per investitori 2", "raccomandazione per investitori 3"]
  },
  "detailed_roadmap": {
    "immediate_actions": [
      {
        "priority": "High",
        "timeframe": "timeframe specifico",
        "action": "azione specifica dettagliata",
        "rationale": "rationale dell'azione"
      }
    ],
    "next_6_months": [
      {
        "milestone": "milestone specifico",
        "description": "descrizione dettagliata",
        "success_metrics": ["metrica 1", "metrica 2", "metrica 3"]
      }
    ],
    "year_1_goals": [
      {
        "objective": "obiettivo specifico",
        "strategy": "strategia dettagliata",
        "expected_outcome": "outcome atteso"
      }
    ]
  }
}

IMPORTANTE:
- Sii ESTREMAMENTE dettagliato e specifico in ogni analisi
- Fornisci insights actionable e data-driven quando possibile
- Considera benchmark di settore e best practices
- Bilancia ottimismo e realismo
- Includi considerazioni di mercato macro/micro
- Pensa come un investitore esperto che valuta il deal
- Rispondi SOLO con il JSON valido, nessun testo aggiuntivo
`

    const message = await client.messages.create({
      model: 'claude-3-sonnet-20240229',
      max_tokens: 4000,
      messages: [{ role: 'user', content: prompt }]
    })

    const responseText = message.content[0].type === 'text' ? message.content[0].text : ''
    
    try {
      const analysis = JSON.parse(responseText) as ProfessionalAnalysis
      return analysis
    } catch (parseError) {
      console.error('Errore parsing analisi professionale:', parseError)
      throw new Error('Errore nel parsing della risposta di analisi')
    }

  } catch (error) {
    console.error('Errore analisi professionale:', error)
    throw new Error('Errore durante l\'analisi professionale della startup')
  }
}

export type { ProfessionalAnalysis }