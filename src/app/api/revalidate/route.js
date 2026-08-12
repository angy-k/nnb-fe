import { revalidateTag } from 'next/cache';
import { NextResponse } from 'next/server';

export async function POST(request) {
    const { searchParams } = new URL(request.url);
    const secret = searchParams.get('secret');
    const tag = searchParams.get('tag');

    if (!secret || secret !== process.env.REVALIDATE_SECRET) {
        return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    if (!tag) {
        return NextResponse.json({ error: 'Missing tag' }, { status: 400 });
    }

    revalidateTag(tag);

    return NextResponse.json({ revalidated: true, tag });
}
