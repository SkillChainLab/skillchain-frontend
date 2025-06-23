import { NextRequest, NextResponse } from 'next/server'
import { findOrCreateConversation, createMessage, findUserByWallet } from '@/lib/database'

export async function POST(request: NextRequest) {
  try {
    // Get current user from Authorization header
    const authHeader = request.headers.get('Authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }
    
    const currentUser = authHeader.substring(7) // Remove 'Bearer ' prefix
    
    const body = await request.json()
    const { recipientId, content, type = 'text', attachments } = body
    
    console.log('📤 Sending message from:', currentUser, 'to:', recipientId)
    
    if (!recipientId || !content) {
      return NextResponse.json({ error: 'Recipient and content are required' }, { status: 400 })
    }

    try {
      // Verify recipient exists
      const recipient = await findUserByWallet(recipientId)
      if (!recipient) {
        return NextResponse.json({ error: 'Recipient not found' }, { status: 404 })
      }
      
      // Find or create conversation between users
      const conversation = await findOrCreateConversation([currentUser, recipientId])
      
      // Create the message
      const message = await createMessage(
        conversation._id!.toString(),
        currentUser,
        content,
        type,
        attachments
      )
      
      // Get sender details for response
      const senderDetails = await findUserByWallet(currentUser)
      
      const formattedMessage = {
        id: message._id?.toString(),
        conversationId: conversation._id?.toString(),
        senderId: message.senderId,
        senderName: senderDetails?.displayName || 'Unknown User',
        senderAvatar: senderDetails?.avatar || '',
        content: message.content,
        type: message.type,
        attachments: message.attachments || [],
        isRead: message.isRead,
        createdAt: message.createdAt
      }
      
      console.log('✅ Message sent successfully')
      
      return NextResponse.json({
        message: formattedMessage,
        conversation: {
          id: conversation._id?.toString(),
          participants: conversation.participants
        }
      })

    } catch (dbError) {
      console.error('Database error:', dbError)
      return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }

  } catch (error) {
    console.error('Error sending message:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 