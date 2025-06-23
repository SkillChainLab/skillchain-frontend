// This module should only be used on the server-side
if (typeof window !== 'undefined') {
  throw new Error('Database module should only be used on the server-side')
}

import { MongoClient, Db, Collection, ObjectId } from 'mongodb'

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017'
const dbName = process.env.MONGODB_DB || 'skillchain-social'

let client: MongoClient | null = null
let db: Db | null = null

export interface DatabaseUser {
  _id?: ObjectId
  walletAddress: string // Primary key - wallet address
  displayName: string
  bio?: string
  location?: string
  website?: string
  github?: string
  linkedin?: string
  twitter?: string
  avatar?: string
  reputationScore: number
  profileCreatedOnBlockchain: boolean // Track if profile exists on blockchain
  lastSyncWithBlockchain?: Date // Last time we synced with blockchain
  createdAt: Date
  updatedAt: Date
}

export interface DatabaseConnection {
  _id?: ObjectId
  fromUser: string // wallet address
  toUser: string // wallet address
  status: 'pending' | 'accepted' | 'blocked'
  createdAt: Date
  updatedAt: Date
}

export interface DatabaseConversation {
  _id?: ObjectId
  participants: string[] // Array of wallet addresses
  lastMessage?: ObjectId // Reference to last message
  lastActivity: Date
  createdAt: Date
  updatedAt: Date
}

export interface DatabaseMessage {
  _id?: ObjectId
  conversationId: ObjectId
  senderId: string // wallet address
  content: string
  type: 'text' | 'image' | 'file' | 'system'
  attachments?: {
    filename: string
    url: string
    type: string
    size: number
  }[]
  isRead: boolean
  editedAt?: Date
  createdAt: Date
}

export async function connectToDatabase(): Promise<Db> {
  if (db) {
    return db
  }

  try {
    console.log('🔌 Connecting to MongoDB...')
    client = new MongoClient(uri)
    await client.connect()
    db = client.db(dbName)
    
    // Create indexes for better performance
    await createIndexes()
    
    console.log('✅ Connected to MongoDB successfully')
    return db
  } catch (error) {
    console.error('❌ Failed to connect to MongoDB:', error)
    throw error
  }
}

async function createIndexes() {
  if (!db) return

  try {
    // User collection indexes
    const usersCollection = db.collection<DatabaseUser>('users')
    await usersCollection.createIndex({ walletAddress: 1 }, { unique: true })
    await usersCollection.createIndex({ displayName: 1 })
    await usersCollection.createIndex({ createdAt: -1 })

    // Connections collection indexes
    const connectionsCollection = db.collection<DatabaseConnection>('connections')
    await connectionsCollection.createIndex({ fromUser: 1 })
    await connectionsCollection.createIndex({ toUser: 1 })
    await connectionsCollection.createIndex({ status: 1 })
    await connectionsCollection.createIndex({ fromUser: 1, toUser: 1 }, { unique: true })

    // Conversations collection indexes
    const conversationsCollection = db.collection<DatabaseConversation>('conversations')
    await conversationsCollection.createIndex({ participants: 1 })
    await conversationsCollection.createIndex({ lastActivity: -1 })

    // Messages collection indexes
    const messagesCollection = db.collection<DatabaseMessage>('messages')
    await messagesCollection.createIndex({ conversationId: 1 })
    await messagesCollection.createIndex({ senderId: 1 })
    await messagesCollection.createIndex({ createdAt: -1 })
    await messagesCollection.createIndex({ conversationId: 1, createdAt: 1 })

    console.log('✅ Database indexes created successfully')
  } catch (error) {
    console.error('❌ Failed to create indexes:', error)
  }
}

export async function getUsersCollection(): Promise<Collection<DatabaseUser>> {
  const database = await connectToDatabase()
  return database.collection<DatabaseUser>('users')
}

export async function getConnectionsCollection(): Promise<Collection<DatabaseConnection>> {
  const database = await connectToDatabase()
  return database.collection<DatabaseConnection>('connections')
}

export async function getConversationsCollection(): Promise<Collection<DatabaseConversation>> {
  const database = await connectToDatabase()
  return database.collection<DatabaseConversation>('conversations')
}

export async function getMessagesCollection(): Promise<Collection<DatabaseMessage>> {
  const database = await connectToDatabase()
  return database.collection<DatabaseMessage>('messages')
}

// User operations
export async function findUserByWallet(walletAddress: string): Promise<DatabaseUser | null> {
  const collection = await getUsersCollection()
  return await collection.findOne({ walletAddress })
}

export async function createOrUpdateUser(userData: Omit<DatabaseUser, '_id' | 'createdAt' | 'updatedAt'>): Promise<DatabaseUser> {
  const collection = await getUsersCollection()
  
  const now = new Date()
  const updateData = {
    ...userData,
    updatedAt: now
  }
  
  const result = await collection.findOneAndUpdate(
    { walletAddress: userData.walletAddress },
    { 
      $set: updateData,
      $setOnInsert: { createdAt: now }
    },
    { 
      upsert: true, 
      returnDocument: 'after' 
    }
  )
  
  return result as DatabaseUser
}

export async function updateUserBlockchainSync(walletAddress: string): Promise<void> {
  const collection = await getUsersCollection()
  await collection.updateOne(
    { walletAddress },
    { 
      $set: { 
        profileCreatedOnBlockchain: true,
        lastSyncWithBlockchain: new Date()
      }
    }
  )
}

// Connection operations
export async function findUserConnections(walletAddress: string, status?: string): Promise<DatabaseConnection[]> {
  const collection = await getConnectionsCollection()
  
  const query: any = {
    $or: [
      { fromUser: walletAddress },
      { toUser: walletAddress }
    ]
  }
  
  if (status) {
    query.status = status
  }
  
  return await collection.find(query).toArray()
}

export async function findConnectionById(connectionId: string): Promise<DatabaseConnection | null> {
  const collection = await getConnectionsCollection()
  const { ObjectId } = await import('mongodb')
  
  try {
    return await collection.findOne({ _id: new ObjectId(connectionId) })
  } catch (error) {
    console.error('Error finding connection by ID:', error)
    return null
  }
}

export async function createConnection(fromUser: string, toUser: string): Promise<DatabaseConnection> {
  const collection = await getConnectionsCollection()
  
  const now = new Date()
  const connectionData: DatabaseConnection = {
    fromUser,
    toUser,
    status: 'pending',
    createdAt: now,
    updatedAt: now
  }
  
  const result = await collection.insertOne(connectionData)
  return { ...connectionData, _id: result.insertedId }
}

export async function updateConnectionStatus(connectionId: string, status: 'accepted' | 'blocked'): Promise<DatabaseConnection | null> {
  const collection = await getConnectionsCollection()
  const { ObjectId } = await import('mongodb')
  
  const result = await collection.findOneAndUpdate(
    { _id: new ObjectId(connectionId) },
    { 
      $set: { 
        status,
        updatedAt: new Date()
      }
    },
    { returnDocument: 'after' }
  )
  
  return result
}

export async function deleteConnection(connectionId: string): Promise<boolean> {
  const collection = await getConnectionsCollection()
  const { ObjectId } = await import('mongodb')
  
  const result = await collection.deleteOne({ _id: new ObjectId(connectionId) })
  return result.deletedCount > 0
}

// Message operations
export async function findOrCreateConversation(participants: string[]): Promise<DatabaseConversation> {
  const collection = await getConversationsCollection()
  
  // Sort participants to ensure consistent order
  const sortedParticipants = participants.sort()
  
  // Find existing conversation
  let conversation = await collection.findOne({
    participants: { $all: sortedParticipants, $size: sortedParticipants.length }
  })
  
  if (!conversation) {
    // Create new conversation
    const now = new Date()
    const conversationData: DatabaseConversation = {
      participants: sortedParticipants,
      lastActivity: now,
      createdAt: now,
      updatedAt: now
    }
    
    const result = await collection.insertOne(conversationData)
    conversation = { ...conversationData, _id: result.insertedId }
  }
  
  return conversation
}

export async function getUserConversations(walletAddress: string): Promise<DatabaseConversation[]> {
  const collection = await getConversationsCollection()
  
  return await collection.find({
    participants: walletAddress
  }).sort({ lastActivity: -1 }).toArray()
}

export async function createMessage(
  conversationId: string, 
  senderId: string, 
  content: string, 
  type: 'text' | 'image' | 'file' | 'system' = 'text',
  attachments?: { filename: string; url: string; type: string; size: number }[]
): Promise<DatabaseMessage> {
  const messagesCollection = await getMessagesCollection()
  const conversationsCollection = await getConversationsCollection()
  const { ObjectId } = await import('mongodb')
  
  const now = new Date()
  const messageData: DatabaseMessage = {
    conversationId: new ObjectId(conversationId),
    senderId,
    content,
    type,
    attachments,
    isRead: false,
    createdAt: now
  }
  
  const result = await messagesCollection.insertOne(messageData)
  const message = { ...messageData, _id: result.insertedId }
  
  // Update conversation last activity and last message
  await conversationsCollection.updateOne(
    { _id: new ObjectId(conversationId) },
    {
      $set: {
        lastMessage: result.insertedId,
        lastActivity: now,
        updatedAt: now
      }
    }
  )
  
  return message
}

export async function getConversationMessages(conversationId: string, limit: number = 50): Promise<DatabaseMessage[]> {
  const collection = await getMessagesCollection()
  const { ObjectId } = await import('mongodb')
  
  return await collection.find({
    conversationId: new ObjectId(conversationId)
  }).sort({ createdAt: -1 }).limit(limit).toArray()
}

export async function markMessagesAsRead(conversationId: string, userId: string): Promise<void> {
  const collection = await getMessagesCollection()
  const { ObjectId } = await import('mongodb')
  
  await collection.updateMany(
    {
      conversationId: new ObjectId(conversationId),
      senderId: { $ne: userId },
      isRead: false
    },
    {
      $set: { isRead: true }
    }
  )
}

export async function getConnectedUsers(walletAddress: string): Promise<DatabaseUser[]> {
  const connectionsCollection = await getConnectionsCollection()
  const usersCollection = await getUsersCollection()
  
  // Get accepted connections
  const connections = await connectionsCollection.find({
    $or: [
      { fromUser: walletAddress, status: 'accepted' },
      { toUser: walletAddress, status: 'accepted' }
    ]
  }).toArray()
  
  // Extract connected user addresses
  const connectedAddresses = connections.map(conn => 
    conn.fromUser === walletAddress ? conn.toUser : conn.fromUser
  )
  
  // Get user details
  return await usersCollection.find({
    walletAddress: { $in: connectedAddresses }
  }).toArray()
}

// Utility function to sync user from blockchain to database
export async function syncUserFromBlockchain(walletAddress: string): Promise<DatabaseUser | null> {
  try {
    console.log('🔄 Syncing user from blockchain:', walletAddress)
    
    // Fetch profile from blockchain using the correct API endpoint
    const response = await fetch(`${process.env.NEXT_PUBLIC_SKILLCHAIN_API || 'http://localhost:1317'}/skillchain/v1/profiles/${walletAddress}`)
    
    if (!response.ok) {
      console.log('❌ Profile not found on blockchain for:', walletAddress, '- Status:', response.status)
      return null
    }
    
    const data = await response.json()
    const blockchainProfile = data.profile || data.data
    
    if (!blockchainProfile) {
      console.log('❌ No profile data found on blockchain for:', walletAddress)
      return null
    }
    
    console.log('✅ Found blockchain profile:', blockchainProfile.displayName)
    
    // Create or update user in database
    const userData: Omit<DatabaseUser, '_id' | 'createdAt' | 'updatedAt'> = {
      walletAddress,
      displayName: blockchainProfile.displayName || 'SkillChain User',
      bio: blockchainProfile.bio || '',
      location: blockchainProfile.location || '',
      website: blockchainProfile.website || '',
      github: blockchainProfile.github || '',
      linkedin: blockchainProfile.linkedin || '',
      twitter: blockchainProfile.twitter || '',
      avatar: blockchainProfile.avatar || '',
      reputationScore: blockchainProfile.reputationScore || 100,
      profileCreatedOnBlockchain: true,
      lastSyncWithBlockchain: new Date()
    }
    
    const user = await createOrUpdateUser(userData)
    console.log('✅ User synced successfully:', walletAddress)
    
    return user
  } catch (error) {
    console.error('❌ Failed to sync user from blockchain:', error)
    return null
  }
}

export async function closeDatabaseConnection(): Promise<void> {
  if (client) {
    await client.close()
    client = null
    db = null
    console.log('🔌 Database connection closed')
  }
} 