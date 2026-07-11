import useSWR from 'swr';

import authService from "../services/authService";

export default function useUser() {
  const { data, mutate, error } = useSWR('user', authService.getUser, {
    revalidateOnFocus: false,
    revalidateIfStale: false,
    revalidateOnMount: true,
    revalidateOnReconnect: false,
    refreshInterval: 0,
    onError: (err) => {
      // Token istekao ili poništen — obriši iz localStorage
      if (err?.status === 401 || err?.status === 403) {
        authService.clearToken()
      }
    },
    errorRetryInterval: 0,
    errorRetryCount: 0
  })

  const loading = !data && !error;
  const loggedOut = error && (error.status === 401 || error.status === 403);

  return {
    loading,
    loggedOut,
    user: data,
    mutate
  };
}
