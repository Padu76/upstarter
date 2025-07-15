// Analizzatore professionale startup - Versione semplificata
export interface StartupAnalysisResult {
  overall_score: number
  valuation_range: {
    min: number
    max: number
    recommended: number
  }
  berkus_analysis: any
  scorecard_analysis: any
  risk_factor_analysis: any
  market_analysis: any
  competitive_analysis: any
  financial_analysis: any
  team_analysis: any
  product_analysis: any
  investment_readiness: any
  recommendations: string[]
  missing_areas: string[]
  next_steps: any
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
    
    return sections.slice(0, 20)
  }
  
  private performBerkusAnalysis(data: any): any {
    const baseValue = {
      score: data.hasProductInfo ? (data.contentLength > 5000 ? 80000 : 50000) : 20000,
      max: 100000,
      reasoning: data.hasProductInfo ? 
        'Prodotto ben descritto con dettagli tecnici, necessaria validazione mercato' : 
        'Informazioni sul prodotto limitate, necessario approfondimento significativo'
    }
    
    const technology = {
      score: data.hasTechnology ? (data.sections.length > 10 ? 70000 : 45000) : 15000,
      max: 100000,
      reasoning: data.hasTechnology ? 
        'Stack tecnologico identificato, necessaria valutazione scalabilità e IP protection' : 
        'Aspetti tecnologici poco chiari, servono specifiche tecniche dettagliate'
    }
    
    const execution = {
      score: data.hasTeamInfo ? (data.hasFinancialProjections ? 65000 : 40000) : 25000,
      max: 100000,
      reasoning: data.hasTeamInfo ? 
        'Team presente con esperienza, capacità esecutiva da validare con track record' : 
        'Informazioni sul team insufficienti per valutare capacità di esecuzione'
    }
    
    const marketRelationships = {
      score: data.hasMarketAnalysis ? (data.hasCompetitiveAnalysis ? 60000 : 35000) : 20000,
      max: 100000,
      reasoning: data.hasMarketAnalysis ? 
        'Comprensione del mercato dimostrata, partnership strategiche da sviluppare' : 
        'Analisi di mercato carente, relazioni strategiche e canali non evidenti'
    }
    
    const productionSales = {
      score: data.hasInvestmentInfo ? (data.hasBusinessModel ? 55000 : 30000) : 15000,
      max: 100000,
      reasoning: data.hasBusinessModel ? 
        'Modello di business delineato, metriche di vendita e produzione da implementare' : 
        'Strategia di produzione e vendita non sufficientemente dettagliata'
    }
    
    return {
      base_value: baseValue,
      technology,
      execution,
      market_relationships: marketRelationships,
      production_sales: productionSales,
      total_valuation: baseValue.score + technology.score + execution.score + marketRelationships.score + productionSales.score,
      summary: `Valutazione Berkus: ${Math.round((baseValue.score + technology.score + execution.score + marketRelationships.score + productionSales.score) / 1000)}K EUR`
    }
  }
  
  private performScorecardAnalysis(data: any): any {
    const managementStrength = {
      score: data.hasTeamInfo ? (data.wordCount > 3000 ? 85 : 65) : 40,
      weight: 30,
      reasoning: data.hasTeamInfo ? 
        'Management identificato, necessaria valutazione track record e competenze settoriali' : 
        'Informazioni sul management insufficienti per valutazione approfondita'
    }
    
    const marketSize = {
      score: data.hasMarketAnalysis ? (data.sections.length > 8 ? 80 : 60) : 35,
      weight: 25,
      reasoning: data.hasMarketAnalysis ? 
        'Dimensioni di mercato accennate, necessaria quantificazione TAM/SAM/SOM con fonti' : 
        'Analisi dimensioni mercato completamente mancante'
    }
    
    const productTechnology = {
      score: data.hasProductInfo ? (data.hasTechnology ? 75 : 55) : 30,
      weight: 15,
      reasoning: data.hasProductInfo ? 
        'Prodotto/tecnologia descritti, necessaria valutazione differenziazione competitiva' : 
        'Specifiche prodotto/tecnologia insufficienti per valutazione'
    }
    
    const partnershipsMarketing = {
      score: data.hasBusinessModel ? 70 : 45,
      weight: 10,
      reasoning: data.hasBusinessModel ? 
        'Strategia commerciale accennata, partnership strategiche da definire' : 
        'Canali di marketing, vendita e partnership strategiche non chiari'
    }
    
    const competitiveEnvironment = {
      score: data.hasCompetitiveAnalysis ? 75 : 40,
      weight: 10,
      reasoning: data.hasCompetitiveAnalysis ? 
        'Ambiente competitivo analizzato, vantaggio competitivo sostenibile da consolidare' : 
        'Analisi competitiva carente, positioning non chiaro'
    }
    
    const additionalInvestmentNeeds = {
      score: data.hasInvestmentInfo ? 80 : 50,
      weight: 5,
      reasoning: data.hasInvestmentInfo ? 
        'Fabbisogni finanziari indicati, necessario business plan dettagliato con milestone' : 
        'Necessità di investimento aggiuntivo non quantificate'
    }
    
    const others = {
      score: data.contentLength > 8000 ? 70 : 50,
      weight: 5,
      reasoning: data.contentLength > 8000 ? 
        'Documentazione completa, alcuni aspetti regolatori e legali da approfondire' : 
        'Documentazione incompleta, necessari approfondimenti in multiple aree'
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
      weighted_score: weightedScore,
      summary: `Score Scorecard: ${weightedScore}/100 - ${weightedScore > 70 ? 'Eccellente' : weightedScore > 50 ? 'Buono' : 'Da migliorare'}`
    }
  }
  
  private performRiskFactorAnalysis(data: any): any {
    const managementRisk = {
      level: data.hasTeamInfo ? (data.wordCount > 5000 ? 'low' : 'medium') : 'high',
      impact: data.hasTeamInfo ? (data.wordCount > 5000 ? 5 : -10) : -25,
      description: data.hasTeamInfo ? 
        'Team descritto ma necessaria valutazione competenze specifiche e track record' : 
        'Informazioni sul team insufficienti, alto rischio esecutivo per il progetto'
    }
    
    const marketRisk = {
      level: data.hasMarketAnalysis ? (data.hasCompetitiveAnalysis ? 'low' : 'medium') : 'high',
      impact: data.hasMarketAnalysis ? (data.hasCompetitiveAnalysis ? 10 : -5) : -20,
      description: data.hasMarketAnalysis ? 
        'Mercato analizzato, necessaria validazione domanda e customer acquisition' : 
        'Analisi di mercato carente, alto rischio di product-market fit'
    }
    
    const technologyRisk = {
      level: data.hasTechnology ? (data.hasProductInfo ? 'low' : 'medium') : 'high',
      impact: data.hasTechnology ? (data.hasProductInfo ? 5 : -10) : -15,
      description: data.hasTechnology ? 
        'Tecnologia descritta, necessaria valutazione scalabilità e implementazione' : 
        'Aspetti tecnologici poco chiari, rischio significativo di implementazione'
    }
    
    const competitiveRisk = {
      level: data.hasCompetitiveAnalysis ? 'medium' : 'high',
      impact: data.hasCompetitiveAnalysis ? -5 : -15,
      description: data.hasCompetitiveAnalysis ? 
        'Concorrenza analizzata, necessario monitoraggio continuo e differenziazione' : 
        'Analisi competitiva insufficiente, rischio di essere superati da competitor'
    }
    
    const financialRisk = {
      level: data.hasFinancialProjections ? (data.hasBusinessModel ? 'medium' : 'high') : 'high',
      impact: data.hasFinancialProjections ? (data.hasBusinessModel ? -5 : -15) : -20,
      description: data.hasFinancialProjections ? 
        'Proiezioni finanziarie presenti, necessaria validazione modello e assumzioni' : 
        'Piano finanziario carente, rischio significativo di sostenibilità economica'
    }
    
    const regulatoryRisk = {
      level: 'medium',
      impact: -5,
      description: 'Aspetti regolatori e compliance da valutare approfonditamente in base al settore'
    }
    
    const totalRiskAdjustment = managementRisk.impact + marketRisk.impact + technologyRisk.impact + competitiveRisk.impact + financialRisk.impact + regulatoryRisk.impact
    
    return {
      management_risk: managementRisk,
      market_risk: marketRisk,
      technology_risk: technologyRisk,
      competitive_risk: competitiveRisk,
      financial_risk: financialRisk,
      regulatory_risk: regulatoryRisk,
      total_risk_adjustment: totalRiskAdjustment,
      summary: `Aggiustamento rischio: ${totalRiskAdjustment > 0 ? '+' : ''}${totalRiskAdjustment}% - ${totalRiskAdjustment > 0 ? 'Profilo favorevole' : 'Rischi da mitigare'}`
    }
  }
  
  private performMarketAnalysis(data: any): any {
    const tamAnalysis = {
      size: data.hasMarketAnalysis ? (data.wordCount > 4000 ? 1000000000 : 500000000) : 100000000,
      confidence: data.hasMarketAnalysis ? (data.sections.length > 10 ? 70 : 50) : 30,
      reasoning: data.hasMarketAnalysis ? 
        'Mercato totale identificato, necessaria quantificazione precisa con fonti autorevoli' : 
        'Dimensioni del mercato totale da definire con ricerca di mercato strutturata'
    }
    
    const samAnalysis = {
      size: Math.round(tamAnalysis.size * 0.1),
      confidence: tamAnalysis.confidence - 10,
      reasoning: data.hasMarketAnalysis ? 
        'Mercato servibile stimato, necessaria segmentazione dettagliata per target' : 
        'Mercato servibile da definire in base a geografia, segmenti e capacità'
    }
    
    const somAnalysis = {
      size: Math.round(samAnalysis.size * 0.05),
      confidence: samAnalysis.confidence - 10,
      reasoning: data.hasMarketAnalysis ? 
        'Mercato ottenibile stimato, necessaria validazione con strategia go-to-market' : 
        'Mercato ottenibile da calcolare in base a capacità operative e strategia'
    }
    
    return {
      tam_analysis: tamAnalysis,
      sam_analysis: samAnalysis,
      som_analysis: somAnalysis,
      market_growth: {
        rate: data.hasMarketAnalysis ? 15 : 10,
        sustainability: data.hasMarketAnalysis ? 70 : 50,
        reasoning: 'Crescita di mercato da validare con dati di settore e trend analysis'
      },
      market_maturity: {
        stage: data.hasMarketAnalysis ? 'Growing' : 'Undefined',
        score: data.hasMarketAnalysis ? 65 : 40,
        reasoning: 'Maturità del mercato da analizzare con lifecycle analysis dettagliata'
      },
      customer_validation: {
        score: data.hasMarketAnalysis ? 55 : 30,
        evidence: data.hasMarketAnalysis ? ['Ricerca di mercato menzionata'] : ['Validazione cliente mancante']
      },
      summary: `TAM: ${Math.round(tamAnalysis.size / 1000000)}M EUR - SAM: ${Math.round(samAnalysis.size / 1000000)}M EUR - SOM: ${Math.round(somAnalysis.size / 1000000)}M EUR`
    }
  }
  
  private performCompetitiveAnalysis(data: any): any {
    return {
      competitive_position: {
        score: data.hasCompetitiveAnalysis ? 65 : 35,
        reasoning: data.hasCompetitiveAnalysis ? 
          'Posizionamento competitivo identificato, necessaria mappatura dettagliata dei competitor' : 
          'Posizionamento competitivo da definire con analisi strutturata del mercato'
      },
      differentiation: {
        score: data.hasProductInfo ? (data.hasTechnology ? 70 : 50) : 35,
        unique_factors: data.hasProductInfo ? ['Caratteristiche prodotto innovative identificate'] : ['Fattori differenzianti da identificare e sviluppare']
      },
      barriers_to_entry: {
        score: data.hasTechnology ? 60 : 40,
        barriers: data.hasTechnology ? ['Barriere tecnologiche potenziali'] : ['Barriere all\'ingresso da sviluppare strategicamente']
      },
      competitive_advantages: {
        sustainable: data.hasCompetitiveAnalysis && data.hasTechnology,
        advantages: data.hasCompetitiveAnalysis ? ['Vantaggio competitivo identificato'] : ['Vantaggi competitivi da consolidare e proteggere']
      },
      threat_level: {
        score: data.hasCompetitiveAnalysis ? 60 : 40,
        threats: ['Nuovi entranti nel mercato', 'Tecnologie disruptive', 'Cambiamenti regolatori', 'Competitor consolidati']
      },
      summary: `Posizione competitiva: ${data.hasCompetitiveAnalysis ? 'Identificata' : 'Da definire'} - Differenziazione: ${data.hasProductInfo ? 'Presente' : 'Mancante'}`
    }
  }
  
  private performFinancialAnalysis(data: any): any {
    return {
      revenue_model: {
        clarity: data.hasBusinessModel ? (data.hasFinancialProjections ? 75 : 55) : 35,
        scalability: data.hasBusinessModel ? 65 : 40,
        reasoning: data.hasBusinessModel ? 
          'Modello di ricavi identificato, necessaria quantificazione unit economics dettagliata' : 
          'Modello di ricavi da definire con chiarezza e sostenibilità economica'
      },
      unit_economics: {
        ltv_cac_ratio: data.hasFinancialProjections ? 3.5 : 2.0,
        payback_period: data.hasFinancialProjections ? 12 : 18,
        reasoning: data.hasFinancialProjections ? 
          'Metriche economiche stimate, necessaria validazione con dati reali' : 
          'Unit economics da calcolare con precisione per sostenibilità'
      },
      financial_projections: {
        realism: data.hasFinancialProjections ? 65 : 30,
        growth_rate: data.hasFinancialProjections ? 150 : 100,
        reasoning: data.hasFinancialProjections ? 
          'Proiezioni finanziarie presenti, necessaria validazione ipotesi e scenari' : 
          'Proiezioni finanziarie da sviluppare con modello dettagliato e realistico'
      },
      funding_requirements: {
        amount: data.hasInvestmentInfo ? 500000 : 300000,
        runway: data.hasInvestmentInfo ? 18 : 12,
        milestones: data.hasInvestmentInfo ? ['Milestone identificate nel piano'] : ['Milestone da definire per round']
      },
      path_to_profitability: {
        timeline: data.hasFinancialProjections ? 24 : 36,
        probability: data.hasFinancialProjections ? 65 : 45,
        reasoning: data.hasFinancialProjections ? 
          'Percorso verso profittabilità delineato con assumzioni' : 
          'Percorso verso profittabilità da pianificare dettagliatamente'
      },
      summary: `Modello ricavi: ${data.hasBusinessModel ? 'Definito' : 'Da sviluppare'} - Proiezioni: ${data.hasFinancialProjections ? 'Presenti' : 'Mancanti'}`
    }
  }
  
  private performTeamAnalysis(data: any): any {
    return {
      founder_market_fit: {
        score: data.hasTeamInfo ? (data.hasMarketAnalysis ? 70 : 55) : 35,
        reasoning: data.hasTeamInfo ? 
          'Team identificato, necessaria valutazione esperienza settoriale specifica' : 
          'Informazioni sul team insufficienti per valutare founder-market fit'
      },
      team_completeness: {
        score: data.hasTeamInfo ? 60 : 30,
        missing_roles: data.hasTeamInfo ? ['Ruoli specialistici da definire'] : ['CEO', 'CTO', 'CMO', 'Head of Sales', 'CFO']
      },
      experience_relevance: {
        score: data.hasTeamInfo ? 65 : 35,
        key_experiences: data.hasTeamInfo ? ['Esperienza settoriale presente'] : ['Esperienza rilevante da documentare']
      },
      track_record: {
        score: data.hasTeamInfo ? 55 : 30,
        previous_successes: data.hasTeamInfo ? ['Successi precedenti accennati'] : ['Track record da dimostrare con evidenze']
      },
      advisors_board: {
        score: data.hasTeamInfo ? 50 : 25,
        advisory_strength: data.hasTeamInfo ? 
          'Advisory board da sviluppare con expertise settoriale' : 
          'Advisory board non presente, necessario per credibilità'
      },
      summary: `Team: ${data.hasTeamInfo ? 'Identificato' : 'Da definire'} - Esperienza: ${data.hasTeamInfo ? 'Presente' : 'Mancante'} - Advisory: ${data.hasTeamInfo ? 'Da sviluppare' : 'Assente'}`
    }
  }
  
  private performProductAnalysis(data: any): any {
    return {
      product_market_fit: {
        score: data.hasProductInfo ? (data.hasMarketAnalysis ? 65 : 45) : 30,
        evidence: data.hasProductInfo ? ['Prodotto descritto con caratteristiche'] : ['Evidenze product-market fit completamente mancanti']
      },
      development_stage: {
        stage: data.hasProductInfo ? (data.hasTechnology ? 'Prototype' : 'Concept') : 'Idea',
        score: data.hasProductInfo ? (data.hasTechnology ? 60 : 40) : 20,
        reasoning: data.hasProductInfo ? 
          'Stadio di sviluppo identificato, necessaria roadmap dettagliata' : 
          'Stadio di sviluppo da definire con timeline e milestone'
      },
      ip_protection: {
        score: data.hasTechnology ? 50 : 25,
        protections: data.hasTechnology ? ['Proprietà intellettuale da proteggere'] : ['Strategia IP completamente mancante']
      },
      scalability: {
        technical: data.hasTechnology ? 65 : 40,
        business: data.hasBusinessModel ? 70 : 45,
        reasoning: data.hasTechnology ? 
          'Scalabilità tecnica identificata, necessaria validazione architetturale' : 
          'Scalabilità tecnica e business da valutare approfonditamente'
      },
      user_traction: {
        score: data.hasProductInfo ? 45 : 25,
        metrics: data.hasProductInfo ? ['Trazione utenti da misurare con KPI'] : ['Trazione utenti completamente mancante']
      },
      summary: `Stadio: ${data.hasProductInfo ? (data.hasTechnology ? 'Prototype' : 'Concept') : 'Idea'} - PMF: ${data.hasProductInfo ? 'Parziale' : 'Mancante'} - Scalabilità: ${data.hasTechnology ? 'Identificata' : 'Da valutare'}`
    }
  }
  
  private assessInvestmentReadiness(data: any): any {
    return {
      pitch_deck_quality: {
        score: data.contentLength > 5000 ? 65 : 40,
        missing_elements: ['Executive Summary coinvolgente', 'Market Size quantificato', 'Financial Projections realistiche', 'Team completo']
      },
      business_plan_completeness: {
        score: data.wordCount > 3000 ? 70 : 45,
        missing_sections: ['Market Analysis dettagliata', 'Competitive Analysis strutturata', 'Financial Model completo', 'Risk Analysis approfondita']
      },
      financial_model_quality: {
        score: data.hasFinancialProjections ? 60 : 30,
        improvements_needed: ['Unit Economics validation', 'Cash Flow dettagliato', 'Scenario Analysis multiple', 'Sensitivity Analysis']
      },
      legal_structure: {
        score: 50,
        issues: ['Corporate Structure ottimizzata', 'IP Protection strategy', 'Regulatory Compliance', 'Shareholder Agreement']
      },
      due_diligence_readiness: {
        score: 45,
        missing_documents: ['Financial Statements auditati', 'Legal Documents completi', 'IP Portfolio documentato', 'Customer Contracts', 'Employment Agreements']
      },
      summary: `Investment Readiness: ${data.contentLength > 5000 ? 'Parziale' : 'Bassa'} - Due Diligence: ${data.hasFinancialProjections ? 'Preparazione iniziale' : 'Non pronta'}`
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
  
  private calculateValuationRange(berkus: any, scorecard: any, risk: any) {
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
      recommendations.push('Condurre ricerca di mercato dettagliata con quantificazione TAM/SAM/SOM e validazione customer')
    }
    
    if (!data.hasCompetitiveAnalysis) {
      recommendations.push('Sviluppare analisi competitiva strutturata con mappatura competitor e positioning')
    }
    
    if (!data.hasFinancialProjections) {
      recommendations.push('Creare modello finanziario con proiezioni 3-5 anni, unit economics e scenario analysis')
    }
    
    if (!data.hasTeamInfo) {
      recommendations.push('Completare team con competenze complementari e sviluppare advisory board settoriale')
    }
    
    if (!data.hasBusinessModel) {
      recommendations.push('Definire chiaramente modello di business, revenue streams e strategia monetizzazione')
    }
    
    if (overallScore < 60) {
      recommendations.push('Sviluppare MVP funzionale e validare product-market fit con clienti target')
    }
    
    recommendations.push('Preparare pitch deck investor-ready con storytelling compelling e demo prodotto')
    recommendations.push('Implementare sistema di metriche KPI per monitoraggio performance e crescita')
    
    return recommendations
  }
  
  private identifyMissingAreas(data: any): string[] {
    const missing = []
    
    if (!data.hasMarketAnalysis) missing.push('Analisi di mercato quantitativa con TAM/SAM/SOM')
    if (!data.hasCompetitiveAnalysis) missing.push('Analisi competitiva strutturata con positioning')
    if (!data.hasFinancialProjections) missing.push('Proiezioni finanziarie dettagliate con unit economics')
    if (!data.hasTeamInfo) missing.push('Informazioni complete sul team e advisory board')
    if (!data.hasBusinessModel) missing.push('Modello di business definito con revenue streams')
    if (!data.hasTechnology) missing.push('Specifiche tecniche dettagliate e architettura')
    if (!data.hasProductInfo) missing.push('Descrizione prodotto/servizio completa con roadmap')
    if (!data.hasInvestmentInfo) missing.push('Piano di investimento e utilizzo fondi con milestone')
    
    return missing
  }
  
  private generateNextSteps(overallScore: number, investmentReadiness: any): any {
    const immediateActions = []
    
    if (overallScore < 50) {
      immediateActions.push({
        action: 'Completare business plan con tutte le sezioni critiche mancanti',
        priority: 'high',
        timeline: '2-4 settimane'
      })
    }
    
    if (investmentReadiness.pitch_deck_quality.score < 70) {
      immediateActions.push({
        action: 'Creare pitch deck professionale con storytelling e demo',
        priority: 'high',
        timeline: '1-2 settimane'
      })
    }
    
    immediateActions.push({
      action: 'Validare product-market fit con clienti target e raccogliere feedback',
      priority: 'medium',
      timeline: '4-6 settimane'
    })
    
    return {
      immediate_actions: immediateActions,
      pitch_preparation: {
        tasks: ['Sviluppare storytelling compelling', 'Preparare demo prodotto funzionale', 'Praticare presentazione con timing'],
        timeline: '2-3 settimane'
      },
      business_plan_completion: {
        tasks: ['Completare ricerca mercato con dati', 'Finalizzare proiezioni finanziarie', 'Definire go-to-market strategy'],
        timeline: '4-6 settimane'
      },
      investment_readiness: {
        tasks: ['Preparare due diligence materials', 'Strutturare round di finanziamento', 'Identificare e contattare investitori target'],
        timeline: '6-8 settimane'
      }
    }
  }
}