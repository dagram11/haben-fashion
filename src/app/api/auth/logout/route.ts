import { NextResponse } from 'next/server'

export async function POST() {
  // In a real app with sessions, you would invalidate the session here
  return NextResponse.json({ success: true })
}
