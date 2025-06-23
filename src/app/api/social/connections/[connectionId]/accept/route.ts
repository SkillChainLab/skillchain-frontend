import { NextRequest, NextResponse } from 'next/server'
import { updateConnectionStatus, findConnectionById } from '@/lib/database'

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
    
    console.log('✅ Accepting connection request:', connectionId, 'by user:', currentUser)

    // Find the connection to verify it exists and user has permission
    const connection = await findConnectionById(connectionId)
    
    if (!connection) {
      return NextResponse.json({ error: 'Connection request not found' }, { status: 404 })
    }
    
    // Verify that the current user is the recipient of the request
    if (connection.toUser !== currentUser) {
      return NextResponse.json({ error: 'Unauthorized to accept this request' }, { status: 403 })
    }
    
    // Check if already processed
    if (connection.status !== 'pending') {
      return NextResponse.json({ 
        error: `Connection request already ${connection.status}` 
      }, { status: 400 })
    }

    // Update connection status to accepted
    const updatedConnection = await updateConnectionStatus(connectionId, 'accepted')
    
    if (!updatedConnection) {
      return NextResponse.json({ error: 'Failed to accept connection' }, { status: 500 })
    }
    
    console.log('✅ Connection request accepted successfully')
    
    return NextResponse.json({
      message: 'Connection request accepted',
      connection: {
        id: updatedConnection._id,
        fromUser: updatedConnection.fromUser,
        toUser: updatedConnection.toUser,
        status: updatedConnection.status,
        createdAt: updatedConnection.createdAt,
        updatedAt: updatedConnection.updatedAt
      }
    })

  } catch (error) {
    console.error('Error accepting connection request:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 