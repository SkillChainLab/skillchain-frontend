import { NextRequest, NextResponse } from 'next/server'
import { getConversationMessages, markMessagesAsRead, findUserByWallet } from '@/lib/database'

export async function GET(
  request: NextRequest,
  { params }: { params: { conversationId: string } }
) {
  try {
    const { conversationId } = params
    
    // Get current user from Authorization header
    const authHeader = request.headers.get('Authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }
    
    const currentUser = authHeader.substring(7) // Remove 'Bearer ' prefix
    
    console.log('📨 Getting messages for conversation:', conversationId, 'user:', currentUser)

    try {
      // Get messages for the conversation
      const messages = await getConversationMessages(conversationId)
      
      // Format messages with sender details
      const formattedMessages = await Promise.all(
        messages.map(async (message) => {
          const senderDetails = await findUserByWallet(message.senderId)
          
          return {
            id: message._id?.toString(),
            senderId: message.senderId,
            senderName: senderDetails?.displayName || 'Unknown User',
            senderAvatar: senderDetails?.avatar || '',
            content: message.content,
            type: message.type,
            attachments: message.attachments || [],
            isRead: message.isRead,
            createdAt: message.createdAt,
            editedAt: message.editedAt
          }
        })
      )
      
      // Mark messages as read for current user
      await markMessagesAsRead(conversationId, currentUser)
      
      console.log('✅ Found', formattedMessages.length, 'messages')
      
      return NextResponse.json({
        messages: formattedMessages.reverse() // Return in chronological order
      })

    } catch (dbError) {
      console.error('Database error:', dbError)
      return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }

  } catch (error) {
    console.error('Error getting messages:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 