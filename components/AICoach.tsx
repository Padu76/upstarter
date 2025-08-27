// Modifiche principali nel file AICoach.tsx

// SOSTITUIRE la funzione processImprovements con questa versione:
const processImprovements = async () => {
  setIsAnalyzing(true)
  setAnimationStep(0)
  setAnalysisProgress('Analisi AI Coach v2.1 in corso...')

  try {
    console.log('AI Coach: Starting advisory analysis (NO score modification)')

    // Animated progress steps
    setTimeout(() => {
      setAnimationStep(1)
      setAnalysisProgress('Analisi aree di miglioramento...')
    }, 1000)

    setTimeout(() => {
      setAnimationStep(2)
      setAnalysisProgress('Generazione raccomandazioni personalizzate...')
    }, 2000)

    setTimeout(() => {
      setAnimationStep(3)
      setAnalysisProgress('Creazione action plan...')
    }, 3000)

    // Genera solo raccomandazioni e action plan - NON modifica score
    const advisoryResult = await generateAdvisoryReport()
    
    console.log('AI Coach: Advisory analysis completed (no scores modified)')

    setTimeout(() => {
      setAnimationStep(4)
      setAnalysisProgress('Report consultivo completato!')
      setBeforeAfterData(advisoryResult)
    }, 4000)

    // Callback con solo consigli
    onImprove({
      advisory: advisoryResult,
      areasAnalyzed: wizardSteps.map(step => step.area.id),
      recommendations: advisoryResult.recommendations,
      actionPlan: advisoryResult.actionPlan
    })
      
  } catch (error) {
    console.error('Error in AI Coach advisory:', error)
    setAnalysisProgress(`Errore: ${error instanceof Error ? error.message : 'Errore sconosciuto'}`)
  } finally {
    setTimeout(() => {
      setIsAnalyzing(false)
      setShowWizard(false)
    }, 5000)
  }
}

// AGGIUNGERE questa nuova funzione:
const generateAdvisoryReport = async () => {
  // Analizza i dati raccolti dal wizard
  const currentAnalysis = analysis?.professional_analysis || analysis?.analysis_data?.professional_analysis
  const currentScore = currentAnalysis?.overall_score || 0

  // Genera raccomandazioni specifiche basate sui dati del wizard
  const recommendations = []
  const actionPlan = []
  const insights = []

  wizardSteps.forEach(step => {
    // Analizza ogni area completata
    const formData = step.formData
    const documents = step.documents.length
    const aiInsights = step.smartInsights

    // Genera raccomandazioni specifiche per quest'area
    switch (step.area.id) {
      case 'market_analysis':
        if (formData.tam_size) {
          recommendations.push(`Eccellente quantificazione TAM: ${formData.tam_size}. Considera di validare con fonti aggiuntive.`)
        }
        if (formData.market_validation) {
          recommendations.push('Validazione mercato completata. Prossimo step: espandere il campione di interviste.')
        }
        actionPlan.push({
          area: 'Market Analysis',
          actions: [
            'Validare TAM/SAM/SOM con 2-3 fonti aggiuntive',
            'Condurre 10+ interviste customer aggiuntive',
            'Creare customer personas dettagliate'
          ],
          timeline: '4-6 settimane',
          priority: 'Alta'
        })
        break

      case 'competitive_analysis':
        if (formData.direct_competitors && formData.competitive_advantage) {
          recommendations.push('Analisi competitiva solida. Focus su differenziazione sostenibile.')
        }
        actionPlan.push({
          area: 'Competitive Position',
          actions: [
            'Monitoraggio competitor trimestrale',
            'Sviluppare barriere competitive',
            'Proteggere vantaggio con IP strategy'
          ],
          timeline: '2-3 settimane',
          priority: 'Media'
        })
        break

      case 'team_strengthening':
        recommendations.push('Team analysis completata. Considera expansion strategica.')
        actionPlan.push({
          area: 'Team Development',
          actions: [
            'Recruiting per ruoli chiave identificati',
            'Advisory board con 3-5 esperti settore',
            'Team building e skill development'
          ],
          timeline: '6-12 settimane',
          priority: 'Alta'
        })
        break

      case 'financial_model':
        if (formData.ltv && formData.cac) {
          recommendations.push(`Unit economics definiti (LTV: ${formData.ltv}, CAC: ${formData.cac}). Validare con dati reali.`)
        }
        actionPlan.push({
          area: 'Financial Planning',
          actions: [
            'Validare unit economics con clienti pilota',
            'Scenario planning (best/worst/realistic)',
            'Cash flow management ottimizzato'
          ],
          timeline: '3-4 settimane',
          priority: 'Alta'
        })
        break

      case 'product_validation':
        recommendations.push('Product validation framework implementato. Focus su feedback loop.')
        actionPlan.push({
          area: 'Product Market Fit',
          actions: [
            'Implementare feedback loop sistematico',
            'A/B testing su feature chiave',
            'Metriche PMF (retention, NPS, usage)'
          ],
          timeline: '4-8 settimane',
          priority: 'Critica'
        })
        break
    }

    // Aggiungi insights AI dai documenti
    aiInsights.forEach(insight => {
      insights.push(insight)
    })
  })

  // Genera overall recommendations
  const overallRecommendations = [
    'Prioritizza le azioni ad alta priorità entro 30 giorni',
    'Implementa sistema di tracking KPI settimanale',
    'Pianifica investor outreach quando score ≥75',
    'Considera acceleratore/incubatore per network',
    'Prepara materials per due diligence'
  ]

  return {
    // NON modifica gli score originali
    currentScore: currentScore,
    areasAnalyzed: wizardSteps.length,
    recommendations: [...recommendations, ...overallRecommendations],
    actionPlan: actionPlan,
    insights: insights,
    nextSteps: {
      immediate: actionPlan.filter(plan => plan.priority === 'Critica' || plan.priority === 'Alta'),
      shortTerm: actionPlan.filter(plan => plan.priority === 'Media'),
      longTerm: []
    },
    summary: {
      title: 'AI Coach Report Consultivo',
      description: `Analisi completata su ${wizardSteps.length} aree critiche con ${insights.length} insight AI`,
      recommendation: currentScore >= 70 
        ? 'Progetto pronto per investor outreach con miglioramenti mirati'
        : 'Focus su aree ad alta priorità prima di approccio investitori'
    }
  }
}

// MODIFICARE la sezione del risultato finale per riflettere che è solo consultivo:
if (beforeAfterData) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[95vh] overflow-y-auto m-4">
        {/* Header modificato */}
        <div className="relative flex items-center justify-between p-8 border-b bg-gradient-to-r from-blue-500 via-purple-500 to-green-600 text-white overflow-hidden">
          <div>
            <h2 className="text-3xl font-bold">AI Coach v2.1 - Report Consultivo</h2>
            <p className="text-blue-100 text-sm mt-1">Analisi e raccomandazioni (score originale preservato)</p>
          </div>
          <button onClick={onClose} className="text-white hover:text-gray-200">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-8">
          {/* Stato attuale (non modificato) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="text-center p-6 bg-blue-50 rounded-xl border-2 border-blue-200">
              <div className="text-4xl font-bold text-blue-600 mb-2">
                {beforeAfterData.currentScore}/100
              </div>
              <div className="text-sm text-blue-700">Score Attuale (Preservato)</div>
            </div>
            <div className="text-center p-6 bg-green-50 rounded-xl border-2 border-green-200">
              <div className="text-4xl font-bold text-green-600 mb-2">
                {beforeAfterData.areasAnalyzed}
              </div>
              <div className="text-sm text-green-700">Aree Analizzate</div>
            </div>
            <div className="text-center p-6 bg-purple-50 rounded-xl border-2 border-purple-200">
              <div className="text-4xl font-bold text-purple-600 mb-2">
                {beforeAfterData.insights?.length || 0}
              </div>
              <div className="text-sm text-purple-700">Insight AI Generati</div>
            </div>
          </div>

          {/* Raccomandazioni */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 mb-8">
            <h3 className="text-xl font-semibold mb-4">🎯 Raccomandazioni Personalizzate</h3>
            <div className="space-y-3">
              {beforeAfterData.recommendations?.map((rec: string, index: number) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-white rounded-lg">
                  <Lightbulb className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-700">{rec}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Plan */}
          <div className="bg-white rounded-xl p-6 border border-gray-200 mb-8">
            <h3 className="text-xl font-semibold mb-4">📋 Action Plan Dettagliato</h3>
            <div className="space-y-6">
              {beforeAfterData.actionPlan?.map((plan: any, index: number) => (
                <div key={index} className="border-l-4 border-blue-500 pl-4">
                  <h4 className="font-semibold text-gray-900 mb-2">{plan.area}</h4>
                  <div className="mb-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      plan.priority === 'Critica' ? 'bg-red-100 text-red-700' :
                      plan.priority === 'Alta' ? 'bg-orange-100 text-orange-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      Priorità {plan.priority}
                    </span>
                    <span className="ml-2 text-sm text-gray-600">{plan.timeline}</span>
                  </div>
                  <ul className="space-y-1">
                    {plan.actions?.map((action: string, idx: number) => (
                      <li key={idx} className="text-sm text-gray-700 flex items-start">
                        <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                        {action}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              📊 Analisi Consultiva Completata
            </h3>
            <p className="text-gray-600 mb-6">
              Il tuo score originale è preservato. Implementa le raccomandazioni per migliorare gradualmente il progetto.
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={onClose}
                className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Torna all'Analisi Originale
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}