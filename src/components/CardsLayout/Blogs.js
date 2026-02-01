'use client'
import CardComponent from "../CardComponent";
import { Divider } from "@nextui-org/divider";
import Button from "../Button";
import { formatTitleForUri } from '@/utils/transform-helper';
import { useRouter } from 'next/navigation'
import PageHeroSection from '@/components/Hero/pageOwl';
import { useState, useEffect } from 'react';
import blogService from '@/services/blogService';


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
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Only fetch from API if no blogs were passed as props
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
    console.log('preview single blog post: ', blog.title)
    router.push(`/blog/${formatTitleForUri(blog.title)}`)
  }

  function previewAllPosts() {
    console.log('preview all blog posts')
  }

  let limitedBlogs = numberForDisplay ? blogs.slice(0,numberForDisplay) : blogs
  
  if (loading) {
    return (
      <>
        {showHero && <PageHeroSection 
          title={`Blog`}
        />}
        <div className="w-full blogs-container pt-24 grid place-items-center pb-48 z-1 bg-[#F0F0F0]">
          <div className="text-center">Loading blogs...</div>
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
          <div className="text-red-500 text-center mb-4">
            Error loading blogs: {error}
          </div>
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
        {/* pagination */}
        {(pagination && blogs.length > 6) && <Divider className="section-divider w-1440" style={{marginTop: '35px'}}/>}
        {/* {(pagination || blogs.length > 6) && <PaginationComponent />} */}
      </div>
    </>
  )
}

export default Blogs;
