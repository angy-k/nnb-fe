'use client'

import { useState } from 'react'
import Image from 'next/image'
import galleryService from '@/services/galleryService'
import MediaUploadModal from './MediaUploadModal'

const MAX_ITEMS = 20

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

const ProfileGallery = ({ account, editable = false, onGalleryChange }) => {
  const [images, setImages] = useState(account?.gallery_images || [])
  const [videos, setVideos] = useState(account?.gallery_videos || [])
  const [uploading, setUploading] = useState(false)
  const [addingVideo, setAddingVideo] = useState(false)
  const [deletingId, setDeletingId] = useState(null)
  const [imageModalOpen, setImageModalOpen] = useState(false)
  const [videoModalOpen, setVideoModalOpen] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState(null) // { id, type }

  const total = images.length + videos.length

  const handleImageUpload = async (file) => {
    if (!file || total >= MAX_ITEMS) return
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
    if (total >= MAX_ITEMS) return
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
            <span className="text-sm text-[#261A54]/50">{total}/{MAX_ITEMS} medija</span>
          )}
        </div>

        <div className="w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pb-2">
          {images.map((img) => (
            <div key={img.id} className="relative group rounded-[20px] overflow-hidden aspect-square bg-gray-100">
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
                  className="absolute top-2 left-2 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition hover:bg-black/80 disabled:opacity-40"
                  aria-label="Obriši fotografiju"
                >
                  <TrashIcon />
                </button>
              )}
            </div>
          ))}

          {/* Upload slot kao grid ćelija (edit mode) */}
          {editable && total < MAX_ITEMS && (
            <button
              type="button"
              disabled={uploading}
              onClick={() => setImageModalOpen(true)}
              className="rounded-[20px] aspect-square flex flex-col items-center justify-center gap-2 border-2 border-dashed border-[#261A54]/20 text-[#261A54]/50 hover:border-[#56C4CF] hover:text-[#56C4CF] transition disabled:opacity-40"
            >
              {uploading ? (
                <span className="text-xs">Otpremanje...</span>
              ) : (
                <>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="17 8 12 3 7 8"/>
                    <line x1="12" y1="3" x2="12" y2="15"/>
                  </svg>
                  <span className="text-xs font-medium text-center leading-tight px-2">Dodajte još fotografija</span>
                  <span className="text-[11px] opacity-70">Prevucite ovde</span>
                </>
              )}
            </button>
          )}

          {images.length === 0 && !editable && (
            <div
              className="rounded-[20px] opacity-60 aspect-square flex items-center justify-center col-span-1"
              style={{ border: '1px dashed #261A64', minHeight: '140px' }}
            >
              <span className="text-xs text-[#261A54]/50">Nema fotografija</span>
            </div>
          )}
        </div>


        {images.length > 0 && (
          <span className="edit-profile-about flex justify-end mt-2">Vidi više...</span>
        )}
      </div>

      {/* ── Video galerija ──────────────────────────────────── */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <span className="edit-profile-subtitle">Video galerija</span>
        </div>


        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pb-2">
          {videos.map((vid) => {
            const ytId = getYouTubeId(vid.url)
            return (
              <div key={vid.id} className="relative group rounded-[20px] overflow-hidden aspect-video bg-gray-100">
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
                    className="absolute top-2 left-2 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition hover:bg-black/80 disabled:opacity-40"
                    aria-label="Obriši video"
                  >
                    <TrashIcon />
                  </button>
                )}
              </div>
            )
          })}

          {/* Upload slot za video (edit mode) */}
          {editable && total < MAX_ITEMS && (
            <div
              className="rounded-[20px] aspect-video flex flex-col items-center justify-center gap-2 border-2 border-dashed border-[#261A54]/20 text-[#261A54]/50 cursor-pointer hover:border-[#56C4CF] hover:text-[#56C4CF] transition"
              onClick={() => setVideoModalOpen(true)}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="17 8 12 3 7 8"/>
                <line x1="12" y1="3" x2="12" y2="15"/>
              </svg>
              <span className="text-xs font-medium text-center leading-tight px-2">Dodajte još video snimaka</span>
            </div>
          )}

          {videos.length === 0 && !editable && (
            <div
              className="rounded-[20px] opacity-60 aspect-video flex items-center justify-center col-span-1"
              style={{ border: '1px dashed #261A64', minHeight: '120px' }}
            >
              <span className="text-xs text-[#261A54]/50">Nema videa</span>
            </div>
          )}
        </div>

        {videos.length > 0 && (
          <span className="edit-profile-about flex justify-end mt-2">Vidi više...</span>
        )}
      </div>

      {/* Confirm brisanje modal */}
      {deleteConfirm && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 400,
            background: 'rgba(38,26,84,0.45)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '1rem',
          }}
          onClick={() => setDeleteConfirm(null)}
        >
          <div
            style={{
              background: 'linear-gradient(145deg, #deedf7 0%, #f8fcff 40%, #ffffff 60%, #eef5fb 100%)',
              borderRadius: '28px',
              width: '100%',
              maxWidth: '680px',
              padding: '64px 48px 56px',
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
                position: 'absolute', top: '20px', right: '24px',
                background: 'none', border: 'none', cursor: 'pointer',
                fontSize: '22px', color: '#261A54', opacity: 0.6, lineHeight: 1,
              }}
              aria-label="Zatvori"
            >
              ✕
            </button>

            <p style={{
              fontSize: '22px', fontWeight: '700', color: '#261A54',
              marginBottom: '40px', lineHeight: '1.4',
            }}>
              Da li želite da obrišete fotografiju/video snimak?
            </p>

            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
              <button
                type="button"
                onClick={confirmDelete}
                disabled={!!deletingId}
                style={{
                  height: '52px', padding: '0 40px',
                  borderRadius: '30px', border: 'none',
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
                  height: '52px', padding: '0 40px',
                  borderRadius: '30px', border: 'none',
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
      <MediaUploadModal
        isOpen={videoModalOpen}
        onClose={() => setVideoModalOpen(false)}
        mode="video"
        onFileUpload={async (file) => {
          // Video file upload — ako postoji servis za to
          setUploading(true)
          try {
            const res = await galleryService.uploadImage(file) // ili uploadVideo ako postoji
            const data = await res.json()
            if (data.success && data.item) {
              const updated = [...videos, data.item]
              setVideos(updated)
              onGalleryChange?.({ images, videos: updated })
              setVideoModalOpen(false)
            }
          } catch { /* silent */ } finally { setUploading(false) }
        }}
        onVideoUrl={handleAddVideo}
        uploading={uploading}
        addingVideo={addingVideo}
      />
    </div>
  )
}

export default ProfileGallery
