import { NextResponse } from 'next/server'

export async function GET() {
  const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN

  if (!accessToken) {
    return NextResponse.json({ success: false, message: 'INSTAGRAM_ACCESS_TOKEN nije podešen.' }, { status: 500 })
  }

  try {
    const url = new URL('https://graph.instagram.com/refresh_access_token')
    url.searchParams.set('grant_type', 'ig_refresh_token')
    url.searchParams.set('access_token', accessToken)

    const res = await fetch(url.toString())
    const data = await res.json().catch(() => null)

    if (!res.ok || data?.error) {
      return NextResponse.json(
        {
          success: false,
          message: data?.error?.message || 'Refresh nije uspeo. Token je verovatno istekao.',
          error: data?.error,
        },
        { status: 502 },
      )
    }

    const expiresInDays = Math.round((data.expires_in ?? 0) / 86400)

    return NextResponse.json({
      success: true,
      access_token: data.access_token,
      expires_in_days: expiresInDays,
      message: `Novi token važi još ${expiresInDays} dana. Zameni INSTAGRAM_ACCESS_TOKEN u .env.local ovim tokenom, pa restartuj server.`,
    })
  } catch (e) {
    return NextResponse.json({ success: false, message: e.message }, { status: 500 })
  }
}
