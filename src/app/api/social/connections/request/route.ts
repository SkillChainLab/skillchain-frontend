import { NextRequest, NextResponse } from 'next/server'
import { createConnection, findUserByWallet } from '@/lib/database'

export async function POST(request: NextRequest) {
  try {
    const { toUser } = await request.json()
    
    // Get current user from Authorization header
    const authHeader = request.headers.get('Authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }
    
    const fromUser = authHeader.substring(7) // Remove 'Bearer ' prefix
    
    if (!toUser) {
      return NextResponse.json({ error: 'toUser is required' }, { status: 400 })
    }
    
    if (fromUser === toUser) {
      return NextResponse.json({ error: 'Cannot connect to yourself' }, { status: 400 })
    }

    console.log('🤝 Creating connection request from:', fromUser, 'to:', toUser)

    // Check if both users exist in database
    const fromUserExists = await findUserByWallet(fromUser)
    const toUserExists = await findUserByWallet(toUser)
    
    if (!fromUserExists) {
      return NextResponse.json({ error: 'Sender user not found' }, { status: 404 })
    }
    
    if (!toUserExists) {
      return NextResponse.json({ error: 'Target user not found' }, { status: 404 })
    }

    try {
      // Create new connection request
      const newConnection = await createConnection(fromUser, toUser)
      
      console.log('✅ Connection request created successfully')
      return NextResponse.json({
        id: newConnection._id,
        fromUser: newConnection.fromUser,
        toUser: newConnection.toUser,
        status: newConnection.status,
        createdAt: newConnection.createdAt,
        updatedAt: newConnection.updatedAt
      })
      
    } catch (dbError: any) {
      // Handle duplicate connection error
      if (dbError.code === 11000) { // MongoDB duplicate key error
        return NextResponse.json({ error: 'Connection already exists or pending' }, { status: 409 })
      }
      throw dbError
    }

  } catch (error) {
    console.error('Error creating connection request:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 