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

    console.log('❌ Rejecting connection request:', connectionId, 'by user:', currentUser)

    // Find the connection
    const connectionIndex = connections.findIndex(conn => conn.id === connectionId)
    
    if (connectionIndex === -1) {
      return NextResponse.json({ error: 'Connection request not found' }, { status: 404 })
    }

    const connection = connections[connectionIndex]

    // Verify the current user is the recipient of the request
    if (connection.toUser !== currentUser) {
      return NextResponse.json({ error: 'Unauthorized to reject this connection' }, { status: 403 })
    }

    // Remove the connection request (reject by deletion)
    connections.splice(connectionIndex, 1)

    console.log('✅ Connection request rejected successfully')
    return NextResponse.json({ message: 'Connection request rejected' })

  } catch (error) {
    console.error('Error rejecting connection:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 