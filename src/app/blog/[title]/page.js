'use client';
import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import PageHeroSection from '@/components/Hero/pageOwl';
import CardComponent from '@/components/CardComponent';
import blogService from '@/services/blogService';
import { formatTitleForUri } from '@/utils/transform-helper';
import Image from 'next/image';
import HomeIcon from '@/icons/home-icon.svg';
import AvatarIcon from '@/icons/avatar-default.svg';

const BlogDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const { title } = params;
  const [blog, setBlog] = useState(null);
  const [similarBlogs, setSimilarBlogs] = useState([]);
  const [prevBlog, setPrevBlog] = useState(null);
  const [nextBlog, setNextBlog] = useState(null);
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

      const matchedIndex = listJson.data.findIndex((b) => {
        const candidateSlug = formatTitleForUri((b?.title ?? '').toString());
        return candidateSlug === slug;
      });

      if (matchedIndex === -1 || !listJson.data[matchedIndex]?.id) {
        throw new Error('Blog not found');
      }

      const matched = listJson.data[matchedIndex];

      // Prev / next from the list
      setPrevBlog(matchedIndex > 0 ? listJson.data[matchedIndex - 1] : null);
      setNextBlog(matchedIndex < listJson.data.length - 1 ? listJson.data[matchedIndex + 1] : null);

      const response = await blogService.getBlog(matched.id);

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setBlog(data.data.blog);
          setSimilarBlogs(data.data.similarBlogs || []);
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

  const navBtnStyle = {
    border: '1.5px solid #261A54',
    borderRadius: '30px',
    padding: '10px 24px',
    background: 'transparent',
    color: '#261A54',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'opacity 0.2s',
  }

  if (loading) {
    return (
      <>
        <PageHeroSection title={"Blog"} />
        <div className="w-full pt-24 grid place-items-center pb-48 z-1 bg-[#F0F0F0]">
          <div className="text-center">Učitavanje objave...</div>
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
        <div className="max-w-7xl mx-auto px-6 w-full">
          {/* ── White card ── */}
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
                  <div className="flex items-center gap-2 self-start md:self-end">
                    <span className="text-sm text-[#1B1B1B] whitespace-nowrap">
                      Autor: {blog.author}
                    </span>
                    <Image
                      src={AvatarIcon}
                      alt={blog.author}
                      width={36}
                      height={36}
                      style={{ borderRadius: '50%' }}
                    />
                  </div>
                </div>

                <div className="px-8 pb-10">
                  {/* Cover image */}
                  <img
                    src={blog.coverImage || blog.heroImage || '/card-component-default-image.png'}
                    alt={blog.title}
                    className="w-full h-80 object-cover rounded-lg mb-8"
                  />

                  {/* Content + sidebar */}
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
                      <div className="w-full md:w-72 flex-shrink-0">
                        <h3 className="text-sm font-semibold text-[#1B1B1B] mb-3">Pročitaj još:</h3>
                        <div className="bg-[#261A54] rounded-xl p-5 md:sticky md:top-28">
                          <ul className="flex flex-col gap-2">
                            {similarBlogs.map((similarBlog, index) => (
                              <li key={index}>
                                <button
                                  onClick={() => router.push(`/blog/${formatTitleForUri(similarBlog.title)}`)}
                                  className="text-white hover:opacity-70 text-sm font-medium text-left w-full transition-opacity duration-200"
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
                <p className="text-gray-600">Sadržaj objave će biti prikazan ovde.</p>
              </div>
            )}
          </div>

          {/* ── Prev / Next navigation ── */}
          {blog && (prevBlog || nextBlog) && (
            <div className="flex justify-between items-center mt-2 mb-2">
              {prevBlog ? (
                <button
                  type="button"
                  onClick={() => router.push(`/blog/${formatTitleForUri(prevBlog.title)}`)}
                  style={navBtnStyle}
                  onMouseOver={e => e.currentTarget.style.opacity = '0.7'}
                  onMouseOut={e => e.currentTarget.style.opacity = '1'}
                >
                  ← Prethodna objava
                </button>
              ) : <div />}
              {nextBlog && (
                <button
                  type="button"
                  onClick={() => router.push(`/blog/${formatTitleForUri(nextBlog.title)}`)}
                  style={navBtnStyle}
                  onMouseOver={e => e.currentTarget.style.opacity = '0.7'}
                  onMouseOut={e => e.currentTarget.style.opacity = '1'}
                >
                  Sledeća objava →
                </button>
              )}
            </div>
          )}

          {/* ── "Pročitaj još" bottom section ── */}
          {blog && similarBlogs && similarBlogs.length > 0 && (
            <>
              <div style={{ borderTop: '1px solid #d0d0d0', margin: '32px 0 0' }} />
              <div className="pt-8 pb-4">
                <span className="blog-title">Pročitaj još</span>
              </div>
              <div className="blog-container grid sm:grid-template-1 md:grid-template-2 mb-8">
                {similarBlogs.slice(0, 3).map((similarBlog, index) => (
                  <div className="blog-card" key={`similar-${index}`}>
                    <CardComponent
                      {...(similarBlog.coverImage && { imageSrc: similarBlog.coverImage })}
                      imageWidth={438}
                      imageHeight={344}
                      imageRadius={"30px"}
                      imageAltText={`Blog post - ${similarBlog.title}`}
                      sectionType={'blog'}
                      author={similarBlog.author}
                      title={similarBlog.title}
                      creationDate={similarBlog.creationDate}
                      buttonAction={() => router.push(`/blog/${formatTitleForUri(similarBlog.title)}`)}
                      buttonText="Pročitaj više"
                    />
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default BlogDetailPage;
