import { NextRequest, NextResponse } from 'next/server'
import { findUserConnections, findUserByWallet } from '@/lib/database'

export async function GET(request: NextRequest) {
  try {
    // Get current user from Authorization header
    const authHeader = request.headers.get('Authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }
    
    const currentUser = authHeader.substring(7) // Remove 'Bearer ' prefix
    
    console.log('📬 Getting notifications for user:', currentUser)

    // Get pending connection requests (incoming notifications)
    const pendingConnections = await findUserConnections(currentUser, 'pending')
    
    // Filter to only incoming requests (where current user is the recipient)
    const incomingRequests = pendingConnections.filter(conn => conn.toUser === currentUser)
    
    // Get sender details for each notification
    const notifications = await Promise.all(
      incomingRequests.map(async (connection) => {
        const senderUser = await findUserByWallet(connection.fromUser)
        
        return {
          id: connection._id,
          type: 'connection_request',
          fromUser: {
            walletAddress: connection.fromUser,
            displayName: senderUser?.displayName || `User ${connection.fromUser.slice(0, 8)}...`,
            avatar: senderUser?.avatar || ''
          },
          message: `${senderUser?.displayName || 'A user'} wants to connect with you`,
          createdAt: connection.createdAt,
          connectionId: connection._id
        }
      })
    )
    
    console.log('✅ Found', notifications.length, 'notifications')
    
    return NextResponse.json({
      notifications,
      count: notifications.length
    })

  } catch (error) {
    console.error('Error getting notifications:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 