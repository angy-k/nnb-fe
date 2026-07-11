/**
 * Shared date parsing and formatting utilities.
 * Handles both the current API format (dd.MM.yyyy, dd.MM.yyyy HH:mm)
 * and legacy formats (d MMM yyyy HH:mm) for backward compatibility.
 */
import { parse, isValid, format } from 'date-fns'

const PARSE_FORMATS = [
  // Current API format (PHP d.m.Y H:i)
  'dd.MM.yyyy HH:mm',
  'd.MM.yyyy HH:mm',
  'dd.MM.yyyy',
  'd.MM.yyyy',
  // Legacy formats (old API)
  'd MMM yyyy HH:mm',
  'd M yyyy HH:mm',
  'dd MMM yyyy HH:mm',
  'dd M yyyy HH:mm',
  'd MMM yyyy',
  'd M yyyy',
  'dd MMM yyyy',
  'dd M yyyy',
]

/** Parse a date string using known API formats, fallback to native Date. */
export function parseDate(dateStr) {
  if (!dateStr) return null
  const s = String(dateStr).trim()
  if (!s) return null
  for (const fmt of PARSE_FORMATS) {
    try {
      const d = parse(s, fmt, new Date())
      if (isValid(d)) return d
    } catch {}
  }
  // Fallback: native Date (handles ISO 8601 strings)
  const d = new Date(s)
  return isValid(d) ? d : null
}

/** Format any API date string as dd.MM.yyyy */
export function formatDate(dateStr) {
  if (!dateStr) return ''
  const d = parseDate(dateStr)
  if (!d) return String(dateStr)
  return format(d, 'dd.MM.yyyy')
}

/** Format any API date string as dd.MM.yyyy HH:mm */
export function formatDateTime(dateStr) {
  if (!dateStr) return ''
  const d = parseDate(dateStr)
  if (!d) return String(dateStr)
  return format(d, 'dd.MM.yyyy HH:mm')
}
