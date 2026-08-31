'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import galleryService from '@/services/galleryService'
import MediaUploadModal from './MediaUploadModal'

const MAX_IMAGES = 3
const MAX_VIDEOS = 1

const TrashIcon = () => (
  <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g clipPath="url(#trash-clip)">
      <path d="M17.9346 1.44502H13.3569L12.9983 0.736688C12.8434 0.427824 12.5257 0.232645 12.1782 0.232917H7.81801C7.47113 0.231598 7.15402 0.427281 7.00168 0.736688L6.64309 1.44502H2.06543C1.72836 1.44502 1.45508 1.71638 1.45508 2.05108V3.26318C1.45508 3.59788 1.72836 3.86924 2.06543 3.86924H17.9346C18.2716 3.86924 18.5449 3.59788 18.5449 3.26318V2.05108C18.5449 1.71638 18.2716 1.44502 17.9346 1.44502Z" fill="white"/>
      <path d="M3.48449 17.9223C3.54492 18.8804 4.345 19.6267 5.31172 19.6268H14.6883C15.655 19.6267 16.4551 18.8804 16.5155 17.9223L17.3242 5.08154H2.67578L3.48449 17.9223Z" fill="white"/>
    </g>
    <defs>
      <clipPath id="trash-clip">
        <rect width="20" height="19.8592" fill="white"/>
      </clipPath>
    </defs>
  </svg>
)

// Extract YouTube video ID from various URL formats
function getYouTubeId(url) {
  try {
    const u = new URL(url)
    if (u.hostname.includes('youtu.be')) return u.pathname.slice(1)
    return u.searchParams.get('v')
  } catch {
    return null
  }
}

// Mereno sa izvoza Figme (`Profil.png`): sličica je 338 × 311 u koloni od 1440,
// a razmak među njima 30 — četiri u redu ispune kolonu. Sličica je dakle nešto
// šira nego viša, ne kvadrat.
const OKVIR_SLICICE = 'aspect-[338/311]'
// Pločica za dodavanje: u dizajnu je puna linija 1px u boji teksta, ne
// isprekidana i ne dvostruka. Provereno na izvozu — ivica je 528 uzastopnih
// piksela bez prekida.
const OKVIR_DODAVANJA = 'border border-solid border-[#261A54]'

// Strelica iz posude, obrisna — mereno na izvozu je 48 × 47 na okviru od 1920,
// sa linijom debljine 4. Srazmerno koloni sajta to je 44px, a `strokeWidth={2}`
// u okviru od 24 daje upravo liniju od ~3,7px na toj veličini.
const IkonaOtpremanja = () => (
  <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" y1="3" x2="12" y2="15" />
  </svg>
)
// 28px je 30 srazmerno umanjeno na kolonu sajta od 1400 sa unutrašnjim
// razmakom (1352 upotrebljivih). Time sličica sama ispadne 317, tačno koliko i
// dizajn traži — širina se ne zadaje ručno.
const MREZA_SLICICA = 'w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-7 pb-2'

// Prazna galerija na pregledu profila. Izgleda kao pločica za dodavanje iz
// izmene, ali ovde ne otvara otpremanje — pregled profila nije izmenljiv, pa
// vodi na `/profil/izmeni`, gde dodavanje i živi.
const PraznaPlocica = ({ tekst }) => (
  <Link
    href="/profil/izmeni"
    className={`rounded-[20px] ${OKVIR_SLICICE} flex flex-col items-center justify-center gap-2 ${OKVIR_DODAVANJA} text-[#261A54]/70 hover:border-[#56C4CF] hover:text-[#56C4CF] transition`}
  >
    <IkonaOtpremanja />
    <span className="text-xs font-medium text-center leading-tight px-2">{tekst}</span>
  </Link>
)

const ProfileGallery = ({ account, editable = false, onGalleryChange }) => {
  const [images, setImages] = useState(account?.gallery_images || [])
  const [videos, setVideos] = useState(account?.gallery_videos || [])
  const [uploading, setUploading] = useState(false)
  const [addingVideo, setAddingVideo] = useState(false)
  const [deletingId, setDeletingId] = useState(null)
  const [imageModalOpen, setImageModalOpen] = useState(false)
  const [videoModalOpen, setVideoModalOpen] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState(null) // { id, type }

  const handleImageUpload = async (file) => {
    if (!file || images.length >= MAX_IMAGES) return
    setUploading(true)
    try {
      const res = await galleryService.uploadImage(file)
      const data = await res.json()
      if (data.success && data.item) {
        const updated = [...images, data.item]
        setImages(updated)
        onGalleryChange?.({ images: updated, videos })
        setImageModalOpen(false)
      } else {
        alert(data.message || 'Greška prilikom otpremanja slike.')
      }
    } catch {
      alert('Greška pri konekciji.')
    } finally {
      setUploading(false)
    }
  }

  const handleAddVideo = async (url) => {
    if (videos.length >= MAX_VIDEOS) return
    setAddingVideo(true)
    try {
      const res = await galleryService.addVideo(url)
      const data = await res.json()
      if (data.success && data.item) {
        const updated = [...videos, data.item]
        setVideos(updated)
        onGalleryChange?.({ images, videos: updated })
        setVideoModalOpen(false)
      } else {
        alert(data.message || 'Greška.')
      }
    } catch {
      alert('Greška pri konekciji.')
    } finally {
      setAddingVideo(false)
    }
  }

  // Otvara confirm modal umesto direktnog brisanja
  const handleDelete = (id, type) => {
    setDeleteConfirm({ id, type })
  }

  // Poziva se kada korisnik potvrdi brisanje
  const confirmDelete = async () => {
    if (!deleteConfirm) return
    const { id, type } = deleteConfirm
    setDeletingId(id)
    setDeleteConfirm(null)
    try {
      const res = await galleryService.deleteItem(id)
      if (res.ok) {
        if (type === 'image') {
          const updated = images.filter((i) => i.id !== id)
          setImages(updated)
          onGalleryChange?.({ images: updated, videos })
        } else {
          const updated = videos.filter((v) => v.id !== id)
          setVideos(updated)
          onGalleryChange?.({ images, videos: updated })
        }
      }
    } catch {
      // silent
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="w-full pt-10 grid gap-14" style={{ maxWidth: '1400px' }}>
      {/* ── Fotografije ─────────────────────────────────────── */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <span className="edit-profile-subtitle">
            {editable ? 'Galerija' : 'Galerija fotografija'}
          </span>
          {editable && (
            <span className="text-sm text-[#261A54]/50">{images.length}/{MAX_IMAGES} fotografija</span>
          )}
        </div>

        <div className={MREZA_SLICICA}>
          {images.map((img) => (
            <div key={img.id} className={`relative group rounded-[20px] overflow-hidden ${OKVIR_SLICICE} bg-gray-100`}>
              <Image
                src={img.url}
                fill
                alt="Galerija"
                className="object-cover"
                sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              />
              {editable && (
                <button
                  type="button"
                  disabled={deletingId === img.id}
                  onClick={() => handleDelete(img.id, 'image')}
                  className="absolute top-3 left-3 text-white flex items-center justify-center transition hover:opacity-70 disabled:opacity-40"
                  style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.55))' }}
                  aria-label="Obriši fotografiju"
                >
                  <TrashIcon />
                </button>
              )}
            </div>
          ))}

          {/* Upload slot kao grid ćelija (edit mode) */}
          {editable && images.length < MAX_IMAGES && (
            <button
              type="button"
              disabled={uploading}
              onClick={() => setImageModalOpen(true)}
              className={`relative rounded-[20px] ${OKVIR_SLICICE} flex flex-col items-center justify-center gap-2 ${OKVIR_DODAVANJA} text-[#261A54]/70 hover:border-[#56C4CF] hover:text-[#56C4CF] transition disabled:opacity-40`}
            >
              {uploading ? (
                <span className="text-xs">Otpremanje...</span>
              ) : (
                <>
                  <IkonaOtpremanja />
                  <span className="text-xs font-medium text-center leading-tight px-2">Dodajte još fotografija</span>
                  {/* U dizajnu ovaj red stoji pri dnu pločice, odvojen od
                      ikone i natpisa koji su usredišteni. */}
                  <span className="text-[11px] opacity-70 absolute bottom-4 left-0 right-0 text-center">Prevucite ovde</span>
                </>
              )}
            </button>
          )}

          {images.length === 0 && !editable && (
            <PraznaPlocica tekst="Dodajte fotografije" />
          )}
        </div>


        {/* „Vidi više..." je uklonjeno. U dizajnu je stajalo dok je galerija
            bila zamišljena kao veća; sada je najviše tri fotografije i sve tri
            staju u jedan red, pa nema šta da otkrije. Uz to nikad i nije bilo
            veza — običan `span` bez rukovaoca, koji je izgledao kao da vodi
            negde. Isto važi i za video ispod. */}
      </div>

      {/* ── Video galerija ──────────────────────────────────── */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <span className="edit-profile-subtitle">Video galerija</span>
          {editable && (
            <span className="text-sm text-[#261A54]/50">{videos.length}/{MAX_VIDEOS} video</span>
          )}
        </div>


        <div className={MREZA_SLICICA}>
          {videos.map((vid) => {
            const ytId = getYouTubeId(vid.url)
            return (
              <div key={vid.id} className={`relative group rounded-[20px] overflow-hidden ${OKVIR_SLICICE} bg-gray-100`}>
                {ytId ? (
                  <iframe
                    src={`https://www.youtube.com/embed/${ytId}`}
                    title="Video"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  />
                ) : (
                  <a
                    href={vid.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-full h-full text-xs text-[#261A54]/60 underline p-4"
                  >
                    {vid.url}
                  </a>
                )}
                {editable && (
                  <button
                    type="button"
                    disabled={deletingId === vid.id}
                    onClick={() => handleDelete(vid.id, 'video')}
                    className="absolute top-3 left-3 text-white flex items-center justify-center transition hover:opacity-70 disabled:opacity-40"
                  style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.55))' }}
                    aria-label="Obriši video"
                  >
                    <TrashIcon />
                  </button>
                )}
              </div>
            )
          })}

          {/* Upload slot za video (edit mode) */}
          {editable && videos.length < MAX_VIDEOS && (
            <div
              className={`rounded-[20px] ${OKVIR_SLICICE} flex flex-col items-center justify-center gap-2 ${OKVIR_DODAVANJA} text-[#261A54]/70 cursor-pointer hover:border-[#56C4CF] hover:text-[#56C4CF] transition`}
              onClick={() => setVideoModalOpen(true)}
            >
              <IkonaOtpremanja />
              <span className="text-xs font-medium text-center leading-tight px-2">Dodajte još video snimaka</span>
            </div>
          )}

          {videos.length === 0 && !editable && (
            <PraznaPlocica tekst="Dodajte video snimke" />
          )}
        </div>

      </div>

      {/* Confirm brisanje modal */}
      {deleteConfirm && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 400,
            // Mereno na izvozu dizajna: pozadina se ravnomerno množi sa ~0,69
            // (bela 245 pada na 168, navy 38 na 27), što je crno na 31% — a ne
            // plava koprena koja je ovde stajala. Uz to je i zamućena.
            background: 'rgba(0,0,0,0.31)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '1rem',
          }}
          onClick={() => setDeleteConfirm(null)}
        >
          {/* Mere sa izvoza: modal je 1440 × 489 na okviru od 1920, dakle iste
              širine kao kolona sadržaja i kao modal za dodavanje videa.
              Srazmerno koloni sajta od 1400 to je 1400 × 475. Preliv ide od
              plavičaste dole levo ka beloj gore desno. */}
          <div
            style={{
              background: 'linear-gradient(to top right, #d5e8ed 0%, #e9eef2 38%, #ffffff 72%)',
              borderRadius: '41px',
              width: '100%',
              maxWidth: '1400px',
              minHeight: '475px',
              padding: '162px 48px 183px',
              position: 'relative',
              boxShadow: '0 16px 60px rgba(0,0,0,0.18)',
              textAlign: 'center',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setDeleteConfirm(null)}
              style={{
                position: 'absolute', top: '47px', right: '49px',
                background: 'none', border: 'none', cursor: 'pointer',
                color: '#261A54', opacity: 0.75, lineHeight: 0, padding: 0,
              }}
              aria-label="Zatvori"
            >
              <svg width="41" height="41" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round">
                <line x1="4" y1="4" x2="20" y2="20" />
                <line x1="20" y1="4" x2="4" y2="20" />
              </svg>
            </button>

            <p style={{
              fontSize: '31px', fontWeight: '700', color: '#261A54',
              marginBottom: '39px', lineHeight: '1.2',
            }}>
              Da li želite da obrišete fotografiju/video snimak?
            </p>

            <div style={{ display: 'flex', gap: '39px', justifyContent: 'center' }}>
              <button
                type="button"
                onClick={confirmDelete}
                disabled={!!deletingId}
                style={{
                  height: '57px', minWidth: '233px', padding: '0 40px',
                  borderRadius: '29px', border: 'none',
                  background: '#56C4CF', color: '#ffffff',
                  fontSize: '16px', fontWeight: '600',
                  cursor: deletingId ? 'not-allowed' : 'pointer',
                  opacity: deletingId ? 0.6 : 1,
                  transition: 'opacity 0.2s',
                }}
              >
                {deletingId ? 'Brisanje...' : 'Da, želim'}
              </button>
              <button
                type="button"
                onClick={() => setDeleteConfirm(null)}
                disabled={!!deletingId}
                style={{
                  height: '57px', minWidth: '233px', padding: '0 40px',
                  borderRadius: '29px', border: 'none',
                  background: '#EC4923', color: '#ffffff',
                  fontSize: '16px', fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'opacity 0.2s',
                }}
              >
                Ne želim
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modali za upload */}
      <MediaUploadModal
        isOpen={imageModalOpen}
        onClose={() => setImageModalOpen(false)}
        mode="image"
        onFileUpload={handleImageUpload}
        uploading={uploading}
      />
      {/* Bez `onFileUpload` — video se dodaje isključivo YouTube linkom.
          Ranije je ovde stajalo otpremanje fajla preko `uploadImage`, što je
          slalo snimak na putanju za slike; ona ga odbija, a greška se nigde
          nije prikazivala. */}
      <MediaUploadModal
        isOpen={videoModalOpen}
        onClose={() => setVideoModalOpen(false)}
        mode="video"
        onVideoUrl={handleAddVideo}
        uploading={uploading}
        addingVideo={addingVideo}
      />
    </div>
  )
}

export default ProfileGallery
