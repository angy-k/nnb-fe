import { NextResponse } from 'next/server'

const DEFAULT_FIELDS = [
  'id',
  'caption',
  'media_url',
  'permalink',
  'media_type',
  'thumbnail_url',
  'timestamp',
].join(',')

export async function GET(request) {
  const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN

  if (!accessToken) {
    return NextResponse.json(
      {
        success: false,
        message: 'Instagram access token is not configured.',
        data: [],
      },
      { status: 500 },
    )
  }

  const { searchParams } = new URL(request.url)
  const limitParam = Number(searchParams.get('limit') || '9')
  const limit = Number.isFinite(limitParam) && limitParam > 0 ? Math.min(limitParam, 25) : 9

  try {
    const url = new URL('https://graph.instagram.com/me/media')
    url.searchParams.set('fields', DEFAULT_FIELDS)
    url.searchParams.set('access_token', accessToken)
    url.searchParams.set('limit', String(limit))

    const response = await fetch(url.toString(), {
      next: { revalidate: 600 },
    })

    const data = await response.json().catch(() => null)

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          message: data?.error?.message || 'Failed to fetch Instagram media.',
          data: [],
        },
        { status: 502 },
      )
    }

    const items = Array.isArray(data?.data) ? data.data : []

    return NextResponse.json({
      success: true,
      data: items.slice(0, limit),
    })
  } catch (e) {
    return NextResponse.json(
      {
        success: false,
        message: 'Unexpected error while fetching Instagram media.',
        data: [],
      },
      { status: 500 },
    )
  }
}
