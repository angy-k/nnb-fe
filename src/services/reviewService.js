import { get } from '@/lib/fetchAPI';

const getReviews = async () => {
  return get(`/api/v1/reviews`, { config: { credentials: 'omit' }, cache: 'no-store' })
}

export default {
  getReviews,
}
