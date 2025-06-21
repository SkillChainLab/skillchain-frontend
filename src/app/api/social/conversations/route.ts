import { NextRequest, NextResponse } from 'next/server'

// Simple in-memory storage for conversations (in production, this would be a proper database)
const conversations: any[] = []

export async function GET(request: NextRequest) {
  try {
    // Get current user from Authorization header
    const authHeader = request.headers.get('Authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }
    
    const currentUser = authHeader.substring(7) // Remove 'Bearer ' prefix

    console.log('💬 Getting conversations for user:', currentUser)

    // Filter conversations where user is a participant
    const userConversations = conversations.filter(conv => 
      conv.participants.includes(currentUser)
    )

    console.log('✅ Returning conversations:', userConversations.length)
    return NextResponse.json(userConversations)

  } catch (error) {
    console.error('Error fetching conversations:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { participantId, message } = await request.json()
    
    // Get current user from Authorization header
    const authHeader = request.headers.get('Authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }
    
    const currentUser = authHeader.substring(7) // Remove 'Bearer ' prefix

    if (!participantId || !message) {
      return NextResponse.json({ error: 'participantId and message are required' }, { status: 400 })
    }

    console.log('💬 Creating conversation between:', currentUser, 'and:', participantId)

    // Check if conversation already exists
    const existingConversation = conversations.find(conv => 
      conv.participants.includes(currentUser) && conv.participants.includes(participantId)
    )

    if (existingConversation) {
      // Add message to existing conversation
      const newMessage = {
        id: Date.now().toString(),
        senderId: currentUser,
        content: message,
        createdAt: new Date()
      }
      
      existingConversation.messages.push(newMessage)
      existingConversation.updatedAt = new Date()
      
      return NextResponse.json(existingConversation)
    } else {
      // Create new conversation
      const newConversation = {
        id: Date.now().toString(),
        participants: [currentUser, participantId],
        messages: [{
          id: Date.now().toString(),
          senderId: currentUser,
          content: message,
          createdAt: new Date()
        }],
        createdAt: new Date(),
        updatedAt: new Date()
      }
      
      conversations.push(newConversation)
      
      console.log('✅ New conversation created')
      return NextResponse.json(newConversation)
    }

  } catch (error) {
    console.error('Error creating conversation:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 