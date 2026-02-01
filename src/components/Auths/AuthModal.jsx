'use client'

import { useEffect, useRef, useState } from 'react'
import ReCAPTCHA from 'react-google-recaptcha'
import { Form, Formik } from 'formik'
import { Modal, ModalBody, ModalContent, ModalHeader, useDisclosure } from '@nextui-org/react'

import authService from '@/services/authService'
import activityGroupService from '@/services/activityGroupService'
import useUser from '@/data/use-user'

import MainTextInput from '@/components/Commons/MainTextInput'
import AuthValidationErrors from '@/components/Auths/AuthValidationErrors'

const DEFAULT_TAB = 'login'

const getAppEnv = () => process.env.NEXT_PUBLIC_ENV || process.env.NEXT_PUBLIC_APP_ENV

const AuthModal = ({ onSuccess, onClose }) => {
  const { mutate } = useUser()

  const {
    isOpen: isLegalDocsOpen,
    onOpen: onLegalDocsOpen,
    onOpenChange: onLegalDocsOpenChange,
    onClose: onLegalDocsClose,
  } = useDisclosure()
  const [legalDocsType, setLegalDocsType] = useState('terms')

  const [tab, setTab] = useState(DEFAULT_TAB)
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)

  const [activityGroups, setActivityGroups] = useState([])
  const [loadingActivityGroups, setLoadingActivityGroups] = useState(true)

  const recaptchaRef = useRef(null)

  useEffect(() => {
    let cancelled = false

    const load = async () => {
      try {
        setLoadingActivityGroups(true)
        const groups = await activityGroupService.getActivityGroups()
        if (!cancelled) {
          setActivityGroups(Array.isArray(groups) ? groups : [])
        }
      } catch (e) {
        if (!cancelled) {
          setActivityGroups([])
        }
      } finally {
        if (!cancelled) {
          setLoadingActivityGroups(false)
        }
      }
    }

    load()

    return () => {
      cancelled = true
    }
  }, [])

  const handleLogin = async values => {
    if (isLoading) return

    setIsLoading(true)
    setErrors({})

    try {
      const res = await authService.login({ values })
      if (res.ok) {
        await mutate()
        onSuccess?.()
        onClose?.()
        return
      }

      if (res.status === 422) {
        const data = await res.json()
        setErrors(data.errors || {})
        return
      }

      if (res.status === 401) {
        setErrors({ failed: ['Pogrešan email ili lozinka.'] })
        return
      }

      setErrors({ failed: ['Došlo je do greške. Pokušaj ponovo.'] })
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegister = async values => {
    if (isLoading) return

    setIsLoading(true)
    setErrors({})

    try {
      if (!values.terms_accepted) {
        setErrors({ terms_accepted: ['Moraš da prihvatiš uslove korišćenja i politiku privatnosti.'] })
        return
      }

      const payload = new FormData()
      payload.append('brand_name', values.brand_name || '')
      payload.append('first_name', values.first_name || '')
      payload.append('last_name', values.last_name || '')
      payload.append('birth_date', values.birth_date || '')
      payload.append('email', values.email)
      payload.append('password', values.password)
      payload.append('phone_number', values.phone_number || '')

      payload.append('activity_group_id', values.activity_group_id)
      payload.append('activity_id', values.activity_id)

      payload.append('address', values.address || '')
      payload.append('city', values.city || '')

      payload.append('is_legal_entity', values.is_legal_entity ? '1' : '0')
      payload.append('terms_accepted', values.terms_accepted ? '1' : '0')

      if (values.is_legal_entity) {
        payload.append('company_name', values.company_name || '')
        payload.append('company_address', values.company_address || '')
        payload.append('mb', values.mb || '')
        payload.append('pib', values.pib || '')
      }

      if (values.brand_logo instanceof File) {
        payload.append('brand_logo', values.brand_logo)
      }

      if (Array.isArray(values.gallery_images)) {
        values.gallery_images.forEach(file => {
          if (file instanceof File) {
            payload.append('gallery_images[]', file)
          }
        })
      }

      const appEnv = getAppEnv()
      if (!['development', 'testing'].includes(appEnv)) {
        payload.append('recaptcha_token', (await recaptchaRef.current?.getValue()) || '')
      }

      const res = await authService.registerMultipart(payload)
      if (res.ok) {
        await mutate()
        onSuccess?.()
        onClose?.()
        return
      }

      if (res.status === 422) {
        const data = await res.json()
        setErrors(data.errors || {})
        return
      }

      setErrors({ failed: ['Došlo je do greške. Pokušaj ponovo.'] })
    } finally {
      setIsLoading(false)
      const appEnv = getAppEnv()
      if (!['development', 'testing'].includes(appEnv)) {
        recaptchaRef.current?.reset?.()
      }
    }
  }

  const handleGoogleLogin = () => {
    const redirectUrl = encodeURIComponent('/')
    window.location.href = `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/social/google?redirect_url=${redirectUrl}`
  }

  return (
    <div className="w-full h-full auth-modal">

      {tab === 'login' && (
        <div className="w-full h-full flex flex-col md:flex-row lg:flex-row">
          <div
            className="hidden md:block lg:block md:w-1/2 lg:w-1/2 h-full bg-cover bg-center"
            style={{ backgroundImage: "url('/about-us-hero-image.png')" }}
          />

          <div className="w-full md:w-1/2 lg:w-1/2 h-full flex flex-col justify-center px-6 md:px-12 lg:px-12 py-10">
            <h2 className="text-white text-3xl mb-6">Prijavite se</h2>

            <button
              type="button"
              disabled={isLoading}
              className="w-full px-4 py-3 rounded-full border border-white text-white"
              onClick={handleGoogleLogin}
            >
              Prijavite se sa Google nalogom
            </button>

            <div className="my-6 text-white text-center">---- Ulogujte se putem mejla ----</div>

            <Formik
              initialValues={{
                email: '',
                password: '',
                terms_accepted: false,
              }}
              onSubmit={async values => {
                if (!values.terms_accepted) {
                  setErrors({ terms_accepted: ['Moraš da prihvatiš uslove korišćenja i politiku privatnosti.'] })
                  return
                }
                await handleLogin(values)
              }}
            >
              {({ values, setFieldValue }) => (
                <Form className="w-full">
                  <div className="mb-3">
                    <MainTextInput
                      name="email"
                      type="email"
                      error={errors.email}
                      setErrors={setErrors}
                      placeholder="E-mail"
                      className="line-flex w-full"
                    />
                  </div>

                  <div className="mb-3">
                    <MainTextInput
                      name="password"
                      type="password"
                      error={errors.password}
                      setErrors={setErrors}
                      placeholder="Lozinka"
                      className="line-flex w-full"
                    />
                  </div>

                  <div className="mb-3">
                    <label className="flex items-start gap-2 text-white">
                      <input
                        type="checkbox"
                        name="terms_accepted"
                        className="auth-legal-entity-checkbox"
                        checked={!!values.terms_accepted}
                        onChange={e => setFieldValue('terms_accepted', e.target.checked)}
                      />
                      <span>
                        Slažem se sa{' '}
                        <button
                          type="button"
                          className="underline"
                          onClick={() => {
                            setLegalDocsType('terms')
                            onLegalDocsOpen()
                          }}
                        >
                          uslovima korišćenja
                        </button>{' '}
                        i{' '}
                        <button
                          type="button"
                          className="underline"
                          onClick={() => {
                            setLegalDocsType('privacy')
                            onLegalDocsOpen()
                          }}
                        >
                          politikom privatnosti
                        </button>
                        .
                      </span>
                    </label>
                    <AuthValidationErrors className="mb-1" errors={errors.terms_accepted} />
                  </div>

                  <AuthValidationErrors className="mb-3" errors={errors.failed} />

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full px-4 py-3 rounded-full bg-white text-black"
                  >
                    Prijavite se
                  </button>

                  <div className="mt-4 text-center">
                    <button
                      type="button"
                      className="text-white underline"
                      onClick={() => {
                        setErrors({})
                        setTab('register')
                      }}
                    >
                      Nemate nalog? Registrujte se.
                    </button>
                  </div>

                  <div className="mt-3 text-center">
                    <button
                      type="button"
                      className="text-white underline"
                      onClick={() => {
                        setLegalDocsType('instructions')
                        onLegalDocsOpen()
                      }}
                    >
                      Pogledajte instrukcije za registraciju
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      )}

      {tab === 'register' && (
        <Formik
          initialValues={{
            brand_name: '',
            first_name: '',
            last_name: '',
            email: '',
            password: '',
            birth_date: '',
            is_legal_entity: false,
            mb: '',
            pib: '',
            company_name: '',
            company_address: '',
            phone_number: '',
            address: '',
            city: '',
            brand_logo: null,
            gallery_images: [],
            terms_accepted: false,
            activity_group_id: '',
            activity_id: '',
          }}
          onSubmit={handleRegister}
        >
          {({ values, setFieldValue }) => {
            const group = activityGroups.find(g => String(g.id) === String(values.activity_group_id))
            const activities = group?.activities || []

            return (
              <Form className="w-full h-full flex items-center justify-center">
                <div className="w-full lg:w-[911px] lg:h-[833px] lg:overflow-y-auto lg:mx-auto">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-3">
                    <div>
                      <h2 className="text-white text-3xl mb-6">Napravite profil</h2>

                      <button
                        type="button"
                        disabled={isLoading}
                        className="w-full px-4 py-3 rounded-full border border-white text-white mb-6"
                        onClick={handleGoogleLogin}
                      >
                        Registrujte se sa Google nalogom
                      </button>

                      <div className="mb-6 text-white text-center">---- Registrujte se putem mejla ----</div>

                      <div className="mb-3">
                        <MainTextInput
                          name="brand_name"
                          type="text"
                          error={errors.brand_name}
                          setErrors={setErrors}
                          placeholder="Naziv brenda"
                          className="line-flex w-full"
                        />
                      </div>

                      <div className="mb-3">
                        <MainTextInput
                          name="first_name"
                          type="text"
                          error={errors.first_name}
                          setErrors={setErrors}
                          placeholder="Ime"
                          className="line-flex w-full"
                        />
                      </div>

                      <div className="mb-3">
                        <MainTextInput
                          name="last_name"
                          type="text"
                          error={errors.last_name}
                          setErrors={setErrors}
                          placeholder="Prezime"
                          className="line-flex w-full"
                        />
                      </div>

                      <div className="mb-3">
                        <MainTextInput
                          name="email"
                          type="email"
                          error={errors.email}
                          setErrors={setErrors}
                          placeholder="E-mail"
                          className="line-flex w-full"
                        />
                      </div>

                      <div className="mb-3">
                        <MainTextInput
                          name="password"
                          type="password"
                          error={errors.password}
                          setErrors={setErrors}
                          placeholder="Lozinka"
                          className="line-flex w-full"
                        />
                      </div>

                      <div className="mb-3">
                        <MainTextInput
                          name="phone_number"
                          type="text"
                          error={errors.phone_number}
                          setErrors={setErrors}
                          placeholder="Broj telefona"
                          className="line-flex w-full"
                        />
                      </div>

                      <div className="mb-3">
                        <MainTextInput
                          name="birth_date"
                          type="date"
                          error={errors.birth_date}
                          setErrors={setErrors}
                          placeholder="Datum rođenja"
                          className="line-flex w-full"
                        />
                      </div>
                    </div>

                    <div>
                      <div className="mb-3">
                        <select
                          className="w-full rounded-md"
                          value={values.activity_group_id}
                          disabled={loadingActivityGroups}
                          onChange={e => {
                            setFieldValue('activity_group_id', e.target.value)
                            setFieldValue('activity_id', '')
                          }}
                        >
                          <option value="" disabled>
                            Grupa delatnosti
                          </option>
                          {activityGroups.map(g => (
                            <option key={g.id} value={g.id}>
                              {g.name}
                            </option>
                          ))}
                        </select>
                        <AuthValidationErrors className="mb-1" errors={errors.activity_group_id} />
                      </div>

                      <div className="mb-3">
                        <select
                          className="w-full rounded-md"
                          value={values.activity_id}
                          disabled={!values.activity_group_id}
                          onChange={e => setFieldValue('activity_id', e.target.value)}
                        >
                          <option value="" disabled>
                            Delatnost
                          </option>
                          {activities.map(a => (
                            <option key={a.id} value={a.id}>
                              {a.name}
                            </option>
                          ))}
                        </select>
                        <AuthValidationErrors className="mb-1" errors={errors.activity_id} />
                      </div>

                    <div className="mb-3">
                      <MainTextInput
                        name="address"
                        type="text"
                        error={errors.address}
                        setErrors={setErrors}
                        placeholder="Adresa"
                        className="line-flex w-full"
                      />
                    </div>

                    <div className="mb-3">
                      <MainTextInput
                        name="city"
                        type="text"
                        error={errors.city}
                        setErrors={setErrors}
                        placeholder="Mesto stanovanja"
                        className="line-flex w-full"
                      />
                    </div>

                    <div className="mb-3">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={e => setFieldValue('brand_logo', e.currentTarget.files?.[0] || null)}
                        className="w-full"
                      />
                      <AuthValidationErrors className="mb-1" errors={errors.brand_logo} />
                    </div>

                    <div className="mb-3">
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={e => setFieldValue('gallery_images', Array.from(e.currentTarget.files || []))}
                        className="w-full"
                      />
                      <AuthValidationErrors className="mb-1" errors={errors.gallery_images} />
                    </div>

                    <div className="mb-3">
                      <label className="flex items-center gap-2 text-white">
                        <input
                          type="checkbox"
                          name="is_legal_entity"
                          className="auth-legal-entity-checkbox"
                          checked={!!values.is_legal_entity}
                          onChange={e => setFieldValue('is_legal_entity', e.target.checked)}
                        />
                        Pravno lice
                      </label>
                    </div>

                    {values.is_legal_entity && (
                      <>
                        <div className="mb-3">
                          <MainTextInput
                            name="company_name"
                            type="text"
                            error={errors.company_name}
                            setErrors={setErrors}
                            placeholder="Naziv firme"
                            className="line-flex w-full"
                          />
                        </div>

                        <div className="mb-3">
                          <MainTextInput
                            name="company_address"
                            type="text"
                            error={errors.company_address}
                            setErrors={setErrors}
                            placeholder="Adresa firme"
                            className="line-flex w-full"
                          />
                        </div>

                        <div className="mb-3">
                          <MainTextInput
                            name="mb"
                            type="text"
                            error={errors.mb}
                            setErrors={setErrors}
                            placeholder="Matični broj"
                            className="line-flex w-full"
                          />
                        </div>

                        <div className="mb-3">
                          <MainTextInput
                            name="pib"
                            type="text"
                            error={errors.pib}
                            setErrors={setErrors}
                            placeholder="PIB"
                            className="line-flex w-full"
                          />
                        </div>
                      </>
                    )}

                    {!['development', 'testing'].includes(getAppEnv()) && (
                      <div className="mb-4">
                        <ReCAPTCHA sitekey={process.env.RECAPTCHA_SITE_KEY} ref={recaptchaRef} />
                        <AuthValidationErrors className="mb-1" errors={errors.recaptcha_token} />
                      </div>
                    )}

                    <div className="mb-3">
                      <label className="flex items-start gap-2 text-white">
                        <input
                          type="checkbox"
                          name="terms_accepted"
                          className="auth-legal-entity-checkbox"
                          checked={!!values.terms_accepted}
                          onChange={e => setFieldValue('terms_accepted', e.target.checked)}
                        />
                        <span>
                          Slažem se sa{' '}
                          <button
                            type="button"
                            className="underline"
                            onClick={() => {
                              setLegalDocsType('terms')
                              onLegalDocsOpen()
                            }}
                          >
                            uslovima korišćenja
                          </button>{' '}
                          i{' '}
                          <button
                            type="button"
                            className="underline"
                            onClick={() => {
                              setLegalDocsType('privacy')
                              onLegalDocsOpen()
                            }}
                          >
                            politikom privatnosti
                          </button>
                          .
                        </span>
                      </label>
                      <AuthValidationErrors className="mb-1" errors={errors.terms_accepted} />
                    </div>

                    <AuthValidationErrors className="mb-3" errors={errors.failed} />

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full px-4 py-3 rounded-full bg-white text-black"
                    >
                      Napravite profil
                    </button>

                    <div className="mt-3">
                      <button
                        type="button"
                        className="underline text-white"
                        onClick={() => {
                          setLegalDocsType('instructions')
                          onLegalDocsOpen()
                        }}
                      >
                        Pogledajte instrukcije za registraciju
                      </button>
                    </div>
                  </div>
                </div>
                </div>
              </Form>
            )
          }}
        </Formik>
      )}

      <Modal isOpen={isLegalDocsOpen} onOpenChange={onLegalDocsOpenChange} onClose={onLegalDocsClose} size="lg">
        <ModalContent>
          {onClose => (
            <>
              <ModalHeader>
                {legalDocsType === 'terms'
                  ? 'Uslovi korišćenja'
                  : legalDocsType === 'privacy'
                    ? 'Politika privatnosti'
                    : 'Instrukcije za registraciju'}
              </ModalHeader>
              <ModalBody>
                <div className="text-black">
                  {legalDocsType === 'terms'
                    ? 'Uslovi korišćenja će biti dodati ovde.'
                    : legalDocsType === 'privacy'
                      ? 'Politika privatnosti će biti dodata ovde.'
                      : 'Instrukcije za registraciju će biti dodate ovde.'}
                </div>
                <button type="button" onClick={onClose} className="w-full px-4 py-3 rounded-full bg-black text-white">
                  Zatvori
                </button>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  )
}

export default AuthModal
