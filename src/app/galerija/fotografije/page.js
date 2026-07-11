import PageHeroSection from '@/components/Hero/pageOwl'
import PhotosGallery from '@/components/Gallery/PhotosGallery'

async function getPhotos() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/gallery/public/photos`,
      { next: { revalidate: 3600, tags: ['gallery'] } }
    )
    if (!res.ok) return []
    const json = await res.json()
    return json.success ? json.data : []
  } catch {
    return []
  }
}

const PhotosPage = async () => {
  const photos = await getPhotos()
  return (
    <>
      <PageHeroSection title="Galerija" type="icons" icons={true} />
      <div className="w-full grid place-items-center pt-24 pb-48 bg-[#F0F0F0]">
        <PhotosGallery photos={photos} />
      </div>
    </>
  )
}

export default PhotosPage
