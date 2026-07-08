import { get } from '@/lib/fetchAPI';

const getPackages = async () => {
  return get(`/api/v1/packages`, { config: { credentials: 'omit' }, cache: 'no-store' });
}

export default {
  getPackages,
}
