import { NextRequest, NextResponse } from 'next/server'
import { findUserConnections } from '@/lib/database'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params
    const url = new URL(request.url)
    const status = url.searchParams.get('status')

    console.log('🔍 Getting connections for user:', userId, 'with status:', status)

    // Get connections from database
    const connections = await findUserConnections(userId, status || undefined)
    
    // Convert ObjectId to string for JSON serialization
    const serializedConnections = connections.map(conn => ({
      id: conn._id?.toString(),
      fromUser: conn.fromUser,
      toUser: conn.toUser,
      status: conn.status,
      createdAt: conn.createdAt,
      updatedAt: conn.updatedAt
    }))

    console.log('✅ Returning connections:', serializedConnections.length)
    return NextResponse.json(serializedConnections)

  } catch (error) {
    console.error('Error fetching user connections:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 