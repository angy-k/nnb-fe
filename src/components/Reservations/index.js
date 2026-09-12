'use client';
import { Avatar } from "@nextui-org/avatar";
import MyReservations from '@/components/CardsLayout/MyReservations';
import Link from 'next/link'
import { useEffect, useState } from 'react'
import applicationService from '@/services/applicationService'
import useUser from '@/data/use-user'
import { formatDate } from '@/utils/dateHelpers'
import MERE_DUGMETA from './headerActionStyle'
import ZaglavljeIzlagaca from '@/components/Profile/ZaglavljeIzlagaca'

// ── Sad face SVG ──────────────────────────────────────────────────────────────
// Mereno na izvozu: 85 × 85 na okviru od 1920, dakle 83 ovde.
const SadFaceIcon = () => (
  <svg width="83" height="83" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="40" cy="40" r="37" stroke="#56C4CF" strokeWidth="3" fill="none"/>
    <circle cx="28" cy="33" r="4" fill="#56C4CF"/>
    <circle cx="52" cy="33" r="4" fill="#56C4CF"/>
    <path d="M26 54c3.5-6 18.5-6 28 0" stroke="#56C4CF" strokeWidth="3" strokeLinecap="round" fill="none"/>
  </svg>
)


// Tanak iks iz dizajna, isti kao na ostalim modalima — 36 × 36 na okviru od
// 1920, u gornjem desnom uglu (45 od vrha, 51 od desne ivice).
const IksZatvori = ({ onClick }) => (
  <button
    type="button"
    onClick={onClick}
    style={{
      position: 'absolute', top: '46px', right: '52px',
      background: 'none', border: 'none', cursor: 'pointer',
      color: '#261A54', lineHeight: 0, padding: 0, zIndex: 1, opacity: 0.75,
    }}
    aria-label="Zatvori"
  >
    <svg width="35" height="35" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round">
      <line x1="4" y1="4" x2="20" y2="20" />
      <line x1="20" y1="4" x2="4" y2="20" />
    </svg>
  </button>
)

/**
 * Mere modala za otkazivanje, sa izvoza dizajna (okvir 1920, modal izvezen ceo
 * sa zaobljenim uglovima: 2880 × 1334, dakle 1440 × 667). Kolona sajta je sada
 * 1440, pa se sve prepisuje doslovno — ranije su vrednosti bile umanjene
 * činiocem 0,972.
 *
 * Kao i ostali modali u ovom projektu, širok je koliko i kolona sadržaja, a
 * sam sadržaj stoji u užoj usredišćenoj koloni. Ranije je ovde stajalo 920.
 */
const M = {
  sirina: 1440,
  visina: 667,
  radijus: 30,   // Rectangle 54: 1440 × 667, zaobljenje 30
  // Izvoz: sadržaj 851 × 409 po sredini (129 od vrha i od dna), dve kolone
  // 416 i 415,5 sa razmakom 20, razmak naslov–polja 60.
  kolona: 851,
  stubac: 415.5,
  razmakStubaca: 20,
  vrhNaslova: 129,
  naslov: 36,
  redNaslova: 49,
  naslovDoPolja: 60,
  visinaPolja: 60,
  razmakPolja: 20,
  visinaOpisa: 215,
  opisDoDugmeta: 20,
  dugmeSirina: 280,
  dugmeVisina: 59,
  dugmeRadijus: 30.5,
  dno: 129,
  poljeBoja: '#F1F1F1',
}

// ── Input style helper ────────────────────────────────────────────────────────
const inputStyle = {
  width: '100%', height: `${M.visinaPolja}px`, borderRadius: '100px',
  background: M.poljeBoja, border: 'none', outline: 'none',
  // Natpis u polju kreće 41 od leve ivice.
  padding: '0 41px', fontSize: '18px', lineHeight: '25px', color: '#261A54',
  fontFamily: 'inherit',
}

const MyReservationsComponent = () => {

  const { user, loading: userLoading, loggedOut } = useUser()
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Cancel modal state
  const [cancelModal, setCancelModal] = useState({ open: false, applicationId: null })
  const [cancelStep, setCancelStep] = useState('form') // 'form' | 'success'
  const [cancelForm, setCancelForm] = useState({ brandName: '', firstName: '', lastName: '', email: '', reason: '' })
  const [cancelling, setCancelling] = useState(false)
  const [cancelError, setCancelError] = useState(null)

  const loadEvents = async (signal) => {
    try {
      setLoading(true)
      setError(null)

      const res = await applicationService.getMyApplications({ active: true })
      if (signal?.aborted) return
      const contentType = res.headers.get('content-type') || ''
      const data = contentType.includes('application/json') ? await res.json() : null

      if (!res.ok || !data?.success) {
        if (!signal?.aborted) setError(data?.message || 'Greška prilikom učitavanja rezervacija.')
        if (!signal?.aborted) setEvents([])
        return
      }

      const items = Array.isArray(data.data) ? data.data : []
      const mapped = items
        .map((item) => {
          const ev = item?.event || {}
          const status = (item?.status ?? '').toString()

          const applicationStatus =
            ['withdrawn', 'cancelled'].includes(status)
              ? 'cancelled'
              : ['declined', 'declined_no_payment', 'expired', 'unpaid', 'no_show'].includes(status)
                ? 'rejected'
                : status === 'approved'
                  ? 'approved'
                  : 'waiting'

          return {
            id: item?.id,
            title: (ev?.title || ev?.name || '').toString(),
            date: formatDate(ev?.dateTime || ''),
            applicationDate: (item?.appliedAt || '').toString(),
            coverImage: ev?.coverImage || null,
            applicationStatus,
          }
        })
        .filter((x) => x?.title)

      if (!signal?.aborted) setEvents(mapped)
    } catch (e) {
      if (!signal?.aborted) setError('Greška prilikom učitavanja rezervacija.')
      if (!signal?.aborted) setEvents([])
    } finally {
      if (!signal?.aborted) setLoading(false)
    }
  }

  useEffect(() => {
    if (loggedOut) return
    const controller = new AbortController()
    loadEvents(controller.signal)
    return () => controller.abort()
  }, [loggedOut])

  const handleCancelClick = (event) => {
    setCancelError(null)
    setCancelStep('form')
    setCancelForm({
      brandName: user?.brand_name || user?.company_name || '',
      firstName: user?.first_name || '',
      lastName: user?.last_name || '',
      email: user?.email || '',
      reason: '',
    })
    setCancelModal({ open: true, applicationId: event.id })
  }

  const handleCancelSubmit = async () => {
    if (!cancelModal.applicationId) return
    setCancelling(true)
    setCancelError(null)
    try {
      const res = await applicationService.cancelApplication(cancelModal.applicationId, {
        brand_name: cancelForm.brandName,
        first_name: cancelForm.firstName,
        last_name: cancelForm.lastName,
        email: cancelForm.email,
        reason: cancelForm.reason,
      })
      const contentType = res.headers.get('content-type') || ''
      const data = contentType.includes('application/json') ? await res.json() : null
      if (!res.ok || !data?.success) {
        setCancelError(data?.message || 'Greška prilikom otkazivanja rezervacije.')
        return
      }
      setCancelStep('success')
      await loadEvents()
    } catch (e) {
      setCancelError('Greška prilikom otkazivanja rezervacije.')
    } finally {
      setCancelling(false)
    }
  }

  const handleCancelDismiss = () => {
    if (cancelling) return
    setCancelModal({ open: false, applicationId: null })
    setCancelError(null)
    setCancelStep('form')
  }

  if (userLoading) {
    return <div className="w-full min-h-screen bg-[#261A54]" />
  }

  if (loggedOut) {
    return (
      <>
        <div className="w-full bg-[#261A54] pt-60 pb-16" />
        <div className="grid place-items-center w-full pb-48 bg-[#f0f0f0]">
          <div className="mt-24 flex flex-col items-center gap-6">
            <p className="text-[#261A54]">Morate biti ulogovani da biste videli rezervacije.</p>
            <button
              type="button"
              className="px-6 py-3 rounded-full font-semibold text-white"
              style={{ backgroundColor: '#56C4CF' }}
              onClick={() => window.dispatchEvent(new Event('nnb:open-auth-modal'))}
            >
              Prijavite se
            </button>
          </div>
        </div>
      </>
    )
  }

  const avatarSrc = user?.profile_photo_url || null

  return (
    <>
      {/* Dark header */}
      <ZaglavljeIzlagaca
        avatarSrc={avatarSrc}
        avatarIme={user?.name || 'U'}
        naslov="Moje rezervacije"
      >
        <Link href="/profil">
          <span style={{ border: '1px solid #ffffff', borderRadius: '30px', whiteSpace: 'nowrap', ...MERE_DUGMETA }}>
            Vrati se na profil
          </span>
        </Link>
        <Link href="/prethodne-rezervacije">
          <span style={{ border: '1px solid #ffffff', borderRadius: '30px', whiteSpace: 'nowrap', ...MERE_DUGMETA }}>
            Prethodne rezervacije
          </span>
        </Link>
      </ZaglavljeIzlagaca>

      {/* Sivi sadržaj */}
      {/* U dizajnu napomena kreće 29px ispod tamne trake, ne 70. */}
      <div className="w-full bg-[#f5f5f5] profile-page-content" style={{ paddingTop: '29px', paddingBottom: '96px' }}>
        {/* Odmak sa strane treba na uskim ekranima; da bi kartice ipak počinjale
            na levoj ivici kolone (x 240) i završavale na desnoj (1680), najveća
            širina je za dvostruki odmak veća — isto kao u zaglavlju. Mera je
            zajednička celom sajtu, vidi `--nnb-odmak`. */}
        <div className="mx-auto nnb-gutter" style={{ maxWidth: 'calc(var(--nnb-kolona) + 2 * var(--nnb-odmak))' }}>
          {/* Napomena je uvučena da ne naleti na krug sa logotipom, koji viri
              ispod trake. U dizajnu počinje tačno ispod naslova iznad, pa je
              uvlaka širina avatara plus razmak do naslova (150 + 24). */}
          {/* Napomena je u izvozu na x 509, u istoj koloni kao i naslov iznad —
              dakle 269 od leve ivice kolone sadržaja. */}
          <span className="font-normal text-[18px] text-[#261A54] block pl-[269px] sm:pl-0">
            *Rezervaciju je moguće otkazati kontaktiranjem Noćnog Bazara.
          </span>
          {loading && (
            <div className="pt-6 text-[#261A54]">Učitavanje...</div>
          )}
          {!loading && error && (
            <div className="pt-6 text-[#EC4923]">{error}</div>
          )}
          {!loading && !error && events.length === 0 && (
            <div className="pt-6 text-[#261A54]">Nemate aktivnih rezervacija.</div>
          )}
          {!loading && !error && events.length > 0 && <MyReservations events={events} onCancelClick={handleCancelClick} />}
        </div>
      </div>

      {/* Cancel modal */}
      {cancelModal.open && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(38,26,84,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}
          onClick={handleCancelDismiss}
        >
          <div
            style={{ background: '#ffffff', borderRadius: `${M.radijus}px`, width: '100%', maxWidth: `${M.sirina}px`, minHeight: `${M.visina}px`, position: 'relative', boxShadow: '0 8px 40px rgba(38,26,84,0.18)', overflow: 'hidden' }}
            onClick={(e) => e.stopPropagation()}
          >
            <IksZatvori onClick={handleCancelDismiss} />

            {cancelStep === 'form' ? (
              /* ── STEP 1: Form ─────────────────────────────────────────── */
              <div className="cancel-modal-inner" style={{ padding: `${M.vrhNaslova}px 24px ${M.dno}px` }}>
                {/* Title */}
                <h2 style={{ fontSize: `${M.naslov}px`, lineHeight: `${M.redNaslova}px`, fontWeight: '700', color: '#1B1B1B', textAlign: 'center', marginBottom: `${M.naslovDoPolja}px` }}>
                  Otkazivanje rezervacije
                </h2>

                {/* Sadržaj stoji u užoj usredišćenoj koloni, kao i u ostalim
                    modalima ovog dizajna. */}
                <div className="cancel-modal-grid" style={{ display: 'grid', gridTemplateColumns: `${M.stubac}px ${M.stubac}px`, gap: `${M.razmakStubaca}px`, alignItems: 'start', maxWidth: `${M.kolona}px`, margin: '0 auto', justifyContent: 'center' }}>
                  {/* Left — inputs */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: `${M.razmakPolja}px` }}>
                    <input
                      style={inputStyle}
                      placeholder="Naziv brenda"
                      value={cancelForm.brandName}
                      onChange={(e) => setCancelForm(f => ({ ...f, brandName: e.target.value }))}
                    />
                    <input
                      style={inputStyle}
                      placeholder="Ime"
                      value={cancelForm.firstName}
                      onChange={(e) => setCancelForm(f => ({ ...f, firstName: e.target.value }))}
                    />
                    <input
                      style={inputStyle}
                      placeholder="Prezime"
                      value={cancelForm.lastName}
                      onChange={(e) => setCancelForm(f => ({ ...f, lastName: e.target.value }))}
                    />
                    <input
                      style={inputStyle}
                      placeholder="Email"
                      type="email"
                      value={cancelForm.email}
                      onChange={(e) => setCancelForm(f => ({ ...f, email: e.target.value }))}
                    />
                  </div>

                  {/* Right — textarea + button */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: `${M.opisDoDugmeta}px` }}>
                    <textarea
                      style={{
                        width: '100%', height: `${M.visinaOpisa}px`, borderRadius: '20px',
                        background: M.poljeBoja, border: 'none', outline: 'none',
                        // Natpis kreće na (43, 25) unutar polja.
                        padding: '25px 43px', fontSize: '18px', lineHeight: '25px', color: '#261A54',
                        fontFamily: 'inherit', resize: 'none',
                      }}
                      placeholder="Navedite razlog otkazivanja rezervacije"
                      value={cancelForm.reason}
                      onChange={(e) => setCancelForm(f => ({ ...f, reason: e.target.value }))}
                    />

                    {cancelError && (
                      <p style={{ color: '#EC4923', fontSize: '14px', margin: 0 }}>{cancelError}</p>
                    )}

                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <button
                        onClick={handleCancelSubmit}
                        disabled={cancelling}
                        style={{
                          width: `${M.dugmeSirina}px`, height: `${M.dugmeVisina}px`,
                          borderRadius: `${M.dugmeRadijus}px`,
                          background: '#EC4923', color: '#ffffff', fontWeight: '600',
                          fontSize: '18px', border: 'none',
                          cursor: cancelling ? 'not-allowed' : 'pointer',
                          opacity: cancelling ? 0.7 : 1,
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {cancelling ? 'Slanje...' : 'Otkažite rezervaciju'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* ── STEP 2: Success ────────────────────────────────────────
                 Donji razmak je 168, a ne izmerenih 180: red podnaslova je viši
                 od samih slova, pa bi modal inače ispao 12px viši od dizajna. */
              <div style={{ padding: '177px 24px 168px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <SadFaceIcon />
                <h2 style={{ fontSize: '34px', fontWeight: '700', color: '#1B1B1B', textAlign: 'center', lineHeight: '1.3', margin: '65px 0 0' }}>
                  Žao nam je što<br />otkazujete rezervaciju.
                </h2>
                {/* U dizajnu je ovaj red tamnoplav (#261A54), a ne tirkizan —
                    proverena boja piksela na izvozu. */}
                <p style={{ fontSize: '19px', color: '#261A54', textAlign: 'center', margin: '38px 0 0' }}>
                  Uskoro ćete biti kontaktirani.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default MyReservationsComponent;

