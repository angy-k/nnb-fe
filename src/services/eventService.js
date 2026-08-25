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

/** Cenovnik: zone sa opsezima štandova i kotizacijom po broju dana */
const getEventPricing = async (eventId) => {
  return get(`/api/v1/events/${eventId}/pricing`, { config: { credentials: 'omit' }, cache: 'no-store' })
}

/**
 * Zauzetost štandova. Bez `eventDayIds` backend podrazumeva sve dane —
 * tako jednodnevni događaj radi bez ikakve izmene poziva.
 */
const getStandAvailability = async (eventId, eventDayIds = null) => {
  const queryParams = {}
  if (Array.isArray(eventDayIds) && eventDayIds.length > 0) {
    queryParams['event_day_ids'] = eventDayIds
  }

  return get(`/api/v1/events/${eventId}/stands`, {
    ...(Object.keys(queryParams).length ? { queryParams } : {}),
    cache: 'no-cache',
  })
}

const lockStand = async ({ eventId, standNumber, eventDayIds = null }) => {
  const payload = { stand_number: standNumber }

  // Isti štand se zaključava na svim izabranim danima
  if (Array.isArray(eventDayIds) && eventDayIds.length > 0) {
    payload.event_day_ids = eventDayIds
  }

  return post(
    `/api/v1/events/${eventId}/stands/lock`,
    payload,
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
  getEventPricing,
  getStandAvailability,
  lockStand,
  extendStandLock,
  unlockStand,
}