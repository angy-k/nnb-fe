import { get } from '@/lib/fetchAPI';

const getBlogs = async () => {
  return get(`/api/v1/blogs`, { config: { credentials: 'omit' }, cache: 'no-store' })
}

const getBlog = async (blogId) => {
  return get(`/api/v1/blogs/${blogId}`, { config: { credentials: 'omit' }, cache: 'no-store' })
}

export default {
  getBlogs,
  getBlog
}
