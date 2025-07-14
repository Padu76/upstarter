import Airtable, { FieldSet } from 'airtable'

// Initialize Airtable
const base = new Airtable({
  apiKey: process.env.AIRTABLE_API_KEY
}).base(process.env.AIRTABLE_BASE_ID!)

// Airtable Tables Configuration
export const TABLES = {
  USERS: 'Users',
  PROJECTS: 'Projects',
  IDEAS_ANALYSIS: 'Ideas_Analysis',
  USER_PROFILES: 'User_Profiles',
  PROJECT_LISTINGS: 'Project_Listings',
  MATCHES: 'Matches',
  INVESTOR_PROFILES: 'Investor_Profiles',
  INVESTOR_MATCHES: 'Investor_Matches',
  MESSAGES: 'Messages',
  IMPROVEMENT_PLANS: 'Improvement_Plans',
  IMPROVEMENT_TASKS: 'Improvement_Tasks'
} as const

// Type definitions for better type safety
interface AirtableRecord {
  id: string
  fields: FieldSet
  createdTime: string
}

interface FindRecordsOptions {
  filterByFormula?: string
  sort?: Array<{ field: string; direction: 'asc' | 'desc' }>
  maxRecords?: number
  pageSize?: number
}

export class AirtableService {
  // Create a new record
  static async createRecord(tableName: string, data: FieldSet): Promise<AirtableRecord> {
    try {
      const records = await base(tableName).create([data])
      return {
        id: records[0].id,
        fields: records[0].fields,
        createdTime: records[0].get('createdTime') as string
      }
    } catch (error) {
      console.error(`Error creating record in ${tableName}:`, error)
      throw error
    }
  }

  // Find records with optional filtering
  static async findRecords(tableName: string, options: FindRecordsOptions = {}): Promise<AirtableRecord[]> {
    try {
      const query = base(tableName).select({
        ...options
      })

      const records: AirtableRecord[] = []
      
      await query.eachPage((pageRecords, fetchNextPage) => {
        pageRecords.forEach(record => {
          records.push({
            id: record.id,
            fields: record.fields,
            createdTime: record.get('createdTime') as string
          })
        })
        fetchNextPage()
      })

      return records
    } catch (error) {
      console.error(`Error finding records in ${tableName}:`, error)
      throw error
    }
  }

  // Get a single record by ID
  static async getRecord(tableName: string, recordId: string): Promise<AirtableRecord | null> {
    try {
      const record = await base(tableName).find(recordId)
      return {
        id: record.id,
        fields: record.fields,
        createdTime: record.get('createdTime') as string
      }
    } catch (error) {
      console.error(`Error getting record ${recordId} from ${tableName}:`, error)
      return null
    }
  }

  // Update a record
  static async updateRecord(tableName: string, recordId: string, data: FieldSet): Promise<AirtableRecord> {
    try {
      const records = await base(tableName).update([
        {
          id: recordId,
          fields: data
        }
      ])

      return {
        id: records[0].id,
        fields: records[0].fields,
        createdTime: records[0].get('createdTime') as string
      }
    } catch (error) {
      console.error(`Error updating record ${recordId} in ${tableName}:`, error)
      throw error
    }
  }

  // Delete a record
  static async deleteRecord(tableName: string, recordId: string): Promise<boolean> {
    try {
      await base(tableName).destroy([recordId])
      return true
    } catch (error) {
      console.error(`Error deleting record ${recordId} from ${tableName}:`, error)
      return false
    }
  }

  // Batch operations
  static async createMultipleRecords(tableName: string, dataArray: FieldSet[]): Promise<AirtableRecord[]> {
    try {
      const records = await base(tableName).create(dataArray)
      
      return records.map(record => ({
        id: record.id,
        fields: record.fields,
        createdTime: record.get('createdTime') as string
      }))
    } catch (error) {
      console.error(`Error creating multiple records in ${tableName}:`, error)
      throw error
    }
  }

  // Helper method to build filter formulas
  static buildFilterFormula(conditions: { [key: string]: string | number }): string {
    const formulas = Object.entries(conditions).map(([field, value]) => {
      if (typeof value === 'string') {
        return `{${field}} = "${value}"`
      } else {
        return `{${field}} = ${value}`
      }
    })
    
    return formulas.length > 1 ? `AND(${formulas.join(', ')})` : formulas[0]
  }
}