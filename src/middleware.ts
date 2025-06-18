import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  // Only apply to social API routes
  if (request.nextUrl.pathname.startsWith('/api/social')) {
    // Get wallet address from Authorization header or query parameter
    const authHeader = request.headers.get('authorization')
    const walletAddress = request.nextUrl.searchParams.get('wallet') || 
                         (authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null)
    
    if (!walletAddress) {
      return NextResponse.json(
        { error: 'Wallet address required for social features' },
        { status: 401 }
      )
    }

    // Validate wallet address format (basic validation)
    if (!walletAddress.match(/^[a-zA-Z0-9]{20,}$/)) {
      return NextResponse.json(
        { error: 'Invalid wallet address format' },
        { status: 400 }
      )
    }

    // Add wallet address to request headers for API routes
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set('x-wallet-address', walletAddress)

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    })
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/api/social/:path*'
  ]
} 