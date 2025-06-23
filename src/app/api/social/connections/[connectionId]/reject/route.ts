import { NextRequest, NextResponse } from 'next/server'
import { deleteConnection, getConnectionsCollection } from '@/lib/database'

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

    // First, find the connection to verify authorization
    const connectionsCollection = await getConnectionsCollection()
    const { ObjectId } = await import('mongodb')
    
    const connection = await connectionsCollection.findOne({ _id: new ObjectId(connectionId) })
    
    if (!connection) {
      return NextResponse.json({ error: 'Connection request not found' }, { status: 404 })
    }

    // Verify the current user is the recipient of the request
    if (connection.toUser !== currentUser) {
      return NextResponse.json({ error: 'Unauthorized to reject this connection' }, { status: 403 })
    }

    // Delete the connection request (reject by deletion)
    const deleted = await deleteConnection(connectionId)
    
    if (!deleted) {
      return NextResponse.json({ error: 'Failed to reject connection request' }, { status: 500 })
    }

    console.log('✅ Connection request rejected successfully')
    return NextResponse.json({ message: 'Connection request rejected' })

  } catch (error) {
    console.error('Error rejecting connection:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 