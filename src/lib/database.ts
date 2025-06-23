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