'use client'
import { useState, useEffect } from 'react'
import { Divider } from '@nextui-org/divider'
import PageHeroSection from '@/components/Hero/pageOwl'

const fetchVideos = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/gallery/public/videos`, {
    cache: 'no-store',
  })
  if (!res.ok) throw new Error('Failed to fetch videos')
  const json = await res.json()
  return json.success ? json.data : []
}

// ─── Play button overlay ──────────────────────────────────────────────────────
const PlayOverlay = ({ size = 56 }) => (
  <div style={{
    position: 'absolute', inset: 0,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: 'rgba(0,0,0,0.35)',
  }}>
    <div style={{
      width: size, height: size,
      borderRadius: '50%',
      background: 'rgba(255,255,255,0.88)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <svg width={size * 0.4} height={size * 0.4} viewBox="0 0 24 24" fill="#261A54">
        <path d="M8 5v14l11-7z" />
      </svg>
    </div>
  </div>
)

// ─── Featured video (embed) ───────────────────────────────────────────────────
const FeaturedVideo = ({ video }) => (
  <div style={{ width: '100%', maxWidth: '900px' }}>
    <div style={{
      borderRadius: '20px',
      overflow: 'hidden',
      aspectRatio: '16/9',
      background: '#000',
    }}>
      <iframe
        src={video.embed_url}
        title={video.title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
      />
    </div>
    <h2 style={{
      fontFamily: 'Open Sans, sans-serif',
      fontWeight: '700',
      fontSize: '28px',
      color: '#1B1B1B',
      marginTop: '20px',
    }}>
      {video.title}
    </h2>
  </div>
)

// ─── Video card (grid item) ───────────────────────────────────────────────────
const VideoCard = ({ video, onClick }) => (
  <button
    onClick={() => onClick(video)}
    style={{
      background: 'none', border: 'none', padding: 0,
      cursor: 'pointer', textAlign: 'left',
      display: 'flex', flexDirection: 'column', gap: '12px',
    }}
  >
    <div style={{
      borderRadius: '16px',
      overflow: 'hidden',
      aspectRatio: '16/9',
      position: 'relative',
      background: '#ccc',
      width: '100%',
    }}>
      <img
        src={video.thumbnail_url}
        alt={video.title}
        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        onError={e => { e.target.style.display = 'none' }}
      />
      <PlayOverlay size={48} />
    </div>
    <p style={{
      fontFamily: 'Open Sans, sans-serif',
      fontWeight: '700',
      fontSize: '15px',
      color: '#1B1B1B',
      margin: 0,
      lineHeight: 1.4,
    }}>
      {video.title}
    </p>
  </button>
)

// ─── Video gallery ────────────────────────────────────────────────────────────
const VideoGallery = ({ videos }) => {
  const [featured, setFeatured] = useState(videos[0] || null)

  if (!videos.length) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px' }}>
        <p style={{
          fontFamily: "'MADE GoodTime Script', sans-serif",
          fontSize: '64px',
          color: '#261A54',
          margin: '0 0 16px',
          lineHeight: 1.2,
        }}>
          Uskoro stiže!
        </p>
        <p style={{
          fontFamily: 'Open Sans, sans-serif',
          fontSize: '18px',
          color: '#261A54',
          opacity: 0.65,
          margin: 0,
        }}>
          Ne brinite, video zapisi uskoro stižu.
        </p>
      </div>
    )
  }

  const rest = videos.filter(v => v.id !== featured?.id)

  return (
    <div style={{ width: '100%', maxWidth: '1400px', display: 'flex', flexDirection: 'column', gap: '40px' }}>
      {/* Featured */}
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <FeaturedVideo video={featured} />
      </div>

      {/* Divider */}
      {rest.length > 0 && <Divider className="section-divider" />}

      {/* Grid */}
      {rest.length > 0 && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '40px 32px',
        }}>
          {rest.map(video => (
            <VideoCard key={video.id} video={video} onClick={setFeatured} />
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────
const VideoPage = () => {
  const [videos, setVideos]   = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchVideos()
      .then(setVideos)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  return (
    <>
      <PageHeroSection title="Galerija" type="icons" icons={true} />

      <div className="w-full grid place-items-center pt-24 pb-48 bg-[#F0F0F0]">
        {loading ? (
          <p style={{ color: '#261A54', fontFamily: 'Open Sans, sans-serif', fontSize: '16px' }}>
            Učitavanje video zapisa...
          </p>
        ) : (
          <VideoGallery videos={videos} />
        )}
      </div>
    </>
  )
}

export default VideoPage
