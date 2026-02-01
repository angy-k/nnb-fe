import { get, post } from '@/lib/fetchAPI'

const clearXSRFToken = () => {
  document.cookie = 
  'XSRF-TOKEN=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
}

const getUser = () => {
  return get('/api/v1/profile/self', { cache: 'no-cache' }).then(async res => {
    const contentType = res.headers.get('content-type') || ''

    // If the request got redirected (e.g. to /dashboard) or returned HTML,
    // treat it as an auth failure so the UI doesn't consider it a valid user payload.
    if (res.redirected || !contentType.includes('application/json')) {
      const err = new Error('Unauthenticated.')
      err.status = res.status || 401
      throw err
    }

    if (res.ok) {
      return res.json()
    }

    if (res.status === 401 || res.status === 403) {
      const err = new Error('Unauthenticated.')
      err.status = res.status
      throw err
    }

    if (res.status !== 409) {
      const err = new Error('Profile deleted.')
      err.status = res.status
      throw err
    }
  })
}

const login = async ({ values }) => {
  return post('/login', values, { withCSRF: true })
}

const register = async values => {
  return post('/register', values, { withCSRF: true })
}

const registerMultipart = async formData => {
  return post('/register', formData, { withCSRF: true, type: 'multipart' })
}

const forgotPassword = async values => {
  return post('/forgot-password', values, { withCSRF: true })
}

const logout = async () => {
  await post('/logout', {}, { withCSRF: true })
  clearXSRFToken()
}

const resendEmailVerification = () => {
  return post('/email/verification-notification', {}, { withCSRF: true })
}

const resetPassword = ({ ...props }) => {
  return post(
    '/reset-password', 
    {
      token: props.token,
      email: props.email,
      password: props.values.password,
    }, 
    { withCSRF: true },
  )
}

const verifyEmail = (id, hash) => {
  return get(`/verify-email/${id}/${hash}`)
}

const sendVerificationCode = values => {
  return post(`/api/v1/profile/phone/send-verification-code`, values, {
    withCSRF: true
  })
}

const checkVerificationCode = code => {
  return post(`/api/v1/profile/phone/verify-code`, code, {
    withCSRF: true
  })
}

export default {
  getUser,
  login,
  register,
  registerMultipart,
  logout,
  forgotPassword,
  resendEmailVerification,
  resetPassword,
  verifyEmail,
  sendVerificationCode,
  checkVerificationCode,
}