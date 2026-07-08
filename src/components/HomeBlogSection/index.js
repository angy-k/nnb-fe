'use client'

import { useEffect, useState } from 'react'
import { Divider } from '@nextui-org/divider'
import { useRouter } from 'next/navigation'

import Button from '@/components/Button'
import CardComponent from '@/components/CardComponent'
import blogService from '@/services/blogService'
import { formatTitleForUri } from '@/utils/transform-helper'

const HomeBlogSection = () => {
  const router = useRouter()
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await blogService.getBlogs()
        if (!response.ok) {
          setBlogs([])
          setError('Greška pri učitavanju blog objava.')
          return
        }

        const data = await response.json().catch(() => null)
        if (!data?.success) {
          setBlogs([])
          setError(data?.message || 'Greška pri učitavanju blog objava.')
          return
        }

        const items = Array.isArray(data?.data)
          ? data.data
          : Array.isArray(data?.data?.data)
            ? data.data.data
            : []

        setBlogs(items)
      } catch (e) {
        setBlogs([])
        setError('Greška pri učitavanju blog objava.')
      } finally {
        setLoading(false)
      }
    }

    fetchBlogs()
  }, [])

  const openAllBlogs = () => {
    router.push('/blog')
  }

  const openBlog = (blog) => {
    router.push(`/blog/${formatTitleForUri(blog?.title)}`)
  }

  const limitedBlogs = blogs.slice(0, 3)

  return (
    <div className="w-full blogs-container pt-32 grid place-items-center pb-64 z-1">
      <div className="w-full" style={{ maxWidth: '1400px' }}>
        <div className="flex items-center justify-between gap-6">
          <span className="blog-title">Blog</span>
          <Button
            type={'outlined-dark'}
            name={'Pogledaj sve objave'}
            onClick={openAllBlogs}
          />
        </div>
        <Divider className="section-divider" />
      </div>

      {loading && <div className="text-center pt-24">Učitavanje...</div>}

      {!loading && error && (
        <div className="text-[#EC4923] text-center pt-24">{error}</div>
      )}

      {!loading && !error && (
        <div className="blog-container grid sm:grid-template-1 md:grid-template-2 mt-6">
          {limitedBlogs.map((blog, index) => (
            <div className="blog-card" key={blog?.id ? `home-blog-${blog.id}` : `home-blog-${index}`}>
              <CardComponent
                key={`home-blog-card-${blog?.id || index}`}
                {...(blog?.coverImage ? { imageSrc: blog.coverImage } : {})}
                imageWidth={438}
                imageHeight={344}
                imageRadius={'30px'}
                imageAltText={`Blog post - ${blog?.title || ''}`}
                sectionType={'blog'}
                author={blog?.author}
                title={blog?.title}
                creationDate={blog?.creationDate}
                buttonAction={() => openBlog(blog)}
                buttonText="Pročitaj više"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default HomeBlogSection
