'use client';
import { Divider } from "@nextui-org/divider";
import Image from 'next/image';
import Button from "../Button";
import DefaultImage from "./assets/default-contact-form-image.png"
import ContactFormLogo from "../Logo/ContactFormLogo";
import { validateContact } from '@/validations/contact';
import { ErrorMessage, Form, Formik } from 'formik';
import { CONSENT_CONTACT } from '@/utils/consentTexts';
import LegalDocsModal from '@/components/Modal/LegalDocsModal';
import MainTextAreaInput from '../Commons/MainTextAreaInput';
import MainTextInput from '../Commons/MainTextInput';
import ReCAPTCHA from 'react-google-recaptcha'
import AuthValidationErrors from "../Auths/AuthValidationErrors";
import contactService from '@/services/contactService'
import { useState, useRef } from "react";
import useUser from '@/data/use-user'

const getAppEnv = () => process.env.NEXT_PUBLIC_ENV || process.env.NEXT_PUBLIC_APP_ENV

const ContactForm = ({
  sectionTitle,
  sectionTitleColor,
  // Uvodna rečenica umesto naslova sekcije — manja, u stilu podnaslova na newsletteru.
  // Boju preuzima od `sectionTitleColor` da se ne prosleđuju dve boje za istu sekciju.
  sectionLead,
  hideDivider = false,
  predefinedTitle = 'Želim da sarađujem sa vama',
  withImage = true,
}) => {

  const [errors, setErrors] = useState([])
  const [formSuccess, setFormSuccess] = useState('')
  const [isLoading, setIsLoading] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const { user } = useUser();
  const recaptchaRef = useRef();

  const onSubmit = async(values, { resetForm }) => {
    if (isLoading) return

    values.recaptcha_token = await recaptchaRef.current?.getValue()

    // Bez unetog naslova poruka bi stigla bez konteksta — koristi se predlog
    // stranice sa koje je poslata („Želim da sarađujem sa vama" i slično).
    if (!String(values.title ?? '').trim()) {
      values.title = predefinedTitle
    }
    setIsLoading(true)
    setFormSuccess('')
    setErrors([])

    try {
      const response = await contactService.sendContact(values)
      if (response.ok) {
        setFormSuccess('Vaša poruka je uspešno poslata. Odgovorićemo Vam u najkraćem roku.')
        resetForm()
        recaptchaRef.current?.reset()
      } else {
        switch(response.status) {
          case 422: {
            const data = await response.json()
            setErrors(data.errors || [])
            break
          }
          default:
            setErrors({ failed: ['Došlo je do greške. Pokušajte ponovo.'] })
        }
        recaptchaRef.current?.reset()
      }
    } catch {
      setErrors({ failed: ['Došlo je do greške. Pokušajte ponovo.'] })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    // `pt-24` i `mt-24` na kartici daju zajedno oko 190px praznine, što je na
    // telefonu skoro pola ekrana pre nego što se forma pojavi.
    <div className="w-full contact-section grid place-items-center pt-24 sm:pt-8 mx-auto 2xl:max-w-screen-2xl 2xl:mx-auto">
      {/* `nnb-gutter` — naslov sekcije je dodirivao levu ivicu na svakoj širini
          ispod 1400px, dok polja forme ispod imaju odmak. */}
      {sectionTitle && <span className="contact-section-title block w-full nnb-gutter" style={sectionTitleColor ? { color: sectionTitleColor } : undefined}>{sectionTitle}</span>}
      {sectionTitle && !hideDivider && <Divider className="section-divider w-1440"/>}
      {sectionLead && (
        <p className="contact-section-lead" style={sectionTitleColor ? { color: sectionTitleColor } : undefined}>
          {sectionLead}
        </p>
      )}
      <div
        className={`flex flex-col-reverse lg:flex-row ${withImage ? '' : 'place-items-center'} justify-center gap-1 ${withImage ? 'sm:gap-24 md:gap-[24px] lg:gap-[24px]' : 'sm:gap-4 md:gap-16 lg:gap-60 sm:py-8 sm:px-4 py-20 px-20 md:px-10 md:py-12'} w-full lg:max-w-[1440px] contact-from bg-[#ffffff] mt-24 sm:mt-6 2xl:max-w-screen-2xl 2xl:mx-auto rounded-3xl overflow-hidden`}
      >
        {withImage ? (
          <div className="relative w-full min-h-[300px] lg:min-h-0 lg:self-stretch lg:w-[45%] flex-shrink-0 overflow-hidden rounded-b-3xl lg:rounded-b-none lg:rounded-l-3xl sm:hidden">
            <Image
              src={DefaultImage}
              fill
              style={{ objectFit: 'cover', objectPosition: 'center' }}
              alt="Contact form default image."
            />
          </div>
        ) : (
          <ContactFormLogo />
        )}
        <div className={`w-[100%] ${withImage ? 'sm:p-5 p-[48px]' : 'p-0'}`}>
          <Formik
            initialValues={{
              // Prazno kao na dizajnu; ako korisnik ne upiše naslov, pri slanju
              // se koristi predlog vezan za stranicu sa koje je forma poslata.
              title: '',
              email: '',
              firstName: '',
              lastName: '',
              phoneNumber: '',
              address: '',
              message: '',
              consent_accepted: false,
            }}
            validationSchema={validateContact}
            onSubmit={onSubmit}
          >
            {({ values, setFieldValue }) => (
              <Form className="w-full">
                {/* 2-kolumna grid: Ime/Prezime, E-mail/Telefon, Adresa/Naslov */}
                <div className="contact-form-inputs grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-x-6 gap-y-5 mb-5">
                  <div>
                    <MainTextInput
                      error={errors.firstName}
                      setErrors={setErrors}
                      label="Ime"
                      name="firstName"
                      type="text"
                    />
                  </div>
                  <div>
                    <MainTextInput
                      error={errors.lastName}
                      setErrors={setErrors}
                      label="Prezime"
                      name="lastName"
                      type="text"
                    />
                  </div>
                  <div>
                    <MainTextInput
                      error={errors.email}
                      setErrors={setErrors}
                      label="E-mail"
                      name="email"
                      type="email"
                    />
                  </div>
                  <div>
                    <MainTextInput
                      error={errors.phoneNumber}
                      setErrors={setErrors}
                      label="Telefon"
                      name="phoneNumber"
                      type="text"
                    />
                  </div>
                  <div>
                    <MainTextInput
                      error={errors.address}
                      setErrors={setErrors}
                      label="Adresa"
                      name="address"
                      type="text"
                    />
                  </div>
                  <div>
                    {/* Po dizajnu obično tekstualno polje, isto kao Adresa pored njega.
                        Bilo je zaključano, pa korisnik nije mogao da napiše naslov.
                        Ostaje prazno; predloženi naslov stoji kao placeholder i
                        koristi se ako ga korisnik ne izmeni. */}
                    <MainTextInput
                      error={errors.title}
                      setErrors={setErrors}
                      label="Naslov"
                      name="title"
                      type="text"
                      placeholder={predefinedTitle}
                    />
                  </div>
                </div>

                {/* Poruka — full width */}
                <div className="contact-form-inputs mb-5">
                  <MainTextAreaInput
                    rows={5}
                    label="Poruka"
                    name="message"
                    className="mt-2 w-full rounded-md shadow-sm border-none"
                  />
                  <span className="text-xs text-[#A4A4A4]">
                    * Maksimalni dozvoljeni broj karaktera je 2047
                  </span>
                </div>

                {!['development', 'testing', 'dev'].includes(getAppEnv()) && (
                  <>
                    <ReCAPTCHA
                      sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
                      ref={recaptchaRef}
                    />
                    <AuthValidationErrors
                      className="mb-1"
                      errors={errors.recaptcha_token}
                    />
                  </>
                )}

                {/* Obavezna saglasnost za obradu podataka o ličnosti */}
                <div className="mt-4 mb-2">
                  <label className="flex items-start gap-2 text-[#261A54] text-sm cursor-pointer">
                    <input
                      type="checkbox"
                      name="consent_accepted"
                      className="mt-0.5 flex-shrink-0 w-4 h-4 accent-[#56C4CF] cursor-pointer"
                      checked={!!values.consent_accepted}
                      onChange={(e) => setFieldValue('consent_accepted', e.target.checked)}
                    />
                    <span className="leading-snug">
                      {CONSENT_CONTACT.before}
                      {/* Modal umesto nove stranice — korisnik ne napušta formu
                          koju je već počeo da popunjava. `preventDefault` je tu
                          jer je dugme unutar `label`, pa bi klik inače čekirao
                          saglasnost, a `stopPropagation` da se ne prosledi dalje. */}
                      <button
                        type="button"
                        className="underline text-[#56C4CF] hover:opacity-80 transition-opacity"
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          setIsPrivacyOpen(true)
                        }}
                      >
                        {CONSENT_CONTACT.linkLabel}
                      </button>
                      {CONSENT_CONTACT.after}
                    </span>
                  </label>
                  <ErrorMessage
                    name="consent_accepted"
                    component="div"
                    className="text-sm text-negative-color mt-1"
                  />
                </div>

                {formSuccess && (
                  <div className="text-sm text-green-600 py-2 mb-2">{formSuccess}</div>
                )}

                <AuthValidationErrors className="mb-1" errors={errors.failed} />

                <Button
                  key="contact-form-button"
                  type="submit-outlined-dark"
                  name={isLoading ? 'Šalje se...' : 'Pošalji poruku'}
                  disabled={isLoading || !values.consent_accepted}
                  className="w-full mt-2"
                />
              </Form>
            )}
          </Formik>
        </div>
      </div>

      {/* `onOpenChange` je dovoljan za kontrolisani modal — isto tako ga koristi
          i prijava na događaj. */}
      <LegalDocsModal
        isOpen={isPrivacyOpen}
        onOpenChange={setIsPrivacyOpen}
        sections={['privacy']}
        acceptLabel="Zatvori"
      />
    </div>
  )
}

export default ContactForm;
