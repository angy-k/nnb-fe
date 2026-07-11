import { get } from '@/lib/fetchAPI'

// Korak 1: uspostavi sesiju (postavlja laravel_session cookie na admin.nocnibazar.rs)
// Korak 2: pročitaj CSRF token iz JSON response-a umesto document.cookie
// Razlog: FE na nnb-fe.vercel.app ne može čitati kolačiće sa admin.nocnibazar.rs
export const csrf = async () => {
  await get('/sanctum/csrf-cookie', { cache: 'no-cache' })
  const res = await get('/sanctum/csrf-token', { cache: 'no-cache' })
  if (res.ok) {
    const { token } = await res.json()
    return token
  }
  return null
}
