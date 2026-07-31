import ProfileComponent from  '@/components/Profile'

export const metadata = {
  robots: { index: false, follow: false },
}

const Profile = () => {
  return (
    <div className="w-full">
      <ProfileComponent />
    </div>
  )
}

export default Profile;
