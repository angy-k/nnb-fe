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
import { electricityOptionsOf, electricityPriceFor, standAllowsElectricity } from '@/utils/electricity'

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

  /**
   * Koordinatni prostor mape.
   *
   * Ranije je ovde stajalo fiksno 1920 × 1609 uz empirijske ispravke skale i
   * pomeraja. To je bila zakrpa za jedan konkretan izvoz — čim je stigla šema
   * sa drugačijim viewBox-om (1379 širine, jer je levi blok odsečen), tačke su
   * se razišle sa podlogom.
   *
   * Sada se prostor čita iz same podloge: `naturalWidth`/`naturalHeight` daju
   * deklarisanu širinu i visinu SVG-a, odnosno piksele rastera. Hotspot JSON se
   * piše u tom istom prostoru, pa nikakva ispravka nije potrebna — a nova šema
   * radi bez diranja koda.
   */
  const [mapNatural, setMapNatural] = useState(null)
  const MAP_W = mapNatural?.w || 1920

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
  const [isSubmittingReservation, setIsSubmittingReservation] = useState(false)
  const [reservationError, setReservationError] = useState(null)
  const [reservationSuccess, setReservationSuccess] = useState(null)
  const [isGalleryWarningOpen, setIsGalleryWarningOpen] = useState(false)

  const isPackageUser = !!user?.active_package

  /**
   * Broj štanda ugovoren paketom.
   *
   * Paket korisnik ne bira mesto — organizator mu ga dodeljuje ugovorom, a
   * backend ga sam upisuje u prijavu. Ovde je potreban da bi predračun mogao da
   * se traži za pravo mesto: bez njega bi obračun tekao kao da mesto nije
   * izabrano i prikazao kotizaciju 0, dok bi se naplatila cena njegove zone.
   */
  const packageStandNumber = (() => {
    const raw = Number(user?.active_package?.stand_number)
    return Number.isFinite(raw) && raw > 0 ? raw : null
  })()

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

  const [eventDetails, setEventDetails] = useState({
    downPayment: null,
    // Varijante strujnog priključka sa događaja; prazan niz = struja se ne nudi
    electricityOptions: [],
    fbMarketingCoasts: null,
    ingMarketingCoasts: null,
    fbIngMarketingCoasts: null,
    termsPdfUrl: null,
  })
  const [eventName, setEventName] = useState('')
  const [eventAddress, setEventAddress] = useState('')

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
    // Paket korisnik ne bira mesto — računa se štand iz njegovog ugovora.
    const standNo = Number(isPackageUser ? packageStandNumber : selectedStand)
    const daysCount = Math.max(1, selectedDayIds.length)

    const cotization = Number.isFinite(standNo) && standNo > 0
      ? cotizationFor(standNo, daysCount)
      : (Number(eventDetails?.downPayment) || 0) * daysCount

    // Zonski dodatak je sada uračunat u kotizaciju
    const zoneCost = null

    // Cena zavisi od izabrane jačine priključka; „none" znači da struja nije tražena
    const electricity = electricityPriceFor(eventDetails, electricityOpt)

    const rawFb = eventDetails?.fbMarketingCoasts
    const rawIg = eventDetails?.ingMarketingCoasts
    const fb = rawFb != null && rawFb !== '' ? Number(rawFb) : null
    const ig = rawIg != null && rawIg !== '' ? Number(rawIg) : null
    /*
     * Cena paketa za obe mreže je zasebna i niža od zbira pojedinačnih;
     * sabiranje ostaje samo za događaje kojima ta cena nije uneta.
     *
     * Ranije je ovde pisalo `event?.fbIngMarketingCoasts`, a na ovoj stranici
     * promenljiva `event` ne postoji — izraz je hvatao `window.event`, koji je
     * van rukovaoca događajem uvek `undefined`. Optional chaining je progutao
     * grešku, pa se paketna cena nikad nije primenila i uvek se sabiralo.
     */
    const rawBoth = eventDetails?.fbIngMarketingCoasts
    const both = rawBoth != null && rawBoth !== '' ? Number(rawBoth) : null

    let marketing = null
    if (marketingOpt === 'facebook') marketing = fb
    else if (marketingOpt === 'instagram') marketing = ig
    else if (marketingOpt === 'instagram_facebook') marketing = both ?? ((fb ?? 0) + (ig ?? 0))

    return { cotization, zoneCost, electricity, marketing }
  }

  /**
   * Troškovi se izvode iz trenutnog stanja pri svakom iscrtavanju.
   *
   * Ranije su se računali jednom i pamtili u `useState`, i to na dva mesta koja
   * su pozivala računicu odmah nakon `setSelectedStand(...)`. Kako React stanje
   * ažurira asinhrono, funkcija je i dalje videla prethodni štand: pri prvom
   * izboru nije bilo nijednog, pa je kotizacija ispadala 0, a pri svakom
   * sledećem se naplaćivala zona prethodno izabranog mesta.
   *
   * Izvedena vrednost nema to stanje pa ni tu grešku — a iznos prati i naknadnu
   * promenu dana ili opcija.
   */
  const localCosts = computeConfirmCosts(electricityOption, marketingOption)

  /*
   * Merodavan obračun dolazi sa servera — `/applications/quote` vraća iste
   * stavke koje će se i upisati. Domaća računica ostaje samo kao trenutni
   * prikaz dok odgovor ne stigne, da sažetak ne bi bio prazan.
   */
  const [serverCosts, setServerCosts] = useState(null)
  const [quoteBlockers, setQuoteBlockers] = useState([])
  const [gratisPokriva, setGratisPokriva] = useState([])

  // Paket korisnik ne bira mesto, pa predračun ide za štand iz njegovog ugovora.
  const standZaObracun = isPackageUser ? packageStandNumber : selectedStand

  useEffect(() => {
    if (!eventId || !user || !standZaObracun) {
      setServerCosts(null)
      setQuoteBlockers([])
      setGratisPokriva([])
      return
    }

    let otkazano = false

    const ucitajPredracun = async () => {
      try {
        const res = await applicationService.quoteApplication({
          eventId,
          electricityOption,
          marketingOption,
          standNumber: standZaObracun,
          eventDayIds: selectedDayIds,
        })
        const data = await res.json().catch(() => null)
        if (otkazano || !data?.success) return

        setServerCosts({
          cotization: data.data.cotization,
          zoneCost: null,
          electricity: data.data.electricity || null,
          marketing: data.data.marketing || null,
        })
        setQuoteBlockers(Array.isArray(data.data.blockers) ? data.data.blockers : [])

        /*
         * Paket pokriva oglašavanje samo ako ga je izlagač i zatražio — inače
         * bi u sažetku pisalo „Reklamiranje — pokriveno paketom" za uslugu koju
         * nije ni izabrao.
         */
        const pokriva = Array.isArray(data.data.gratis_pokriva) ? data.data.gratis_pokriva : []
        setGratisPokriva(pokriva.filter((k) =>
          k !== 'oglasavanje' || (marketingOption && marketingOption !== 'none')
        ))
      } catch {
        // Bez predračuna ostaje domaća procena — potvrda i dalje radi
      }
    }

    ucitajPredracun()
    return () => { otkazano = true }
  }, [eventId, user, standZaObracun, electricityOption, marketingOption, selectedDayIds])

  const confirmCosts = serverCosts ?? localCosts

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
          electricityOptions: electricityOptionsOf(found),
          fbMarketingCoasts: toNum(found?.fbMarketingCoasts),
          ingMarketingCoasts: toNum(found?.ingMarketingCoasts),
          fbIngMarketingCoasts: toNum(found?.fbIngMarketingCoasts),
          // Ručno uploadovan dokument ima prednost; inače idu generisani uslovi
          termsPdfUrl: found?.termsPdfUrl || found?.generatedTermsUrl || null,
        })
        setEventName((found?.title || found?.name || '').toString())
        setEventAddress((found?.eventAddress || '').toString())

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

  // Predračun javlja i razloge zbog kojih upis ne bi prošao (mesto van zona,
  // neodređena cena) — bolje da ih izlagač vidi pre potvrde nego posle slanja.
  const readyToConfirm = (isPackageUser || (!sessionExpired && !!selectedStand && !!lockId))
    && quoteBlockers.length === 0

  if (loading) {
    return (
      <div className="mt-48 w-full grid place-items-center">
        <div className="text-[#261A54]">Učitavanje mape...</div>
      </div>
    )
  }

  /*
   * Paket korisniku mapa ne treba — mesto mu je dodeljeno ugovorom, pa ni
   * nedostatak mape nije prepreka za prijavu. Ranije ga je ovaj uslov odbijao
   * porukom „Mapa nije dostupna" na događajima bez šeme, iako mesto ima.
   */
  if (!isPackageUser && (error || !mapConfig?.map_url || !Array.isArray(mapConfig?.hotspots))) {
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

  const withElectricity = electricityOption && electricityOption !== 'none'

  // Struja se više ne vezuje za tip zone nego za pojedinačnu poziciju: po mapi
  // organizatora priključak postoji samo na označenim tezgama. Zato izbor zone
  // ne zavisi od toga da li je struja tražena — sve zone su podjednako u igri,
  // a dozvoljenost priključka se proverava na izabranom štandu.
  const candidateZones = zonesWithRanges
  /**
   * Dok štand nije izabran, priključak se ne ograničava.
   *
   * `standAllowsElectricity` vraća `false` kad broj štanda nije prosleđen — što
   * je tačno za pitanje „da li na ovom mestu ima struje", ali pogrešno na
   * početku, jer se modal sa opcijama otvara odmah pri učitavanju mape, pre
   * nego što je izlagač išta izabrao. Zbog toga su mu se opcije javljale kao
   * nedostupne iako ih događaj nudi.
   */
  const electricityAllowedHere = selectedStand == null
    ? true
    : standAllowsElectricity(zonesWithRanges, selectedStand)

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

  /**
   * Da li zona prima izlagača iz njegove grupe delatnosti.
   *
   * Poredi se veza ka grupi — isto pravilo kao na backendu, da korisnik ne bi
   * video mesto kao slobodno pa dobio odbijenicu tek pri slanju.
   *
   * Poređenje po nazivu ostaje samo za zone bez veze (starije, koje migracija
   * nije prepoznala). Ono ne ume da razlikuje grupe koje dele reč — „Hrana i
   * piće", „Hrana sa pripremom na bazaru" i „Hrana i rukotvorci bez suhomesnatih
   * proizvoda" sve sadrže „hrana" — pa je namerno poslednja opcija.
   */
  const zoneAllowsUser = (zone) => {
    const zoneGroupId = zone?.activity_group_id
    const userGroupId = user?.activity_group?.id

    if (zoneGroupId != null) {
      return userGroupId != null && Number(zoneGroupId) === Number(userGroupId)
    }

    // „Ostalo" prolazi svuda samo u ovoj grani — zona sa vezom traži tačno
    // podudaranje, kako radi i backend.
    if (userGroupKey === 'ostalo') return true

    const cat = normalizeLabel(zone?.zone_category)
    if (!cat) return true

    return cat.includes(userGroupKey)
  }

  const standAllowed = (standNo) => {
    if (isPackageUser) return { ok: false, reason: 'Imate aktivan paket. Mesto se dodeljuje automatski.' }
    // Ako nema zona — svako može birati bez obzira na grupu delatnosti
    const imaGrupu = user?.activity_group?.id != null || !!userGroupKey
    if (!imaGrupu && candidateZones.length > 0) {
      return { ok: false, reason: 'Molimo odaberite grupu delatnosti u profilu.' }
    }

    if (candidateZones.length > 0) {
      const z = findZonesForStand(standNo)
      /**
       * Štand koji nijedna zona ne pokriva se ne može izabrati.
       *
       * Ranije je takav štand prolazio kao „bez ograničenja", pa je bio
       * dostupan svakoj delatnosti, dozvoljavao struju bilo gde i naplaćivao
       * nula dinara kotizacije — jer se cena uzima iz zone. Na ovoj šemi je
       * takvih 46 kutija, pa je to bila rupa kroz koju se mesto moglo uzeti
       * besplatno.
       *
       * Provera važi samo kad događaj uopšte ima zone sa opsezima; događaji
       * bez zona i dalje nemaju ograničenja.
       */
      if (z.length === 0) {
        return { ok: false, reason: 'Ovo mesto nije u ponudi za ovaj događaj.' }
      }

      const allowed = z.some((zone) => zoneAllowsUser(zone))

      if (!allowed) return { ok: false, reason: 'Mesto nije dostupno za vašu delatnost.' }
    }

    /**
     * Kad je priključak tražen, mesta bez struje se ne mogu izabrati.
     *
     * Ranije se izbor struje uopšte nije uzimao u obzir pri označavanju mapa —
     * izlagač bi izabrao priključak, pa mesto koje ga nema, i tek bi mu se u
     * modalu javilo da tu nije moguće. Sada takva mesta odmah stoje kao
     * nedostupna, pa se vidi šta se uopšte može uzeti.
     */
    if (electricityOption && electricityOption !== 'none'
        && !standAllowsElectricity(zonesWithRanges, standNo)) {
      return { ok: false, reason: 'Na ovom mestu nema strujnog priključka.' }
    }

    return { ok: true, reason: null }
  }

  return (
    <div className="mt-72 w-full grid place-items-center bg-[#F0F0F0] pb-32">
      {/* `min-w-0` je uslov, ne ukras. Ovo je ćelija mreže, a takve po
          podrazumevanom `min-width: auto` ne mogu da se skupe ispod širine
          sadržaja. Mapa štandova unutra ima `min-width: 900px` — namerno, jer
          se skroluje vodoravno — pa je celu stranicu razvlačila na 932px i
          gurala „Nazad" i traku sa dugmadima van ekrana. Sa `min-w-0` skrol
          ostaje na mapi, gde mu je i mesto. */}
      <div className="w-full min-w-0 max-w-[1440px] px-4 pt-6">
        <div className="flex items-center justify-between mb-6">
          <div className="text-[#261A54] text-2xl font-bold">Izaberite mesto</div>
          <Button type="outlined-dark" name="Nazad" onClick={() => router.back()} />
        </div>

        {/* Adresa događaja — u dizajnu stoji ispod naslova, uz tirkiznu oznaku
            mesta. Podatak dolazi sa događaja (`eventAddress`). */}
        {eventAddress && (
          <div className="flex items-center mb-6" style={{ gap: '16px' }}>
            <svg width="27" height="37" viewBox="0 0 24 33" fill="#56C4CF" aria-hidden="true">
              <path d="M12 0C5.4 0 0 5.4 0 12c0 9 12 21 12 21s12-12 12-21c0-6.6-5.4-12-12-12zm0 16.5a4.5 4.5 0 1 1 0-9 4.5 4.5 0 0 1 0 9z" />
            </svg>
            <span className="text-[#261A54]" style={{ fontSize: '31px' }}>{eventAddress}</span>
          </div>
        )}

        {/* Legenda — mereno na izvozu 243 × 249 na okviru od 1920 */}
        {/* Boja se zadaje izričito — klasa `bg-white` u ovom projektu nije bela
            (`tailwind.config.ts` je `white` postavio na #F0F0F0), pa bi kartica
            bila iste boje kao pozadina strane i ne bi se videla. */}
        <div className="mb-6" style={{ background: '#ffffff', width: '236px', minHeight: '242px', padding: '55px 40px 0' }}>
          <div className="text-[#261A54] font-bold" style={{ fontSize: '33px', lineHeight: 1 }}>Legenda</div>
          <div className="flex items-center" style={{ gap: '17px', marginTop: '48px' }}>
            <span style={{ width: '45px', height: '23px', background: '#F27D14', flexShrink: 0 }} />
            <span className="text-[#261A54]" style={{ fontSize: '21px' }}>Rezervisano</span>
          </div>
          <div className="flex items-center" style={{ gap: '17px', marginTop: '25px' }}>
            <span style={{ width: '45px', height: '23px', background: '#ffffff', border: '1px solid #C5C4C2', flexShrink: 0 }} />
            <span className="text-[#261A54]" style={{ fontSize: '21px' }}>Slobodno</span>
          </div>
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
          {/* Paket korisniku se mapa ne prikazuje — ne bira mesto, pa bi gledao
              šemu na kojoj je sve nedostupno. Umesto nje stoji njegov štand. */}
          {isPackageUser ? (
            <div className="p-8 text-center">
              <div style={{ fontSize: '13px', color: '#56C4CF', fontWeight: '600', letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: '6px' }}>
                Vaše mesto po ugovoru
              </div>
              <div style={{ fontSize: '44px', fontWeight: '800', color: '#261A54', lineHeight: 1 }}>
                {packageStandNumber ?? '—'}
              </div>
              <div className="text-[#555] mt-3">
                {packageStandNumber
                  ? 'Mesto je dodeljeno paketom, pa ga ne birate na mapi.'
                  : 'Broj mesta još nije upisan u ugovor. Obratite se organizatoru.'}
              </div>
            </div>
          ) : (
          <div className="w-full overflow-x-auto overflow-y-hidden rounded-t-2xl">
            <div ref={mapContainerRef} className="relative" style={{ minWidth: '900px' }}>
              <img
                src={mapConfig.map_url}
                alt="Mapa štandova"
                onLoad={(e) => {
                  const w = e.currentTarget.naturalWidth
                  const h = e.currentTarget.naturalHeight
                  if (w > 0 && h > 0) setMapNatural({ w, h })
                }}
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
                      left: `${Number(r.x) * mapScale + overlayOffset.x}px`,
                      top: `${Number(r.y) * mapScale + overlayOffset.y}px`,
                      width: `${Number(r.width) * mapScale}px`,
                      height: `${Number(r.height) * mapScale}px`,
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
          )}

          <div className="p-6 border-t border-gray-200">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="text-sm text-[#261A54]">
                {isPackageUser ? (
                  <div>
                    Mesto po paketu: <span className="font-semibold">{packageStandNumber ?? '—'}</span>
                  </div>
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
        electricityOptions={eventDetails?.electricityOptions ?? []}
        electricityAllowed={electricityAllowedHere}
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
        // Paket korisnik ne bira mesto, ali u potvrdi treba da vidi koje dobija.
        selectedStand={standZaObracun}
        // U dizajnu naslov nosi i broj izabrane tezge („Da li želite da
        // rezervišete tezgu XYZ?"), pa izlagač pred potvrdu vidi šta tačno
        // uzima. Ranije je pisalo samo „…da potvrdite rezervaciju?".
        title={standZaObracun ? `Da li želite da rezervišete tezgu ${standZaObracun}?` : 'Da li želite da rezervišete tezgu?'}
        eventName={eventName}
        onConfirm={confirmReservation}
        onCancel={() => setIsConfirmModalOpen(false)}
        isLoading={isSubmittingReservation}
        successMessage={reservationSuccess}
        errorMessage={reservationError || quoteBlockers[0] || null}
        onDismissMessage={() => {
          setReservationError(null)
          setReservationSuccess(null)
        }}
        costs={confirmCosts}
        coveredByPackage={gratisPokriva}
        timeRemaining={!isPackageUser && !sessionExpired ? sessionSecondsLeft : null}
        // Potvrda posle uspešnog slanja imenuje baš tezgu za koju je zahtev
        // poslat. U dizajnu dugme vraća na mapu, ali je dogovoreno da izlagača
        // odvede na „Moje rezervacije", gde odmah vidi i ovu novu među aktivnim
        // — pa natpis prati to, da ne obećava povratak na mapu.
        standSuccessLabel="Pogledajte rezervacije"
        onStandSuccess={() => {
          setIsConfirmModalOpen(false)
          setReservationSuccess(null)
          router.push('/moje-rezervacije')
        }}
      />
    </div>
  )
}

export default ReservationMapPage
