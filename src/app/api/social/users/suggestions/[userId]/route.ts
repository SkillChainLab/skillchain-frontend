import { NextRequest, NextResponse } from 'next/server'

// SkillChain blockchain API configuration - Updated for Virtual Server
const SKILLCHAIN_API_URL = process.env.NEXT_PUBLIC_SKILLCHAIN_API || 'http://45.83.20.3:1317'

interface BlockchainProfile {
  index: string
  owner: string
  displayName: string
  bio: string
  location: string
  website: string
  github: string
  linkedin: string
  twitter: string
  avatar: string
  reputationScore: number
  createdAt: number
  updatedAt: number
  creator?: string
}

interface BlockchainProfileResponse {
  profiles: BlockchainProfile[]
  pagination?: any
  total_count?: number
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params
    const url = new URL(request.url)
    const limit = parseInt(url.searchParams.get('limit') || '10')

    console.log('🔍 Getting suggestions for user:', userId, 'from blockchain')

    try {
      // Fetch all profiles from SkillChain blockchain
      const response = await fetch(`${SKILLCHAIN_API_URL}/skillchain/v1/profiles`)
      
      if (!response.ok) {
        throw new Error(`Blockchain API error: ${response.status}`)
      }

      const profileData: BlockchainProfileResponse = await response.json()
      console.log('📋 Fetched profiles from blockchain:', profileData.profiles?.length || 0)

      if (!profileData.profiles || profileData.profiles.length === 0) {
        console.log('📝 No profiles found on blockchain')
        return NextResponse.json([])
      }

      // Convert blockchain profiles to social profile format
      const suggestions = profileData.profiles
        .filter(profile => profile.owner !== userId) // Exclude current user
        .slice(0, limit)
        .map(profile => ({
          walletAddress: profile.owner,
          displayName: profile.displayName || `User ${profile.owner.slice(-6)}`,
          avatar: profile.avatar ? `https://ipfs.io/ipfs/${profile.avatar}` : '',
          isOnline: Math.random() > 0.5, // Random online status for demo
          lastSeen: new Date(profile.updatedAt * 1000).toISOString(),
          connections: Math.floor(Math.random() * 50) + 5, // Random connection count for demo
          bio: profile.bio || 'SkillChain user',
          skills: [], // Skills would need separate API call
          mutualConnections: Math.floor(Math.random() * 5), // Random mutual connections for demo
          location: profile.location,
          website: profile.website,
          github: profile.github,
          linkedin: profile.linkedin,
          twitter: profile.twitter,
          reputationScore: profile.reputationScore
        }))

      console.log('✅ Returning blockchain-based suggestions:', suggestions.length, 'profiles')
      return NextResponse.json(suggestions)

    } catch (blockchainError: any) {
      console.log('❌ Blockchain API not available:', blockchainError.message)
      
      // Fallback to sample data when blockchain is not available
      const sampleProfiles = [
        {
          walletAddress: 'skillchain1sample1user123456789',
          displayName: 'Alice Johnson',
          avatar: '',
          isOnline: false,
          lastSeen: new Date().toISOString(),
          connections: 15,
          bio: 'Full-stack developer specializing in blockchain',
          skills: ['React', 'Solidity', 'Node.js'],
          mutualConnections: 0
        },
        {
          walletAddress: 'skillchain1sample2user987654321',
          displayName: 'Bob Smith',
          avatar: '',
          isOnline: true,
          lastSeen: new Date().toISOString(),
          connections: 23,
          bio: 'UI/UX Designer with Web3 experience',
          skills: ['Figma', 'React', 'Design Systems'],
          mutualConnections: 2
        },
        {
          walletAddress: 'skillchain1sample3user456789123',
          displayName: 'Carol Davis',
          avatar: '',
          isOnline: false,
          lastSeen: new Date(Date.now() - 3600000).toISOString(),
          connections: 8,
          bio: 'Smart contract auditor and security expert',
          skills: ['Solidity', 'Security', 'Rust'],
          mutualConnections: 1
        }
      ]

      const filteredProfiles = sampleProfiles
        .filter(profile => profile.walletAddress !== userId)
        .slice(0, limit)

      console.log('📝 Using fallback sample data:', filteredProfiles.length, 'profiles')
      return NextResponse.json(filteredProfiles)
    }

  } catch (error) {
    console.error('Error fetching connection suggestions:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 