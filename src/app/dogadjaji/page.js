import Events from '@/components/CardsLayout/Events';

async function getEvents() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/events`,
      { next: { revalidate: 3600, tags: ['events'] } }
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

const EventsPage = async () => {
  const events = await getEvents()
  // Bez `mt-60`: hero sada sam računa mesto za zaglavlje (vidi
  // `--nnb-zaglavlje`), pa bi ovaj odmak isti prostor zauzeo drugi put.
  return (
    <div className="grid place-items-center w-full">
      <Events events={events} numberForDisplay={12} pagination={true} />
    </div>
  )
}

export default EventsPage
