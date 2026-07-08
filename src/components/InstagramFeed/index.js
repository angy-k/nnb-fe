'use client';
import React, { useEffect, useState } from 'react';

const InstagramPosts = () => {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [apiFailed, setApiFailed] = useState(false)

  useEffect(() => {
    let isActive = true

    fetch('/api/instagram?limit=9', { cache: 'no-store' })
      .then((res) => res.json().catch(() => null))
      .then((data) => {
        if (!isActive) return
        if (data?.success && Array.isArray(data.data) && data.data.length > 0) {
          setPosts(data.data.slice(0, 9))
        } else {
          setApiFailed(true)
        }
      })
      .catch(() => { if (isActive) setApiFailed(true) })
      .finally(() => { if (isActive) setLoading(false) })

    return () => { isActive = false }
  }, []);

  const sectionStyle = {
    background: '#261A54',
    padding: '64px 0',
    borderRadius: '50% 50% 0 0 / 70px 70px 0 0',
    marginTop: '-70px',
    position: 'relative',
    zIndex: 2,
    overflow: 'hidden',
    width: '100%',
    minHeight: '200px',
  }

  // Skeleton dok se učitava
  if (loading) {
    return (
      <section style={sectionStyle}>
        <div className="instagram-grid">
          {[...Array(9)].map((_, i) => (
            <div key={i} className="instagram-post" style={{ background: 'rgba(255,255,255,0.06)' }}>
              <div className="instagram-post-inner" />
            </div>
          ))}
        </div>
      </section>
    )
  }

  // API nije vratio podatke — sakrij sekciju
  if (apiFailed || !posts.length) return null;

  return (
    <section style={sectionStyle}>
      <div className="instagram-grid">
        {posts.map((post) => {
          // thumbnail_url je uvek JPEG (za VIDEO); media_url može biti .heic/.mp4
          // Koristimo thumbnail_url ako postoji, inače media_url
          const mediaUrl = post?.thumbnail_url || post?.media_url
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
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={mediaUrl}
                  alt="Instagram post"
                  referrerPolicy="no-referrer"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  onError={(e) => {
                    const parent = e.currentTarget?.closest?.('a.instagram-post')
                    if (parent) parent.style.display = 'none'
                  }}
                />
              </div>
            </a>
          )
        })}
      </div>
    </section>
  );
};

export default InstagramPosts;
