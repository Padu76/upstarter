import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
})

export interface IdeaAnalysisInput {
  title: string
  description: string
  questionnaire: {
    target_market: string
    value_proposition: string
    business_model: string
    competitive_advantage: string
    financial_projections: string
    market_size: string
    team_needs: string
    timeline: string
  }
}

export interface IdeaAnalysisResult {
  overall_score: number
  strengths: string[]
  weaknesses: string[]
  opportunities: string[]
  threats: string[]
  recommendations: string[]
  next_steps: string[]
  market_validation: {
    score: number
    analysis: string
    suggestions: string[]
  }
  business_model: {
    score: number
    analysis: string
    suggestions: string[]
  }
  competitive_landscape: {
    score: number
    analysis: string
    suggestions: string[]
  }
  financial_viability: {
    score: number
    analysis: string
    suggestions: string[]
  }
  team_assessment: {
    score: number
    missing_roles: string[]
    priorities: string[]
  }
}

const ANALYSIS_PROMPT = `
Sei un esperto consulente di startup e business development. Analizza l'idea di business fornita e dai un feedback dettagliato e costruttivo.

IDEA DA ANALIZZARE:
Titolo: {title}
Descrizione: {description}

QUESTIONARIO BUSINESS:
- Mercato target: {target_market}
- Proposta di valore: {value_proposition}
- Modello di business: {business_model}
- Vantaggio competitivo: {competitive_advantage}
- Proiezioni finanziarie: {financial_projections}
- Dimensione mercato: {market_size}
- Esigenze del team: {team_needs}
- Timeline: {timeline}

FORNISCI UN'ANALISI STRUTTURATA IN FORMATO JSON con:

1. overall_score (0-100): Punteggio complessivo dell'idea
2. strengths: Array di 3-5 punti di forza principali
3. weaknesses: Array di 3-5 debolezze principali
4. opportunities: Array di 3-4 opportunità di mercato
5. threats: Array di 3-4 minacce/rischi
6. recommendations: Array di 5-7 raccomandazioni actionable
7. next_steps: Array di 4-6 prossimi passi concreti ordinati per priorità

8. market_validation:
   - score (0-100)
   - analysis (2-3 frasi di analisi)
   - suggestions (3-4 suggerimenti specifici)

9. business_model:
   - score (0-100)
   - analysis (2-3 frasi di analisi)
   - suggestions (3-4 suggerimenti specifici)

10. competitive_landscape:
    - score (0-100)
    - analysis (2-3 frasi di analisi)
    - suggestions (3-4 suggerimenti specifici)

11. financial_viability:
    - score (0-100)
    - analysis (2-3 frasi di analisi)
    - suggestions (3-4 suggerimenti specifici)

12. team_assessment:
    - score (0-100)
    - missing_roles (array di ruoli mancanti nel team)
    - priorities (array di 3-4 priorità di assunzione)

Rispondi SOLO con il JSON valido, senza testo aggiuntivo.
`

export async function analyzeIdea(input: IdeaAnalysisInput): Promise<IdeaAnalysisResult> {
  try {
    const prompt = ANALYSIS_PROMPT
      .replace('{title}', input.title)
      .replace('{description}', input.description)
      .replace('{target_market}', input.questionnaire.target_market)
      .replace('{value_proposition}', input.questionnaire.value_proposition)
      .replace('{business_model}', input.questionnaire.business_model)
      .replace('{competitive_advantage}', input.questionnaire.competitive_advantage)
      .replace('{financial_projections}', input.questionnaire.financial_projections)
      .replace('{market_size}', input.questionnaire.market_size)
      .replace('{team_needs}', input.questionnaire.team_needs)
      .replace('{timeline}', input.questionnaire.timeline)

    const message = await anthropic.messages.create({
      model: 'claude-3-sonnet-20240229',
      max_tokens: 4000,
      temperature: 0.3,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    })

    const content = message.content[0]
    if (content.type !== 'text') {
      throw new Error('Unexpected response type from Claude')
    }

    // Parse the JSON response
    const analysis = JSON.parse(content.text) as IdeaAnalysisResult
    
    // Validate the response structure
    if (!analysis.overall_score || !analysis.strengths || !analysis.recommendations) {
      throw new Error('Invalid analysis structure received')
    }

    return analysis
  } catch (error) {
    console.error('Error analyzing idea with Claude:', error)
    throw new Error('Failed to analyze idea. Please try again.')
  }
}