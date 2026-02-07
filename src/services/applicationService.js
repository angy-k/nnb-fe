import { get, post } from '@/lib/fetchAPI'

const submitApplication = async ({
  eventId,
  electricityOption = 'none',
  marketingOption = 'none',
  standNumber = null,
  lockId = null,
}) => {
  const payload = {
    event_id: eventId,
    electricity_option: electricityOption,
    marketing_option: marketingOption,
  }

  if (standNumber != null) {
    payload.stand_number = standNumber
  }

  if (lockId != null) {
    payload.lock_id = lockId
  }

  return post(
    '/api/v1/applications',
    payload,
    { withCSRF: true },
  )
}

const getMyApplications = async ({ active = true, past = false } = {}) => {
  return get('/api/v1/applications', {
    queryParams: { active: active ? 1 : 0, past: past ? 1 : 0 },
    cache: 'no-cache',
  })
}

export default {
  submitApplication,
  getMyApplications,
}
