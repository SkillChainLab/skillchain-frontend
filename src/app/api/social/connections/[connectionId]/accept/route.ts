import { NextRequest, NextResponse } from 'next/server'
import { updateConnectionStatus } from '@/lib/database'

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

    // Update connection status in database
    const updatedConnection = await updateConnectionStatus(connectionId, 'accepted')
    
    if (!updatedConnection) {
      return NextResponse.json({ error: 'Connection request not found' }, { status: 404 })
    }

    // Verify the current user is the recipient of the request
    if (updatedConnection.toUser !== currentUser) {
      return NextResponse.json({ error: 'Unauthorized to accept this connection' }, { status: 403 })
    }

    console.log('✅ Connection request accepted successfully')
    return NextResponse.json({
      id: updatedConnection._id?.toString(),
      fromUser: updatedConnection.fromUser,
      toUser: updatedConnection.toUser,
      status: updatedConnection.status,
      createdAt: updatedConnection.createdAt,
      updatedAt: updatedConnection.updatedAt
    })

  } catch (error) {
    console.error('Error accepting connection:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 