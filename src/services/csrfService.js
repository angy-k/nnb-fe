import { get } from '@/lib/fetchAPI'

export const csrf = () => get('/sanctum/csrf-cookie', { cache: 'no-cache' })
