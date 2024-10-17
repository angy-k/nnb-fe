import { get, post } from '@/lib/fetchAPI'

const clearXSRFToken = () => {
  document.cookie = 
  'XSRF-TOKEN=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
}

const getUser = () => {
  return get('/api/v1/profile/self', { cache: 'no-cache' }).then(res => {
    if (res.ok) {
      return res.json()
    }
    if (res.status !== 409) {
      throw new Error('Profile deleted.')
    }
  })
}

const login = async ({ values }) => {
  return post('/login', values, { withCSRF: true })
}

const register = async values => {
  return post('/register', values, { withCSRF: true })
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
  logout,
  forgotPassword,
  resendEmailVerification,
  resetPassword,
  verifyEmail,
  sendVerificationCode,
  checkVerificationCode,
}