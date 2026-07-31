const serbianMap = { š: 's', ć: 'c', č: 'c', ž: 'z', đ: 'dj' }
const replaceCharacters = (str, from, to) =>
  str.split(from).join(to)
const formatTitleForUri = (title) => {
  const raw = Array.isArray(title) ? title.join(' ') : title
  let s = (raw ?? '').toString()
  Object.entries(serbianMap).forEach(([k, v]) => { s = s.split(k).join(v) })
  const normalized = s.replace(/\s*[-–—]\s*/g, '-')
  return replaceCharacters(normalized, ' ', '-')
    .replace(/,/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '')
    .toLowerCase()
}

const BASE_URL = process.env.NEXT_PUBLIC_URL || 'https://nocnibazar.rs'
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://admin.nocnibazar.rs'

const STATIC_PAGES = [
  '/',
  '/o-nama',
  '/blog',
  '/dogadjaji',
  '/galerija',
  '/galerija/fotografije',
  '/galerija/video',
  '/kontakt',
  '/prijatelji',
  '/mapa-nocnog-bazara-u-novom-sadu',
  '/kalendar-dogadjaja',
  '/politika-privatnosti',
  '/projekti',
]

// Stranice isključene iz sitemape: /paketi, /profil, /moje-rezervacije, /prethodne-rezervacije

async function fetchItems(path) {
  try {
    const res = await fetch(`${BACKEND_URL}${path}`, { next: { revalidate: 3600 } })
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

export default async function sitemap() {
  const now = new Date()

  const staticEntries = STATIC_PAGES.map(path => ({
    url: `${BASE_URL}${path}`,
    lastModified: now,
  }))

  const [blogs, projects] = await Promise.all([
    fetchItems('/api/v1/blogs'),
    fetchItems('/api/v1/projects'),
  ])

  const blogEntries = blogs.map(blog => ({
    url: `${BASE_URL}/blog/${formatTitleForUri(blog.title)}`,
    lastModified: blog.updated_at ? new Date(blog.updated_at) : now,
  }))

  const projectEntries = projects.map(project => ({
    url: `${BASE_URL}/projekti/${formatTitleForUri(project.title)}`,
    lastModified: project.updated_at ? new Date(project.updated_at) : now,
  }))

  return [...staticEntries, ...blogEntries, ...projectEntries]
}
