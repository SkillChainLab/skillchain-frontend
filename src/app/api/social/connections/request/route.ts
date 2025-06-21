import { NextRequest, NextResponse } from 'next/server'

// Simple in-memory storage for connections (in production, this would be a proper database)
const connections: any[] = []

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

    // Check if connection already exists
    const existingConnection = connections.find(conn => 
      (conn.fromUser === fromUser && conn.toUser === toUser) ||
      (conn.fromUser === toUser && conn.toUser === fromUser)
    )

    if (existingConnection) {
      return NextResponse.json({ error: 'Connection already exists or pending' }, { status: 409 })
    }

    // Create new connection request
    const newConnection = {
      id: Date.now().toString(),
      fromUser,
      toUser,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    }

    connections.push(newConnection)

    console.log('✅ Connection request created successfully')
    return NextResponse.json({
      id: newConnection.id,
      fromUser: newConnection.fromUser,
      toUser: newConnection.toUser,
      status: newConnection.status,
      createdAt: newConnection.createdAt,
      updatedAt: newConnection.updatedAt
    })

  } catch (error) {
    console.error('Error creating connection request:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 