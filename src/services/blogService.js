import { get } from '@/lib/fetchAPI';

const getBlogs = async () => {
  return get(`/api/v1/blogs`)
}

const getBlog = async (blogId) => {
  return get(`/api/v1/blogs/${blogId}`)
}

export default {
  getBlogs,
  getBlog
}
