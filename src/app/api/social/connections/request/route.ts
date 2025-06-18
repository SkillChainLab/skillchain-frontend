import { NextRequest, NextResponse } from 'next/server'
import { MongoClient, ObjectId } from 'mongodb'

// MongoDB Atlas connection
const MONGODB_URI = process.env.MONGODB_URI || ''
const MONGODB_DB = process.env.MONGODB_DB || 'skillchain-social'

let client: MongoClient
let clientPromise: Promise<MongoClient>

if (!MONGODB_URI) {
  throw new Error('Please add your MongoDB URI to .env.local')
}

if (process.env.NODE_ENV === 'development') {
  if (!(global as any)._mongoClientPromise) {
    client = new MongoClient(MONGODB_URI)
    ;(global as any)._mongoClientPromise = client.connect()
  }
  clientPromise = (global as any)._mongoClientPromise
} else {
  client = new MongoClient(MONGODB_URI)
  clientPromise = client.connect()
}

export async function POST(request: NextRequest) {
  try {
    const { toUser } = await request.json()
    
    // Get wallet address from headers (set by middleware/auth)
    const fromUser = request.headers.get('x-wallet-address')
    
    if (!fromUser) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    if (!toUser) {
      return NextResponse.json({ error: 'toUser is required' }, { status: 400 })
    }

    if (fromUser === toUser) {
      return NextResponse.json({ error: 'Cannot connect to yourself' }, { status: 400 })
    }

    const mongoClient = await clientPromise
    const db = mongoClient.db(MONGODB_DB)
    const connections = db.collection('connections')

    // Check if connection already exists
    const existingConnection = await connections.findOne({
      $or: [
        { fromUser, toUser },
        { fromUser: toUser, toUser: fromUser }
      ]
    })

    if (existingConnection) {
      return NextResponse.json({ 
        error: 'Connection already exists',
        status: existingConnection.status 
      }, { status: 409 })
    }

    // Create new connection request
    const newConnection = {
      fromUser,
      toUser,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    const result = await connections.insertOne(newConnection)

    // Create notification for the recipient
    const notifications = db.collection('notifications')
    await notifications.insertOne({
      userId: toUser,
      type: 'connection_request',
      fromUser,
      connectionId: result.insertedId.toString(),
      message: `New connection request`,
      isRead: false,
      createdAt: new Date().toISOString()
    })

    return NextResponse.json({
      id: result.insertedId.toString(),
      ...newConnection
    })

  } catch (error) {
    console.error('Error creating connection request:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 