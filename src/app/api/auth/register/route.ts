import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { UserService } from '@/lib/models/User'

// Simple in-memory storage as fallback
const inMemoryUsers: any[] = []

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, userType } = await request.json()

    if (!name || !email || !password || !userType) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }
    
    // Validate password strength
    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long' },
        { status: 400 }
      )
    }

    // Validate user type
    if (!['freelancer', 'client', 'both'].includes(userType)) {
      return NextResponse.json(
        { error: 'Invalid user type' },
        { status: 400 }
      )
    }

    // Create user
    const user = await UserService.createUser({
      name,
      email,
      password,
      userType,
      avatar: name.charAt(0).toUpperCase() + (name.split(' ')[1]?.charAt(0).toUpperCase() || '')
    })

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
    console.error('Register error:', error)
    
    if (error.message === 'User already exists with this email') {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 409 }
      )
    }

    return NextResponse.json(
      { error: error.message || 'Registration failed' },
      { status: 500 }
    )
  }
} 