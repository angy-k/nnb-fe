import { put, post } from '@/lib/fetchAPI'

const updateProfile = (data) =>
  put('/api/v1/profile/self', data, { withCSRF: true })

const uploadAvatar = (file) => {
  const formData = new FormData()
  formData.append('avatar', file)
  return post('/api/v1/profile/avatar', formData, { withCSRF: true, type: 'multipart' })
}

export default {
  updateProfile,
  uploadAvatar,
}
