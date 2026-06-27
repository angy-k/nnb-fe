import { NextResponse } from 'next/server'

export async function GET() {
  const APP_ID = process.env.INSTAGRAM_APP_ID
  const REDIRECT_URI = `${process.env.NEXT_PUBLIC_APP_URL}/api/instagram/callback`

  const url = new URL('https://www.instagram.com/oauth/authorize')
  url.searchParams.set('client_id', APP_ID)
  url.searchParams.set('redirect_uri', REDIRECT_URI)
  url.searchParams.set('scope', 'instagram_business_basic')
  url.searchParams.set('response_type', 'code')

  return NextResponse.redirect(url.toString())
}
