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

// Create new conversation
export async function POST(request: NextRequest) {
  try {
    const { participantId, metadata } = await request.json()
    
    // Get wallet address from headers (set by middleware/auth)
    const currentUser = request.headers.get('x-wallet-address')
    
    if (!currentUser) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    if (!participantId) {
      return NextResponse.json({ error: 'participantId is required' }, { status: 400 })
    }

    if (currentUser === participantId) {
      return NextResponse.json({ error: 'Cannot create conversation with yourself' }, { status: 400 })
    }

    const mongoClient = await clientPromise
    const db = mongoClient.db(MONGODB_DB)
    const conversations = db.collection('conversations')

    // Check if conversation already exists between these users
    const existingConversation = await conversations.findOne({
      participants: { $all: [currentUser, participantId] },
      isActive: true
    })

    if (existingConversation) {
      return NextResponse.json({
        id: existingConversation._id.toString(),
        participants: existingConversation.participants,
        lastActivity: existingConversation.lastActivity,
        isActive: existingConversation.isActive,
        metadata: existingConversation.metadata
      })
    }

    // Create new conversation
    const newConversation = {
      participants: [currentUser, participantId],
      lastActivity: new Date().toISOString(),
      isActive: true,
      metadata: metadata || {},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    const result = await conversations.insertOne(newConversation)

    return NextResponse.json({
      id: result.insertedId.toString(),
      ...newConversation
    })

  } catch (error) {
    console.error('Error creating conversation:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 