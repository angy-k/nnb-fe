'use client'

import { Suspense, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { mutate } from 'swr'
import authService from '@/services/authService'

function OAuthCallbackInner() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const token = searchParams.get('token')
    const redirect = searchParams.get('redirect') || ''
    const setup = searchParams.get('setup') === '1'

    const handleCallback = async () => {
      if (token) {
        authService.storeToken(token)
        // Osvežavamo SWR cache da bi header odmah prikazao ulogovanog korisnika.
        // try/catch sprečava da greška iz getUser() blokira redirect ispod.
        try {
          await mutate('user')
        } catch {
          // Greška se ignoriše — redirect se svakako dešava.
          // /profil/izmeni će sam osvežiti podatke via revalidateOnMount.
        }
      }

      // Novi/gost korisnik → preusmeri na dopunu profila
      if (setup) {
        router.replace('/profil/izmeni?setup=1')
        return
      }

      const safePath = redirect.startsWith('/') ? redirect : (redirect ? `/${redirect}` : '/profil')
      router.replace(safePath)
    }

    handleCallback()
  }, [router, searchParams])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-[#261A54]">Prijava u toku...</p>
    </div>
  )
}

export default function OAuthCallbackPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-[#261A54]">Prijava u toku...</p>
      </div>
    }>
      <OAuthCallbackInner />
    </Suspense>
  )
}
