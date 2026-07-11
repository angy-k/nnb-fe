import PageHeroSection from '@/components/Hero/pageOwl'
import VideoGallery from '@/components/Gallery/VideoGallery'

async function getVideos() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/gallery/public/videos`,
      { next: { revalidate: 3600, tags: ['gallery'] } }
    )
    if (!res.ok) return []
    const json = await res.json()
    return json.success ? json.data : []
  } catch {
    return []
  }
}

const VideoPage = async () => {
  const videos = await getVideos()
  return (
    <>
      <PageHeroSection title="Galerija" type="icons" icons={true} />
      <div className="w-full grid place-items-center pt-24 pb-48 bg-[#F0F0F0]">
        <VideoGallery videos={videos} />
      </div>
    </>
  )
}

export default VideoPage
