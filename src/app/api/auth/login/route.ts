import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { UserService } from '@/lib/models/User'

// Simple in-memory storage as fallback (shared with register)
const inMemoryUsers: any[] = []

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()
    
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Authenticate user
    const user = await UserService.authenticateUser(email, password)
        
    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET || 'your-jwt-secret-key',
      { expiresIn: '7d' }
    )

    // Set HTTP-only cookie
    const response = NextResponse.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        userType: user.userType,
        avatar: user.name.split(' ').map((n: string) => n[0]).join('').toUpperCase(),
        reputationScore: (user as any).reputationScore || 0,
        totalStaked: (user as any).totalStaked || 0,
        endorsementCount: (user as any).endorsementCount || 0,
        memberSince: user.createdAt ? new Date(user.createdAt).toLocaleDateString() : new Date().toLocaleDateString(),
        verified: (user as any).verified || false
        // Note: Balance data will be fetched from blockchain, not database
      }
    })

    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    })

    return response

  } catch (error: any) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: error.message || 'Authentication failed' },
      { status: 401 }
    )
  }
} 