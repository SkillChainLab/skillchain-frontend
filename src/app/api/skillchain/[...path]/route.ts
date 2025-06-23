import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path } = await params
    const skillchainApiUrl = process.env.NEXT_PUBLIC_SKILLCHAIN_API || 'http://localhost:1317'
    const targetUrl = `${skillchainApiUrl}/skillchain/${path.join('/')}`
    
    // Get query parameters from the original request
    const url = new URL(request.url)
    const searchParams = url.searchParams.toString()
    const finalUrl = searchParams ? `${targetUrl}?${searchParams}` : targetUrl
    
    console.log('🔄 Proxying request to:', finalUrl)
    
    const response = await fetch(finalUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })
    
    if (!response.ok) {
      console.error('❌ SkillChain API error:', response.status, response.statusText)
      const errorText = await response.text()
      console.error('❌ Error details:', errorText)
      
      return NextResponse.json(
        { 
          error: 'SkillChain API error', 
          status: response.status, 
          statusText: response.statusText,
          details: errorText
        }, 
        { status: response.status }
      )
    }
    
    const data = await response.json()
    console.log('✅ SkillChain API response:', data)
    
    return NextResponse.json(data)
    
  } catch (error) {
    console.error('❌ Proxy error:', error)
    return NextResponse.json(
      { 
        error: 'Proxy error', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      }, 
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path } = await params
    const skillchainApiUrl = process.env.NEXT_PUBLIC_SKILLCHAIN_API || 'http://localhost:1317'
    const targetUrl = `${skillchainApiUrl}/skillchain/${path.join('/')}`
    
    const body = await request.text()
    
    console.log('🔄 Proxying POST request to:', targetUrl)
    
    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body
    })
    
    if (!response.ok) {
      console.error('❌ SkillChain API error:', response.status, response.statusText)
      const errorText = await response.text()
      console.error('❌ Error details:', errorText)
      
      return NextResponse.json(
        { 
          error: 'SkillChain API error', 
          status: response.status, 
          statusText: response.statusText,
          details: errorText
        }, 
        { status: response.status }
      )
    }
    
    const data = await response.json()
    console.log('✅ SkillChain API response:', data)
    
    return NextResponse.json(data)
    
  } catch (error) {
    console.error('❌ Proxy error:', error)
    return NextResponse.json(
      { 
        error: 'Proxy error', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      }, 
      { status: 500 }
    )
  }
} 