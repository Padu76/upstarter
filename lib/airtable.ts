import Airtable from 'airtable'

// Initialize Airtable
const base = new Airtable({
  apiKey: process.env.AIRTABLE_API_KEY
}).base(process.env.AIRTABLE_BASE_ID!)

// Airtable Tables Configuration
export const TABLES = {
  USERS: 'Users',
  PROJECTS: 'Projects', 
  IDEAS_ANALYSIS: 'Ideas_Analysis',
  IMPROVEMENT_PLANS: 'Improvement_Plans',
  IMPROVEMENT_TASKS: 'Improvement_Tasks',
  MATCHES: 'Matches',
  MATCHING_INTERACTIONS: 'Matching_Interactions',
  MESSAGES: 'Messages',
  NOTIFICATIONS: 'Notifications',
  INVESTORS: 'Investors',
  USER_PROGRESS: 'User_Progress',
  ACHIEVEMENTS: 'Achievements'
} as const

// Airtable Helper Functions
export class AirtableService {
  
  // Create a new record
  static async create(tableName: string, fields: Record<string, any>) {
    try {
      const records = await base(tableName).create([{ fields }])
      return records[0]
    } catch (error) {
      console.error(`Error creating record in ${tableName}:`, error)
      throw error
    }
  }

  // Get record by ID
  static async getById(tableName: string, recordId: string) {
    try {
      const record = await base(tableName).find(recordId)
      return {
        id: record.id,
        ...record.fields
      }
    } catch (error) {
      console.error(`Error fetching record ${recordId} from ${tableName}:`, error)
      throw error
    }
  }

  // Find records with filters
  static async find(tableName: string, options: {
    filterByFormula?: string
    sort?: Array<{ field: string, direction?: 'asc' | 'desc' }>
    maxRecords?: number
    view?: string
  } = {}) {
    try {
      const records = await base(tableName).select(options).all()
      return records.map(record => ({
        id: record.id,
        ...record.fields
      }))
    } catch (error) {
      console.error(`Error finding records in ${tableName}:`, error)
      throw error
    }
  }

  // Update record
  static async update(tableName: string, recordId: string, fields: Record<string, any>) {
    try {
      const records = await base(tableName).update([
        { id: recordId, fields }
      ])
      return records[0]
    } catch (error) {
      console.error(`Error updating record ${recordId} in ${tableName}:`, error)
      throw error
    }
  }

  // Delete record
  static async delete(tableName: string, recordId: string) {
    try {
      const deletedRecord = await base(tableName).destroy(recordId)
      return deletedRecord
    } catch (error) {
      console.error(`Error deleting record ${recordId} from ${tableName}:`, error)
      throw error
    }
  }

  // Batch operations
  static async batchCreate(tableName: string, records: Array<{ fields: Record<string, any> }>) {
    try {
      const chunks = []
      for (let i = 0; i < records.length; i += 10) {
        chunks.push(records.slice(i, i + 10))
      }

      const results = []
      for (const chunk of chunks) {
        const chunkResults = await base(tableName).create(chunk)
        results.push(...chunkResults)
      }

      return results
    } catch (error) {
      console.error(`Error batch creating records in ${tableName}:`, error)
      throw error
    }
  }
}