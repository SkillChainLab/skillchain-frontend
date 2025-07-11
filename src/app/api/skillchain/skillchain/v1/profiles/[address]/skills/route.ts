import { NextRequest, NextResponse } from 'next/server'

// SkillChain blockchain API configuration - Updated for Virtual Server
const SKILLCHAIN_API_URL = process.env.NEXT_PUBLIC_SKILLCHAIN_API || 'http://45.83.20.3:1317'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ address: string }> }
) {
  try {
    const { address } = await params
    
    console.log('🔍 Fetching skills for address:', address)
    
    // Forward request to SkillChain blockchain
    const response = await fetch(`${SKILLCHAIN_API_URL}/skillchain/v1/profiles/${address}/skills`)
    
    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json({ skills: [] }, { status: 200 })
      }
      throw new Error(`Blockchain API error: ${response.status}`)
    }
    
    const data = await response.json()
    console.log('✅ Skills data retrieved:', data.skills?.length || 0, 'skills')
    
    return NextResponse.json(data)
    
  } catch (error: any) {
    console.error('Error fetching skills:', error)
    return NextResponse.json({ 
      skills: [],
      error: 'Failed to fetch skills',
      details: error.message 
    }, { status: 200 })
  }
} 