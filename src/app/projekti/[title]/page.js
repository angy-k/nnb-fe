'use client';

import PageHeroSection from '@/components/Hero/pageOwl';
import { formatTitleForUri } from '@/utils/transform-helper';
import projectService from '@/services/projectService';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

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
      if (!slug) {
        throw new Error('Missing project title');
      }

      const listResponse = await projectService.getProjects();
      if (!listResponse.ok) {
        throw new Error('Failed to fetch projects');
      }

      const listJson = await listResponse.json();
      if (!listJson.success || !Array.isArray(listJson.data)) {
        throw new Error(listJson.message || 'Failed to fetch projects');
      }

      const matched = listJson.data.find((p) => {
        const candidateSlug = formatTitleForUri((p?.title ?? '').toString());
        return candidateSlug === slug;
      });

      if (!matched?.id) {
        throw new Error('Project not found');
      }

      const response = await projectService.getProject(matched.id);
      if (!response.ok) {
        throw new Error('Failed to fetch project');
      }

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message || 'Failed to fetch project');
      }

      setProject(data.data.project);
    } catch (err) {
      console.error('Error fetching project:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <PageHeroSection title={'Projekti'} />
        <div className="w-full pt-24 grid place-items-center pb-48 z-1 bg-[#F0F0F0]">
          <div className="text-center">Loading project...</div>
        </div>
      </>
    );
  }

  return (
    <>
      <PageHeroSection title={'Projekti'} />
      <div className="w-full pt-24 grid place-items-center pb-48 z-1 bg-[#F0F0F0]">
        {error && (
          <div className="text-red-500 text-center mb-4">
            Error loading project: {error}
          </div>
        )}
        {project && (
          <div className="max-w-5xl mx-auto px-6 w-full">
            <div className="bg-white rounded-lg p-8">
              <div className="flex flex-col md:flex-row md:justify-between items-start gap-2 md:gap-8 mb-6">
                <h1 className="single-blog-title flex-1 min-w-0" style={{ wordWrap: 'break-word', whiteSpace: 'normal' }}>
                  {project.title}
                </h1>
                <div className="text-sm text-[#1B1B1B] md:whitespace-nowrap self-start" style={{ alignSelf: 'flex-end' }}>
                  Autor: {project.author}
                </div>
              </div>

              {project.creationDate && (
                <div className="text-sm text-[#1B1B1B] mb-8">
                  Objavljeno: {project.creationDate}
                </div>
              )}

              {project.content && (
                <div className="prose prose-lg max-w-none">
                  <div className="text-gray-700 leading-relaxed text-lg single-blog-content">
                    {project.content}
                  </div>
                </div>
              )}

              <div className="mt-10">
                <button
                  onClick={() => router.push('/projekti')}
                  className="hover:opacity-70 cursor-pointer"
                >
                  Nazad
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ProjectDetailPage;
