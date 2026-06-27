import { NextResponse } from 'next/server'

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')

  if (!code) {
    return NextResponse.json({ error: 'No code received' }, { status: 400 })
  }

  const APP_ID = process.env.INSTAGRAM_APP_ID
  const APP_SECRET = process.env.INSTAGRAM_APP_SECRET
  const REDIRECT_URI = `${process.env.NEXT_PUBLIC_APP_URL}/api/instagram/callback`

  // 1. Zameni code za short-lived token
  const tokenRes = await fetch('https://api.instagram.com/oauth/access_token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: APP_ID,
      client_secret: APP_SECRET,
      grant_type: 'authorization_code',
      redirect_uri: REDIRECT_URI,
      code,
    }),
  })

  const tokenData = await tokenRes.json()

  if (tokenData.error_type) {
    return NextResponse.json({ error: tokenData.error_message }, { status: 400 })
  }

  const shortLivedToken = tokenData.access_token

  // 2. Zameni short-lived za long-lived token (60 dana)
  const longLivedRes = await fetch(
    `https://graph.instagram.com/access_token?grant_type=ig_exchange_token&client_id=${APP_ID}&client_secret=${APP_SECRET}&access_token=${shortLivedToken}`
  )

  const longLivedData = await longLivedRes.json()

  if (longLivedData.error) {
    return NextResponse.json({ error: longLivedData.error.message }, { status: 400 })
  }

  const expiresInDays = Math.round(longLivedData.expires_in / 86400)

  return NextResponse.json({
    success: true,
    access_token: longLivedData.access_token,
    expires_in_days: expiresInDays,
    message: `Dodaj ovaj token u .env.local kao INSTAGRAM_ACCESS_TOKEN. Ističe za ${expiresInDays} dana.`,
  })
}
