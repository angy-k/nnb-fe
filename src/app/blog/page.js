import Blogs from '@/components/CardsLayout/Blogs';

async function getBlogs() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/blogs`,
      { next: { revalidate: 3600, tags: ['blogs'] } }
    )
    if (!res.ok) return []
    const data = await res.json()
    if (!data.success) return []
    return Array.isArray(data.data) ? data.data
      : Array.isArray(data.data?.data) ? data.data.data
      : []
  } catch {
    return []
  }
}

const BlogPage = async () => {
  const blogs = await getBlogs()
  return (
    <div className="mt-60 grid place-items-center w-full">
      <Blogs blogs={blogs} pagination={true} />
    </div>
  )
}

export default BlogPage
