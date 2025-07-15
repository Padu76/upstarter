// Analizzatore professionale startup basato su metodi VC reali
export interface StartupAnalysisResult {
  overall_score: number
  valuation_range: {
    min: number
    max: number
    recommended: number
  }
  berkus_analysis: BerkusAnalysis
  scorecard_analysis: ScorecardAnalysis
  risk_factor_analysis: RiskFactorAnalysis
  market_analysis: MarketAnalysis
  competitive_analysis: CompetitiveAnalysis
  financial_analysis: FinancialAnalysis
  team_analysis: TeamAnalysis
  product_analysis: ProductAnalysis
  investment_readiness: InvestmentReadiness
  recommendations: string[]
  missing_areas: string[]
  next_steps: NextSteps
}

interface BerkusAnalysis {
  base_value: { score: number; max: 100000; reasoning: string }
  technology: { score: number; max: 100000; reasoning: string }
  execution: { score: number; max: 100000; reasoning: string }
  market_relationships: { score: number; max: 100000; reasoning: string }
  production_sales: { score: number; max: 100000; reasoning: string }
  total_valuation: number
}

interface ScorecardAnalysis {
  management_strength: { score: number; weight: 30; reasoning: string }
  market_size: { score: number; weight: 25; reasoning: string }
  product_technology: { score: number; weight: 15; reasoning: string }
  partnerships_marketing: { score: number; weight: 10; reasoning: string }
  competitive_environment: { score: number; weight: 10; reasoning: string }
  additional_investment_needs: { score: number; weight: 5; reasoning: string }
  others: { score: number; weight: 5; reasoning: string }
  weighted_score: number
}

interface RiskFactorAnalysis {
  management_risk: { level: 'low' | 'medium' | 'high'; impact: number; description: string }
  market_risk: { level: 'low' | 'medium' | 'high'; impact: number; description: string }
  technology_risk: { level: 'low' | 'medium' | 'high'; impact: number; description: string }
  competitive_risk: { level: 'low' | 'medium' | 'high'; impact: number; description: string }
  financial_risk: { level: 'low' | 'medium' | 'high'; impact: number; description: string }
  regulatory_risk: { level: 'low' | 'medium' | 'high'; impact: number; description: string }
  total_risk_adjustment: number
}

interface MarketAnalysis {
  tam_analysis: { size: number; confidence: number; reasoning: string }
  sam_analysis: { size: number; confidence: number; reasoning: string }
  som_analysis: { size: number; confidence: number; reasoning: string }
  market_growth: { rate: number; sustainability: number; reasoning: string }
  market_maturity: { stage: string; score: number; reasoning: string }
  customer_validation: { score: number; evidence: string[] }
}

interface CompetitiveAnalysis {
  competitive_position: { score: number; reasoning: string }
  differentiation: { score: number; unique_factors: string[] }
  barriers_to_entry: { score: number; barriers: string[] }
  competitive_advantages: { sustainable: boolean; advantages: string[] }
  threat_level: { score: number; threats: string[] }
}

interface FinancialAnalysis {
  revenue_model: { clarity: number; scalability: number; reasoning: string }
  unit_economics: { ltv_cac_ratio: number; payback_period: number; reasoning: string }
  financial_projections: { realism: number; growth_rate: number; reasoning: string }
  funding_requirements: { amount: number; runway: number; milestones: string[] }
  path_to_profitability: { timeline: number; probability: number; reasoning: string }
}

interface TeamAnalysis {
  founder_market_fit: { score: number; reasoning: string }
  team_completeness: { score: number; missing_roles: string[] }
  experience_relevance: { score: number; key_experiences: string[] }
  track_record: { score: number; previous_successes: string[] }
  advisors_board: { score: number; advisory_strength: string }
}

interface ProductAnalysis {
  product_market_fit: { score: number; evidence: string[] }
  development_stage: { stage: string; score: number; reasoning: string }
  ip_protection: { score: number; protections: string[] }
  scalability: { technical: number; business: number; reasoning: string }
  user_traction: { score: number; metrics: string[] }
}

interface InvestmentReadiness {
  pitch_deck_quality: { score: number; missing_elements: string[] }
  business_plan_completeness: { score: number; missing_sections: string[] }
  financial_model_quality: { score: number; improvements_needed: string[] }
  legal_structure: { score: number; issues: string[] }
  due_diligence_readiness: { score: number; missing_documents: string[] }
}

interface NextSteps {
  immediate_actions: { action: string; priority: 'high' | 'medium' | 'low'; timeline: string }[]
  pitch_preparation: { tasks: string[]; timeline: string }
  business_plan_completion: { tasks: string[]; timeline: string }
  investment_readiness: { tasks: string[]; timeline: string }
}

export class ProfessionalStartupAnalyzer {
  
  async analyzeStartup(title: string, content: string): Promise<StartupAnalysisResult> {
    console.log('🔍 Starting professional startup analysis...')
    
    // Analizza il contenuto per estrarre informazioni chiave
    const extractedData = this.extractKeyInformation(content)
    
    // Esegue tutte le analisi professionali
    const berkusAnalysis = this.performBerkusAnalysis(extractedData)
    const scorecardAnalysis = this.performScorecardAnalysis(extractedData)
    const riskFactorAnalysis = this.performRiskFactorAnalysis(extractedData)
    const marketAnalysis = this.performMarketAnalysis(extractedData)
    const competitiveAnalysis = this.performCompetitiveAnalysis(extractedData)
    const financialAnalysis = this.performFinancialAnalysis(extractedData)
    const teamAnalysis = this.performTeamAnalysis(extractedData)
    const productAnalysis = this.performProductAnalysis(extractedData)
    const investmentReadiness = this.assessInvestmentReadiness(extractedData)
    
    // Calcola score complessivo
    const overallScore = this.calculateOverallScore({
      berkus: berkusAnalysis.total_valuation,
      scorecard: scorecardAnalysis.weighted_score,
      market: marketAnalysis.som_analysis.confidence,
      team: teamAnalysis.founder_market_fit.score,
      product: productAnalysis.product_market_fit.score,
      financial: financialAnalysis.revenue_model.clarity
    })
    
    // Calcola range di valutazione
    const valuationRange = this.calculateValuationRange(berkusAnalysis, scorecardAnalysis, riskFactorAnalysis)
    
    // Genera raccomandazioni e next steps
    const recommendations = this.generateRecommendations(extractedData, overallScore)
    const missingAreas = this.identifyMissingAreas(extractedData)
    const nextSteps = this.generateNextSteps(overallScore, investmentReadiness)
    
    return {
      overall_score: overallScore,
      valuation_range: valuationRange,
      berkus_analysis: berkusAnalysis,
      scorecard_analysis: scorecardAnalysis,
      risk_factor_analysis: riskFactorAnalysis,
      market_analysis: marketAnalysis,
      competitive_analysis: competitiveAnalysis,
      financial_analysis: financialAnalysis,
      team_analysis: teamAnalysis,
      product_analysis: productAnalysis,
      investment_readiness: investmentReadiness,
      recommendations,
      missing_areas: missingAreas,
      next_steps: nextSteps
    }
  }
  
  private extractKeyInformation(content: string) {
    const contentLower = content.toLowerCase()
    
    // Estrae indicatori chiave dal contenuto
    const hasMarketAnalysis = this.checkForKeywords(contentLower, ['mercato', 'market', 'tam', 'sam', 'som', 'target'])
    const hasCompetitiveAnalysis = this.checkForKeywords(contentLower, ['competitor', 'concorrenza', 'competitivo', 'vantaggio'])
    const hasFinancialProjections = this.checkForKeywords(contentLower, ['ricavi', 'revenue', 'fatturato', 'proiezioni', 'budget'])
    const hasTeamInfo = this.checkForKeywords(contentLower, ['team', 'founder', 'fondatore', 'ceo', 'cto', 'esperienza'])
    const hasProductInfo = this.checkForKeywords(contentLower, ['prodotto', 'product', 'servizio', 'mvp', 'prototipo'])
    const hasBusinessModel = this.checkForKeywords(contentLower, ['business model', 'modello', 'monetizzazione', 'ricavi'])
    const hasTechnology = this.checkForKeywords(contentLower, ['tecnologia', 'technology', 'piattaforma', 'software', 'ai', 'ml'])
    const hasInvestmentInfo = this.checkForKeywords(contentLower, ['investimento', 'finanziamento', 'funding', 'capitale'])
    
    return {
      content,
      contentLength: content.length,
      hasMarketAnalysis,
      hasCompetitiveAnalysis,
      hasFinancialProjections,
      hasTeamInfo,
      hasProductInfo,
      hasBusinessModel,
      hasTechnology,
      hasInvestmentInfo,
      wordCount: content.split(/\s+/).length,
      sections: this.identifySections(content)
    }
  }
  
  private checkForKeywords(content: string, keywords: string[]): boolean {
    return keywords.some(keyword => content.includes(keyword))
  }
  
  private identifySections(content: string): string[] {
    const sections = []
    const lines = content.split('\n')
    
    for (const line of lines) {
      if (line.length > 0 && line.length < 100 && 
          (line.includes(':') || line.match(/^[A-Z][a-z]/))) {
        sections.push(line.trim())
      }
    }
    
    return sections.slice(0, 20) // Prende le prime 20 sezioni
  }
  
  private performBerkusAnalysis(data: any): BerkusAnalysis {
    // Metodo Berkus: 5 fattori da 0-100k EUR ciascuno
    
    const baseValue = {
      score: data.hasProductInfo ? (data.contentLength > 5000 ? 80000 : 50000) : 20000,
      max: 100000,
      reasoning: data.hasProductInfo ? 
        'Prodotto ben descritto con dettagli tecnici' : 
        'Informazioni sul prodotto limitate, necessario approfondimento'
    }
    
    const technology = {
      score: data.hasTechnology ? (data.sections.length > 10 ? 70000 : 45000) : 15000,
      max: 100000,
      reasoning: data.hasTechnology ? 
        'Stack tecnologico identificato, necessaria valutazione scalabilità' : 
        'Aspetti tecnologici poco chiari, servono specifiche dettagliate'
    }
    
    const execution = {
      score: data.hasTeamInfo ? (data.hasFinancialProjections ? 65000 : 40000) : 25000,
      max: 100000,
      reasoning: data.hasTeamInfo ? 
        'Team presente con esperienza, capacità esecutiva da validare' : 
        'Informazioni sul team insufficienti per valutare capacità esecutiva'
    }
    
    const marketRelationships = {
      score: data.hasMarketAnalysis ? (data.hasCompetitiveAnalysis ? 60000 : 35000) : 20000,
      max: 100000,
      reasoning: data.hasMarketAnalysis ? 
        'Comprensione del mercato dimostrata, partnership da sviluppare' : 
        'Analisi di mercato carente, relazioni strategiche non evidenti'
    }
    
    const productionSales = {
      score: data.hasInvestmentInfo ? (data.hasBusinessModel ? 55000 : 30000) : 15000,
      max: 100000,
      reasoning: data.hasBusinessModel ? 
        'Modello di business delineato, metriche di vendita da implementare' : 
        'Strategia di produzione e vendita non sufficientemente dettagliata'
    }
    
    return {
      base_value: baseValue,
      technology,
      execution,
      market_relationships: marketRelationships,
      production_sales: productionSales,
      total_valuation: baseValue.score + technology.score + execution.score + marketRelationships.score + productionSales.score
    }
  }
  
  private performScorecardAnalysis(data: any): ScorecardAnalysis {
    // Metodo Scorecard: fattori pesati per percentuale
    
    const managementStrength = {
      score: data.hasTeamInfo ? (data.wordCount > 3000 ? 85 : 65) : 40,
      weight: 30,
      reasoning: data.hasTeamInfo ? 
        'Management identificato, necessaria valutazione track record' : 
        'Informazioni sul management insufficienti'
    }
    
    const marketSize = {
      score: data.hasMarketAnalysis ? (data.sections.length > 8 ? 80 : 60) : 35,
      weight: 25,
      reasoning: data.hasMarketAnalysis ? 
        'Dimensioni di mercato accennate, necessaria quantificazione TAM/SAM/SOM' : 
        'Analisi dimensioni mercato mancante'
    }
    
    const productTechnology = {
      score: data.hasProductInfo ? (data.hasTechnology ? 75 : 55) : 30,
      weight: 15,
      reasoning: data.hasProductInfo ? 
        'Prodotto/tecnologia descritti, necessaria valutazione differenziazione' : 
        'Specifiche prodotto/tecnologia insufficienti'
    }
    
    const partnershipsMarketing = {
      score: data.hasBusinessModel ? 70 : 45,
      weight: 10,
      reasoning: data.hasBusinessModel ? 
        'Strategia commerciale accennata, partnership da definire' : 
        'Canali di marketing e partnership non chiari'
    }
    
    const competitiveEnvironment = {
      score: data.hasCompetitiveAnalysis ? 75 : 40,
      weight: 10,
      reasoning: data.hasCompetitiveAnalysis ? 
        'Ambiente competitivo analizzato, vantaggio competitivo da consolidare' : 
        'Analisi competitiva carente'
    }
    
    const additionalInvestmentNeeds = {
      score: data.hasInvestmentInfo ? 80 : 50,
      weight: 5,
      reasoning: data.hasInvestmentInfo ? 
        'Fabbisogni finanziari indicati, necessario business plan dettagliato' : 
        'Necessità di investimento non quantificate'
    }
    
    const others = {
      score: data.contentLength > 8000 ? 70 : 50,
      weight: 5,
      reasoning: data.contentLength > 8000 ? 
        'Documentazione completa, alcuni aspetti da approfondire' : 
        'Documentazione incompleta, necessari approfondimenti'
    }
    
    const weightedScore = Math.round(
      (managementStrength.score * managementStrength.weight +
       marketSize.score * marketSize.weight +
       productTechnology.score * productTechnology.weight +
       partnershipsMarketing.score * partnershipsMarketing.weight +
       competitiveEnvironment.score * competitiveEnvironment.weight +
       additionalInvestmentNeeds.score * additionalInvestmentNeeds.weight +
       others.score * others.weight) / 100
    )
    
    return {
      management_strength: managementStrength,
      market_size: marketSize,
      product_technology: productTechnology,
      partnerships_marketing: partnershipsMarketing,
      competitive_environment: competitiveEnvironment,
      additional_investment_needs: additionalInvestmentNeeds,
      others,
      weighted_score: weightedScore
    }
  }
  
  private performRiskFactorAnalysis(data: any): RiskFactorAnalysis {
    const managementRisk = {
      level: data.hasTeamInfo ? (data.wordCount > 5000 ? 'low' : 'medium') : 'high' as const,
      impact: data.hasTeamInfo ? (data.wordCount > 5000 ? 5 : -10) : -25,
      description: data.hasTeamInfo ? 
        'Team descritto ma necessaria valutazione competenze specifiche' : 
        'Informazioni sul team insufficienti, alto rischio esecutivo'
    }
    
    const marketRisk = {
      level: data.hasMarketAnalysis ? (data.hasCompetitiveAnalysis ? 'low' : 'medium') : 'high' as const,
      impact: data.hasMarketAnalysis ? (data.hasCompetitiveAnalysis ? 10 : -5) : -20,
      description: data.hasMarketAnalysis ? 
        'Mercato analizzato, necessaria validazione domanda' : 
        'Analisi di mercato carente, rischio di product-market fit'
    }
    
    const technologyRisk = {
      level: data.hasTechnology ? (data.hasProductInfo ? 'low' : 'medium') : 'high' as const,
      impact: data.hasTechnology ? (data.hasProductInfo ? 5 : -10) : -15,
      description: data.hasTechnology ? 
        'Tecnologia descritta, necessaria valutazione scalabilità' : 
        'Aspetti tecnologici poco chiari, rischio implementazione'
    }
    
    const competitiveRisk = {
      level: data.hasCompetitiveAnalysis ? 'medium' : 'high' as const,
      impact: data.hasCompetitiveAnalysis ? -5 : -15,
      description: data.hasCompetitiveAnalysis ? 
        'Concorrenza analizzata, necessario monitoraggio continuo' : 
        'Analisi competitiva insufficiente, rischio di essere superati'
    }
    
    const financialRisk = {
      level: data.hasFinancialProjections ? (data.hasBusinessModel ? 'medium' : 'high') : 'high' as const,
      impact: data.hasFinancialProjections ? (data.hasBusinessModel ? -5 : -15) : -20,
      description: data.hasFinancialProjections ? 
        'Proiezioni finanziarie presenti, necessaria validazione modello' : 
        'Piano finanziario carente, rischio di sostenibilità'
    }
    
    const regulatoryRisk = {
      level: 'medium' as const,
      impact: -5,
      description: 'Aspetti regolatori da valutare in base al settore di attività'
    }
    
    return {
      management_risk: managementRisk,
      market_risk: marketRisk,
      technology_risk: technologyRisk,
      competitive_risk: competitiveRisk,
      financial_risk: financialRisk,
      regulatory_risk: regulatoryRisk,
      total_risk_adjustment: managementRisk.impact + marketRisk.impact + technologyRisk.impact + competitiveRisk.impact + financialRisk.impact + regulatoryRisk.impact
    }
  }
  
  private performMarketAnalysis(data: any): MarketAnalysis {
    const tamAnalysis = {
      size: data.hasMarketAnalysis ? (data.wordCount > 4000 ? 1000000000 : 500000000) : 100000000,
      confidence: data.hasMarketAnalysis ? (data.sections.length > 10 ? 70 : 50) : 30,
      reasoning: data.hasMarketAnalysis ? 
        'Mercato totale identificato, necessaria quantificazione precisa con fonti' : 
        'Dimensioni del mercato totale da definire con ricerca strutturata'
    }
    
    const samAnalysis = {
      size: Math.round(tamAnalysis.size * 0.1),
      confidence: tamAnalysis.confidence - 10,
      reasoning: data.hasMarketAnalysis ? 
        'Mercato servibile stimato, necessaria segmentazione dettagliata' : 
        'Mercato servibile da definire in base a geografia e target'
    }
    
    const somAnalysis = {
      size: Math.round(samAnalysis.size * 0.05),
      confidence: samAnalysis.confidence - 10,
      reasoning: data.hasMarketAnalysis ? 
        'Mercato ottenibile stimato, necessaria validazione con go-to-market' : 
        'Mercato ottenibile da calcolare in base a capacità e strategia'
    }
    
    return {
      tam_analysis: tamAnalysis,
      sam_analysis: samAnalysis,
      som_analysis: somAnalysis,
      market_growth: {
        rate: data.hasMarketAnalysis ? 15 : 10,
        sustainability: data.hasMarketAnalysis ? 70 : 50,
        reasoning: 'Crescita di mercato da validare con dati di settore'
      },
      market_maturity: {
        stage: data.hasMarketAnalysis ? 'Growing' : 'Undefined',
        score: data.hasMarketAnalysis ? 65 : 40,
        reasoning: 'Maturità del mercato da analizzare in dettaglio'
      },
      customer_validation: {
        score: data.hasMarketAnalysis ? 55 : 30,
        evidence: data.hasMarketAnalysis ? ['Ricerca di mercato menzionata'] : ['Validazione cliente mancante']
      }
    }
  }
  
  private performCompetitiveAnalysis(data: any): CompetitiveAnalysis {
    return {
      competitive_position: {
        score: data.hasCompetitiveAnalysis ? 65 : 35,
        reasoning: data.hasCompetitiveAnalysis ? 
          'Posizionamento competitivo identificato, necessaria mappatura dettagliata' : 
          'Posizionamento competitivo da definire con analisi strutturata'
      },
      differentiation: {
        score: data.hasProductInfo ? (data.hasTechnology ? 70 : 50) : 35,
        unique_factors: data.hasProductInfo ? ['Caratteristiche prodotto innovative'] : ['Fattori differenzianti da identificare']
      },
      barriers_to_entry: {
        score: data.hasTechnology ? 60 : 40,
        barriers: data.hasTechnology ? ['Barriere tecnologiche'] : ['Barriere all\'ingresso da sviluppare']
      },
      competitive_advantages: {
        sustainable: data.hasCompetitiveAnalysis && data.hasTechnology,
        advantages: data.hasCompetitiveAnalysis ? ['Vantaggio competitivo identificato'] : ['Vantaggi competitivi da consolidare']
      },
      threat_level: {
        score: data.hasCompetitiveAnalysis ? 60 : 40,
        threats: ['Nuovi entranti', 'Tecnologie disruptive', 'Cambiamenti regolatori']
      }
    }
  }
  
  private performFinancialAnalysis(data: any): FinancialAnalysis {
    return {
      revenue_model: {
        clarity: data.hasBusinessModel ? (data.hasFinancialProjections ? 75 : 55) : 35,
        scalability: data.hasBusinessModel ? 65 : 40,
        reasoning: data.hasBusinessModel ? 
          'Modello di ricavi identificato, necessaria quantificazione unit economics' : 
          'Modello di ricavi da definire con chiarezza'
      },
      unit_economics: {
        ltv_cac_ratio: data.hasFinancialProjections ? 3.5 : 2.0,
        payback_period: data.hasFinancialProjections ? 12 : 18,
        reasoning: data.hasFinancialProjections ? 
          'Metriche economiche stimate, necessaria validazione' : 
          'Unit economics da calcolare con precisione'
      },
      financial_projections: {
        realism: data.hasFinancialProjections ? 65 : 30,
        growth_rate: data.hasFinancialProjections ? 150 : 100,
        reasoning: data.hasFinancialProjections ? 
          'Proiezioni finanziarie presenti, necessaria validazione ipotesi' : 
          'Proiezioni finanziarie da sviluppare con modello dettagliato'
      },
      funding_requirements: {
        amount: data.hasInvestmentInfo ? 500000 : 300000,
        runway: data.hasInvestmentInfo ? 18 : 12,
        milestones: data.hasInvestmentInfo ? ['Milestone identificate'] : ['Milestone da definire']
      },
      path_to_profitability: {
        timeline: data.hasFinancialProjections ? 24 : 36,
        probability: data.hasFinancialProjections ? 65 : 45,
        reasoning: data.hasFinancialProjections ? 
          'Percorso verso profittabilità delineato' : 
          'Percorso verso profittabilità da pianificare'
      }
    }
  }
  
  private performTeamAnalysis(data: any): TeamAnalysis {
    return {
      founder_market_fit: {
        score: data.hasTeamInfo ? (data.hasMarketAnalysis ? 70 : 55) : 35,
        reasoning: data.hasTeamInfo ? 
          'Team identificato, necessaria valutazione esperienza settoriale' : 
          'Informazioni sul team insufficienti per valutare fit'
      },
      team_completeness: {
        score: data.hasTeamInfo ? 60 : 30,
        missing_roles: data.hasTeamInfo ? ['Ruoli specialistici'] : ['CEO', 'CTO', 'CMO', 'Head of Sales']
      },
      experience_relevance: {
        score: data.hasTeamInfo ? 65 : 35,
        key_experiences: data.hasTeamInfo ? ['Esperienza settoriale'] : ['Esperienza da documentare']
      },
      track_record: {
        score: data.hasTeamInfo ? 55 : 30,
        previous_successes: data.hasTeamInfo ? ['Successi precedenti accennati'] : ['Track record da dimostrare']
      },
      advisors_board: {
        score: data.hasTeamInfo ? 50 : 25,
        advisory_strength: data.hasTeamInfo ? 
          'Advisory board da sviluppare' : 
          'Advisory board non presente'
      }
    }
  }
  
  private performProductAnalysis(data: any): ProductAnalysis {
    return {
      product_market_fit: {
        score: data.hasProductInfo ? (data.hasMarketAnalysis ? 65 : 45) : 30,
        evidence: data.hasProductInfo ? ['Prodotto descritto'] : ['Evidenze PMF mancanti']
      },
      development_stage: {
        stage: data.hasProductInfo ? (data.hasTechnology ? 'Prototype' : 'Concept') : 'Idea',
        score: data.hasProductInfo ? (data.hasTechnology ? 60 : 40) : 20,
        reasoning: data.hasProductInfo ? 
          'Stadio di sviluppo identificato' : 
          'Stadio di sviluppo da definire'
      },
      ip_protection: {
        score: data.hasTechnology ? 50 : 25,
        protections: data.hasTechnology ? ['IP da proteggere'] : ['Strategia IP mancante']
      },
      scalability: {
        technical: data.hasTechnology ? 65 : 40,
        business: data.hasBusinessModel ? 70 : 45,
        reasoning: data.hasTechnology ? 
          'Scalabilità tecnica identificata' : 
          'Scalabilità da valutare'
      },
      user_traction: {
        score: data.hasProductInfo ? 45 : 25,
        metrics: data.hasProductInfo ? ['Trazione utenti da misurare'] : ['Trazione utenti mancante']
      }
    }
  }
  
  private assessInvestmentReadiness(data: any): InvestmentReadiness {
    return {
      pitch_deck_quality: {
        score: data.contentLength > 5000 ? 65 : 40,
        missing_elements: ['Executive Summary', 'Market Size', 'Financial Projections', 'Team']
      },
      business_plan_completeness: {
        score: data.wordCount > 3000 ? 70 : 45,
        missing_sections: ['Market Analysis', 'Competitive Analysis', 'Financial Model', 'Risk Analysis']
      },
      financial_model_quality: {
        score: data.hasFinancialProjections ? 60 : 30,
        improvements_needed: ['Unit Economics', 'Cash Flow', 'Scenario Analysis']
      },
      legal_structure: {
        score: 50,
        issues: ['Corporate Structure', 'IP Protection', 'Compliance']
      },
      due_diligence_readiness: {
        score: 45,
        missing_documents: ['Financial Statements', 'Legal Documents', 'IP Portfolio', 'Customer Contracts']
      }
    }
  }
  
  private calculateOverallScore(scores: any): number {
    const weights = {
      market: 0.25,
      team: 0.20,
      product: 0.20,
      financial: 0.15,
      berkus: 0.10,
      scorecard: 0.10
    }
    
    const normalizedScores = {
      market: Math.min(scores.market, 100),
      team: Math.min(scores.team, 100),
      product: Math.min(scores.product, 100),
      financial: Math.min(scores.financial, 100),
      berkus: Math.min((scores.berkus / 500000) * 100, 100),
      scorecard: Math.min(scores.scorecard, 100)
    }
    
    return Math.round(
      normalizedScores.market * weights.market +
      normalizedScores.team * weights.team +
      normalizedScores.product * weights.product +
      normalizedScores.financial * weights.financial +
      normalizedScores.berkus * weights.berkus +
      normalizedScores.scorecard * weights.scorecard
    )
  }
  
  private calculateValuationRange(berkus: BerkusAnalysis, scorecard: ScorecardAnalysis, risk: RiskFactorAnalysis) {
    const baseValuation = (berkus.total_valuation + (scorecard.weighted_score * 10000)) / 2
    const riskAdjustment = 1 + (risk.total_risk_adjustment / 100)
    
    return {
      min: Math.round(baseValuation * 0.7 * riskAdjustment),
      max: Math.round(baseValuation * 1.3 * riskAdjustment),
      recommended: Math.round(baseValuation * riskAdjustment)
    }
  }
  
  private generateRecommendations(data: any, overallScore: number): string[] {
    const recommendations = []
    
    if (!data.hasMarketAnalysis) {
      recommendations.push('Condurre ricerca di mercato dettagliata con quantificazione TAM/SAM/SOM')
    }
    
    if (!data.hasCompetitiveAnalysis) {
      recommendations.push('Sviluppare analisi competitiva strutturata con mappatura competitor')
    }
    
    if (!data.hasFinancialProjections) {
      recommendations.push('Creare modello finanziario con proiezioni 3-5 anni e unit economics')
    }
    
    if (!data.hasTeamInfo) {
      recommendations.push('Completare team con competenze complementari e advisory board')
    }
    
    if (!data.hasBusinessModel) {
      recommendations.push('Definire chiaramente modello di business e revenue streams')
    }
    
    if (overallScore < 60) {
      recommendations.push('Sviluppare MVP e validare product-market fit con clienti target')
    }
    
    recommendations.push('Preparare pitch deck investor-ready con story compelling')
    recommendations.push('Implementare sistema di metriche e KPI per monitoraggio performance')
    
    return recommendations
  }
  
  private identifyMissingAreas(data: any): string[] {
    const missing = []
    
    if (!data.hasMarketAnalysis) missing.push('Analisi di mercato quantitativa')
    if (!data.hasCompetitiveAnalysis) missing.push('Analisi competitiva strutturata')
    if (!data.hasFinancialProjections) missing.push('Proiezioni finanziarie dettagliate')
    if (!data.hasTeamInfo) missing.push('Informazioni complete sul team')
    if (!data.hasBusinessModel) missing.push('Modello di business definito')
    if (!data.hasTechnology) missing.push('Specifiche tecniche dettagliate')
    if (!data.hasProductInfo) missing.push('Descrizione prodotto/servizio completa')
    if (!data.hasInvestmentInfo) missing.push('Piano di investimento e utilizzo fondi')
    
    return missing
  }
  
  private generateNextSteps(overallScore: number, investmentReadiness: InvestmentReadiness): NextSteps {
    const immediateActions = []
    
    if (overallScore < 50) {
      immediateActions.push({
        action: 'Completare business plan con sezioni mancanti',
        priority: 'high' as const,
        timeline: '2-4 settimane'
      })
    }
    
    if (investmentReadiness.pitch_deck_quality.score < 70) {
      immediateActions.push({
        action: 'Creare pitch deck professionale',
        priority: 'high' as const,
        timeline: '1-2 settimane'
      })
    }
    
    immediateActions.push({
      action: 'Validare product-market fit con clienti target',
      priority: 'medium' as const,
      timeline: '4-6 settimane'
    })
    
    return {
      immediate_actions: immediateActions,
      pitch_preparation: {
        tasks: ['Sviluppare story compelling', 'Preparare demo prodotto', 'Praticare presentazione'],
        timeline: '2-3 settimane'
      },
      business_plan_completion: {
        tasks: ['Completare ricerca mercato', 'Finalizzare proiezioni finanziarie', 'Definire go-to-market'],
        timeline: '4-6 settimane'
      },
      investment_readiness: {
        tasks: ['Preparare due diligence materiali', 'Strutturare round di finanziamento', 'Identificare investitori target'],
        timeline: '6-8 settimane'
      }
    }
  }
}