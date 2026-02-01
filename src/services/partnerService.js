import { get } from '@/lib/fetchAPI';

const getPartners = async () => {
  return get(`/api/v1/partners`, { config: { credentials: 'omit' }, cache: 'no-store' })
}

export default {
  getPartners,
}
