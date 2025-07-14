const Airtable = require('airtable')

// Configurazione base di Airtable
const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(process.env.AIRTABLE_BASE_ID)

// Definizione delle tabelle
export const TABLES = {
  USERS: 'Users',
  PROJECTS: 'Projects', 
  IDEAS_ANALYSIS: 'Ideas_Analysis',
  ADDITIONAL_INFO: 'Additional_Info'
} as const

// Tipi TypeScript per i record
export interface UserRecord {
  id?: string
  email: string
  name?: string
  user_type?: 'startup' | 'investor' | 'consultant'
  created_at: string
  updated_at?: string
}

export interface ProjectRecord {
  id?: string
  user_id: string
  title: string
  description: string
  score: number
  status: 'draft' | 'analyzed' | 'archived'
  type: 'standard' | 'professional'
  source: 'form' | 'document' | 'document_professional'
  source_file?: string
  completeness?: number
  created_at: string
  updated_at: string
}

export interface AnalysisRecord {
  id?: string
  project_id: string
  overall_score: number
  analysis_data: string // JSON stringified
  missing_areas?: string // JSON stringified  
  created_at: string
}

export interface AdditionalInfoRecord {
  id?: string
  project_id: string
  category: string
  content: string
  created_at: string
}

class AirtableService {
  // Operazioni generiche per tutte le tabelle
  async findRecords(tableName: string, options: any = {}): Promise<any[]> {
    try {
      const records: any[] = []
      
      await base(tableName).select({
        maxRecords: 100,
        ...options
      }).eachPage((pageRecords: any[], fetchNextPage: () => void) => {
        records.push(...pageRecords.map(record => ({
          id: record.id,
          ...record.fields
        })))
        fetchNextPage()
      })
      
      return records
    } catch (error) {
      console.error(`Error finding records in ${tableName}:`, error)
      throw error
    }
  }

  async createRecord(tableName: string, fields: any): Promise<any> {
    try {
      const record = await base(tableName).create(fields)
      return {
        id: record.id,
        ...record.fields
      }
    } catch (error) {
      console.error(`Error creating record in ${tableName}:`, error)
      throw error
    }
  }

  async updateRecord(tableName: string, recordId: string, fields: any): Promise<any> {
    try {
      const record = await base(tableName).update(recordId, fields)
      return {
        id: record.id,
        ...record.fields
      }
    } catch (error) {
      console.error(`Error updating record in ${tableName}:`, error)
      throw error
    }
  }

  async deleteRecord(tableName: string, recordId: string): Promise<boolean> {
    try {
      await base(tableName).destroy(recordId)
      return true
    } catch (error) {
      console.error(`Error deleting record in ${tableName}:`, error)
      return false
    }
  }

  // Metodi specifici per Users
  async findUserByEmail(email: string): Promise<UserRecord | null> {
    try {
      const users = await this.findRecords(TABLES.USERS, {
        filterByFormula: `{email} = "${email}"`
      })
      return users.length > 0 ? users[0] : null
    } catch (error) {
      console.error('Error finding user by email:', error)
      return null
    }
  }

  async createUser(userData: Omit<UserRecord, 'id'>): Promise<UserRecord> {
    return await this.createRecord(TABLES.USERS, userData)
  }

  // Metodi specifici per Projects
  async findProjectsByUser(userId: string): Promise<ProjectRecord[]> {
    try {
      return await this.findRecords(TABLES.PROJECTS, {
        filterByFormula: `{user_id} = "${userId}"`,
        sort: [{ field: 'created_at', direction: 'desc' }]
      })
    } catch (error) {
      console.error('Error finding projects by user:', error)
      return []
    }
  }

  async createProject(projectData: Omit<ProjectRecord, 'id'>): Promise<ProjectRecord> {
    return await this.createRecord(TABLES.PROJECTS, projectData)
  }

  async updateProject(projectId: string, projectData: Partial<ProjectRecord>): Promise<ProjectRecord> {
    return await this.updateRecord(TABLES.PROJECTS, projectId, {
      ...projectData,
      updated_at: new Date().toISOString()
    })
  }

  async deleteProject(projectId: string): Promise<boolean> {
    try {
      // Elimina prima le analisi associate
      const analyses = await this.findRecords(TABLES.IDEAS_ANALYSIS, {
        filterByFormula: `{project_id} = "${projectId}"`
      })
      
      for (const analysis of analyses) {
        await this.deleteRecord(TABLES.IDEAS_ANALYSIS, analysis.id)
      }

      // Elimina le info aggiuntive associate
      const additionalInfos = await this.findRecords(TABLES.ADDITIONAL_INFO, {
        filterByFormula: `{project_id} = "${projectId}"`
      })
      
      for (const info of additionalInfos) {
        await this.deleteRecord(TABLES.ADDITIONAL_INFO, info.id)
      }

      // Elimina il progetto
      return await this.deleteRecord(TABLES.PROJECTS, projectId)
    } catch (error) {
      console.error('Error deleting project and related data:', error)
      return false
    }
  }

  // Metodi specifici per Analysis
  async findAnalysisByProject(projectId: string): Promise<AnalysisRecord | null> {
    try {
      const analyses = await this.findRecords(TABLES.IDEAS_ANALYSIS, {
        filterByFormula: `{project_id} = "${projectId}"`
      })
      return analyses.length > 0 ? analyses[0] : null
    } catch (error) {
      console.error('Error finding analysis by project:', error)
      return null
    }
  }

  async createAnalysis(analysisData: Omit<AnalysisRecord, 'id'>): Promise<AnalysisRecord> {
    return await this.createRecord(TABLES.IDEAS_ANALYSIS, analysisData)
  }

  async updateAnalysis(analysisId: string, analysisData: Partial<AnalysisRecord>): Promise<AnalysisRecord> {
    return await this.updateRecord(TABLES.IDEAS_ANALYSIS, analysisId, analysisData)
  }

  // Metodi specifici per Additional Info
  async findAdditionalInfoByProject(projectId: string): Promise<AdditionalInfoRecord[]> {
    try {
      return await this.findRecords(TABLES.ADDITIONAL_INFO, {
        filterByFormula: `{project_id} = "${projectId}"`,
        sort: [{ field: 'created_at', direction: 'desc' }]
      })
    } catch (error) {
      console.error('Error finding additional info by project:', error)
      return []
    }
  }

  async createAdditionalInfo(infoData: Omit<AdditionalInfoRecord, 'id'>): Promise<AdditionalInfoRecord> {
    return await this.createRecord(TABLES.ADDITIONAL_INFO, infoData)
  }

  // Utility per verificare la connessione
  async testConnection(): Promise<boolean> {
    try {
      await this.findRecords(TABLES.USERS, { maxRecords: 1 })
      return true
    } catch (error) {
      console.error('Airtable connection test failed:', error)
      return false
    }
  }

  // Metodo per inizializzare un utente (crea se non esiste)
  async initializeUser(email: string, name?: string): Promise<UserRecord> {
    try {
      let user = await this.findUserByEmail(email)
      
      if (!user) {
        user = await this.createUser({
          email,
          name: name || email.split('@')[0],
          user_type: 'startup',
          created_at: new Date().toISOString()
        })
        console.log('New user created:', email)
      }
      
      return user
    } catch (error) {
      console.error('Error initializing user:', error)
      throw error
    }
  }

  // Metodo per ottenere statistiche utente
  async getUserStats(userId: string): Promise<any> {
    try {
      const projects = await this.findProjectsByUser(userId)
      
      const stats = {
        total_projects: projects.length,
        analyzed_projects: projects.filter(p => p.status === 'analyzed').length,
        draft_projects: projects.filter(p => p.status === 'draft').length,
        average_score: projects.length > 0 
          ? Math.round(projects.reduce((sum, p) => sum + p.score, 0) / projects.length)
          : 0,
        latest_project: projects.length > 0 ? projects[0] : null
      }
      
      return stats
    } catch (error) {
      console.error('Error getting user stats:', error)
      return {
        total_projects: 0,
        analyzed_projects: 0,
        draft_projects: 0,
        average_score: 0,
        latest_project: null
      }
    }
  }
}

export const airtableService = new AirtableService()
export default airtableService