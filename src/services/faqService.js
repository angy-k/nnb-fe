import { get } from '@/lib/fetchAPI';

const getFaqs = async () => {
  return get(`/api/v1/faqs`, { config: { credentials: 'omit' }, cache: 'no-store' })
}

export default {
  getFaqs,
}
