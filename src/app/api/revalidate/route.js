import { revalidateTag } from 'next/cache'
import { NextResponse } from 'next/server'

export async function POST(request) {
  const { searchParams } = new URL(request.url)
  const secret = searchParams.get('secret')
  const tag    = searchParams.get('tag') || 'about-us'

  if (!process.env.REVALIDATE_SECRET || secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  revalidateTag(tag)
  return NextResponse.json({ revalidated: true, tag })
}
