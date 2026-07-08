/**
 * Instagram CDN image proxy
 * Next.js /_next/image šalje zahtjeve bez Referer headera → CDN vraća 403.
 * Ovaj proxy dodaje Referer i browser-like headere pa CDN prihvata request.
 */

const ALLOWED_HOSTS = ['cdninstagram.com', 'fbcdn.net', 'scontent.cdninstagram.com']

function isAllowedUrl(url) {
  try {
    const { hostname } = new URL(url)
    return ALLOWED_HOSTS.some((h) => hostname === h || hostname.endsWith('.' + h))
  } catch {
    return false
  }
}

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const url = searchParams.get('url')

  if (!url || !isAllowedUrl(url)) {
    return new Response('Invalid or missing url', { status: 400 })
  }

  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        Referer: 'https://www.instagram.com/',
        Accept: 'image/webp,image/apng,image/*,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Sec-Fetch-Dest': 'image',
        'Sec-Fetch-Mode': 'no-cors',
        'Sec-Fetch-Site': 'cross-site',
      },
    })

    if (!res.ok) {
      return new Response(`Upstream CDN error: ${res.status}`, { status: res.status })
    }

    const contentType = res.headers.get('Content-Type') || 'image/jpeg'
    const buffer = await res.arrayBuffer()

    return new Response(buffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400, stale-while-revalidate=3600',
        'X-Proxy-Source': 'instagram-cdn',
      },
    })
  } catch (err) {
    return new Response('Proxy fetch error', { status: 502 })
  }
}
