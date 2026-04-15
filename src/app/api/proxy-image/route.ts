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

    // Use redirect instead of proxying to avoid Vercel's 4.5MB response limit
    // The browser will fetch directly from Replicate's CDN
    return NextResponse.redirect(imageUrl)
  } catch (error) {
    console.error('Proxy error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to redirect' },
      { status: 500 }
    )
  }
}
