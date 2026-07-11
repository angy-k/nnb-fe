import { get, post } from '@/lib/fetchAPI'

// ── Token storage ─────────────────────────────────────────────────────────────
// Sanctum API token čuvamo u localStorage (cross-domain SPA — session kolačići
// nisu dostupni između nnb-fe.vercel.app i admin.nocnibazar.rs).

const storeToken = (token) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('auth_token', token)
  }
}

const clearToken = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('auth_token')
  }
}

// ── Auth API ──────────────────────────────────────────────────────────────────

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
  // withCSRF nije potreban — bearer token auth, CSRF rute su excluded
  return post('/login', values)
}

const register = async values => {
  return post('/register', values)
}

const registerMultipart = async formData => {
  return post('/register', formData, { type: 'multipart' })
}

const forgotPassword = async values => {
  return post('/forgot-password', values, { withCSRF: true })
}

const logout = async () => {
  // Pošalji logout na server dok je token još u localStorage (header se čita u fetchAPI)
  try {
    await post('/logout', {})
  } catch {
    // Ignorisati greške — token brisati u svakom slučaju
  }
  clearToken()
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

export default {
  storeToken,
  clearToken,
  getUser,
  login,
  register,
  registerMultipart,
  logout,
  forgotPassword,
  resendEmailVerification,
  resetPassword,
  verifyEmail,
}
