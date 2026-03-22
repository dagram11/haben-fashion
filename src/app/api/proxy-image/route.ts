import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const maxDuration = 30

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const imageUrl = searchParams.get('url')

    if (!imageUrl) {
      return NextResponse.json({ error: 'Missing url parameter' }, { status: 400 })
    }

    // Only allow Replicate CDN URLs for security
    if (!imageUrl.startsWith('https://replicate.delivery/')) {
      return NextResponse.json({ error: 'Invalid URL' }, { status: 400 })
    }

    console.log('Proxying image:', imageUrl)

    const response = await fetch(imageUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    })

    if (!response.ok) {
      console.error('Failed to fetch image:', response.status, response.statusText)
      return NextResponse.json(
        { error: `Failed to fetch image: ${response.status}` },
        { status: response.status }
      )
    }

    const imageBuffer = await response.arrayBuffer()
    const contentType = response.headers.get('content-type') || 'image/png'

    console.log('Proxied image successfully, size:', imageBuffer.byteLength)

    return new NextResponse(imageBuffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400', // Cache for 24 hours
      },
    })
  } catch (error) {
    console.error('Proxy error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to proxy image' },
      { status: 500 }
    )
  }
}
