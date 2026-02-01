import { csrf } from '@/services/csrfService'
import { parse } from 'cookie'

const base_url = `${process.env.NEXT_PUBLIC_BACKEND_URL}`

const base_headers = (type = null) => {
  const isBrowser = typeof window !== 'undefined'

  if (type === 'multipart') {
    return {
      Accept: 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
      ...(isBrowser ? {} : { Referer: process.env.NEXT_PUBLIC_APP_URL })
    }
  }

  return {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
    ...(isBrowser ? {} : { Referer: process.env.NEXT_PUBLIC_APP_URL })
  }
}

export const extractAuthHeadersFromRequestHeaders = reqHeaders => {
  let headers = {}
  const token = (() => {
    const { 'XSRF-TOKEN': token } = parse(reqHeaders.get('cookie') || '')
    if (!token) return token
    try {
      return decodeURIComponent(token)
    } catch {
      return token
    }
  })()

  if(reqHeaders.get('cookie')) {
    headers['Cookie'] = reqHeaders.get('cookie')
  }

  if (token) {
    headers['X-XSRF-TOKEN'] = token
  }
  return headers
}

function getCSRFValue() {
  const { 'XSRF-TOKEN': token } = parse(document.cookie || '')

  if (!token) return token
  try {
    return decodeURIComponent(token)
  } catch {
    return token
  }
}

export const get = (
  path, 
  { queryParams = {}, config = {}, next = {}, cache = 'force-cache' } = {}
) => {
  const isBrowser = typeof window !== 'undefined'
  let url = `${base_url}${path}`
  if (Object.keys(queryParams).length > 0) {
    url +=
    '?' +
    new URLSearchParams(
      Object.fromEntries(
        Object.entries(queryParams).filter(([_, v]) => v != null),
      ),
    )
  }

  return fetch(url, {
    headers: { ...base_headers(), ...config.headers },
    credentials: config.credentials ?? 'include',
    redirect: config.redirect ?? (isBrowser ? 'manual' : 'follow'),
    next,
    cache
  })
}

export const post = async (
  path,
  data = {},
  {
    queryParams = {},
    config = {},
    withCSRF = false,
    preBuiltURL = false,
    type = null
  } = {},
) => {
  const isBrowser = typeof window !== 'undefined'
  let url

  if (preBuiltURL) {
    url = path
  } else {
    url = `${base_url}${path}`
    if (Object.keys(queryParams).length > 0) {
      url +=
      '?' +
      new URLSearchParams(
        Object.fromEntries(
          Object.entries(queryParams).filter(([_,v]) => v != null),
        ),
      )
    }
  }

  if (withCSRF) {
    await csrf()
    if (!config.headers) {
      config.headers = {}
    }
    config.headers['X-XSRF-TOKEN'] = getCSRFValue()
  }

  if (type !== 'multipart') {
    data = JSON.stringify(data)
  }

  return fetch(url, {
    method: 'POST',
    headers: {...base_headers(type), ...config.headers },
    body: data,
    credentials: config.credentials ?? 'include',
    redirect: config.redirect ?? (isBrowser ? 'manual' : 'follow'),
  })
}

export const del = async (
  path,
  data = {},
  {
    queryParams = {},
    config = {},
    withCSRF = false,
    preBuiltURL = false,
    type = null,
  } = {}
) => {
  const isBrowser = typeof window !== 'undefined'
  let url
  url = `${base_url}${path}`
  if(Object.keys(queryParams).length > 0) {
    url +=
    '?' +
    new URLSearchParams(
      Object.fromEntries(
        Object.entries(queryParams).filter(([_, v]) => v != null),
      )
    )
  }

  if (withCSRF) {
    await get('/sanctum/csrf-cookie')
    if (!config.headers) {
      config.headers = {}
    }
    config.headers['X-XSRF-TOKEN'] = getCSRFValue()
  }

  return fetch(url, {
    method: 'DELETE',
    headers: { ...base_headers(type), ...config.headers },
    credentials: config.credentials ?? 'include',
    redirect: config.redirect ?? (isBrowser ? 'manual' : 'follow'),
  })
}
