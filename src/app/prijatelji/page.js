import Partners from '@/components/CardsLayout/Partners';

async function getPartners() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/partners`,
      { next: { revalidate: 3600, tags: ['partners'] } }
    )
    if (!res.ok) return []
    const data = await res.json()
    if (!data.success) return []
    return Array.isArray(data.data) ? data.data
      : Array.isArray(data.data?.data) ? data.data.data
      : []
  } catch {
    return []
  }
}

const FriendsPage = async () => {
  const partners = await getPartners()
  return (
    <div className="mt-60 grid place-items-center w-full">
      <Partners partners={partners} />
    </div>
  )
}

export default FriendsPage
