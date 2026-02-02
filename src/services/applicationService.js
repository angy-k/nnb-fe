import { get, post } from '@/lib/fetchAPI'

const submitApplication = async ({ eventId, electricityOption = 'none', marketingOption = 'none' }) => {
  return post(
    '/api/v1/applications',
    {
      event_id: eventId,
      electricity_option: electricityOption,
      marketing_option: marketingOption,
    },
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
