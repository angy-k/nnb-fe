'use client'

import { Suspense } from 'react'
import ProfileEdit from '@/components/Profile/edit'

const ProfileEditPage = () => {
  return (
    <div className="w-full">
      <Suspense>
        <ProfileEdit />
      </Suspense>
    </div>
  )
}

export default ProfileEditPage
