import useSWR from 'swr';

import authService from "../services/authService";

const clearXSRFToken = () => {
  document.cookie = 
    'XSRF-TOKEN=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
}

export default function useUser() {
  const { data, mutate, error } = useSWR('user', authService.getUser, {
    revalidateOnFocus: false,
    revalidateIfStale: false,
    revalidateOnMount: false,
    revalidateOnReconnect: false,
    refreshInterval: 0,
    onError: () => {
        clearXSRFToken()
    },
    errorRetryInterval: 0,
    errorRetryCount: 0
  })

  const loading = !data && !error;
  const loggedOut = error && error.status === 403;

  return {
    loading,
    loggedOut,
    user: data,
    mutate
  };
}
