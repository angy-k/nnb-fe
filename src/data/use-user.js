import useSWR from 'swr';

import authService from "../services/authService";

export default function useUser() {
  const { data, mutate, error } = useSWR('user', authService.getUser, {
    revalidateOnFocus: false,
    revalidateIfStale: false,
    revalidateOnMount: true,
    revalidateOnReconnect: false,
    refreshInterval: 0,
    onError: () => {
      // Ne brišemo token ovde — to radi samo eksplicitni logout (authService.logout()).
      // Brisanje tokena na svaki 401 izaziva neočekivano izlogovanje zbog
      // tranzijentnih grešaka (opaque redirect, timing, itd.).
      // loggedOut = true će biti true kada error.status === 401/403, što je dovoljno
      // za UI — korisnik vidi "morate biti ulogovani" i može da se ponovo prijavi.
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
