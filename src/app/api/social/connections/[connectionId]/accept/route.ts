import { NextRequest, NextResponse } from 'next/server'

// Simple in-memory storage for connections (in production, this would be a proper database)
const connections: any[] = []

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ connectionId: string }> }
) {
  try {
    const { connectionId } = await params
    
    // Get current user from Authorization header
    const authHeader = request.headers.get('Authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }
    
    const currentUser = authHeader.substring(7) // Remove 'Bearer ' prefix

    console.log('✅ Accepting connection request:', connectionId, 'by user:', currentUser)

    // Find the connection
    const connectionIndex = connections.findIndex(conn => conn.id === connectionId)
    
    if (connectionIndex === -1) {
      return NextResponse.json({ error: 'Connection request not found' }, { status: 404 })
    }

    const connection = connections[connectionIndex]

    // Verify the current user is the recipient of the request
    if (connection.toUser !== currentUser) {
      return NextResponse.json({ error: 'Unauthorized to accept this connection' }, { status: 403 })
    }

    // Update connection status
    connections[connectionIndex] = {
      ...connection,
      status: 'accepted',
      updatedAt: new Date()
    }

    console.log('✅ Connection request accepted successfully')
    return NextResponse.json({
      id: connections[connectionIndex].id,
      fromUser: connections[connectionIndex].fromUser,
      toUser: connections[connectionIndex].toUser,
      status: connections[connectionIndex].status,
      createdAt: connections[connectionIndex].createdAt,
      updatedAt: connections[connectionIndex].updatedAt
    })

  } catch (error) {
    console.error('Error accepting connection:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 