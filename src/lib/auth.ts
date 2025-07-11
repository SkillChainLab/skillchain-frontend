import jwt from 'jsonwebtoken'
import { NextRequest } from 'next/server'
import { UserService } from './models/User'

export interface AuthUser {
  id: string
  name: string
  email: string
  userType: 'freelancer' | 'client' | 'both'
  avatar?: string
  balance?: {
    skill: number
    vusd: number
  }
}

export async function verifyToken(token: string): Promise<{ userId: string; email: string } | null> {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-jwt-secret-key') as { userId: string; email: string }
    return decoded
  } catch (error) {
    console.error('Token verification failed:', error)
    return null
  }
}

export async function getAuthUser(request: NextRequest): Promise<AuthUser | null> {
  try {
    // Get token from cookie
    const token = request.cookies.get('auth-token')?.value
    
    if (!token) {
      return null
    }

    // Verify token
    const decoded = await verifyToken(token)
    if (!decoded) {
      return null
    }

    // Get user from database
    const user = await UserService.getUserById(decoded.userId)
    if (!user) {
      return null
    }

    return {
      id: user._id!,
      name: user.name,
      email: user.email,
      userType: user.userType,
      avatar: user.avatar,
    }

  } catch (error) {
    console.error('Get auth user failed:', error)
    return null
  }
}

export function generateAvatar(name: string): string {
  const names = name.split(' ')
  if (names.length >= 2) {
    return names[0].charAt(0).toUpperCase() + names[1].charAt(0).toUpperCase()
  }
  return name.charAt(0).toUpperCase()
} 