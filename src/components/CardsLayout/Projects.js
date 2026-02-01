'use client'

import CardComponent from "../CardComponent";
import { Divider } from "@nextui-org/divider";
import Button from "../Button";
import { formatTitleForUri } from '@/utils/transform-helper';
import PageHeroSection from '@/components/Hero/pageOwl';
import { useEffect, useState } from 'react';
import projectService from '@/services/projectService';
import { useRouter } from 'next/navigation';

const Projects = ({
  title,
  numberForDisplay,
  projects: propProjects,
  pagination = false, 
  sectionType = 'project'
}) => {
  const router = useRouter()
  const [projects, setProjects] = useState(propProjects || [])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!propProjects) {
      fetchProjects()
    }
  }, [propProjects])

  const fetchProjects = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await projectService.getProjects()
      if (!response.ok) {
        throw new Error('Failed to fetch projects')
      }

      const data = await response.json()
      if (!data.success) {
        throw new Error(data.message || 'Failed to fetch projects')
      }

      setProjects(Array.isArray(data.data) ? data.data : [])
    } catch (err) {
      console.error('Error fetching projects:', err)
      setError(err.message)
      setProjects([])
    } finally {
      setLoading(false)
    }
  }

  function previewAllProjects() {
    console.log('preview all project posts')
  }

  let limitedProjects = numberForDisplay ? projects.slice(0,numberForDisplay) : projects
  return (
    <>
      <PageHeroSection 
        title={`Projekti`}
      />
      <div className="w-full blogs-container pt-24 grid place-items-center pb-48 z-1 bg-[#F0F0F0]">
        {loading && (
          <div className="text-center">Loading projects...</div>
        )}
        {error && (
          <div className="text-red-500 text-center mb-4">
            Error loading projects: {error}
          </div>
        )}
        {title && <span className="blog-title">{title}</span>}
        {title && <Button
            key={`section-component-title-button-${sectionType}`}
            type={'outlined-dark'}
            name={'Pogledaj sve projekte'}
            onClick={() => previewAllProjects()}
        />}
        {title && <Divider className="section-divider"/>}
        <div className="blog-container grid  sm:grid-template-1 md:grid-template-2">
          {limitedProjects.map((project, index) => (
            <div className="blog-card" key={`project-card-${index}`}>
              <div
                role="link"
                tabIndex={0}
                onClick={() => {
                  const href = `/projekti/${formatTitleForUri(project.title)}`
                  router.push(href)
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    const href = `/projekti/${formatTitleForUri(project.title)}`
                    router.push(href)
                  }
                }}
                className="cursor-pointer"
              >
                <CardComponent
                  key={`project-card-${index}`}
                  {...(project.coverImage && { imageSrc: project.coverImage })}
                  imageWidth={438}
                  imageHeight={344}
                  imageRadius={"30px"}
                  imageAltText={`Project post - ${project.title}`}
                  sectionType={'project'}
                  author={project.author}
                  title={project.title}
                  creationDate={project.creationDate}
                  buttonAction={() => {
                    const href = `/projekti/${formatTitleForUri(project.title)}`
                    router.push(href)
                  }}
                  buttonText="Pročitaj više"
                />
              </div>
            </div>
          ))}
        </div>
        {/* pagination */}
        {pagination && <Divider className="section-divider w-1440" style={{marginTop: '35px'}}/>}
        {/* {pagination && <PaginationComponent />} */}
      </div>
    </>
  )
}

export default Projects;
