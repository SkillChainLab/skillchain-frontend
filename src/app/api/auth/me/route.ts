import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { ObjectId } from 'mongodb'
import clientPromise from '@/lib/mongodb'

export async function GET(request: NextRequest) {
  try {
    // Get token from cookies
    const token = request.cookies.get('auth-token')?.value

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'No authentication token' },
        { status: 401 }
      )
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as any

    // Get user from database
    const client = await clientPromise
    const db = client.db('skillchain-database')
    const users = db.collection('users')

    const user = await users.findOne(
      { _id: new ObjectId(decoded.userId) },
      { projection: { password: 0 } } // Exclude password
    )

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      )
    }

    // Format user data
    const userData = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      userType: user.userType,
      avatar: user.name.split(' ').map((n: string) => n[0]).join('').toUpperCase(),
      reputationScore: user.reputationScore || 0,
      totalStaked: user.totalStaked || 0,
      endorsementCount: user.endorsementCount || 0,
      memberSince: user.createdAt ? new Date(user.createdAt).toLocaleDateString() : new Date().toLocaleDateString(),
      verified: user.verified || false
      // Note: Balance data will be fetched from blockchain, not database
    }

    return NextResponse.json({
      success: true,
      user: userData
    })

  } catch (error) {
    console.error('Auth check error:', error)
    return NextResponse.json(
      { success: false, error: 'Authentication failed' },
      { status: 401 }
    )
  }
} 