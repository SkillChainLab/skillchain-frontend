import { NextRequest, NextResponse } from 'next/server'

// Simple in-memory storage as fallback (shared with register)
const inMemoryUsers: any[] = []

export async function POST(request: NextRequest) {
  try {
    const { walletAddress, signature } = await request.json()
    
    if (!walletAddress) {
      return NextResponse.json({ error: 'Wallet address is required' }, { status: 400 })
    }
    
    console.log('🔑 Login attempt for wallet:', walletAddress)
    
    let user
    let usingMongoDB = false
    
    try {
      console.log('🔄 Attempting to use MongoDB...')
      const dbModule = await import('@/lib/database')
      const { findUserByWallet, syncUserFromBlockchain, createOrUpdateUser } = dbModule
      console.log('✅ Database module imported successfully')
      
      // Check if user exists in database
      user = await findUserByWallet(walletAddress)
      
      if (!user) {
        console.log('👤 User not found in database, attempting to sync from blockchain...')
        
        // Try to sync from blockchain first
        user = await syncUserFromBlockchain(walletAddress)
        
        if (!user) {
          console.log('👤 User not found on blockchain either, creating minimal profile...')
          
          // Create minimal user profile if not found anywhere
          const userData = {
            walletAddress,
            displayName: `User ${walletAddress.slice(0, 8)}...`,
            bio: '',
            location: '',
            website: '',
            github: '',
            linkedin: '',
            twitter: '',
            avatar: '',
            reputationScore: 100,
            profileCreatedOnBlockchain: false,
            lastSyncWithBlockchain: undefined
          }
          
          user = await createOrUpdateUser(userData)
          console.log('✅ Created minimal user profile for:', walletAddress)
        }
      } else {
        console.log('👤 User found in database:', user.displayName)
        
        // If user exists but hasn't been synced recently, try to sync from blockchain
        const lastSync = user.lastSyncWithBlockchain
        const now = new Date()
        const hoursSinceLastSync = lastSync ? (now.getTime() - lastSync.getTime()) / (1000 * 60 * 60) : Infinity
        
        if (hoursSinceLastSync > 24) { // Sync every 24 hours
          console.log('🔄 User data is stale, attempting to sync from blockchain...')
          const syncedUser = await syncUserFromBlockchain(walletAddress)
          if (syncedUser) {
            user = syncedUser
            console.log('✅ User data synced from blockchain')
          }
        }
      }
      
      usingMongoDB = true
      console.log('✅ Login successful with MongoDB')
      
    } catch (dbError) {
      console.warn('⚠️ MongoDB not available, using in-memory storage:', dbError)
      
      // Fallback to in-memory storage
      user = inMemoryUsers.find(u => u.walletAddress === walletAddress)
      
      if (!user) {
        console.log('👤 User not found in memory, creating minimal profile...')
        const now = new Date()
        user = {
          walletAddress,
          displayName: `User ${walletAddress.slice(0, 8)}...`,
          bio: '',
          location: '',
          website: '',
          github: '',
          linkedin: '',
          twitter: '',
          avatar: '',
          reputationScore: 100,
          profileCreatedOnBlockchain: false,
          lastSyncWithBlockchain: undefined,
          createdAt: now,
          updatedAt: now
        }
        inMemoryUsers.push(user)
        console.log('✅ Created minimal user profile in memory')
      } else {
        console.log('👤 User found in memory:', user.displayName)
      }
    }
    
    // Generate a simple JWT-like token (in production, use proper JWT)
    const token = Buffer.from(JSON.stringify({
      walletAddress,
      timestamp: Date.now()
    })).toString('base64')
    
    console.log(`✅ Login successful for: ${walletAddress} ${usingMongoDB ? '(MongoDB)' : '(In-Memory)'}`)
    
    return NextResponse.json({
      success: true,
      user: {
        walletAddress: user.walletAddress,
        displayName: user.displayName,
        bio: user.bio,
        location: user.location,
        avatar: user.avatar,
        reputationScore: user.reputationScore,
        profileCreatedOnBlockchain: user.profileCreatedOnBlockchain,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      },
      token,
      storage: usingMongoDB ? 'MongoDB' : 'In-Memory'
    })
    
  } catch (error) {
    console.error('❌ Login error:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
} 