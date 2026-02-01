import { get } from '@/lib/fetchAPI';

const getEvents = async () => {
  return get(`/api/v1/events`, { config: { credentials: 'omit' }, cache: 'no-store' })
}

export default {
  getEvents
}