'use client'

import { Suspense, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import authService from '@/services/authService'

function OAuthCallbackInner() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const token = searchParams.get('token')
    const redirect = searchParams.get('redirect') || ''
    const setup = searchParams.get('setup') === '1'

    if (token) {
      authService.storeToken(token)
    }

    // Novi/gost korisnik → preusmeri na dopunu profila
    if (setup) {
      router.replace('/profil/izmeni?setup=1')
      return
    }

    const safePath = redirect.startsWith('/') ? redirect : (redirect ? `/${redirect}` : '/profil')
    router.replace(safePath)
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
