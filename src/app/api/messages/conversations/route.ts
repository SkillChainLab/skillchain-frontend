import { NextRequest, NextResponse } from 'next/server'
import { getUserConversations, getConnectedUsers, findUserByWallet, getMessagesCollection } from '@/lib/database'

export async function GET(request: NextRequest) {
  try {
    // Get current user from Authorization header
    const authHeader = request.headers.get('Authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }
    
    const currentUser = authHeader.substring(7) // Remove 'Bearer ' prefix
    
    console.log('💬 Getting conversations for user:', currentUser)

    try {
      // Get user's conversations
      const conversations = await getUserConversations(currentUser)
      
      // Get connected users for creating new conversations
      const connectedUsers = await getConnectedUsers(currentUser)
      
      // Get messages collection for unread count
      const messagesCollection = await getMessagesCollection()
      const { ObjectId } = await import('mongodb')
      
      // Format conversations with participant details and unread count
      const formattedConversations = await Promise.all(
        conversations.map(async (conversation) => {
          // Find the other participant
          const otherParticipant = conversation.participants.find(p => p !== currentUser)
          const participantDetails = await findUserByWallet(otherParticipant || '')
          
          // Get unread message count
          const unreadCount = await messagesCollection.countDocuments({
            conversationId: conversation._id,
            senderId: { $ne: currentUser },
            isRead: false
          })
          
          // Get last message
          const lastMessage = await messagesCollection.findOne(
            { conversationId: conversation._id },
            { sort: { createdAt: -1 } }
          )
          
          return {
            id: conversation._id?.toString(),
            participantId: otherParticipant,
            participantName: participantDetails?.displayName || 'Unknown User',
            participantAvatar: participantDetails?.avatar || '',
            lastActivity: conversation.lastActivity,
            createdAt: conversation.createdAt,
            unreadCount,
            lastMessage: lastMessage?.content || '',
            lastMessageSender: lastMessage?.senderId || ''
          }
        })
      )
      
      // Format connected users
      const formattedConnectedUsers = connectedUsers.map(user => ({
        walletAddress: user.walletAddress,
        displayName: user.displayName,
        avatar: user.avatar || ''
      }))
      
      console.log('✅ Found', formattedConversations.length, 'conversations and', formattedConnectedUsers.length, 'connected users')
      
      return NextResponse.json({
        conversations: formattedConversations,
        connectedUsers: formattedConnectedUsers
      })

    } catch (dbError) {
      console.error('Database error:', dbError)
      return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }

  } catch (error) {
    console.error('Error getting conversations:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 