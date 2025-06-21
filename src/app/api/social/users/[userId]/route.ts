import { NextRequest, NextResponse } from 'next/server'

// Simple in-memory storage for connections (in production, this would be a proper database)
const connections: any[] = []

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params
    const url = new URL(request.url)
    const status = url.searchParams.get('status')

    console.log('🔍 Getting connections for user:', userId, 'with status:', status)

    // Filter connections based on status if provided
    const filteredConnections = connections.filter(conn => {
      const isUserInvolved = conn.fromUser === userId || conn.toUser === userId
      if (!isUserInvolved) return false
      
      if (status) {
        return conn.status === status
      }
      return true
    })

    console.log('✅ Returning connections:', filteredConnections.length)
    return NextResponse.json(filteredConnections)

  } catch (error) {
    console.error('Error fetching user connections:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 