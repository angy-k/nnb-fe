import { get } from '@/lib/fetchAPI';

const getEvents = async () => {
  return get(`/api/v1/events`, { config: { credentials: 'omit' }, cache: 'no-store' })
}

const getActiveEvents = async () => {
  return get(`/api/v1/events?active=1`, { config: { credentials: 'omit' }, cache: 'no-store' })
}

export default {
  getEvents,
  getActiveEvents
}