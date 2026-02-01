import { get } from '@/lib/fetchAPI';

const getProjects = async () => {
  return get(`/api/v1/projects`, { config: { credentials: 'omit' }, cache: 'no-store' })
}

const getProject = async (projectId) => {
  return get(`/api/v1/projects/${projectId}`, { config: { credentials: 'omit' }, cache: 'no-store' })
}

export default {
  getProjects,
  getProject
}
