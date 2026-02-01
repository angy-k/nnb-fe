import { get } from '@/lib/fetchAPI'

const getActivityGroups = async () => {
  const res = await get('/api/v1/activity-group/activity-groups', { cache: 'no-cache' })
  if (!res.ok) {
    throw res
  }

  const data = await res.json()
  return data?.data ?? data
}

export default {
  getActivityGroups,
}
