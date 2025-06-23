import { NextRequest, NextResponse } from 'next/server'
import { deleteConnection, findConnectionById } from '@/lib/database'

export async function POST(
  request: NextRequest,
  { params }: { params: { connectionId: string } }
) {
  try {
    const { connectionId } = params
    
    // Get current user from Authorization header
    const authHeader = request.headers.get('Authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }
    
    const currentUser = authHeader.substring(7) // Remove 'Bearer ' prefix
    
    console.log('❌ Rejecting connection request:', connectionId, 'by user:', currentUser)

    // Find the connection to verify it exists and user has permission
    const connection = await findConnectionById(connectionId)
    
    if (!connection) {
      return NextResponse.json({ error: 'Connection request not found' }, { status: 404 })
    }
    
    // Verify that the current user is the recipient of the request
    if (connection.toUser !== currentUser) {
      return NextResponse.json({ error: 'Unauthorized to reject this request' }, { status: 403 })
    }
    
    // Check if already processed
    if (connection.status !== 'pending') {
      return NextResponse.json({ 
        error: `Connection request already ${connection.status}` 
      }, { status: 400 })
    }

    // Delete the connection request (reject by removing)
    const deleted = await deleteConnection(connectionId)
    
    if (!deleted) {
      return NextResponse.json({ error: 'Failed to reject connection' }, { status: 500 })
    }
    
    console.log('✅ Connection request rejected successfully')
    
    return NextResponse.json({
      message: 'Connection request rejected',
      connectionId
    })

  } catch (error) {
    console.error('Error rejecting connection request:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 