import Projects from '@/components/CardsLayout/Projects';

async function getProjects() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/projects`,
      { next: { revalidate: 3600, tags: ['projects'] } }
    )
    if (!res.ok) return []
    const data = await res.json()
    if (!data.success) return []
    return Array.isArray(data.data) ? data.data
      : Array.isArray(data.data?.data) ? data.data.data
      : []
  } catch {
    return []
  }
}

const ProjectsPage = async () => {
  const projects = await getProjects()
  return (
    <div className="mt-60 grid place-items-center w-full">
      <Projects projects={projects} />
    </div>
  )
}

export default ProjectsPage
