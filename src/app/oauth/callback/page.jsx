'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import authService from '@/services/authService'

/**
 * OAuth callback stranica — prihvata Sanctum bearer token iz URL parametra
 * koji šalje Laravel SocialController nakon uspešnog OAuth logina.
 *
 * URL format: /oauth/callback?token=<sanctum_token>&redirect=<path>
 */
export default function OAuthCallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const token = searchParams.get('token')
    const redirect = searchParams.get('redirect') || '/profil'

    if (token) {
      authService.storeToken(token)
    }

    // Redirect na željenu stranicu (ili /profil kao default)
    const safePath = redirect.startsWith('/') ? redirect : `/${redirect}`
    router.replace(safePath)
  }, [router, searchParams])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-[#261A54]">Prijava u toku...</p>
    </div>
  )
}
