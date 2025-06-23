import { NextRequest, NextResponse } from 'next/server'

// Simple in-memory storage as fallback
const inMemoryUsers: any[] = []

export async function POST(request: NextRequest) {
  try {
    console.log('📝 Register API called')
    
    // Parse request body
    let body
    try {
      body = await request.json()
      console.log('📝 Request body received:', JSON.stringify(body, null, 2))
    } catch (parseError) {
      console.error('❌ Failed to parse request body:', parseError)
      return NextResponse.json({ 
        error: 'Invalid JSON in request body',
        details: parseError instanceof Error ? parseError.message : 'Unknown parsing error'
      }, { status: 400 })
    }
    
    const { 
      walletAddress, 
      displayName, 
      bio, 
      location, 
      website, 
      github, 
      linkedin, 
      twitter, 
      avatar,
      transactionHash // Hash of the blockchain transaction
    } = body
    
    if (!walletAddress || !displayName) {
      console.error('❌ Missing required fields:', { walletAddress: !!walletAddress, displayName: !!displayName })
      return NextResponse.json({ 
        error: 'Wallet address and display name are required' 
      }, { status: 400 })
    }
    
    console.log('📝 Register profile for wallet:', walletAddress)
    console.log('📝 Transaction hash:', transactionHash)
    
    // Try to use MongoDB, fallback to in-memory storage
    let user
    let usingMongoDB = false
    
    try {
      console.log('🔄 Attempting to use MongoDB...')
      const dbModule = await import('@/lib/database')
      const { createOrUpdateUser, updateUserBlockchainSync } = dbModule
      console.log('✅ Database module imported successfully')
      
      const userData = {
        walletAddress,
        displayName,
        bio: bio || '',
        location: location || '',
        website: website || '',
        github: github || '',
        linkedin: linkedin || '',
        twitter: twitter || '',
        avatar: avatar || '',
        reputationScore: 100,
        profileCreatedOnBlockchain: !!transactionHash,
        lastSyncWithBlockchain: transactionHash ? new Date() : undefined
      }
      
      user = await createOrUpdateUser(userData)
      
      if (transactionHash) {
        await updateUserBlockchainSync(walletAddress)
      }
      
      usingMongoDB = true
      console.log('✅ User saved to MongoDB successfully')
      
    } catch (dbError) {
      console.warn('⚠️ MongoDB not available, using in-memory storage:', dbError)
      
      // Fallback to in-memory storage
      const now = new Date()
      const existingUserIndex = inMemoryUsers.findIndex(u => u.walletAddress === walletAddress)
      
      user = {
        walletAddress,
        displayName,
        bio: bio || '',
        location: location || '',
        website: website || '',
        github: github || '',
        linkedin: linkedin || '',
        twitter: twitter || '',
        avatar: avatar || '',
        reputationScore: 100,
        profileCreatedOnBlockchain: !!transactionHash,
        lastSyncWithBlockchain: transactionHash ? now : undefined,
        createdAt: now,
        updatedAt: now
      }
      
      if (existingUserIndex >= 0) {
        inMemoryUsers[existingUserIndex] = { ...inMemoryUsers[existingUserIndex], ...user }
        user = inMemoryUsers[existingUserIndex]
      } else {
        inMemoryUsers.push(user)
      }
      
      console.log('✅ User saved to in-memory storage')
    }
    
    return NextResponse.json({
      success: true,
      message: `Profile registered successfully${usingMongoDB ? ' (MongoDB)' : ' (In-Memory)'}`,
      user: {
        walletAddress: user.walletAddress,
        displayName: user.displayName,
        bio: user.bio,
        location: user.location,
        website: user.website,
        github: user.github,
        linkedin: user.linkedin,
        twitter: user.twitter,
        avatar: user.avatar,
        reputationScore: user.reputationScore,
        profileCreatedOnBlockchain: user.profileCreatedOnBlockchain,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    })
    
  } catch (error) {
    console.error('❌ Register API error:', error)
    console.error('❌ Error stack:', error instanceof Error ? error.stack : 'No stack trace')
    
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error',
      stack: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.stack : 'No stack') : undefined
    }, { status: 500 })
  }
} 