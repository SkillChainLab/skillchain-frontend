import { NextRequest, NextResponse } from 'next/server'

// SkillChain blockchain API configuration
const SKILLCHAIN_API_URL = process.env.NEXT_PUBLIC_SKILLCHAIN_API || 'http://localhost:1317'

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

interface BlockchainSearchResponse {
  profiles: BlockchainProfile[]
  search_criteria?: any
  total_count?: number
}

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const query = url.searchParams.get('q') || ''
    const limit = parseInt(url.searchParams.get('limit') || '20')
    
    // Get current user from headers
    const currentUser = request.headers.get('x-wallet-address')
    
    if (!currentUser) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    if (!query.trim()) {
      return NextResponse.json({ error: 'Search query is required' }, { status: 400 })
    }

    console.log('🔍 Searching blockchain users with query:', query, 'for user:', currentUser)

    try {
      // Search profiles on SkillChain blockchain
      const searchUrl = `${SKILLCHAIN_API_URL}/skillchain/v1/profiles/search?q=${encodeURIComponent(query)}`
      const response = await fetch(searchUrl)
      
      if (!response.ok) {
        throw new Error(`Blockchain search API error: ${response.status}`)
      }

      const searchData: BlockchainSearchResponse = await response.json()
      console.log('📋 Blockchain search results:', searchData.profiles?.length || 0)

      if (!searchData.profiles || searchData.profiles.length === 0) {
        console.log('📝 No search results found on blockchain')
        return NextResponse.json([])
      }

      // Convert blockchain profiles to social profile format
      const results = searchData.profiles
        .filter(profile => profile.owner !== currentUser) // Exclude current user
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
          location: profile.location,
          website: profile.website,
          github: profile.github,
          linkedin: profile.linkedin,
          twitter: profile.twitter,
          reputationScore: profile.reputationScore
        }))

      console.log('✅ Returning blockchain search results:', results.length, 'profiles')
      return NextResponse.json(results)

    } catch (blockchainError: any) {
      console.log('❌ Blockchain search API not available:', blockchainError.message)
      
      // Fallback to sample search results
      const sampleProfiles = [
        {
          walletAddress: 'skillchain1sample1user123456789',
          displayName: 'Alice Johnson',
          avatar: '',
          isOnline: false,
          lastSeen: new Date().toISOString(),
          connections: 15,
          bio: 'Full-stack developer specializing in blockchain',
          skills: ['React', 'Solidity', 'Node.js']
        },
        {
          walletAddress: 'skillchain1sample2user987654321',
          displayName: 'Bob Smith',
          avatar: '',
          isOnline: true,
          lastSeen: new Date().toISOString(),
          connections: 23,
          bio: 'UI/UX Designer with Web3 experience',
          skills: ['Figma', 'React', 'Design Systems']
        },
        {
          walletAddress: 'skillchain1sample3user456789123',
          displayName: 'Carol Davis',
          avatar: '',
          isOnline: false,
          lastSeen: new Date(Date.now() - 3600000).toISOString(),
          connections: 8,
          bio: 'Smart contract auditor and security expert',
          skills: ['Solidity', 'Security', 'Rust']
        }
      ]

      // Filter sample results based on search query
      const queryLower = query.toLowerCase()
      const filteredSampleResults = sampleProfiles
        .filter(profile => 
          profile.walletAddress !== currentUser && (
            profile.displayName.toLowerCase().includes(queryLower) ||
            profile.bio.toLowerCase().includes(queryLower) ||
            profile.skills.some(skill => skill.toLowerCase().includes(queryLower)) ||
            profile.walletAddress.toLowerCase().includes(queryLower)
          )
        )
        .slice(0, limit)

      console.log('📝 Using fallback sample search results:', filteredSampleResults.length, 'profiles')
      return NextResponse.json(filteredSampleResults)
    }

  } catch (error) {
    console.error('Error searching users:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 