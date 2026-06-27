import { get, post, del } from '@/lib/fetchAPI'

const getGallery = () =>
  get('/api/v1/gallery/', { cache: 'no-cache' })

const uploadImage = (file) => {
  const formData = new FormData()
  formData.append('image', file)
  return post('/api/v1/gallery/images', formData, { withCSRF: true, type: 'multipart' })
}

const addVideo = (url) =>
  post('/api/v1/gallery/videos', { url }, { withCSRF: true })

const deleteItem = (id) =>
  del(`/api/v1/gallery/${id}`, {}, { withCSRF: true })

export default {
  getGallery,
  uploadImage,
  addVideo,
  deleteItem,
}
