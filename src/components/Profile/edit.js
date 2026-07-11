'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Avatar } from '@nextui-org/avatar'
import ProfileGallery from './gallery'
import useUser from '@/data/use-user'
import profileService from '@/services/profileService'

// ─── Inline editable field ────────────────────────────────────────────────────
const EditableField = ({ value, onChange, placeholder, type = 'text', readOnly = false, filterInput = null, validate = null }) => {
  const [editing, setEditing] = useState(false)
  const [fieldError, setFieldError] = useState(null)
  const inputRef = useRef(null)

  const handlePencilClick = () => {
    if (readOnly) return
    setEditing(true)
    setTimeout(() => inputRef.current?.focus(), 0)
  }

  const handleChange = (raw) => {
    const val = filterInput ? filterInput(raw) : raw
    onChange(val)
    // clear error while typing so it doesn't block mid-entry (e.g. "+381")
    if (validate && fieldError) setFieldError(validate(val))
  }

  const handleBlur = () => {
    setEditing(false)
    if (validate) setFieldError(validate(value))
  }

  return (
    <div className="flex flex-col gap-1 w-full">
      <div className="flex items-center justify-between bg-[#ffffff] rounded-full px-5 py-3 gap-3 w-full">
        {editing ? (
          <input
            ref={inputRef}
            type={type}
            value={value}
            onChange={(e) => handleChange(e.target.value)}
            onBlur={handleBlur}
            className="flex-1 outline-none focus:ring-0 border-0 focus:border-0 text-[#261A54] text-sm bg-transparent"
            style={{ boxShadow: 'none', border: 'none', padding: 0 }}
            placeholder={placeholder}
          />
        ) : (
          <span className={`flex-1 text-sm ${value ? 'text-[#261A54]' : 'text-[#aaa]'}`}>
            {value || placeholder}
          </span>
        )}
        <button
          type="button"
          onClick={handlePencilClick}
          disabled={readOnly}
          className={`flex-shrink-0 transition ${readOnly ? 'text-[#261A54] opacity-20 cursor-default' : 'text-[#261A54] opacity-60 hover:opacity-100 cursor-pointer'}`}
          aria-label="Izmeni"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
          </svg>
        </button>
      </div>
      {fieldError && (
        <p className="text-xs pl-5" style={{ color: '#EC4923' }}>{fieldError}</p>
      )}
    </div>
  )
}

// ─── Section ──────────────────────────────────────────────────────────────────
const Section = ({ title, children }) => (
  <div className="flex flex-col gap-3 w-full">
    <span className="edit-profile-subtitle">{title}</span>
    {children}
  </div>
)

// ─── ProfileEdit ──────────────────────────────────────────────────────────────
const ProfileEdit = () => {
  const router = useRouter()
  const { user, mutate } = useUser()

  // Podaci o vlasniku
  const [brandName, setBrandName] = useState(user?.name || '')
  const [firstName, setFirstName] = useState(user?.first_name || '')
  const [lastName, setLastName] = useState(user?.last_name || '')
  const [phone, setPhone] = useState(user?.phone_number || '')
  const [address, setAddress] = useState(user?.address || '')
  const [dateOfBirth, setDateOfBirth] = useState(user?.date_of_birth || '')

  // Podaci o firmi
  const [companyName, setCompanyName] = useState(user?.legal_entity?.company_name || '')
  const [companyAddress, setCompanyAddress] = useState(user?.legal_entity?.company_address || '')
  const [mb, setMb] = useState(user?.legal_entity?.mb || '')
  const [pib, setPib] = useState(user?.legal_entity?.pib || '')
  const [isSefUser, setIsSefUser] = useState(!!user?.legal_entity?.is_sef_user)

  // Social
  const [facebook, setFacebook] = useState(user?.facebook || '')
  const [instagram, setInstagram] = useState(user?.instagram || '')

  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const [avatarPreview, setAvatarPreview] = useState(null)
  const [avatarUploading, setAvatarUploading] = useState(false)
  const [avatarError, setAvatarError] = useState(null)
  const fileInputRef = useRef(null)

  // Sync state kada user učita podatke (SWR async)
  useEffect(() => {
    if (user) {
      setBrandName(prev => prev || user.name || '')
      setFirstName(prev => prev || user.first_name || '')
      setLastName(prev => prev || user.last_name || '')
      setPhone(prev => prev || user.phone_number || '')
      setAddress(prev => prev || user.address || '')
      setDateOfBirth(prev => prev || user.date_of_birth || '')
      setCompanyName(prev => prev || user.legal_entity?.company_name || '')
      setCompanyAddress(prev => prev || user.legal_entity?.company_address || '')
      setMb(prev => prev || user.legal_entity?.mb || '')
      setPib(prev => prev || user.legal_entity?.pib || '')
      setIsSefUser(!!user.legal_entity?.is_sef_user)
      setFacebook(prev => prev || user.facebook || '')
      setInstagram(prev => prev || user.instagram || '')
    }
  }, [user])

  const fullName = [firstName, lastName].filter(Boolean).join(' ')
  const setFullName = (val) => {
    const parts = val.split(' ')
    setFirstName(parts[0] || '')
    setLastName(parts.slice(1).join(' ') || '')
  }

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setAvatarError(null)
    setAvatarPreview(URL.createObjectURL(file))
    setAvatarUploading(true)
    try {
      const res = await profileService.uploadAvatar(file)
      if (res.ok) {
        const data = await res.json()
        setAvatarPreview(data.profile_photo_url || null)
        await mutate?.()
      } else {
        const errData = await res.json().catch(() => null)
        const msg = errData?.message || 'Greška pri upload-u slike. Pokušajte ponovo.'
        setAvatarError(msg)
        setAvatarPreview(null)
      }
    } catch {
      setAvatarError('Greška pri upload-u slike. Pokušajte ponovo.')
      setAvatarPreview(null)
    } finally {
      setAvatarUploading(false)
      // Reset file input so the same file can be re-selected after error
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const handleSave = async () => {
    setSaving(true)
    setError(null)
    setSuccess(false)
    try {
      const payload = {}
      if (brandName && brandName !== user?.name) payload.name = brandName
      if (firstName !== (user?.first_name || '')) payload.first_name = firstName
      if (lastName !== (user?.last_name || '')) payload.last_name = lastName
      if (dateOfBirth !== (user?.date_of_birth || '')) payload.birth_date = dateOfBirth
      if (phone !== (user?.phone_number || '')) payload.phone_number = phone
      if (address !== (user?.address || '')) payload.address = address
      if (companyName !== (user?.legal_entity?.company_name || '')) payload.company_name = companyName
      if (companyAddress !== (user?.legal_entity?.company_address || '')) payload.company_address = companyAddress
      if (mb !== (user?.legal_entity?.mb || '')) payload.mb = mb
      if (pib !== (user?.legal_entity?.pib || '')) payload.pib = pib
      if (isSefUser !== !!user?.legal_entity?.is_sef_user) payload.is_sef_user = isSefUser
      if (facebook !== (user?.facebook || '')) payload.facebook = facebook
      if (instagram !== (user?.instagram || '')) payload.instagram = instagram

      if (Object.keys(payload).length === 0) {
        router.push('/profil')
        return
      }

      const res = await profileService.updateProfile(payload)
      if (res.ok || res.status === 200 || res.type === 'opaqueredirect') {
        await mutate?.()
        setSuccess(true)
        setTimeout(() => router.push('/profil'), 900)
      } else {
        const data = await res.json().catch(() => null)
        if (data?.errors) {
          // Laravel 422 validation errors — flatten all field messages into one string
          const messages = Object.values(data.errors).flat()
          setError(messages.join(' '))
        } else {
          setError(data?.message || 'Greška pri čuvanju. Pokušajte ponovo.')
        }
      }
    } catch (e) {
      setError('Greška pri čuvanju. Pokušajte ponovo.')
    } finally {
      setSaving(false)
    }
  }

  // Resolve avatar — prefer local preview, then real URL, then null (shows initials)
  const avatarSrc = (() => {
    if (avatarPreview) return avatarPreview
    const img = user?.profile_photo_url
    if (typeof img === 'string' && img.length > 0) return img
    return null
  })()

  const account = {
    gallery_images: user?.gallery_images || [],
    gallery_videos: user?.gallery_videos || [],
  }

  return (
    <>
      {/* ── Header — paddingTop gura sadržaj ispod fixed nava ── */}
      <div className="w-full bg-[#261A54]" style={{ paddingTop: '260px', paddingBottom: '50px' }}>
        <div className="max-w-[1400px] w-full mx-auto px-6 flex items-end justify-between gap-6">

          {/* Avatar + brand name */}
          <div className="flex items-end gap-6">
            {/* Avatar with upload overlay */}
            <div className="flex flex-col items-center gap-2" style={{ marginBottom: '-56px' }}>
              <div className="relative flex-shrink-0 group z-10">
                <Avatar
                  isBordered
                  showFallback
                  src={avatarSrc || undefined}
                  name={user?.name || 'U'}
                  radius="full"
                  className="w-[150px] h-[150px] text-2xl bg-[#3d2f7a] border-4 border-white"
                />
                <label
                  htmlFor="avatar-upload"
                  className="absolute inset-0 flex flex-col items-center justify-center rounded-full bg-black/40 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  {avatarUploading ? (
                    <span className="text-white text-[10px] font-medium">Učitava...</span>
                  ) : (
                    <>
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                        <circle cx="12" cy="13" r="4"/>
                      </svg>
                      <span className="text-white text-[10px] mt-1 font-medium">Dodajte logo</span>
                    </>
                  )}
                </label>
                {/* Visible camera badge so user knows avatar is clickable */}
                <label
                  htmlFor="avatar-upload"
                  className="absolute bottom-1 right-1 w-8 h-8 rounded-full flex items-center justify-center cursor-pointer group-hover:opacity-0 transition-opacity"
                  style={{ background: '#56C4CF' }}
                  title="Promenite profilnu sliku"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                    <circle cx="12" cy="13" r="4"/>
                  </svg>
                </label>
                <input
                  id="avatar-upload"
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
              </div>
              {avatarError && (
                <p className="text-[11px] text-center max-w-[160px]" style={{ color: '#EC4923' }}>{avatarError}</p>
              )}
            </div>

            {/* Inline editable brand name */}
            <div className="flex flex-col gap-1 pb-2">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  className="bg-transparent text-3xl font-bold leading-tight outline-none border-b border-transparent focus:border-[#56C4CF]/60 transition min-w-[100px] py-0 h-[38px]"
                  style={{ color: '#ffffff' }}
                  placeholder="Naziv brenda"
                />
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-60 flex-shrink-0">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
              </div>
              <span className="text-base" style={{ color: 'rgba(255,255,255,0.6)' }}>
                {user?.activity?.name || user?.activity_group?.name || ''}
              </span>
            </div>
          </div>

          {/* Save button */}
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2.5 rounded-full text-sm font-semibold flex-shrink-0 hover:opacity-90 transition disabled:opacity-60 mb-2"
            style={{ color: '#ffffff', backgroundColor: '#56C4CF' }}
          >
            {saving ? 'Čuvanje...' : success ? 'Sačuvano ✓' : 'Sačuvajte izmene'}
          </button>
        </div>

      </div>

      {/* ── Forma ── */}
      <div className="w-full bg-[#f5f5f5] pb-24 overflow-hidden" style={{ paddingTop: '56px' }}>
        {error && (
          <div className="max-w-[1400px] mx-auto px-6 pt-4">
            <p className="text-sm rounded-lg px-4 py-2 bg-red-50" style={{ color: '#EC4923' }}>{error}</p>
          </div>
        )}
        <div className="max-w-[1400px] mx-auto px-6 pt-8 pb-4 grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* Podaci o vlasniku */}
          <Section title="Podaci o vlasniku">
            <EditableField
              value={fullName}
              onChange={setFullName}
              placeholder="Ime i prezime"
            />
            <EditableField
              value={user?.email || ''}
              onChange={() => {}}
              placeholder="Email"
              readOnly
            />
            <EditableField
              value="••••••••"
              onChange={() => {}}
              placeholder="Lozinka"
              readOnly
            />
            <EditableField
              value={phone}
              onChange={setPhone}
              placeholder="Telefon"
              filterInput={(val) => val.replace(/[^0-9+\-\s()]/g, '')}
              validate={(val) => {
                if (!val) return null
                if (!/^[0-9+\-\s()]{5,20}$/.test(val)) return 'Unesite validan broj telefona'
                return null
              }}
            />
            <EditableField
              value={address}
              onChange={setAddress}
              placeholder="Adresa"
            />
            <EditableField
              value={dateOfBirth}
              onChange={setDateOfBirth}
              placeholder="Datum rodjenja"
              type="date"
            />
            <EditableField
              value={facebook}
              onChange={setFacebook}
              placeholder="Facebook link"
              validate={(val) => {
                if (!val) return null
                try { new URL(val) } catch { return 'Unesite validan URL' }
                if (!val.includes('facebook.com')) return 'Link mora biti sa facebook.com'
                return null
              }}
            />
            <EditableField
              value={instagram}
              onChange={setInstagram}
              placeholder="Instagram link"
              validate={(val) => {
                if (!val) return null
                try { new URL(val) } catch { return 'Unesite validan URL' }
                if (!val.includes('instagram.com')) return 'Link mora biti sa instagram.com'
                return null
              }}
            />
          </Section>

          {/* Podaci o firmi */}
          <Section title="Podaci o firmi">
            <EditableField
              value={companyName}
              onChange={setCompanyName}
              placeholder="Naziv firme"
            />
            <EditableField
              value={companyAddress}
              onChange={setCompanyAddress}
              placeholder="Adresa firme"
            />
            <EditableField
              value={mb}
              onChange={setMb}
              placeholder="MB: matični broj"
              filterInput={(val) => val.replace(/\D/g, '')}
              validate={(val) => {
                if (!val) return null
                if (!/^\d{8}$/.test(val)) return 'Matični broj mora imati tačno 8 cifara'
                return null
              }}
            />
            <EditableField
              value={pib}
              onChange={setPib}
              placeholder="PIB"
              filterInput={(val) => val.replace(/\D/g, '')}
              validate={(val) => {
                if (!val) return null
                if (!/^\d{9}$/.test(val)) return 'PIB mora imati tačno 9 cifara'
                return null
              }}
            />
            {/* SEF checkbox — pojavljuje se samo ako korisnik ima pravno lice */}
            {(companyName || mb || pib) && (
              <label
                className="flex items-center gap-3 cursor-pointer"
                onClick={() => setIsSefUser(v => !v)}
              >
                <div
                  className="w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors"
                  style={{
                    borderColor: isSefUser ? '#56C4CF' : '#d1d5db',
                    backgroundColor: isSefUser ? '#56C4CF' : 'transparent',
                  }}
                >
                  {isSefUser && (
                    <svg width="11" height="8" viewBox="0 0 11 8" fill="none">
                      <path d="M1 4L4 7L10 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </div>
                <span className="text-sm text-[#261A54] select-none">
                  Korisnik sam SEF-a (Sistem elektronskih faktura)
                </span>
              </label>
            )}
          </Section>
        </div>

        {/* Galerija */}
        <div className="max-w-[1400px] mx-auto px-6">
          <ProfileGallery account={account} editable={true} />
        </div>
      </div>
    </>
  )
}

export default ProfileEdit
