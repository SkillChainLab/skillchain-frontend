import { NextRequest, NextResponse } from 'next/server'
import { findOrCreateConversation, findUserByWallet } from '@/lib/database'

// In-memory store for typing status (in production, use Redis)
const typingStatus = new Map<string, { userId: string; timestamp: number }>()

export async function POST(request: NextRequest) {
  try {
    // Get current user from Authorization header
    const authHeader = request.headers.get('Authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }
    
    const currentUser = authHeader.substring(7) // Remove 'Bearer ' prefix
    
    const body = await request.json()
    const { recipientId, isTyping } = body
    
    if (!recipientId) {
      return NextResponse.json({ error: 'Recipient is required' }, { status: 400 })
    }

    try {
      // Verify recipient exists
      const recipient = await findUserByWallet(recipientId)
      if (!recipient) {
        return NextResponse.json({ error: 'Recipient not found' }, { status: 404 })
      }
      
      // Find or create conversation between users
      const conversation = await findOrCreateConversation([currentUser, recipientId])
      const conversationId = conversation._id!.toString()
      
      if (isTyping) {
        // Set typing status
        typingStatus.set(conversationId, {
          userId: currentUser,
          timestamp: Date.now()
        })
      } else {
        // Remove typing status
        typingStatus.delete(conversationId)
      }
      
      return NextResponse.json({ success: true })

    } catch (dbError) {
      console.error('Database error:', dbError)
      return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }

  } catch (error) {
    console.error('Error updating typing status:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    // Get current user from Authorization header
    const authHeader = request.headers.get('Authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }
    
    const currentUser = authHeader.substring(7) // Remove 'Bearer ' prefix
    
    const { searchParams } = new URL(request.url)
    const conversationId = searchParams.get('conversationId')
    
    if (!conversationId) {
      return NextResponse.json({ error: 'Conversation ID is required' }, { status: 400 })
    }

    try {
      // Get typing status for conversation
      const typing = typingStatus.get(conversationId)
      
      // Clean up expired typing status (older than 3 seconds)
      if (typing && Date.now() - typing.timestamp > 3000) {
        typingStatus.delete(conversationId)
        return NextResponse.json({ isTyping: false })
      }
      
      // Return typing status only if it's not the current user typing
      const isOtherUserTyping = typing && typing.userId !== currentUser
      
      return NextResponse.json({ 
        isTyping: isOtherUserTyping,
        typingUserId: isOtherUserTyping ? typing.userId : null
      })

    } catch (dbError) {
      console.error('Database error:', dbError)
      return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }

  } catch (error) {
    console.error('Error getting typing status:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 