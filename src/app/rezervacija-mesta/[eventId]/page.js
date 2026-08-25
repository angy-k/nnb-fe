'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import useUser from '@/data/use-user'
import eventService from '@/services/eventService'
import applicationService from '@/services/applicationService'
import { checkProfileReady } from '@/utils/profileValidation'
import ReservationOptionsModal from '@/components/Modal/ReservationOptionsModal'
import BoothReservationConfirmModal from '@/components/Modal/BoothReservationConfirmModal'
import GalleryWarningModal from '@/components/Modal/GalleryWarningModal'
import Button from '@/components/Button'

const ReservationMapPage = () => {
  const router = useRouter()
  const params = useParams()
  const searchParams = useSearchParams()
  const { user, loggedOut, loading: isUserLoading } = useUser()

  const eventId = params?.eventId ? String(params.eventId) : null

  const [mapConfig, setMapConfig] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [availability, setAvailability] = useState(null)

  // Map coordinate system: SVG viewBox is 1920×1609
  const MAP_W = 1920
  const MAP_H = 1609
  // Y: hotspot JSON was calibrated ~7.8% compressed vs SVG viewBox height.
  const Y_SCALE = 1.0779
  // X: hotspot JSON x-coordinates are offset from the raster's actual stand positions.
  // Empirical fit across 11 measured stands: actual_svg_x = X_SCALE * hotspot_x - X_OFFSET
  const X_SCALE = 1.070
  const X_OFFSET = 173.9

  const mapContainerRef = useRef(null)
  const [containerWidth, setContainerWidth] = useState(0)
  const mapScale = containerWidth > 0 ? containerWidth / MAP_W : 0

  const [overlayOffset, setOverlayOffset] = useState({ x: 0, y: 0 })

  const debugMode = useMemo(() => {
    const v = (searchParams?.get('debug') ?? '').toString()
    return v === '1' || v.toLowerCase() === 'true'
  }, [searchParams])

  const [isOptionsOpen, setIsOptionsOpen] = useState(true)
  const [electricityOption, setElectricityOption] = useState('none')
  const [marketingOption, setMarketingOption] = useState('none')

  const [selectedStand, setSelectedStand] = useState(null)
  const [lockId, setLockId] = useState(null)

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false)
  const [confirmCosts, setConfirmCosts] = useState({ cotization: 0, electricity: null, marketing: null })
  const [isSubmittingReservation, setIsSubmittingReservation] = useState(false)
  const [reservationError, setReservationError] = useState(null)
  const [reservationSuccess, setReservationSuccess] = useState(null)
  const [isGalleryWarningOpen, setIsGalleryWarningOpen] = useState(false)

  const isPackageUser = !!user?.active_package

  const [sessionExpired, setSessionExpired] = useState(false)
  const [sessionSecondsLeft, setSessionSecondsLeft] = useState(120)
  useEffect(() => {
    // Resetuj tajmer pri promeni eventa ili korisnika (nova sesija)
    setSessionExpired(false)
    setSessionSecondsLeft(120)
  }, [eventId, user?.id])

  const normalizeLabel = (value) => {
    const raw = (value ?? '').toString().trim().toLowerCase()
    if (!raw) return ''

    const ascii = raw.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    return ascii
      .replace(/[^a-z0-9]+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
  }

  const resolveUserActivityGroupKey = (activityGroupName) => {
    const v = normalizeLabel(activityGroupName)
    if (!v) return null

    if (v.includes('hrana')) return 'hrana'
    if (v.includes('pice')) return 'pice'
    if (v.includes('rukotvorine')) return 'rukotvorine'
    if (v.includes('nakit')) return 'nakit'
    if (v.includes('kozmetika')) return 'kozmetika'
    if (v.includes('ostalo')) return 'ostalo'

    // Craft / textile activities → rukotvorine
    if (
      v.includes('strikanje') ||
      v.includes('pletenje') ||
      v.includes('heklanje') ||
      v.includes('vez') ||
      v.includes('tkanje') ||
      v.includes('tekstil') ||
      v.includes('keramik') ||
      v.includes('grncar') ||
      v.includes('drvorez') ||
      v.includes('origami') ||
      v.includes('makrame') ||
      v.includes('kuis') ||
      v.includes('svec') ||
      v.includes('sapun') ||
      v.includes('decupage') ||
      v.includes('craft') ||
      v.includes('zanat')
    ) return 'rukotvorine'

    return v
  }

  const zoneIsWithElectricity = (zoneType) => {
    const t = normalizeLabel(zoneType)
    if (t === 'with electricity') return true
    if (t.includes('struj') && !t.includes('bez')) return true
    return false
  }

  const zoneIsWithoutElectricity = (zoneType) => {
    const t = normalizeLabel(zoneType)
    if (t === 'without electricity') return true
    if (t.includes('bez') && t.includes('struj')) return true
    return false
  }

  const [eventDetails, setEventDetails] = useState({
    downPayment: null,
    electricityExtensionCoasts: null,
    fbMarketingCoasts: null,
    ingMarketingCoasts: null,
    termsPdfUrl: null,
  })
  const [eventName, setEventName] = useState('')

  // ── Dani događaja ──────────────────────────────────────────────────────────
  const [eventDays, setEventDays] = useState([])
  const [allowPerDay, setAllowPerDay] = useState(false)
  const [pricing, setPricing] = useState(null)
  const [multiDayChecked, setMultiDayChecked] = useState(false)
  const [selectedDayIds, setSelectedDayIds] = useState([])

  const isMultiDayEvent = eventDays.length > 1

  // Dan iz URL-a (?day=) je onaj koji je korisnik kliknuo na kalendaru
  const initialDayId = (() => {
    const raw = Number(searchParams?.get('day'))
    return Number.isFinite(raw) && raw > 0 ? raw : null
  })()

  /**
   * Kotizacija za izabranu zonu i broj dana — ista logika kao na backendu:
   * stepenasta cena, pa osnovna × dani, pa fallback.
   */
  const cotizationFor = (standNo, daysCount) => {
    const count = Math.max(1, daysCount)
    const zones = Array.isArray(pricing?.zones) ? pricing.zones : []

    const zone = zones.find((z) => {
      const from = Number(z?.stand_number_from)
      const to = Number(z?.stand_number_to)
      return Number.isFinite(from) && Number.isFinite(to)
        && standNo >= Math.min(from, to) && standNo <= Math.max(from, to)
    })

    if (zone) {
      const tier = zone?.tiers?.[count] ?? zone?.tiers?.[String(count)]
      if (tier != null) return Number(tier)

      const base = Number(zone?.base_cost)
      if (Number.isFinite(base) && base > 0) return base * count
    }

    return (Number(eventDetails?.downPayment) || 0) * count
  }

  const computeConfirmCosts = (electricityOpt, marketingOpt) => {
    // Kotizacija zavisi od zone izabranog štanda i broja izabranih dana.
    // Struja i marketing se naplaćuju jednom po prijavi, bez obzira na broj dana.
    const standNo = Number(selectedStand)
    const daysCount = Math.max(1, selectedDayIds.length)

    const cotization = Number.isFinite(standNo) && standNo > 0
      ? cotizationFor(standNo, daysCount)
      : (Number(eventDetails?.downPayment) || 0) * daysCount

    // Zonski dodatak je sada uračunat u kotizaciju
    const zoneCost = null

    const rawElectricity = eventDetails?.electricityExtensionCoasts
    const electricityCostBase = rawElectricity != null && rawElectricity !== '' ? Number(rawElectricity) : null
    const electricity = electricityOpt && electricityOpt !== 'none' ? electricityCostBase : null

    const rawFb = eventDetails?.fbMarketingCoasts
    const rawIg = eventDetails?.ingMarketingCoasts
    const fb = rawFb != null && rawFb !== '' ? Number(rawFb) : null
    const ig = rawIg != null && rawIg !== '' ? Number(rawIg) : null
    // Cena paketa za obe mreže je zasebna i niža od zbira pojedinačnih;
    // sabiranje ostaje samo za događaje kojima ta cena nije uneta.
    const rawBoth = event?.fbIngMarketingCoasts
    const both = rawBoth != null && rawBoth !== '' ? Number(rawBoth) : null

    let marketing = null
    if (marketingOpt === 'facebook') marketing = fb
    else if (marketingOpt === 'instagram') marketing = ig
    else if (marketingOpt === 'instagram_facebook') marketing = both ?? ((fb ?? 0) + (ig ?? 0))

    return { cotization, zoneCost, electricity, marketing }
  }

  useEffect(() => {
    const el = mapContainerRef.current
    if (!el) return
    const observer = new ResizeObserver(([entry]) => {
      setContainerWidth(entry.contentRect.width)
    })
    observer.observe(el)
    // Set initial width
    setContainerWidth(el.getBoundingClientRect().width)
    return () => observer.disconnect()
  }, [mapConfig])

  const refreshAvailability = async () => {
    if (!eventId || !user) return
    if (sessionExpired || isPackageUser) return
    // Zauzetost se traži za izabrane dane — štand zauzet drugog dana
    // ne sme da blokira prijavu za prvi.
    const res = await eventService.getStandAvailability(eventId, selectedDayIds)
    if (!res.ok) return
    const data = await res.json()
    if (data?.success) {
      setAvailability(data.data)
      // Ne vraćamo selectedStand/lockId iz my_lock — svaka sesija počinje ispočetka
    }
  }

  useEffect(() => {
    const fetchConfig = async () => {
      if (!eventId) return

      try {
        setLoading(true)
        setError(null)

        const res = await eventService.getEventMapConfig(eventId)
        if (!res.ok) {
          setError('Mapa nije dostupna.')
          setMapConfig(null)
          return
        }

        const data = await res.json()
        if (!data?.success) {
          setError(data?.message || 'Mapa nije dostupna.')
          setMapConfig(null)
          return
        }

        setMapConfig(data.data)
      } catch (e) {
        setError('Mapa nije dostupna.')
        setMapConfig(null)
      } finally {
        setLoading(false)
      }
    }

    fetchConfig()
  }, [eventId])

  useEffect(() => {
    if (!debugMode) return
    const dx = Number(searchParams?.get('dx'))
    const dy = Number(searchParams?.get('dy'))
    setOverlayOffset({
      x: Number.isFinite(dx) ? dx : 0,
      y: Number.isFinite(dy) ? dy : 0,
    })
  }, [debugMode, searchParams])

  useEffect(() => {
    const fetchEventDetails = async () => {
      if (!eventId) return
      try {
        const res = await eventService.getEvents()
        if (!res.ok) return

        const data = await res.json()
        if (!data?.success) return

        const items = Array.isArray(data.data)
          ? data.data
          : Array.isArray(data.data?.data)
            ? data.data.data
            : []

        const found = items.find((e) => String(e?.id) === String(eventId))
        if (!found) return

        const toNum = (v) => (v != null && v !== '') ? Number(v) : null
        setEventDetails({
          downPayment: Number(found?.downPayment) || 0,
          electricityExtensionCoasts: toNum(found?.electricityExtensionCoasts),
          fbMarketingCoasts: toNum(found?.fbMarketingCoasts),
          ingMarketingCoasts: toNum(found?.ingMarketingCoasts),
          // Ručno uploadovan dokument ima prednost; inače idu generisani uslovi
          termsPdfUrl: found?.termsPdfUrl || found?.generatedTermsUrl || null,
        })
        setEventName((found?.title || found?.name || '').toString())

        const days = Array.isArray(found?.days) ? found.days : []
        setEventDays(days)
        setAllowPerDay(!!found?.allowPerDayApplications)

        // Polazni izbor: dan iz URL-a ako postoji, inače svi dani.
        // Kad prijava po danu nije dozvoljena, prijava uvek pokriva sve dane.
        const allIds = days.map((d) => d.id)
        if (!found?.allowPerDayApplications || allIds.length <= 1) {
          setSelectedDayIds(allIds)
        } else if (initialDayId && allIds.includes(initialDayId)) {
          setSelectedDayIds([initialDayId])
        } else {
          setSelectedDayIds(allIds.slice(0, 1))
        }
      } catch {
        return
      }
    }

    fetchEventDetails()
  }, [eventId])

  useEffect(() => {
    const fetchPricing = async () => {
      if (!eventId) return
      try {
        const res = await eventService.getEventPricing(eventId)
        if (!res.ok) return
        const data = await res.json()
        if (data?.success) setPricing(data.data)
      } catch {
        return
      }
    }

    fetchPricing()
  }, [eventId])

  // Pri svakom loadu/refreshu: oslobodi stari lock da štand ne ostane blokiran
  useEffect(() => {
    if (!user || !eventId || isPackageUser) return
    eventService.unlockStand({ eventId }).catch(() => null)
  }, [user?.id, eventId])

  useEffect(() => {
    if (!user || !eventId) return
    if (isPackageUser || sessionExpired) return
    // selectedDayIds je u zavisnostima — promena izbora dana osvežava zauzetost
    refreshAvailability()
  }, [user, eventId, isPackageUser, sessionExpired, selectedDayIds])

  useEffect(() => {
    if (!user || !eventId) return
    if (isPackageUser || sessionExpired) return
    const interval = setInterval(() => {
      refreshAvailability()
    }, 10000)
    return () => clearInterval(interval)
  }, [user, eventId, isPackageUser, sessionExpired])

  // Expiry: okida se kad tajmer dođe do 0
  useEffect(() => {
    if (sessionSecondsLeft > 0) return
    if (sessionExpired) return
    if (isPackageUser) return
    if (!eventId) return

    setSessionExpired(true)
    setIsConfirmModalOpen(false)
    setIsOptionsOpen(false)
    setReservationError('Sesija za izbor mesta je istekla. Osvežite stranicu i pokušajte ponovo.')
    setLockId(null)
    setSelectedStand(null)
    eventService.unlockStand({ eventId }).catch(() => null)
  }, [sessionSecondsLeft])

  useEffect(() => {
    // Tajmer kreće odmah od munta/refresh-a, ne čeka user load
    if (isPackageUser || sessionExpired) return

    const id = setInterval(() => {
      setSessionSecondsLeft(s => Math.max(0, s - 1))
    }, 1000)

    return () => clearInterval(id)
  }, [isPackageUser, sessionExpired])

  useEffect(() => {
    if (!user || !eventId) return
    if (!lockId || isPackageUser) return
    if (sessionExpired) return

    const ttlSeconds = Number(availability?.ttl_seconds) || 120
    const extendEveryMs = Math.max(15000, Math.floor(ttlSeconds * 1000 * 0.7))

    const interval = setInterval(async () => {
      try {
        const res = await eventService.extendStandLock({ eventId, lockId })
        if (res.status === 404) {
          setLockId(null)
          setSelectedStand(null)
          return
        }
      } catch {
        return
      }
    }, extendEveryMs)

    return () => clearInterval(interval)
  }, [user, eventId, lockId, availability?.ttl_seconds, isPackageUser, sessionExpired])

  useEffect(() => {
    if (!eventId || !user) return
    if (isPackageUser) return
    if (sessionExpired) return

    return () => {
      eventService.unlockStand({ eventId }).catch(() => null)
    }
  }, [eventId, user, isPackageUser, sessionExpired])

  useEffect(() => {
    if (isUserLoading) return
    if (loggedOut) {
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('nnb:open-auth-modal'))
      }
      router.back()
    }
  }, [loggedOut, router, isUserLoading])

  const canSelectStand = !isPackageUser && !sessionExpired

  const onPickStand = async (standNumber) => {
    if (!eventId || !user) return
    if (!canSelectStand) return

    const allowed = standAllowed(standNumber)
    if (!allowed.ok) {
      setReservationError(allowed.reason)
      return
    }

    try {
      // Isti štand se zaključava na svim izabranim danima — ako je zauzet
      // makar jednog, backend vraća 409 sa nazivom dana koji blokira.
      const res = await eventService.lockStand({ eventId, standNumber, eventDayIds: selectedDayIds })
      const data = await res.json().catch(() => null)

      if (!res.ok || !data?.success) {
        setReservationError(data?.message || 'Neuspešno zaključavanje mesta.')
        return
      }

      setSelectedStand(standNumber)
      setLockId(data.data?.id)
      setReservationError(null)

      if (!isOptionsOpen) {
        setConfirmCosts(computeConfirmCosts(electricityOption, marketingOption))
        setIsConfirmModalOpen(true)
      }

      await refreshAvailability()
    } catch (e) {
      setReservationError('Neuspešno zaključavanje mesta.')
    }
  }

  const submitReservationOptions = () => {
    if (!isPackageUser && sessionExpired) {
      setReservationError('Sesija za izbor mesta je istekla. Osvežite stranicu i pokušajte ponovo.')
      setIsOptionsOpen(false)
      return
    }

    // Ako je odabrana reklama, a korisnik nema fotografija — prikaži upozorenje
    if (marketingOption !== 'none' && user) {
      const hasGallery =
        (Array.isArray(user?.gallery_images) && user.gallery_images.length > 0) ||
        (Array.isArray(user?.gallery_videos) && user.gallery_videos.length > 0)
      if (!hasGallery) {
        setIsGalleryWarningOpen(true)
        return
      }
    }

    setConfirmCosts(computeConfirmCosts(electricityOption, marketingOption))
    setIsOptionsOpen(false)

    if (isPackageUser) {
      setIsConfirmModalOpen(true)
      return
    }

    if (selectedStand && lockId) {
      setIsConfirmModalOpen(true)
    }
  }

  const confirmReservation = async () => {
    if (!user || !eventId) return
    if (!isPackageUser && sessionExpired) {
      setReservationError('Sesija za izbor mesta je istekla. Osvežite stranicu i pokušajte ponovo.')
      return
    }

    const withMarketing = marketingOption && marketingOption !== 'none'
    const { ok: profileOk, missing } = checkProfileReady(user, { withMarketing })
    if (!profileOk) {
      setReservationError(`Pre prijave dopunite profil — nedostaje: ${missing.join(', ')}. Idite na Profil → Izmeni profil.`)
      return
    }

    try {
      setReservationError(null)
      setReservationSuccess(null)
      setIsSubmittingReservation(true)

      const payload = {
        eventId,
        electricityOption,
        marketingOption,
        eventDayIds: selectedDayIds,
      }

      if (!isPackageUser) {
        payload.standNumber = selectedStand
        payload.lockId = lockId
      }

      const res = await applicationService.submitApplication(payload)
      const contentType = res.headers.get('content-type') || ''
      const data = contentType.includes('application/json') ? await res.json() : null

      if (res.ok && data?.success) {
        router.push('/moje-rezervacije')
        return
      }

      if (res.status === 409) {
        setReservationError(data?.message || 'Već ste poslali prijavu za ovaj događaj.')
        return
      }

      setReservationError(data?.message || 'Greška prilikom slanja prijave.')
    } catch (e) {
      setReservationError('Greška prilikom slanja prijave.')
    } finally {
      setIsSubmittingReservation(false)
    }
  }

  const readyToConfirm = isPackageUser || (!sessionExpired && !!selectedStand && !!lockId)

  if (loading) {
    return (
      <div className="mt-48 w-full grid place-items-center">
        <div className="text-[#261A54]">Učitavanje mape...</div>
      </div>
    )
  }

  if (error || !mapConfig?.map_url || !Array.isArray(mapConfig?.hotspots)) {
    return (
      <div className="mt-48 w-full grid place-items-center px-6">
        <div className="max-w-[900px] w-full bg-white rounded-2xl shadow p-8">
          <div className="text-[#261A54] text-xl font-bold mb-4">Mapa nije dostupna</div>
          <div className="text-[#1B1B1B] mb-6">{error || 'Događaj nema mapu za izbor mesta.'}</div>
          <Button type="outlined-orange" name="Nazad" onClick={() => router.back()} />
        </div>
      </div>
    )
  }

  const reserved = new Set((availability?.reserved || []).map(Number))
  const locked = new Set((availability?.locked || []).map(Number))

  const userGroupKey = resolveUserActivityGroupKey(user?.activity_group?.name)

  const zones = Array.isArray(mapConfig?.zones) ? mapConfig.zones : []

  const zonesWithRanges = zones.filter((z) => {
    const from = Number(z?.stand_number_from)
    const to = Number(z?.stand_number_to)
    return Number.isFinite(from) && Number.isFinite(to)
  })

  const zonesWithElectricity = zonesWithRanges.filter((z) => zoneIsWithElectricity(z?.zone_type))
  const zonesWithoutElectricity = zonesWithRanges.filter((z) => zoneIsWithoutElectricity(z?.zone_type))
  const withElectricity = electricityOption && electricityOption !== 'none'

  const candidateZones = zonesWithRanges.length > 0
    ? (withElectricity
        ? (zonesWithElectricity.length > 0 ? zonesWithElectricity : zonesWithRanges)
        : (zonesWithoutElectricity.length > 0 ? zonesWithoutElectricity : zonesWithRanges))
    : []

  const findZonesForStand = (standNo) => {
    const n = Number(standNo)
    if (!Number.isFinite(n)) return []

    return candidateZones.filter((z) => {
      const from = Number(z?.stand_number_from)
      const to = Number(z?.stand_number_to)
      if (!Number.isFinite(from) || !Number.isFinite(to)) return false
      return n >= Math.min(from, to) && n <= Math.max(from, to)
    })
  }

  const standAllowed = (standNo) => {
    if (isPackageUser) return { ok: false, reason: 'Imate aktivan paket. Mesto se dodeljuje automatski.' }
    // Ako nema zona — svako može birati bez obzira na grupu delatnosti
    if (!userGroupKey && candidateZones.length > 0) return { ok: false, reason: 'Molimo odaberite grupu delatnosti u profilu.' }
    if (userGroupKey === 'ostalo') return { ok: true, reason: null }

    if (candidateZones.length > 0) {
      const z = findZonesForStand(standNo)
      // Stand bez zone nema ograničenja — dostupan svima
      if (z.length === 0) return { ok: true, reason: null }

      const allowed = z.some((zone) => {
        const cat = normalizeLabel(zone?.zone_category)
        if (!cat) return true
        return cat.includes(userGroupKey)
      })

      if (!allowed) return { ok: false, reason: 'Mesto nije dostupno za vašu delatnost.' }
    }

    return { ok: true, reason: null }
  }

  return (
    <div className="mt-72 w-full grid place-items-center bg-[#F0F0F0] pb-32">
      <div className="w-full max-w-[1440px] px-4 pt-6">
        <div className="flex items-center justify-between mb-6">
          <div className="text-[#261A54] text-2xl font-bold">Izaberite mesto</div>
          <Button type="outlined-dark" name="Nazad" onClick={() => router.back()} />
        </div>

        {/* Izbor dana — samo za višednevne događaje sa dozvoljenom prijavom po danu */}
        {isMultiDayEvent && allowPerDay && !isPackageUser && (
          <div className="mb-6 bg-white rounded-2xl shadow p-5">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={multiDayChecked}
                onChange={(e) => {
                  const checked = e.target.checked
                  setMultiDayChecked(checked)
                  if (!checked) {
                    // Vraćamo se na jedan dan — onaj sa kojeg je korisnik došao
                    const fallback = initialDayId && eventDays.some((d) => d.id === initialDayId)
                      ? initialDayId
                      : eventDays[0]?.id
                    setSelectedDayIds(fallback ? [fallback] : [])
                  }
                  setSelectedStand(null)
                  setLockId(null)
                }}
                className="w-5 h-5 accent-[#56C4CF] cursor-pointer"
              />
              <span className="text-[#261A54] font-semibold">Prijavljujem se za više dana</span>
            </label>

            <p className="text-sm text-[#666] mt-2">
              {multiDayChecked
                ? 'Izaberite dane. Isti štand se rezerviše za sve izabrane dane.'
                : 'Događaj traje više dana. Prijava za više dana je povoljnija od zbira pojedinačnih.'}
            </p>

            <div className="flex flex-wrap gap-3 mt-4">
              {eventDays.map((day) => {
                const isSelected = selectedDayIds.includes(day.id)
                const isOnly = selectedDayIds.length === 1 && isSelected

                return (
                  <button
                    key={day.id}
                    type="button"
                    onClick={() => {
                      if (!multiDayChecked) {
                        // Bez štikliranog polja bira se tačno jedan dan
                        setSelectedDayIds([day.id])
                      } else if (isSelected) {
                        // Poslednji izabrani dan se ne može odštiklirati
                        if (isOnly) return
                        setSelectedDayIds((prev) => prev.filter((id) => id !== day.id))
                      } else {
                        setSelectedDayIds((prev) => [...prev, day.id])
                      }
                      // Izbor dana menja zauzetost — stari izbor štanda više ne važi
                      setSelectedStand(null)
                      setLockId(null)
                    }}
                    className="rounded-xl border-2 px-4 py-3 text-left transition"
                    style={{
                      borderColor: isSelected ? '#56C4CF' : '#e0e0e0',
                      background: isSelected ? '#eafafb' : '#ffffff',
                      cursor: isOnly && multiDayChecked ? 'default' : 'pointer',
                    }}
                  >
                    <div className="text-[#261A54] font-semibold text-sm">
                      {day.dayNumber}. dan
                    </div>
                    <div className="text-[#555] text-sm">{day.date}</div>
                    {day.timeRange && (
                      <div className="text-[#888] text-xs mt-0.5">{day.timeRange}</div>
                    )}
                  </button>
                )
              })}
            </div>

            {selectedStand && (
              <div className="mt-4 pt-4 border-t border-[#eee] text-[#261A54]">
                Kotizacija za {selectedDayIds.length}{' '}
                {selectedDayIds.length === 1 ? 'dan' : 'dana'}:{' '}
                <strong>
                  {cotizationFor(Number(selectedStand), selectedDayIds.length).toLocaleString('sr-RS')} RSD
                </strong>
                <span className="text-[#888] text-sm"> · struja i marketing se naplaćuju jednom</span>
              </div>
            )}
          </div>
        )}

        {debugMode && (
          <div className="mb-4 bg-white rounded-2xl shadow p-4">
            <div className="text-[#261A54] font-semibold mb-3">Podešavanje overlay-a</div>
            <div className="flex flex-col md:flex-row gap-3 md:items-center">
              <label className="text-sm text-[#261A54] flex items-center gap-2">
                dx
                <input
                  type="number"
                  value={overlayOffset.x}
                  onChange={(e) => setOverlayOffset((s) => ({ ...s, x: Number(e.target.value) || 0 }))}
                  className="border rounded-lg px-3 py-2 w-[140px]"
                />
              </label>
              <label className="text-sm text-[#261A54] flex items-center gap-2">
                dy
                <input
                  type="number"
                  value={overlayOffset.y}
                  onChange={(e) => setOverlayOffset((s) => ({ ...s, y: Number(e.target.value) || 0 }))}
                  className="border rounded-lg px-3 py-2 w-[140px]"
                />
              </label>
              <div className="text-xs text-[#261A54] opacity-70">
                scale: {mapScale.toFixed(4)} containerWidth: {containerWidth}
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow">
          <div className="w-full overflow-x-auto overflow-y-hidden rounded-t-2xl">
            <div ref={mapContainerRef} className="relative" style={{ minWidth: '900px' }}>
              <img
                src={mapConfig.map_url}
                alt="Mapa štandova"
                style={{ display: 'block', width: '100%', height: 'auto' }}
              />
              {mapScale > 0 && mapConfig.hotspots.map((h, idx) => {
                const standNo = Number(h?.stand_number)
                const r = h?.rect
                if (!standNo || !r) return null

                const isReserved = reserved.has(standNo)
                const isLocked = locked.has(standNo)
                const isMine = Number(selectedStand) === standNo
                const allowed = standAllowed(standNo)
                // trueDisabled = button ne može ni reagovati (reserved/locked/nema sesije)
                const trueDisabled = isReserved || (isLocked && !isMine) || !canSelectStand
                // notAllowed = korisnik može kliknuti, ali će dobiti objašnjenje zašto ne može
                const notAllowed = !trueDisabled && !allowed.ok

                const bg = isReserved
                  ? 'bg-red-500/25 border-red-600'
                  : isMine
                    ? 'bg-emerald-500/40 border-emerald-600'
                    : isLocked
                      ? 'bg-yellow-500/25 border-yellow-600'
                      : notAllowed
                        ? 'bg-gray-400/20 border-gray-400'
                        : 'bg-blue-500/10 border-blue-500'

                return (
                  <button
                    key={`${standNo}-${idx}`}
                    type="button"
                    onClick={() => {
                      if (notAllowed) return
                      onPickStand(standNo)
                    }}
                    disabled={trueDisabled}
                    title={allowed.ok ? `Mesto ${standNo}` : `Mesto ${standNo} — ${allowed.reason}`}
                    style={{
                      position: 'absolute',
                      left: `${(Number(r.x) * X_SCALE - X_OFFSET) * mapScale + overlayOffset.x}px`,
                      top: `${Number(r.y) * Y_SCALE * mapScale + overlayOffset.y}px`,
                      width: `${Number(r.width) * X_SCALE * mapScale}px`,
                      height: `${Number(r.height) * Y_SCALE * mapScale}px`,
                    }}
                    className={`border ${bg} ${trueDisabled ? 'cursor-not-allowed' : notAllowed ? 'cursor-not-allowed' : 'hover:bg-blue-500/25'} `}
                  >
                  </button>
                )
              })}

              {!isPackageUser && sessionExpired && (
                <div className="absolute inset-0 bg-white/70 backdrop-blur-sm flex flex-col items-center justify-center gap-4 p-6">
                  <div className="text-[#261A54] font-semibold text-center">
                    Sesija za izbor mesta je istekla.
                  </div>
                  <div className="flex items-center gap-3">
                    <Button type="outlined-orange" name="Osveži" onClick={() => window.location.reload()} />
                    <Button type="outlined-dark" name="Nazad" onClick={() => router.back()} />
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="p-6 border-t border-gray-200">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="text-sm text-[#261A54]">
                {isPackageUser ? (
                  <div>Imate aktivan paket. Mesto se dodeljuje automatski.</div>
                ) : (
                  <>
                    <div>
                      Izabrano mesto: <span className="font-semibold">{selectedStand || '-'}</span>
                    </div>
                    {!sessionExpired && (
                      <div style={{
                        marginTop: '6px',
                        display: 'inline-flex', alignItems: 'center', gap: '6px',
                        padding: '3px 12px', borderRadius: '20px',
                        border: `1.5px solid ${sessionSecondsLeft <= 15 ? '#EC4923' : sessionSecondsLeft <= 30 ? '#FACE06' : '#56C4CF'}`,
                        color: sessionSecondsLeft <= 15 ? '#EC4923' : sessionSecondsLeft <= 30 ? '#FACE06' : '#56C4CF',
                        fontWeight: '600', fontSize: '13px',
                      }}>
                        <span>⏱</span>
                        <span>Sesija ističe za {Math.floor(sessionSecondsLeft / 60)}:{(sessionSecondsLeft % 60).toString().padStart(2, '0')}</span>
                      </div>
                    )}
                  </>
                )}
                {reservationError && <div className="text-red-600 mt-2">{reservationError}</div>}
              </div>

              <div className="flex items-center gap-3">
                {!isConfirmModalOpen && (
                  <Button
                    type="light"
                    name={isOptionsOpen ? 'Izaberi opcije' : 'Opcije'}
                    onClick={() => {
                      if (!isPackageUser && sessionExpired) return
                      setIsOptionsOpen(true)
                    }}
                    disabled={!isPackageUser && sessionExpired}
                  />
                )}

                <Button
                  type="outlined-orange"
                  name="Nastavi"
                  disabled={!readyToConfirm || isSubmittingReservation}
                  onClick={() => setIsConfirmModalOpen(true)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <ReservationOptionsModal
        isOpen={isOptionsOpen}
        onClose={() => setIsOptionsOpen(false)}
        electricityOption={electricityOption}
        setElectricityOption={setElectricityOption}
        marketingOption={marketingOption}
        setMarketingOption={setMarketingOption}
        onSubmit={submitReservationOptions}
        submitLabel="Nastavi"
        showCancel={true}
        cancelLabel="Otkaži"
        timeRemaining={!isPackageUser && !sessionExpired ? sessionSecondsLeft : null}
        termsPdfUrl={eventDetails.termsPdfUrl}
      />

      <GalleryWarningModal
        isOpen={isGalleryWarningOpen}
        onClose={() => setIsGalleryWarningOpen(false)}
      />

      <BoothReservationConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        selectedStand={selectedStand}
        title={selectedStand ? 'Da li želite da potvrdite rezervaciju?' : 'Da li želite da rezervišete tezgu?'}
        eventName={eventName}
        onConfirm={confirmReservation}
        onCancel={() => setIsConfirmModalOpen(false)}
        isLoading={isSubmittingReservation}
        successMessage={reservationSuccess}
        errorMessage={reservationError}
        onDismissMessage={() => {
          setReservationError(null)
          setReservationSuccess(null)
        }}
        costs={confirmCosts}
        timeRemaining={!isPackageUser && !sessionExpired ? sessionSecondsLeft : null}
      />
    </div>
  )
}

export default ReservationMapPage
