import CardComponent from "../CardComponent";
import { Divider } from "@nextui-org/divider";
import Button from "../Button";
import Link from 'next/link';
import { formatTitleForUri } from '@/utils/transform-helper';
import PageHeroSection from '@/components/Hero/pageOwl';

const Projects = ({
  title,
  numberForDisplay,
  projects = mockProjects,
  pagination = false, 
  sectionType = 'project'
}) => {
  function goToSingleProject() {
    console.log('preview single project post')
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
              <Link
                prefetch={false}
                legacyBehavior
                href={`/projekat/${formatTitleForUri(project.title)}`}
              >
                <CardComponent
                  key={`project-card-${index}`}
                  imageSrc={project.coverImage}
                  imageWidth={438}
                  imageHeight={344}
                  imageRadius={"30px"}
                  imageAltText={`Project post - ${project.title}`}
                  sectionType={'project'}
                  author={project.author}
                  title={project.title}
                  creationDate={project.creationDate}
                  buttonAction={() => goToSingleProject()}
                  buttonText="Pročitaj više"
                />
              </Link>
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

const mockProjects= [
    {
        id: 1,
        title: 'Projekat "Market of Entrepreneurship"',
        author: 'Erasmus+',
        creationDate: '10 Maj ‘24 ',
    },
    {
        id: 2,
        title: 'Projekat "Market of Entrepreneurship"',
        author: 'Erasmus+',
        creationDate: '10 Maj ‘24 ',
    },
    {
        id: 3,
        title: 'Projekat "Market of Entrepreneurship"',
        author: 'Erasmus+',
        creationDate: '10 Maj ‘24 ',
    },
    {
        id: 4,
        title: 'Projekat "Market of Entrepreneurship"',
        author: 'Erasmus+',
        creationDate: '10 Maj ‘24 ',
    },
    {
        id: 5,
        title: 'Projekat "Market of Entrepreneurship"',
        author: 'Erasmus+',
        creationDate: '10 Maj ‘24 ',
    },
    {
        id: 6,
        title: 'Projekat "Market of Entrepreneurship"',
        author: 'Erasmus+',
        creationDate: '10 Maj ‘24 ',
    },
    {
        id: 7,
        title: 'Projekat "Market of Entrepreneurship"',
        author: 'Erasmus+',
        creationDate: '10 Maj ‘24 ',
    },
];

export default Projects;
