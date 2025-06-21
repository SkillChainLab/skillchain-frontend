import { NextRequest, NextResponse } from 'next/server'

// SkillChain blockchain API configuration
const SKILLCHAIN_API_URL = process.env.NEXT_PUBLIC_SKILLCHAIN_API || 'http://localhost:1317'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ address: string }> }
) {
  try {
    const { address } = await params
    
    console.log('🔍 Fetching profile for address:', address)
    
    // Forward request to SkillChain blockchain
    const response = await fetch(`${SKILLCHAIN_API_URL}/skillchain/v1/profiles/${address}`)
    
    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
      }
      throw new Error(`Blockchain API error: ${response.status}`)
    }
    
    const data = await response.json()
    console.log('✅ Profile data retrieved:', data.profile?.displayName || 'Unknown')
    
    return NextResponse.json(data)
    
  } catch (error: any) {
    console.error('Error fetching profile:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch profile',
      details: error.message 
    }, { status: 500 })
  }
} 