import { parse, add, startOfToday } from 'date-fns'

const DATE_TIME_FORMATS = [
  'dd.MM.yyyy HH:mm', 'd.MM.yyyy HH:mm',
  'd MMM yyyy HH:mm', 'd M yyyy HH:mm',
  'dd MMM yyyy HH:mm', 'dd M yyyy HH:mm',
]

const DATE_ONLY_FORMATS = [
  'dd.MM.yyyy', 'd.MM.yyyy',
  'd MMM yyyy', 'd M yyyy',
  'dd MMM yyyy', 'dd M yyyy',
]

export function parseWithFallbacks(value, formats) {
  const raw = (value ?? '').toString().trim()
  if (!raw) return null
  for (const fmt of formats) {
    const d = parse(raw, fmt, new Date())
    if (!Number.isNaN(d?.getTime?.())) return d
  }
  return null
}

export function parseEventDateTime(value) {
  return parseWithFallbacks(value, DATE_TIME_FORMATS)
}

export function parseEventDate(value) {
  return parseWithFallbacks(value, [...DATE_TIME_FORMATS, ...DATE_ONLY_FORMATS])
}

/** "18:00" + "01:00" → Date objekti za taj dan; kraj koji je pre početka prelazi u sutra */
function buildDayRange(dateStr, startTime, endTime) {
  const base = parseWithFallbacks(dateStr, DATE_ONLY_FORMATS)
  if (!base) return null

  const applyTime = (time) => {
    if (!time) return null
    const [h, m] = String(time).split(':').map((n) => parseInt(n, 10))
    if (Number.isNaN(h)) return null
    const d = new Date(base)
    d.setHours(h, Number.isNaN(m) ? 0 : m, 0, 0)
    return d
  }

  const start = applyTime(startTime) ?? base
  let end = applyTime(endTime)

  // Događaj koji se završava posle ponoći (18:00–01:00) pripada narednom danu
  if (end && end <= start) {
    end = add(end, { days: 1 })
  }

  return { start, end: end ?? add(start, { hours: 1 }) }
}

export function eventVariant(item) {
  if (item?.eventType === 'startup_bazar') return 'startup'
  if (item?.eventType === 'nocni_bazar_mesto') return 'away'
  return 'regular'
}

/**
 * Pretvara listu događaja iz API-ja u kalendarske stavke — po jednu za svaki dan.
 *
 * Višednevni događaj daje N stavki, pa kalendar prirodno crta bedž po danu.
 * Jednodnevni daje jednu. Događaj bez `days[]` (stariji API) pada nazad na `dateTime`.
 *
 * Vraća `{ items, detailsById }`, gde je ključ složeni `"eventId:dayId"`, a vrednost
 * ceo događaj proširen sa `_day` (izabrani dan) i `_dayLabel` (naslov za popup).
 */
export function buildCalendarItems(items) {
  const today = startOfToday()
  const detailsById = {}

  const calendarItems = (items ?? []).flatMap((item) => {
    if (item?.isActive === false) return []

    const eventId = (item?.id ?? '').toString()
    if (!eventId) return []

    const title = (item?.title ?? item?.name ?? '').toString()
    const variant = eventVariant(item)
    const days = Array.isArray(item?.days) ? item.days : []

    // Fallback za događaje bez definisanih dana
    if (days.length === 0) {
      const start = parseEventDateTime(item?.dateTime)
      if (!start) return []

      const key = eventId
      detailsById[key] = { ...item, _day: null, _dayLabel: title, _totalDays: 1 }

      return [{
        id: key,
        title,
        start_date: start,
        end_date: add(start, { hours: 1 }),
        variant,
        isPast: start < today,
      }]
    }

    return days.flatMap((day) => {
      const range = buildDayRange(day?.date, day?.startTime, day?.endTime)
      if (!range) return []

      const key = `${eventId}:${day.id}`
      const label = day?.label || (days.length > 1 ? `${title} — ${day.dayNumber}. dan` : title)

      detailsById[key] = {
        ...item,
        _day: day,
        _dayLabel: label,
        _totalDays: days.length,
      }

      return [{
        id: key,
        title: label,
        start_date: range.start,
        end_date: range.end,
        variant,
        isPast: range.start < today,
      }]
    })
  })

  return { items: calendarItems, detailsById }
}
