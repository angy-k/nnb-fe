'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import useUser from '@/data/use-user'
import eventService from '@/services/eventService'
import applicationService from '@/services/applicationService'
import ReservationOptionsModal from '@/components/Modal/ReservationOptionsModal'
import BoothReservationConfirmModal from '@/components/Modal/BoothReservationConfirmModal'
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

  const imgRef = useRef(null)
  const [imgScale, setImgScale] = useState({ x: 1, y: 1 })
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

  const isPackageUser = !!user?.active_package

  const [sessionExpired, setSessionExpired] = useState(false)
  const sessionStartedAtRef = useRef(null)
  const sessionTimeoutRef = useRef(null)

  useEffect(() => {
    sessionStartedAtRef.current = null
    setSessionExpired(false)
    if (sessionTimeoutRef.current) {
      clearTimeout(sessionTimeoutRef.current)
      sessionTimeoutRef.current = null
    }
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
    downPayment: 0,
    electricityExtensionCoasts: 0,
    fbMarketingCoasts: 0,
    ingMarketingCoasts: 0,
  })

  const computeConfirmCosts = (electricityOpt, marketingOpt) => {
    const cotization = Number(eventDetails?.downPayment) || 0

    const electricityCostBase = Number(eventDetails?.electricityExtensionCoasts) || 0
    const electricity = electricityOpt && electricityOpt !== 'none' ? electricityCostBase : null

    const fb = Number(eventDetails?.fbMarketingCoasts) || 0
    const ig = Number(eventDetails?.ingMarketingCoasts) || 0

    let marketing = null
    if (marketingOpt === 'facebook') marketing = fb
    else if (marketingOpt === 'instagram') marketing = ig
    else if (marketingOpt === 'instagram_facebook') marketing = fb + ig

    return { cotization, electricity, marketing }
  }

  const hotspotsBounds = useMemo(() => {
    const hs = mapConfig?.hotspots
    if (!Array.isArray(hs) || hs.length === 0) return { width: null, height: null }

    let maxX = 0
    let maxY = 0

    for (const h of hs) {
      const r = h?.rect
      if (!r) continue

      const x = Number(r.x) || 0
      const y = Number(r.y) || 0
      const w = Number(r.width) || 0
      const hgt = Number(r.height) || 0

      maxX = Math.max(maxX, x + w)
      maxY = Math.max(maxY, y + hgt)
    }

    return {
      width: maxX > 0 ? maxX : null,
      height: maxY > 0 ? maxY : null,
    }
  }, [mapConfig?.hotspots])

  const updateImageScale = () => {
    const img = imgRef.current
    if (!img) return

    const rect = img.getBoundingClientRect()

    const naturalWidthRaw = Number(img.naturalWidth) || 0
    const naturalHeightRaw = Number(img.naturalHeight) || 0
    const sourceWidth = naturalWidthRaw > 1 ? naturalWidthRaw : (hotspotsBounds.width ?? rect.width ?? 1)
    const sourceHeight = naturalHeightRaw > 1 ? naturalHeightRaw : (hotspotsBounds.height ?? rect.height ?? 1)

    const x = rect.width / (sourceWidth || 1)
    const y = rect.height / (sourceHeight || 1)

    setImgScale({ x: Number.isFinite(x) && x > 0 ? x : 1, y: Number.isFinite(y) && y > 0 ? y : 1 })
  }

  const refreshAvailability = async () => {
    if (!eventId || !user) return
    if (sessionExpired || isPackageUser) return
    const res = await eventService.getStandAvailability(eventId)
    if (!res.ok) return
    const data = await res.json()
    if (data?.success) {
      setAvailability(data.data)
      if (data.data?.my_lock) {
        setLockId(data.data.my_lock.id)
        setSelectedStand(data.data.my_lock.stand_number)
      } else {
        setLockId(null)
        setSelectedStand(null)
      }
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
    updateImageScale()
    const onResize = () => updateImageScale()
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [hotspotsBounds.width, hotspotsBounds.height])

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

        setEventDetails({
          downPayment: Number(found?.downPayment) || 0,
          electricityExtensionCoasts: Number(found?.electricityExtensionCoasts) || 0,
          fbMarketingCoasts: Number(found?.fbMarketingCoasts) || 0,
          ingMarketingCoasts: Number(found?.ingMarketingCoasts) || 0,
        })
      } catch {
        return
      }
    }

    fetchEventDetails()
  }, [eventId])

  useEffect(() => {
    if (!user || !eventId) return
    if (isPackageUser || sessionExpired) return
    refreshAvailability()
  }, [user, eventId, isPackageUser, sessionExpired])

  useEffect(() => {
    if (!user || !eventId) return
    if (isPackageUser || sessionExpired) return
    const interval = setInterval(() => {
      refreshAvailability()
    }, 10000)
    return () => clearInterval(interval)
  }, [user, eventId, isPackageUser, sessionExpired])

  useEffect(() => {
    if (!user || !eventId) return
    if (isPackageUser) return
    if (sessionExpired) return

    const ttlSeconds = 120

    if (sessionStartedAtRef.current === null) {
      sessionStartedAtRef.current = Date.now()
    }

    const elapsedMs = Date.now() - sessionStartedAtRef.current
    const remainingMs = ttlSeconds * 1000 - elapsedMs

    if (remainingMs <= 0) {
      setSessionExpired(true)
      setIsConfirmModalOpen(false)
      setIsOptionsOpen(false)
      setReservationError('Sesija za izbor mesta je istekla. Osvežite stranicu i pokušajte ponovo.')
      setLockId(null)
      setSelectedStand(null)
      eventService.unlockStand({ eventId }).catch(() => null)
      return
    }

    if (sessionTimeoutRef.current) {
      clearTimeout(sessionTimeoutRef.current)
    }

    sessionTimeoutRef.current = setTimeout(() => {
      setSessionExpired(true)
      setIsConfirmModalOpen(false)
      setIsOptionsOpen(false)
      setReservationError('Sesija za izbor mesta je istekla. Osvežite stranicu i pokušajte ponovo.')
      setLockId(null)
      setSelectedStand(null)
      eventService.unlockStand({ eventId }).catch(() => null)
    }, remainingMs)

    return () => {
      if (sessionTimeoutRef.current) {
        clearTimeout(sessionTimeoutRef.current)
      }
    }
  }, [user?.id, eventId, isPackageUser, sessionExpired])

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
      const res = await eventService.lockStand({ eventId, standNumber })
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

    try {
      setReservationError(null)
      setReservationSuccess(null)
      setIsSubmittingReservation(true)

      const payload = {
        eventId,
        electricityOption,
        marketingOption,
      }

      if (!isPackageUser) {
        payload.standNumber = selectedStand
        payload.lockId = lockId
      }

      const res = await applicationService.submitApplication(payload)
      const contentType = res.headers.get('content-type') || ''
      const data = contentType.includes('application/json') ? await res.json() : null

      if (res.ok && data?.success) {
        setReservationSuccess('Prijava je uspešno poslata.')
        setTimeout(() => {
          router.push('/moje-rezervacije')
        }, 1200)
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
    if (!userGroupKey) return { ok: false, reason: 'Molimo odaberite grupu delatnosti u profilu.' }
    if (userGroupKey === 'ostalo') return { ok: true, reason: null }

    if (candidateZones.length > 0) {
      const z = findZonesForStand(standNo)
      if (z.length === 0) return { ok: false, reason: 'Mesto nije u nijednoj zoni.' }

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
                scaleX: {imgScale.x.toFixed(4)} scaleY: {imgScale.y.toFixed(4)}
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow overflow-hidden">
          <div className="relative w-full overflow-auto">
            <div className="relative inline-block">
              <img ref={imgRef} onLoad={updateImageScale} src={mapConfig.map_url} alt="Mapa štandova" className="w-full h-auto" />
              {mapConfig.hotspots.map((h, idx) => {
                const standNo = Number(h?.stand_number)
                const r = h?.rect
                if (!standNo || !r) return null

                const isReserved = reserved.has(standNo)
                const isLocked = locked.has(standNo)
                const isMine = Number(selectedStand) === standNo
                const allowed = standAllowed(standNo)
                const disabled = isReserved || (isLocked && !isMine) || !canSelectStand || !allowed.ok

                const bg = isReserved
                  ? 'bg-red-500/20 border-red-600'
                  : isMine
                    ? 'bg-emerald-500/20 border-emerald-600'
                    : isLocked
                      ? 'bg-yellow-500/20 border-yellow-600'
                      : 'bg-blue-500/10 border-blue-600'

                return (
                  <button
                    key={`${standNo}-${idx}`}
                    type="button"
                    onClick={() => onPickStand(standNo)}
                    disabled={disabled}
                    title={allowed.ok ? `Mesto ${standNo}` : `Mesto ${standNo} - ${allowed.reason}`}
                    style={{
                      position: 'absolute',
                      left: `${Number(r.x) * imgScale.x + overlayOffset.x}px`,
                      top: `${Number(r.y) * imgScale.y + overlayOffset.y}px`,
                      width: `${Number(r.width) * imgScale.x}px`,
                      height: `${Number(r.height) * imgScale.y}px`,
                    }}
                    className={`border ${bg} text-[10px] text-[#261A54] flex items-center justify-center ${disabled ? 'cursor-not-allowed opacity-60' : 'hover:opacity-90'} `}
                  >
                    {standNo}
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
                  <div>
                    Izabrano mesto: <span className="font-semibold">{selectedStand || '-'}</span>
                  </div>
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
      />

      <BoothReservationConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        costs={confirmCosts}
        selections={{ electricityOption, marketingOption }}
        onConfirm={confirmReservation}
        onCancel={() => setIsConfirmModalOpen(false)}
        isLoading={isSubmittingReservation}
        successMessage={reservationSuccess}
        errorMessage={reservationError}
        onDismissMessage={() => {
          setReservationError(null)
          setReservationSuccess(null)
        }}
      />
    </div>
  )
}

export default ReservationMapPage
