'use client'

import { useEffect, useRef, useState } from 'react'
import * as Yup from 'yup'
import ReCAPTCHA from 'react-google-recaptcha'
import { ErrorMessage, Form, Formik } from 'formik'
import { Modal, ModalBody, ModalContent, ModalHeader, useDisclosure } from '@nextui-org/react'

import authService from '@/services/authService'
import activityGroupService from '@/services/activityGroupService'
import useUser from '@/data/use-user'

import MainTextInput from '@/components/Commons/MainTextInput'
import AuthValidationErrors from '@/components/Auths/AuthValidationErrors'

const DEFAULT_TAB = 'login'

const getAppEnv = () => process.env.NEXT_PUBLIC_ENV || process.env.NEXT_PUBLIC_APP_ENV

const loginSchema = Yup.object({
  email: Yup.string()
    .email('Unesite validnu email adresu.')
    .required('Email je obavezan.'),
  password: Yup.string()
    .min(6, 'Lozinka mora imati najmanje 6 karaktera.')
    .required('Lozinka je obavezna.'),
  terms_accepted: Yup.boolean()
    .oneOf([true], 'Moraš da prihvatiš uslove korišćenja i politiku privatnosti.'),
})

const registerSchema = Yup.object({
  brand_name:        Yup.string().required('Naziv brenda je obavezan.'),
  first_name:        Yup.string().required('Ime je obavezno.'),
  last_name:         Yup.string().required('Prezime je obavezno.'),
  email:             Yup.string().email('Unesite validnu email adresu.').required('Email je obavezan.'),
  password:          Yup.string().min(8, 'Lozinka mora imati najmanje 8 karaktera.').required('Lozinka je obavezna.'),
  phone_number:      Yup.string().required('Broj telefona je obavezan.'),
  birth_date:        Yup.string().required('Datum rođenja je obavezan.'),
  activity_group_id: Yup.string().required('Grupa delatnosti je obavezna.'),
  activity_name:     Yup.string().required('Delatnost je obavezna.'),
  address:           Yup.string().required('Adresa je obavezna.'),
  city:              Yup.string().required('Mesto stanovanja je obavezno.'),
  terms_accepted:    Yup.boolean().oneOf([true], 'Moraš da prihvatiš uslove korišćenja i politiku privatnosti.'),
  company_name:      Yup.string().when('is_legal_entity', {
    is: true, then: s => s.required('Naziv firme je obavezan.'),
  }),
  company_address:   Yup.string().when('is_legal_entity', {
    is: true, then: s => s.required('Adresa firme je obavezna.'),
  }),
  mb:  Yup.string().when('is_legal_entity', { is: true, then: s => s.required('Matični broj je obavezan.') }),
  pib: Yup.string().when('is_legal_entity', { is: true, then: s => s.required('PIB je obavezan.') }),
})

const UploadIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="#261A54" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    <polyline points="17 8 12 3 7 8" stroke="#261A54" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    <line x1="12" y1="3" x2="12" y2="15" stroke="#261A54" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const SpinnerIcon = () => (
  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
  </svg>
)

const FileUploadButton = ({ label, accept, multiple, fileName, onChange }) => {
  const inputRef = useRef(null)
  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        className="hidden"
        onChange={onChange}
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="file-upload-btn"
      >
        <UploadIcon />
        <span className="file-upload-btn__label">
          {fileName || label}
        </span>
      </button>
    </div>
  )
}

const AuthModal = ({ onSuccess, onClose, initialTab }) => {
  const { mutate } = useUser()

  const {
    isOpen: isLegalDocsOpen,
    onOpen: onLegalDocsOpen,
    onOpenChange: onLegalDocsOpenChange,
    onClose: onLegalDocsClose,
  } = useDisclosure()
  const [legalDocsType, setLegalDocsType] = useState('terms')

  const [tab, setTab] = useState(initialTab || DEFAULT_TAB)
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

      const payload = new FormData()
      payload.append('brand_name', values.brand_name || '')
      payload.append('first_name', values.first_name || '')
      payload.append('last_name', values.last_name || '')
      payload.append('birth_date', values.birth_date || '')
      payload.append('email', values.email)
      payload.append('password', values.password)
      payload.append('phone_number', values.phone_number || '')

      payload.append('activity_group_id', values.activity_group_id)
      payload.append('activity_name', values.activity_name || '')

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

          <div className="w-full md:w-1/2 lg:w-1/2 h-full flex flex-col justify-center bg-white px-6 md:px-12 lg:px-12 py-10">
            <h2 className="text-[#261A54] text-3xl font-bold mb-6">Prijavite se</h2>

            <button
              type="button"
              disabled={isLoading}
              className="w-full px-4 py-3 rounded-full border border-gray-300 text-[#261A54] flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors"
              onClick={handleGoogleLogin}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
              Prijavite se sa Google nalogom
            </button>

            <div className="my-5 flex items-center gap-3 text-gray-400 text-sm"><span className="flex-1 h-px bg-gray-200"/><span>ili putem mejla</span><span className="flex-1 h-px bg-gray-200"/></div>

            <Formik
              initialValues={{ email: '', password: '', terms_accepted: false }}
              validationSchema={loginSchema}
              validateOnChange={false}
              validateOnBlur={true}
              onSubmit={handleLogin}
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
                    <label className="flex items-start gap-2 text-gray-700">
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
                          className="underline text-[#56C4CF]"
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
                          className="underline text-[#56C4CF]"
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
                    className={`w-full px-4 py-3 rounded-full bg-[#56C4CF] text-white font-semibold transition-colors flex items-center justify-center gap-2 ${isLoading ? 'opacity-60 cursor-not-allowed' : 'hover:bg-[#3db8c4]'}`}
                  >
                    {isLoading && <SpinnerIcon />}
                    {isLoading ? 'Učitavanje...' : 'Prijavite se'}
                  </button>

                  <div className="mt-4 text-center">
                    <button
                      type="button"
                      className="text-[#56C4CF] underline"
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
                      className="text-gray-400 underline"
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
            activity_name: '',
          }}
          validationSchema={registerSchema}
          validateOnChange={false}
          validateOnBlur={true}
          onSubmit={handleRegister}
        >
          {({ values, setFieldValue }) => {
            return (
              <Form className="w-full h-full flex items-center justify-center bg-white">
                <div className="w-full lg:w-[911px] lg:mx-auto px-6 md:px-12 py-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-3">
                    <div>
                      <h2 className="text-[#261A54] text-3xl font-bold mb-6">Napravite profil</h2>

                      <button
                        type="button"
                        disabled={isLoading}
                        className="w-full px-4 py-3 rounded-full border border-gray-300 text-[#261A54] flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors mb-6"
                        onClick={handleGoogleLogin}
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                        Registrujte se sa Google nalogom
                      </button>

                      <div className="mb-5 flex items-center gap-3 text-gray-400 text-sm"><span className="flex-1 h-px bg-gray-200"/><span>ili putem mejla</span><span className="flex-1 h-px bg-gray-200"/></div>

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
                          name="activity_group_id"
                          className="w-full rounded-md"
                          value={values.activity_group_id}
                          disabled={loadingActivityGroups}
                          onChange={e => {
                            setFieldValue('activity_group_id', e.target.value)
                            setFieldValue('activity_name', '')
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
                        <ErrorMessage name="activity_group_id" component="div" className="text-sm text-negative-color mt-1" />
                        <AuthValidationErrors className="mb-1" errors={errors.activity_group_id} />
                      </div>

                      <div className="mb-3">
                        <MainTextInput
                          name="activity_name"
                          type="text"
                          error={errors.activity_name}
                          setErrors={setErrors}
                          placeholder="Delatnost"
                          className="line-flex w-full"
                          disabled={!values.activity_group_id}
                        />
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
                      <FileUploadButton
                        label="Dodajte logo"
                        accept="image/*"
                        fileName={values.brand_logo?.name}
                        onChange={e => setFieldValue('brand_logo', e.currentTarget.files?.[0] || null)}
                      />
                      <AuthValidationErrors className="mb-1" errors={errors.brand_logo} />
                    </div>

                    <div className="mb-3">
                      <FileUploadButton
                        label="Dodajte fotografije"
                        accept="image/*"
                        multiple
                        fileName={values.gallery_images?.length ? `${values.gallery_images.length} fajl${values.gallery_images.length === 1 ? '' : 'a'} izabrano` : null}
                        onChange={e => setFieldValue('gallery_images', Array.from(e.currentTarget.files || []))}
                      />
                      <AuthValidationErrors className="mb-1" errors={errors.gallery_images} />
                    </div>

                    <div className="mb-3">
                      <label className="flex items-center gap-2 text-gray-700">
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
                      <label className="flex items-start gap-2 text-gray-700">
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
                            className="underline text-[#56C4CF]"
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
                            className="underline text-[#56C4CF]"
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
                      <ErrorMessage name="terms_accepted" component="div" className="text-sm text-negative-color mt-1" />
                      <AuthValidationErrors className="mb-1" errors={errors.terms_accepted} />
                    </div>

                    <AuthValidationErrors className="mb-3" errors={errors.failed} />

                    <button
                      type="submit"
                      disabled={isLoading}
                      className={`w-full px-4 py-3 rounded-full bg-[#56C4CF] text-white font-semibold transition-colors flex items-center justify-center gap-2 ${isLoading ? 'opacity-60 cursor-not-allowed' : 'hover:bg-[#3db8c4]'}`}
                    >
                      {isLoading && <SpinnerIcon />}
                      {isLoading ? 'Učitavanje...' : 'Napravite profil'}
                    </button>

                    <div className="mt-3 text-center">
                      <button
                        type="button"
                        className="underline text-gray-400"
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

      <Modal
        isOpen={isLegalDocsOpen}
        onOpenChange={onLegalDocsOpenChange}
        onClose={onLegalDocsClose}
        size="lg"
        backdrop="blur"
        classNames={{
          wrapper: 'nnb-modal-wrapper items-center justify-center',
          backdrop: 'nnb-modal-backdrop',
        }}
      >
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
