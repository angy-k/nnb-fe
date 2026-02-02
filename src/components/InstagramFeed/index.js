 'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image'

const InstagramPosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    let isActive = true

    const fetchInstagramPosts = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch('/api/instagram?limit=9', { cache: 'no-store' })
        const data = await response.json().catch(() => null)

        if (!response.ok || !data?.success) {
          if (isActive) setError(data?.message || 'Greška prilikom učitavanja Instagram objava.')
          if (isActive) setPosts([])
          return
        }

        const items = Array.isArray(data?.data) ? data.data : []
        if (isActive) setPosts(items.slice(0, 9))
      } catch (e) {
        if (isActive) setError('Greška prilikom učitavanja Instagram objava.')
        if (isActive) setPosts([])
      } finally {
        if (isActive) setLoading(false)
      }
    };

    fetchInstagramPosts();
    return () => {
      isActive = false
    }
  }, []);

  if (loading) {
    return <div className="w-full grid place-items-center py-12">Učitavanje...</div>
  }

  if (error) {
    return <div className="w-full grid place-items-center py-12 text-[#EC4923]">{error}</div>
  }

  return (
    <div className="instagram-grid">
      {posts.map((post) => {
        const mediaUrl = post?.media_type === 'VIDEO' ? post?.thumbnail_url : post?.media_url
        const permalink = post?.permalink

        if (!mediaUrl) return null

        return (
          <a
            key={post?.id || mediaUrl}
            href={permalink || '#'}
            target={permalink ? '_blank' : undefined}
            rel={permalink ? 'noreferrer' : undefined}
            className="instagram-post"
          >
            <div className="instagram-post-inner">
              <Image
                src={mediaUrl}
                alt={(post?.caption || 'Instagram post').toString()}
                fill
                sizes="(max-width: 768px) 33vw, 300px"
                style={{ objectFit: 'cover' }}
                unoptimized
              />
            </div>
          </a>
        )
      })}
    </div>
  );
};

export default InstagramPosts;