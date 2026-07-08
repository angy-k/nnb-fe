import SectionImage from '@/components/SectionImage';

const statusLabel = {
  waiting:  'Rezervacija na čekanju',
  approved: 'Uspešno rezervisano!',
  rejected: 'Rezervacija odbijena',
}

// Prethodne rezervacije koriste istu sivu boju za sve statuse
const STATUS_BG = '#C5C4C2'

// ── Pagination ─────────────────────────────────────────────────────────────────
const Pagination = ({ page, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null

  const getPages = () => {
    const pages = []
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i)
      return pages
    }
    // Always show: 1, 2, 3, ..., last
    const around = [page - 1, page, page + 1].filter(p => p > 3 && p < totalPages - 1)
    const core = Array.from(new Set([1, 2, 3, ...around, totalPages - 1, totalPages])).sort((a, b) => a - b)
    const result = []
    let prev = null
    for (const p of core) {
      if (prev && p - prev > 1) result.push('...')
      result.push(p)
      prev = p
    }
    return result
  }

  const btnBase = {
    minWidth: '36px', height: '36px', borderRadius: '50%', border: 'none',
    fontSize: '15px', fontWeight: '500', cursor: 'pointer', transition: 'background 0.15s',
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', paddingTop: '48px' }}>
      {/* Prev */}
      <button
        type="button"
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        style={{ ...btnBase, background: 'transparent', color: page === 1 ? '#ccc' : '#261A54' }}
        aria-label="Prethodna"
      >
        ‹
      </button>

      {getPages().map((p, i) =>
        p === '...'
          ? <span key={`ellipsis-${i}`} style={{ padding: '0 4px', color: '#261A54' }}>...</span>
          : (
            <button
              key={p}
              type="button"
              onClick={() => onPageChange(p)}
              style={{
                ...btnBase,
                background: p === page ? '#261A54' : 'transparent',
                color: p === page ? '#ffffff' : '#261A54',
              }}
            >
              {p}
            </button>
          )
      )}

      {/* Next */}
      <button
        type="button"
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        style={{ ...btnBase, background: 'transparent', color: page === totalPages ? '#ccc' : '#261A54' }}
        aria-label="Sledeća"
      >
        ›
      </button>
    </div>
  )
}

// ── MyPreviousReservations ─────────────────────────────────────────────────────
const MyPreviousReservations = ({ events = [], page = 1, totalPages = 1, onPageChange }) => {
  return (
    <div className="w-full pt-6 pb-4">
      <div className="flex flex-col gap-4">
        {events.map((event, index) => (
          <div
            key={`prev-res-${index}`}
            className="flex flex-row bg-white rounded-[16px] overflow-hidden shadow-sm"
            style={{ minHeight: '120px' }}
          >
            {/* Image left */}
            <div className="flex-shrink-0 w-[200px] md:w-[240px]">
              <SectionImage
                imageSrc={event.coverImage || '/card-component-default-image.png'}
                isGrey={true}
                width={240}
                height={160}
                radius="0"
                altText="cover"
              />
            </div>

            {/* Content center */}
            <div className="flex flex-col justify-center flex-1 px-6 py-4 gap-1">
              {event.title && (
                <span className="text-[16px] font-semibold text-[#C5C4C2] leading-snug">
                  {event.title}
                </span>
              )}
              {event.date && (
                <span className="text-[13px] text-[#C5C4C2]">{event.date}</span>
              )}
              {event.applicationDate && (
                <span className="text-[13px] text-[#261A54]/40 mt-1">
                  {`Rezervacija poslata ${event.applicationDate}`}
                </span>
              )}
            </div>

            {/* Status button right */}
            <div className="flex-shrink-0 flex items-center pr-6">
              <div
                style={{ background: STATUS_BG, cursor: 'default' }}
                className="h-[44px] px-5 rounded-full text-white font-semibold text-[13px] whitespace-nowrap flex items-center justify-center"
              >
                {statusLabel[event.applicationStatus] || statusLabel.approved}
              </div>
            </div>
          </div>
        ))}
      </div>

      <Pagination page={page} totalPages={totalPages} onPageChange={onPageChange} />
    </div>
  )
}

export default MyPreviousReservations;
