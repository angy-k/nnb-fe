'use client';
import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import PageHeroSection from '@/components/Hero/pageOwl';
import Blogs from '@/components/CardsLayout/Blogs';
import blogService from '@/services/blogService';
import { formatTitleForUri } from '@/utils/transform-helper';
import Image from 'next/image';
import HomeIcon from '@/icons/home-icon.svg';

const BlogDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const { title } = params;
  const [blog, setBlog] = useState(null);
  const [similarBlogs, setSimilarBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBlogData();
  }, [title]);

  const fetchBlogData = async () => {
    try {
      setLoading(true);
      setError(null);

      const titleParam = Array.isArray(title) ? title[0] : title;
      const slug = decodeURIComponent((titleParam ?? '').toString());
      if (!slug) {
        throw new Error('Missing blog title');
      }

      const listResponse = await blogService.getBlogs();
      if (!listResponse.ok) {
        throw new Error('Failed to fetch blogs');
      }

      const listJson = await listResponse.json();
      if (!listJson.success || !Array.isArray(listJson.data)) {
        throw new Error(listJson.message || 'Failed to fetch blogs');
      }

      const matched = listJson.data.find((b) => {
        const candidateSlug = formatTitleForUri((b?.title ?? '').toString());
        return candidateSlug === slug;
      });

      if (!matched?.id) {
        throw new Error('Blog not found');
      }

      const response = await blogService.getBlog(matched.id);
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setBlog(data.data.blog);
          setSimilarBlogs(data.data.similarBlogs);
        } else {
          throw new Error(data.message || 'Failed to fetch blog');
        }
      } else {
        throw new Error('Failed to fetch blog');
      }
    } catch (err) {
      console.error('Error fetching blog:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <PageHeroSection title={"Blog"} />
        <div className="w-full pt-24 grid place-items-center pb-48 z-1 bg-[#F0F0F0]">
          <div className="text-center">Loading blog post...</div>
        </div>
      </>
    );
  }

  return (
    <>
      <PageHeroSection title="Blog" />
      <div className="w-full pt-24 grid place-items-center pb-48 z-1 bg-[#F0F0F0]">
        {error && (
          <div className="text-red-500 text-center mb-4">
            Error loading blog: {error}
          </div>
        )}
        <div className="max-w-7xl mx-auto px-6">
          <div className="bg-white rounded-lg mb-6">
                {blog && (
                  <>
                    {/* Breadcrumb and Publication Date */}
                    <div className="flex flex-col md:flex-row md:justify-between md:items-center items-start gap-4 mb-8 p-8 pb-0">
                      <div className="text-sm text-[#1B1B1B]">
                        Objavljeno: {blog.creationDate}
                      </div>
                      <nav className="text-sm text-[#1B1B1B] flex flex-wrap items-center">
                        <button 
                          onClick={() => router.push('/')}
                          className="hover:opacity-70 cursor-pointer"
                        >
                          <Image 
                            src={HomeIcon} 
                            alt="Home" 
                            width={16} 
                            height={16}
                          />
                        </button>
                        <span className="mx-2">/</span>
                        <button 
                          onClick={() => router.push('/blog')}
                          className="hover:text-[#1B1B1B] cursor-pointer"
                        >
                          sve objave
                        </button>
                        <span className="mx-2">/</span>
                        <span className="text-[#1B1B1B]">
                          {blog.title.length > 30 ? blog.title.substring(0, 30) + '...' : blog.title}
                        </span>
                      </nav>
                    </div>
                    
                    {/* Title and Author */}
                    <div className="flex flex-col md:flex-row md:justify-between md:items-end items-start mb-8 px-8 gap-4 md:gap-18">
                      <h1 className="single-blog-title flex-1 min-w-0" style={{wordWrap: 'break-word', whiteSpace: 'normal'}}>
                        {blog.title}
                      </h1>
                      <div className="text-sm text-[#1B1B1B] whitespace-normal md:whitespace-nowrap break-words max-w-full self-start md:self-end">
                        Autor: {blog.author}
                      </div>
                    </div>
                    <div className="px-8">
                      <img 
                        src={blog.coverImage || blog.heroImage || '/card-component-default-image.png'} 
                        className="w-full h-80 object-cover rounded-lg mb-8"
                      />
                      <div className="flex flex-col md:flex-row gap-8">
                        {/* Blog Content */}
                        <div className="flex-1">
                          <div className="prose prose-lg max-w-none pb-8">
                            <div
                              className="text-gray-700 leading-relaxed text-lg single-blog-content"
                              dangerouslySetInnerHTML={{ __html: blog.content || '' }}
                            />
                          </div>
                        </div>
                        
                        {/* Similar Blogs Sidebar */}
                        {similarBlogs && similarBlogs.length > 0 && (
                          <div className="w-full md:w-80">
                            <h3 className="text-lg font-semibold text-[#1B1B1B] mb-4">Pročitaj još:</h3>
                            <div className="bg-[#261A54] rounded-lg p-6 md:sticky md:top-24">
                              <ul className="space-y-3">
                                {similarBlogs.map((similarBlog, index) => (
                                  <li key={index}>
                                    <button
                                      onClick={() => router.push(`/blog/${formatTitleForUri(similarBlog.title)}`)}
                                      className="text-blue-700 hover:text-blue-900 text-sm font-medium text-left w-full transition-colors duration-200"
                                    >
                                      {similarBlog.title}
                                    </button>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                )}
                {!blog && !error && (
                  <div className="p-8">
                    <h1 className="text-4xl font-bold mb-6 text-gray-900">
                      {title ? title.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'Blog Post'}
                    </h1>
                    <p className="text-gray-600">Blog post content will be displayed here.</p>
                  </div>
                )}
          </div>
        </div>
      </div>
    </>
  );
};

export default BlogDetailPage;
