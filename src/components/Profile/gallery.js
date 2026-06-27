'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import galleryService from '@/services/galleryService'

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
  const [videoUrl, setVideoUrl] = useState('')
  const [videoError, setVideoError] = useState('')
  const [uploading, setUploading] = useState(false)
  const [addingVideo, setAddingVideo] = useState(false)
  const [deletingId, setDeletingId] = useState(null)
  const fileInputRef = useRef(null)

  const total = images.length + videos.length

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (total >= MAX_ITEMS) return

    setUploading(true)
    try {
      const res = await galleryService.uploadImage(file)
      const data = await res.json()
      if (data.success && data.item) {
        const updated = [...images, data.item]
        setImages(updated)
        onGalleryChange?.({ images: updated, videos })
      } else {
        alert(data.message || 'Greška prilikom otpremanja slike.')
      }
    } catch {
      alert('Greška pri konekciji.')
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const handleAddVideo = async () => {
    setVideoError('')
    const trimmed = videoUrl.trim()
    if (!trimmed) return

    const youtubePattern = /^https?:\/\/(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[\w\-]+/
    if (!youtubePattern.test(trimmed)) {
      setVideoError('Unesite validan javni YouTube link.')
      return
    }

    if (total >= MAX_ITEMS) {
      setVideoError('Dostigli ste maksimalan broj medija (20).')
      return
    }

    setAddingVideo(true)
    try {
      const res = await galleryService.addVideo(trimmed)
      const data = await res.json()
      if (data.success && data.item) {
        const updated = [...videos, data.item]
        setVideos(updated)
        setVideoUrl('')
        onGalleryChange?.({ images, videos: updated })
      } else {
        setVideoError(data.message || 'Greška.')
      }
    } catch {
      setVideoError('Greška pri konekciji.')
    } finally {
      setAddingVideo(false)
    }
  }

  const handleDelete = async (id, type) => {
    setDeletingId(id)
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
    <div className="w-full pt-24 grid gap-24" style={{ maxWidth: '1400px' }}>
      {/* ── Fotografije ─────────────────────────────────────── */}
      <div>
        <div className="flex items-center justify-between mb-8">
          <span className="edit-profile-subtitle">Galerija fotografija</span>
          {editable && (
            <div className="flex items-center gap-3">
              <span className="text-sm text-[#261A54]/60">
                {total}/{MAX_ITEMS} medija
              </span>
              <button
                type="button"
                disabled={uploading || total >= MAX_ITEMS}
                onClick={() => fileInputRef.current?.click()}
                className="bg-[#56C4CF] hover:opacity-90 disabled:opacity-40 text-white px-5 py-2 rounded-full text-sm font-semibold transition"
              >
                {uploading ? 'Otpremanje...' : '+ Dodaj fotografiju'}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/gif,image/webp"
                className="hidden"
                onChange={handleImageUpload}
              />
            </div>
          )}
        </div>

        <div className="w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pb-4">
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

          {images.length === 0 && (
            <div
              className="rounded-[20px] opacity-60 aspect-square flex items-center justify-center col-span-1"
              style={{ border: '1px dashed #261A64', minHeight: '140px' }}
            >
              <span className="text-xs text-[#261A54]/50">Nema fotografija</span>
            </div>
          )}
        </div>

        {images.length > 4 && (
          <span className="edit-profile-about flex justify-end text-sm text-[#261A54]/60 mt-2">
            Prikazano {images.length} fotografija
          </span>
        )}
      </div>

      {/* ── Video galerija ──────────────────────────────────── */}
      <div>
        <div className="flex items-center justify-between mb-8">
          <span className="edit-profile-subtitle">Video galerija</span>
        </div>

        {editable && (
          <div className="flex flex-col gap-2 mb-6">
            <div className="flex gap-3">
              <input
                type="url"
                value={videoUrl}
                onChange={(e) => { setVideoUrl(e.target.value); setVideoError('') }}
                placeholder="https://youtube.com/watch?v=..."
                className="flex-1 border border-[#d1d5db] rounded-full px-4 py-2 text-sm text-[#261A54] outline-none focus:border-[#56C4CF] transition"
              />
              <button
                type="button"
                disabled={addingVideo || !videoUrl.trim() || total >= MAX_ITEMS}
                onClick={handleAddVideo}
                className="bg-[#56C4CF] hover:opacity-90 disabled:opacity-40 text-white px-5 py-2 rounded-full text-sm font-semibold transition whitespace-nowrap"
              >
                {addingVideo ? 'Dodavanje...' : '+ Dodaj video'}
              </button>
            </div>
            {videoError && (
              <p className="text-xs text-[#EC4923] pl-4">{videoError}</p>
            )}
            <p className="text-xs text-[#261A54]/50 pl-4">
              Dodajte javni YouTube link (npr. youtube.com/watch?v=ID ili youtu.be/ID)
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-4">
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

          {videos.length === 0 && (
            <div
              className="rounded-[20px] opacity-60 aspect-video flex items-center justify-center col-span-1"
              style={{ border: '1px dashed #261A64', minHeight: '120px' }}
            >
              <span className="text-xs text-[#261A54]/50">Nema videa</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProfileGallery
