import { NextResponse } from 'next/server'

// Uvijek uzimaj svježe podatke — CDN URL-ovi iz Graph API-ja istječu
// i Next.js fetch cache je sačuvao stare URL-ove
export const dynamic = 'force-dynamic'

const DEFAULT_FIELDS = [
  'id',
  'caption',
  'media_url',
  'permalink',
  'media_type',
  'thumbnail_url',
  'timestamp',
].join(',')

// Strategy 1: user access token (istekne posle 60 dana)
async function fetchWithUserToken(accessToken, limit) {
  try {
    const url = new URL('https://graph.instagram.com/me/media')
    url.searchParams.set('fields', DEFAULT_FIELDS)
    url.searchParams.set('access_token', accessToken)
    url.searchParams.set('limit', String(limit))
    const res = await fetch(url.toString(), { cache: 'no-store' })
    const data = await res.json().catch(() => null)
    if (!res.ok || data?.error) return null
    return Array.isArray(data?.data) ? data.data : null
  } catch {
    return null
  }
}

// Strategy 2: scraping javnog profila — izvlači post URL-ove iz HTML-a
async function scrapePostUrls(username, limit) {
  try {
    const res = await fetch(`https://www.instagram.com/${username}/`, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Cache-Control': 'no-cache',
      },
      next: { revalidate: 3600 },
    })
    if (!res.ok) return []
    const html = await res.text()
    // Izvuci post shortcodes iz linkova oblika /p/SHORTCODE/
    const matches = [...html.matchAll(/href="\/p\/([A-Za-z0-9_-]+)\//g)]
    const shortcodes = [...new Set(matches.map((m) => m[1]))].slice(0, limit)
    return shortcodes.map((code) => `https://www.instagram.com/p/${code}/`)
  } catch {
    return []
  }
}

// oEmbed: dohvati thumbnail za jedan post URL koristeći app token (nikad ne ističe)
async function getOEmbedThumbnail(postUrl, appToken) {
  try {
    const url = new URL('https://graph.facebook.com/v18.0/instagram_oembed')
    url.searchParams.set('url', postUrl)
    url.searchParams.set('fields', 'thumbnail_url,author_name,permalink_url')
    url.searchParams.set('access_token', appToken)
    url.searchParams.set('omitscript', 'true')
    const res = await fetch(url.toString(), { next: { revalidate: 3600 } })
    const data = await res.json().catch(() => null)
    if (!res.ok || data?.error) return null
    return data
  } catch {
    return null
  }
}

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const limitParam = Number(searchParams.get('limit') || '9')
  const limit = Number.isFinite(limitParam) && limitParam > 0 ? Math.min(limitParam, 25) : 9

  const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN
  const appId = process.env.INSTAGRAM_APP_ID
  const appSecret = process.env.INSTAGRAM_APP_SECRET
  const username = process.env.INSTAGRAM_USERNAME || 'nocnibazar'

  // --- Strategy 1: user token ---
  if (accessToken) {
    const posts = await fetchWithUserToken(accessToken, limit)
    if (posts?.length) {
      return NextResponse.json({ success: true, source: 'token', data: posts.slice(0, limit) })
    }
  }

  // --- Strategy 2 + 3: scraping + oEmbed ---
  if (appId && appSecret) {
    const appToken = `${appId}|${appSecret}`

    // 2a: ručno konfigurisani URL-ovi (INSTAGRAM_POST_URLS u .env.local)
    const configuredUrls = (process.env.INSTAGRAM_POST_URLS || '')
      .split(',')
      .map((u) => u.trim())
      .filter(Boolean)
      .slice(0, limit)

    // 2b: automatski scraping javnog profila
    const scrapedUrls = configuredUrls.length === 0
      ? await scrapePostUrls(username, limit)
      : []

    const postUrls = configuredUrls.length > 0 ? configuredUrls : scrapedUrls

    if (postUrls.length > 0) {
      const results = await Promise.all(
        postUrls.map(async (postUrl) => {
          const oembed = await getOEmbedThumbnail(postUrl, appToken)
          if (!oembed?.thumbnail_url) return null
          return {
            id: postUrl,
            media_url: oembed.thumbnail_url,
            thumbnail_url: oembed.thumbnail_url,
            permalink: postUrl,
            media_type: 'IMAGE',
          }
        }),
      )
      const validPosts = results.filter(Boolean)
      if (validPosts.length > 0) {
        return NextResponse.json({
          success: true,
          source: configuredUrls.length > 0 ? 'configured' : 'scraped',
          data: validPosts,
        })
      }
    }
  }

  return NextResponse.json(
    { success: false, message: 'Nije moguće dohvatiti Instagram postove.', data: [] },
    { status: 502 },
  )
}
