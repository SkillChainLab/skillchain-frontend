import { NextRequest, NextResponse } from 'next/server'
import { getUsersCollection } from '@/lib/database'

export async function GET(request: NextRequest) {
  try {
    // Get current user from Authorization header (optional for listing users)
    const authHeader = request.headers.get('Authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Wallet address required for social features' }, { status: 401 })
    }
    
    const currentUser = authHeader.substring(7) // Remove 'Bearer ' prefix
    
    console.log('👥 Getting all users for:', currentUser)

    try {
      // Get all users from database
      const collection = await getUsersCollection()
      const users = await collection.find({}).sort({ createdAt: -1 }).toArray()
      
      // Filter out sensitive information and format response
      const publicUsers = users.map(user => ({
        walletAddress: user.walletAddress,
        displayName: user.displayName || 'SkillChain User',
        bio: user.bio || '',
        location: user.location || '',
        website: user.website || '',
        github: user.github || '',
        linkedin: user.linkedin || '',
        twitter: user.twitter || '',
        avatar: user.avatar || '',
        reputationScore: user.reputationScore || 100,
        profileCreatedOnBlockchain: user.profileCreatedOnBlockchain || false
      }))
      
      console.log('✅ Found', publicUsers.length, 'users')
      
      return NextResponse.json({
        users: publicUsers,
        count: publicUsers.length
      })

    } catch (dbError) {
      console.error('Database error, falling back to in-memory storage:', dbError)
      
      // Fallback to in-memory storage (if available)
      // For now, return empty array as fallback
      return NextResponse.json({
        users: [],
        count: 0,
        message: 'Database temporarily unavailable'
      })
    }

  } catch (error) {
    console.error('Error getting users:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 