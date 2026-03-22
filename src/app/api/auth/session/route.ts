import { NextResponse } from 'next/server'

// Note: This is a simplified session check
// In a real app with JWT or session tokens, you would verify the token here
// For now, we rely on the Zustand persist middleware to handle auth state on the client

export async function GET() {
  // This endpoint exists for future session validation
  // Currently, auth state is managed client-side with Zustand persist
  return NextResponse.json({ 
    authenticated: false,
    user: null 
  })
}
