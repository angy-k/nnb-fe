'use client'
import CardComponent from "../CardComponent";
import { Divider } from "@nextui-org/divider";
import Button from "../Button";
import { formatTitleForUri } from '@/utils/transform-helper';
import { useRouter } from 'next/navigation'
import PageHeroSection from '@/components/Hero/pageOwl';
import { useState, useEffect } from 'react';
import blogService from '@/services/blogService';


// ── Pagination ─────────────────────────────────────────────────────────────────
const BlogPagination = ({ page, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null

  const getPages = () => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1)
    }
    const around = [page - 1, page, page + 1].filter(p => p > 3 && p < totalPages - 1)
    const core = Array.from(new Set([1, 2, 3, ...around, totalPages - 1, totalPages])).sort((a, b) => a - b)
    const result = []
    let prev = null
    for (const p of core) {
      if (prev && p - prev > 1) result.push('...')
      result.push(p)
      prev = p
    }
    return result
  }

  const btnBase = {
    minWidth: '36px', height: '36px', borderRadius: '50%', border: 'none',
    fontSize: '15px', fontWeight: '500', cursor: 'pointer', transition: 'background 0.15s',
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', paddingTop: '48px' }}>
      <button
        type="button"
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        style={{ ...btnBase, background: 'transparent', color: page === 1 ? '#ccc' : '#261A54', fontSize: '20px' }}
        aria-label="Prethodna"
      >
        ‹
      </button>

      {getPages().map((p, i) =>
        p === '...'
          ? <span key={`ellipsis-${i}`} style={{ padding: '0 4px', color: '#261A54' }}>...</span>
          : (
            <button
              key={p}
              type="button"
              onClick={() => onPageChange(p)}
              style={{
                ...btnBase,
                background: p === page ? '#261A54' : 'transparent',
                color: p === page ? '#ffffff' : '#261A54',
              }}
            >
              {p}
            </button>
          )
      )}

      <button
        type="button"
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        style={{ ...btnBase, background: 'transparent', color: page === totalPages ? '#ccc' : '#261A54', fontSize: '20px' }}
        aria-label="Sledeća"
      >
        ›
      </button>
    </div>
  )
}


const Blogs = ({
  title,
  numberForDisplay,
  blogs: propBlogs,
  pagination = false,
  sectionType = 'blog',
  showHero = true
}) => {
  const router = useRouter()
  const [blogs, setBlogs] = useState(propBlogs || [])
  const [loading, setLoading] = useState(!propBlogs)
  const [error, setError] = useState(null)
  const [page, setPage] = useState(1)

  const POSTS_PER_PAGE = numberForDisplay || 6

  useEffect(() => {
    if (!propBlogs) {
      fetchBlogs()
    }
  }, [propBlogs])

  const fetchBlogs = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await blogService.getBlogs()

      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          const items = Array.isArray(data.data)
            ? data.data
            : Array.isArray(data.data?.data)
              ? data.data.data
              : []
          setBlogs(items)
          setPage(1)
        } else {
          throw new Error(data.message || 'Failed to fetch blogs')
        }
      } else {
        throw new Error('Failed to fetch blogs')
      }
    } catch (err) {
      console.error('Error fetching blogs:', err)
      setError(err.message)
      setBlogs([])
    } finally {
      setLoading(false)
    }
  }

  function goToSingleBlog(blog) {
    router.push(`/blog/${formatTitleForUri(blog.title)}`)
  }

  function previewAllPosts() {
    console.log('preview all blog posts')
  }

  const totalPages = pagination ? Math.ceil(blogs.length / POSTS_PER_PAGE) : 1
  const limitedBlogs = pagination
    ? blogs.slice((page - 1) * POSTS_PER_PAGE, page * POSTS_PER_PAGE)
    : (numberForDisplay ? blogs.slice(0, numberForDisplay) : blogs)

  if (loading) {
    return (
      <>
        {showHero && <PageHeroSection
          title={`Blog`}
        />}
        <div className="w-full blogs-container pt-24 grid place-items-center pb-48 z-1 bg-[#F0F0F0]">
          <div className="text-center text-[#261A54]">Učitavanje objava...</div>
        </div>
      </>
    )
  }

  return (
    <>
      {showHero && <PageHeroSection
        title={`Blog`}
      />}
      <div className="w-full blogs-container pt-24 grid place-items-center pb-48 z-1 bg-[#F0F0F0]">
        {!showHero && (
          <>
            <Divider className="section-divider w-1440" style={{marginBottom: '35px'}}/>
            <div className="flex justify-start">
              <span className="blog-title text-start">Pročitaj još</span>
            </div>
          </>
        )}
        {error && (
          <div className="text-[#EC4923] text-center mb-4">Greška prilikom učitavanja objava.</div>
        )}
        {!loading && !error && limitedBlogs.length === 0 && (
          <p className="text-[#261A54] our-team-title">Objave uskoro stižu.</p>
        )}
        {title && <span className="blog-title">{title}</span>}
        {title && <Button
            key={`section-component-title-button-${sectionType}`}
            type={'outlined-dark'}
            name={'Pogledaj sve objave'}
            onClick={() => previewAllPosts()}
        />}
        {title && <Divider className="section-divider"/>}
        <div className="blog-container grid  sm:grid-template-1 md:grid-template-2">
          {limitedBlogs.map((blog, index) => (
            <div className="blog-card" key={`blog-card-${index}`}>
              <CardComponent
                key={`blog-card-${index}`}
                {...(blog.coverImage && { imageSrc: blog.coverImage })}
                imageWidth={438}
                imageHeight={344}
                imageRadius={"30px"}
                imageAltText={`Blog post - ${blog.title}`}
                sectionType={'blog'}
                author={blog.author}
                title={blog.title}
                creationDate={blog.creationDate}
                buttonAction={() => goToSingleBlog(blog)}
                buttonText="Pročitaj više"
              />
            </div>
          ))}
        </div>
        {pagination && (
          <>
            <Divider className="section-divider w-1440" style={{marginTop: '35px'}}/>
            <BlogPagination
              page={page}
              totalPages={totalPages}
              onPageChange={(p) => {
                setPage(p)
                window.scrollTo({ top: 0, behavior: 'smooth' })
              }}
            />
          </>
        )}
      </div>
    </>
  )
}

export default Blogs;
