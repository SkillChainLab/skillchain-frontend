import bcrypt from 'bcryptjs'
import clientPromise from '../mongodb'

export interface User {
  _id?: string
  name: string
  email: string
  password: string
  userType: 'freelancer' | 'client' | 'both'
  walletAddress?: string // Optional wallet address for future blockchain integration
  avatar?: string
  profile?: {
    skills?: string[]
    bio?: string
    location?: string
    experience?: string
    hourlyRate?: number
  }
  createdAt: Date
  updatedAt: Date
}

export class UserService {
  private static async getCollection() {
    const client = await clientPromise
    const db = client.db(process.env.MONGODB_DB || 'skillchain-database')
    const collection = db.collection<User>('users')
    
    // Ensure indexes exist
    await this.ensureIndexes(collection)
    
    return collection
  }

  private static async ensureIndexes(collection: any) {
    try {
      // Create email index (unique)
      await collection.createIndex({ email: 1 }, { unique: true })
      
      // Create sparse walletAddress index (unique but only for non-null values)
      await collection.createIndex(
        { walletAddress: 1 }, 
        { unique: true, sparse: true }
      )
      
      // Create other useful indexes
      await collection.createIndex({ userType: 1 })
      await collection.createIndex({ createdAt: -1 })
      
    } catch (error) {
      // Indexes might already exist, ignore errors
      console.log('Index creation note:', (error as Error).message)
    }
  }

  static async createUser(userData: Omit<User, '_id' | 'createdAt' | 'updatedAt'>) {
    const collection = await this.getCollection()
    
    // Check if user already exists
    const existingUser = await collection.findOne({ email: userData.email })
    if (existingUser) {
      throw new Error('User already exists with this email')
    }

    // Hash password
    const saltRounds = 12
    const hashedPassword = await bcrypt.hash(userData.password, saltRounds)

    const newUser: Omit<User, '_id'> = {
      ...userData,
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    const result = await collection.insertOne(newUser)
    
    // Return user without password
    const { password, ...userWithoutPassword } = newUser
    return {
      _id: result.insertedId.toString(),
      ...userWithoutPassword
    }
  }

  static async authenticateUser(email: string, password: string) {
    const collection = await this.getCollection()
    
    const user = await collection.findOne({ email })
    if (!user) {
      throw new Error('Invalid credentials')
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      throw new Error('Invalid credentials')
    }

    // Return user without password
    const { password: _, ...userWithoutPassword } = user
    return {
      ...userWithoutPassword,
      _id: user._id.toString()
    }
  }

  static async getUserById(id: string) {
    const collection = await this.getCollection()
    
    const user = await collection.findOne({ _id: id as any })
    if (!user) {
      return null
    }

    // Return user without password
    const { password, ...userWithoutPassword } = user
    return {
      ...userWithoutPassword,
      _id: user._id.toString()
    }
  }

  static async getUserByEmail(email: string) {
    const collection = await this.getCollection()
    
    const user = await collection.findOne({ email })
    if (!user) {
      return null
    }

    // Return user without password
    const { password, ...userWithoutPassword } = user
    return {
      ...userWithoutPassword,
      _id: user._id.toString()
    }
  }

  static async updateUser(id: string, updates: Partial<User>) {
    const collection = await this.getCollection()
    
    const updateData = {
      ...updates,
      updatedAt: new Date()
    }

    if (updates.password) {
      const saltRounds = 12
      updateData.password = await bcrypt.hash(updates.password, saltRounds)
    }

    const result = await collection.updateOne(
      { _id: id as any },
      { $set: updateData }
    )

    if (result.matchedCount === 0) {
      throw new Error('User not found')
    }

    return await this.getUserById(id)
  }
} 