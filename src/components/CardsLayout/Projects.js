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
  sectionType = 'project',
  showHero = true
}) => {
  const router = useRouter()
  const [projects, setProjects] = useState(propProjects || [])
  const [loading, setLoading] = useState(!propProjects)
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
      if (data.success) {
        const items = Array.isArray(data.data)
          ? data.data
          : Array.isArray(data.data?.data)
            ? data.data.data
            : []
        setProjects(items)
      } else {
        throw new Error(data.message || 'Failed to fetch projects')
      }
    } catch (err) {
      console.error('Error fetching projects:', err)
      setError(err.message)
      setProjects([])
    } finally {
      setLoading(false)
    }
  }

  function goToSingleProject(project) {
    router.push(`/projekti/${formatTitleForUri(project.title)}`)
  }

  function previewAllProjects() {
    console.log('preview all projects')
  }

  let limitedProjects = numberForDisplay ? projects.slice(0, numberForDisplay) : projects

  if (loading) {
    return (
      <>
        {showHero && <PageHeroSection
          title={`Projekti`}
        />}
        <div className="w-full blogs-container pt-24 grid place-items-center pb-48 z-1 bg-[#F0F0F0]">
          <div className="text-center text-[#261A54]">Učitavanje projekata...</div>
        </div>
      </>
    )
  }

  return (
    <>
      {showHero && <PageHeroSection
        title={`Projekti`}
      />}
      <div className="w-full blogs-container pt-24 grid place-items-center pb-48 z-1 bg-[#F0F0F0]">
        {!showHero && (
          <>
            <Divider className="section-divider w-1440" style={{marginBottom: '35px'}}/>
            <div className="flex justify-start">
              <span className="blog-title text-start">Pogledaj još projekata</span>
            </div>
          </>
        )}
        {error && (
          <div className="text-[#EC4923] text-center mb-4">Greška prilikom učitavanja projekata.</div>
        )}
        {!loading && !error && limitedProjects.length === 0 && (
          <p className="text-[#261A54] our-team-title">Projekti uskoro stižu.</p>
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
              <CardComponent
                key={`project-card-${index}`}
                {...(project.coverImage && { imageSrc: project.coverImage })}
                imageWidth={438}
                imageHeight={344}
                imageRadius={"30px"}
                imageAltText={`Projekat - ${project.title}`}
                sectionType={'project'}
                author={project.author}
                title={project.title}
                creationDate={project.creationDate}
                buttonAction={() => goToSingleProject(project)}
                buttonText="Pročitaj više"
              />
            </div>
          ))}
        </div>
        {/* pagination */}
        {(pagination && projects.length > 6) && <Divider className="section-divider w-1440" style={{marginTop: '35px'}}/>}
      </div>
    </>
  )
}

export default Projects;
