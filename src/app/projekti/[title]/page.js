'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { formatTitleForUri } from '@/utils/transform-helper';
import projectService from '@/services/projectService';
import Image from 'next/image';
import HomeIcon from '@/icons/home-icon.svg';

const ProjectDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const { title } = params;

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProjectData();
  }, [title]);

  const fetchProjectData = async () => {
    try {
      setLoading(true);
      setError(null);

      const titleParam = Array.isArray(title) ? title[0] : title;
      const slug = decodeURIComponent((titleParam ?? '').toString());
      if (!slug) throw new Error('Missing project title');

      const listResponse = await projectService.getProjects();
      if (!listResponse.ok) throw new Error('Failed to fetch projects');

      const listJson = await listResponse.json();
      if (!listJson.success || !Array.isArray(listJson.data)) {
        throw new Error(listJson.message || 'Failed to fetch projects');
      }

      const matched = listJson.data.find((p) => {
        const candidateSlug = formatTitleForUri((p?.title ?? '').toString());
        return candidateSlug === slug;
      });

      if (!matched?.id) throw new Error('Project not found');

      const response = await projectService.getProject(matched.id);
      if (!response.ok) throw new Error('Failed to fetch project');

      const data = await response.json();
      if (!data.success) throw new Error(data.message || 'Failed to fetch project');

      setProject(data.data.project);
    } catch (err) {
      console.error('Error fetching project:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const heroTitle = loading
    ? 'Projekat'
    : project
      ? `Projekat "${project.title}"`
      : 'Projekat';

  return (
    <>
      {/* Full-width hero — no owl, project title */}
      <div
        className="w-full bg-[#261A54] page-hero-section"
        style={{ minHeight: '372px', display: 'flex', alignItems: 'flex-end' }}
      >
        <div
          className="2xl:max-w-screen-2xl 2xl:mx-auto mx-auto w-full"
          style={{ maxWidth: '1440px', padding: '80px 60px 60px' }}
        >
          <div className="page-hero-section-title" style={{ paddingTop: '25px' }}>
            {heroTitle}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="w-full pt-24 grid place-items-center pb-48 bg-[#F0F0F0]">
        {loading && (
          <div className="text-center text-[#261A54]">Učitavanje projekta...</div>
        )}
        {error && (
          <div className="text-[#EC4923] text-center mb-4">
            Greška: {error}
          </div>
        )}
        {project && (
          <div className="max-w-7xl mx-auto px-6 w-full">
            <div className="bg-white rounded-lg mb-6">

              {/* Breadcrumb + date */}
              <div className="flex flex-col md:flex-row md:justify-between md:items-center items-start gap-4 mb-8 p-8 pb-0">
                <div className="text-sm text-[#1B1B1B]">
                  {project.creationDate && `Objavljeno: ${project.creationDate}`}
                </div>
                <nav className="text-sm text-[#1B1B1B] flex flex-wrap items-center">
                  <button
                    onClick={() => router.push('/')}
                    className="hover:opacity-70 cursor-pointer"
                  >
                    <Image src={HomeIcon} alt="Home" width={16} height={16} />
                  </button>
                  <span className="mx-2">/</span>
                  <button
                    onClick={() => router.push('/projekti')}
                    className="hover:opacity-70 cursor-pointer"
                  >
                    svi projekti
                  </button>
                  <span className="mx-2">/</span>
                  <span className="text-[#1B1B1B]">
                    {project.title.length > 30
                      ? project.title.substring(0, 30) + '...'
                      : project.title}
                  </span>
                </nav>
              </div>

              {/* Title + author */}
              <div className="flex flex-col md:flex-row md:justify-between md:items-end items-start mb-8 px-8 gap-4 md:gap-18">
                <h1
                  className="single-blog-title flex-1 min-w-0"
                  style={{ wordWrap: 'break-word', whiteSpace: 'normal' }}
                >
                  {project.title}
                </h1>
                {project.author && (
                  <div className="text-sm text-[#1B1B1B] whitespace-normal md:whitespace-nowrap break-words max-w-full self-start md:self-end">
                    Autor: {project.author}
                  </div>
                )}
              </div>

              <div className="px-8 pb-10">
                {/* Cover image */}
                {(project.coverImage || project.heroImage) && (
                  <img
                    src={project.coverImage || project.heroImage}
                    alt={project.title}
                    className="w-full h-80 object-cover rounded-lg mb-8"
                  />
                )}

                {/* HTML content */}
                <div className="prose prose-lg max-w-none">
                  <div
                    className="text-gray-700 leading-relaxed text-lg single-blog-content"
                    dangerouslySetInnerHTML={{ __html: project.content || '' }}
                  />
                </div>

                {/* Back link */}
                <div className="mt-10">
                  <button
                    onClick={() => router.push('/projekti')}
                    className="text-[#261A54] hover:opacity-70 cursor-pointer font-medium"
                  >
                    ← Nazad na projekte
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ProjectDetailPage;
