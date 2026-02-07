import { get, post } from '@/lib/fetchAPI';

const getEvents = async () => {
  return get(`/api/v1/events`, { config: { credentials: 'omit' }, cache: 'no-store' })
}

const getActiveEvents = async () => {
  return get(`/api/v1/events?active=1`, { config: { credentials: 'omit' }, cache: 'no-store' })
}

const getEventMapConfig = async (eventId) => {
  return get(`/api/v1/events/${eventId}/map-config`, { config: { credentials: 'omit' }, cache: 'no-store' })
}

const getStandAvailability = async (eventId) => {
  return get(`/api/v1/events/${eventId}/stands`, { cache: 'no-cache' })
}

const lockStand = async ({ eventId, standNumber }) => {
  return post(
    `/api/v1/events/${eventId}/stands/lock`,
    { stand_number: standNumber },
    { withCSRF: true },
  )
}

const extendStandLock = async ({ eventId, lockId }) => {
  return post(
    `/api/v1/events/${eventId}/stands/extend`,
    { lock_id: lockId },
    { withCSRF: true },
  )
}

const unlockStand = async ({ eventId }) => {
  return post(
    `/api/v1/events/${eventId}/stands/unlock`,
    {},
    { withCSRF: true },
  )
}

export default {
  getEvents,
  getActiveEvents,
  getEventMapConfig,
  getStandAvailability,
  lockStand,
  extendStandLock,
  unlockStand,
}