import { NextRequest, NextResponse } from 'next/server'
import { markMessagesAsRead } from '@/lib/database'

export async function POST(
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
    
    console.log('✅ Marking messages as read for conversation:', conversationId, 'user:', currentUser)

    try {
      // Mark messages as read for current user
      await markMessagesAsRead(conversationId, currentUser)
      
      console.log('✅ Messages marked as read successfully')
      
      return NextResponse.json({ success: true })

    } catch (dbError) {
      console.error('Database error:', dbError)
      return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }

  } catch (error) {
    console.error('Error marking messages as read:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 