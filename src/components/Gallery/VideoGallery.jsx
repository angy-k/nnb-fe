'use client'
import { useState } from 'react'
import { Divider } from '@nextui-org/divider'

/* Koprena preko snimka je u izvozu tamnoplava na 70% (`Rectangle 101` u
   „galerija-video", isto i na neaktivnim fotografijama u traci), a ne crna na
   35% kako je ovde stajalo. */
const PlayOverlay = ({ size = 56 }) => (
  <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(38, 26, 84, 0.7)' }}>
    <div style={{ width: size, height: size, borderRadius: '50%', background: 'rgba(255,255,255,0.88)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width={size * 0.4} height={size * 0.4} viewBox="0 0 24 24" fill="#261A54">
        <path d="M8 5v14l11-7z" />
      </svg>
    </div>
  </div>
)

/*
 * Glavni snimak ide preko cele kolone sadržaja — u dizajnu je 1435 širok na
 * okviru od 1920, isto kao i glavna fotografija u foto galeriji. Ovde je stajalo
 * `maxWidth: 900px`, ista greška koja je i tamo sužavala glavnu sliku.
 *
 * Odnos ostaje 16:9. U dizajnu je nacrtan kao 2,09, ali se ugrađeni snimak ne
 * može iseći bez crnih traka gore i dole, pa bi verno praćenje dizajna donelo
 * gori prikaz nego odstupanje.
 */
const FeaturedVideo = ({ video }) => (
  <div style={{ width: '100%' }}>
    {/* Glavni video: po dizajnu 1436 × 688 preko kolone, zaobljenje 30px kao i
        ostale fotografije na sajtu. */}
    <div style={{ borderRadius: '30px', overflow: 'hidden', aspectRatio: '1436 / 688', background: '#000' }}>
      <iframe
        src={video.embed_url}
        title={video.title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
      />
    </div>
    <h2 style={{ fontFamily: 'Open Sans, sans-serif', fontWeight: '700', fontSize: '28px', color: '#1B1B1B', marginTop: '20px' }}>
      {video.title}
    </h2>
  </div>
)

const VideoCard = ({ video, onClick }) => (
  <button
    onClick={() => onClick(video)}
    style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '12px' }}
  >
    {/* Kartica snimka: po dizajnu 467 × 312, zaobljenje 30px. Ranije 16px i
          odnos 16/9, pa je kartica bila niža (262) nego u dizajnu. */}
    <div style={{ borderRadius: '30px', overflow: 'hidden', aspectRatio: '467 / 312', position: 'relative', background: '#ccc', width: '100%' }}>
      <img
        src={video.thumbnail_url}
        alt={video.title}
        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        onError={e => { e.target.style.display = 'none' }}
      />
      <PlayOverlay size={48} />
    </div>
    <p style={{ fontFamily: 'Open Sans, sans-serif', fontWeight: '700', fontSize: '15px', color: '#1B1B1B', margin: 0, lineHeight: 1.4 }}>
      {video.title}
    </p>
  </button>
)

const VideoGallery = ({ videos = [] }) => {
  const [featured, setFeatured] = useState(videos[0] || null)

  if (!videos.length) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px' }}>
        <p style={{ fontFamily: "'MADE GoodTime Script', sans-serif", fontSize: '64px', color: '#261A54', margin: '0 0 16px', lineHeight: 1.2 }}>
          Uskoro stiže!
        </p>
        <p style={{ fontFamily: 'Open Sans, sans-serif', fontSize: '18px', color: '#261A54', opacity: 0.65, margin: 0 }}>
          Ne brinite, video zapisi uskoro stižu.
        </p>
      </div>
    )
  }

  const rest = videos.filter(v => v.id !== featured?.id)

  return (
    <div style={{ width: '100%', maxWidth: 'var(--nnb-kolona)', display: 'flex', flexDirection: 'column', gap: '40px' }}>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <FeaturedVideo video={featured} />
      </div>
      {rest.length > 0 && <Divider className="section-divider" />}
      {/* Tri kolone, kartica 467 široka sa razmakom od 19px — mereno sa izvoza
          Figme: kartice stoje na x 241, 727 i 1213, svaka 467, unutar kolone od
          1440. Vodoravni razmak je ovde bio 20px. */}
      {rest.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', columnGap: '19px', rowGap: '40px' }}>
          {rest.map(video => (
            <VideoCard key={video.id} video={video} onClick={setFeatured} />
          ))}
        </div>
      )}
    </div>
  )
}

export default VideoGallery
