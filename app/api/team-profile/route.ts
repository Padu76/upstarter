import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// Airtable configuration
const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID
const AIRTABLE_TABLE_NAME = 'TEAM_PROFILES'

interface TeamProfileData {
  user_id: string
  user_email: string
  full_name: string
  professional_title: string
  bio: string
  location: string
  timezone: string
  role_seeking: string
  availability: string
  start_timeline: string
  skills: string[]
  experience_years: number
  industry_focus: string[]
  previous_roles: string[]
  startup_stage_preference: string[]
  equity_expectations: string
  compensation_needs: string
  remote_preference: string
  portfolio_url?: string
  linkedin_url?: string
  github_url?: string
  website_url?: string
  team_size_preference?: string
  investment_stage_preference?: string[]
  geographic_preference?: string[]
  status: 'active' | 'inactive'
  created_at: string
  updated_at: string
}

// Helper function to call Airtable API
async function callAirtable(method: string, recordData?: any, recordId?: string) {
  const url = recordId 
    ? `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_NAME}/${recordId}`
    : `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_NAME}`

  const options: RequestInit = {
    method,
    headers: {
      'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
      'Content-Type': 'application/json',
    }
  }

  if (recordData && (method === 'POST' || method === 'PATCH')) {
    options.body = JSON.stringify({
      fields: recordData
    })
  }

  const response = await fetch(url, options)
  
  if (!response.ok) {
    const errorText = await response.text()
    console.error('Airtable API Error:', response.status, errorText)
    throw new Error(`Airtable API error: ${response.status}`)
  }

  return response.json()
}

// GET - Retrieve team profile
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Search for existing profile by user email
    const searchUrl = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_NAME}?filterByFormula={user_email}="${session.user.email}"`
    
    const response = await fetch(searchUrl, {
      headers: {
        'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
        'Content-Type': 'application/json',
      }
    })

    if (!response.ok) {
      throw new Error(`Airtable search failed: ${response.status}`)
    }

    const data = await response.json()
    
    if (data.records && data.records.length > 0) {
      const profile = data.records[0]
      return NextResponse.json({
        success: true,
        profile: {
          id: profile.id,
          ...profile.fields
        }
      })
    } else {
      return NextResponse.json({
        success: true,
        profile: null,
        message: 'No profile found'
      })
    }

  } catch (error) {
    console.error('GET team profile error:', error)
    return NextResponse.json(
      { error: 'Failed to retrieve team profile' },
      { status: 500 }
    )
  }
}

// POST - Create team profile
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    console.log('Creating team profile for:', session.user.email)

    // Validate required fields
    const requiredFields = [
      'full_name', 'professional_title', 'bio', 'location',
      'role_seeking', 'availability', 'skills', 'industry_focus',
      'startup_stage_preference', 'equity_expectations'
    ]

    for (const field of requiredFields) {
      if (!body[field] || (Array.isArray(body[field]) && body[field].length === 0)) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        )
      }
    }

    // Check if profile already exists
    const searchUrl = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_NAME}?filterByFormula={user_email}="${session.user.email}"`
    
    const searchResponse = await fetch(searchUrl, {
      headers: {
        'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
        'Content-Type': 'application/json',
      }
    })

    const searchData = await searchResponse.json()
    
    if (searchData.records && searchData.records.length > 0) {
      return NextResponse.json(
        { error: 'Profile already exists. Use PUT to update.' },
        { status: 409 }
      )
    }

    // Prepare data for Airtable
    const now = new Date().toISOString()
    const profileData: TeamProfileData = {
      user_id: session.user.email, // Using email as unique ID
      user_email: session.user.email,
      full_name: body.full_name,
      professional_title: body.professional_title,
      bio: body.bio,
      location: body.location,
      timezone: body.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
      role_seeking: body.role_seeking,
      availability: body.availability,
      start_timeline: body.start_timeline,
      skills: body.skills,
      experience_years: body.experience_years || 0,
      industry_focus: body.industry_focus,
      previous_roles: body.previous_roles || [],
      startup_stage_preference: body.startup_stage_preference,
      equity_expectations: body.equity_expectations,
      compensation_needs: body.compensation_needs,
      remote_preference: body.remote_preference,
      portfolio_url: body.portfolio_url || '',
      linkedin_url: body.linkedin_url || '',
      github_url: body.github_url || '',
      website_url: body.website_url || '',
      team_size_preference: body.team_size_preference || '',
      investment_stage_preference: body.investment_stage_preference || [],
      geographic_preference: body.geographic_preference || [],
      status: 'active',
      created_at: now,
      updated_at: now
    }

    // Convert arrays to comma-separated strings for Airtable
    const airtableData = {
      ...profileData,
      skills: profileData.skills.join(', '),
      industry_focus: profileData.industry_focus.join(', '),
      previous_roles: profileData.previous_roles.join(', '),
      startup_stage_preference: profileData.startup_stage_preference.join(', '),
      investment_stage_preference: profileData.investment_stage_preference.join(', '),
      geographic_preference: profileData.geographic_preference.join(', ')
    }

    // Create record in Airtable
    const result = await callAirtable('POST', airtableData)

    console.log('Team profile created successfully:', result.id)

    return NextResponse.json({
      success: true,
      profile: {
        id: result.id,
        ...result.fields
      },
      message: 'Team profile created successfully'
    })

  } catch (error) {
    console.error('POST team profile error:', error)
    return NextResponse.json(
      { error: 'Failed to create team profile' },
      { status: 500 }
    )
  }
}

// PUT - Update team profile
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    console.log('Updating team profile for:', session.user.email)

    // Find existing profile
    const searchUrl = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_NAME}?filterByFormula={user_email}="${session.user.email}"`
    
    const searchResponse = await fetch(searchUrl, {
      headers: {
        'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
        'Content-Type': 'application/json',
      }
    })

    const searchData = await searchResponse.json()
    
    if (!searchData.records || searchData.records.length === 0) {
      return NextResponse.json(
        { error: 'Profile not found. Use POST to create.' },
        { status: 404 }
      )
    }

    const existingRecord = searchData.records[0]

    // Prepare updated data
    const now = new Date().toISOString()
    const updatedData = {
      full_name: body.full_name,
      professional_title: body.professional_title,
      bio: body.bio,
      location: body.location,
      timezone: body.timezone,
      role_seeking: body.role_seeking,
      availability: body.availability,
      start_timeline: body.start_timeline,
      skills: Array.isArray(body.skills) ? body.skills.join(', ') : body.skills,
      experience_years: body.experience_years,
      industry_focus: Array.isArray(body.industry_focus) ? body.industry_focus.join(', ') : body.industry_focus,
      previous_roles: Array.isArray(body.previous_roles) ? body.previous_roles.join(', ') : body.previous_roles,
      startup_stage_preference: Array.isArray(body.startup_stage_preference) ? body.startup_stage_preference.join(', ') : body.startup_stage_preference,
      equity_expectations: body.equity_expectations,
      compensation_needs: body.compensation_needs,
      remote_preference: body.remote_preference,
      portfolio_url: body.portfolio_url || '',
      linkedin_url: body.linkedin_url || '',
      github_url: body.github_url || '',
      website_url: body.website_url || '',
      team_size_preference: body.team_size_preference || '',
      investment_stage_preference: Array.isArray(body.investment_stage_preference) ? body.investment_stage_preference.join(', ') : body.investment_stage_preference,
      geographic_preference: Array.isArray(body.geographic_preference) ? body.geographic_preference.join(', ') : body.geographic_preference,
      updated_at: now
    }

    // Update record in Airtable
    const result = await callAirtable('PATCH', updatedData, existingRecord.id)

    console.log('Team profile updated successfully:', result.id)

    return NextResponse.json({
      success: true,
      profile: {
        id: result.id,
        ...result.fields
      },
      message: 'Team profile updated successfully'
    })

  } catch (error) {
    console.error('PUT team profile error:', error)
    return NextResponse.json(
      { error: 'Failed to update team profile' },
      { status: 500 }
    )
  }
}

// DELETE - Delete team profile (set to inactive)
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.log('Deactivating team profile for:', session.user.email)

    // Find existing profile
    const searchUrl = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_NAME}?filterByFormula={user_email}="${session.user.email}"`
    
    const searchResponse = await fetch(searchUrl, {
      headers: {
        'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
        'Content-Type': 'application/json',
      }
    })

    const searchData = await searchResponse.json()
    
    if (!searchData.records || searchData.records.length === 0) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      )
    }

    const existingRecord = searchData.records[0]

    // Set status to inactive instead of deleting
    const updatedData = {
      status: 'inactive',
      updated_at: new Date().toISOString()
    }

    const result = await callAirtable('PATCH', updatedData, existingRecord.id)

    console.log('Team profile deactivated successfully:', result.id)

    return NextResponse.json({
      success: true,
      message: 'Team profile deactivated successfully'
    })

  } catch (error) {
    console.error('DELETE team profile error:', error)
    return NextResponse.json(
      { error: 'Failed to deactivate team profile' },
      { status: 500 }
    )
  }
}