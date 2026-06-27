'use client';
import { Divider } from "@nextui-org/divider";
import Image from 'next/image';
import Button from "../Button";
import DefaultImage from "./assets/default-contact-form-image.png"
import ContactFormLogo from "../Logo/ContactFormLogo";
import { validateContact } from '@/validations/contact';
import { Form, Formik } from 'formik';
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
  predefinedTitle = 'Želim da sarađujem sa vama',
  withImage = true,
}) => {

  const [errors, setErrors] = useState([])
  const [formSuccess, setFormSuccess] = useState('')
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useUser();
  const recaptchaRef = useRef();

  const onSubmit = async(values, { resetForm }) => {
    if (isLoading) return

    values.recaptcha_token = await recaptchaRef.current?.getValue()
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
    <div className="w-full contact-section grid place-items-center pt-24 mx-auto 2xl:max-w-screen-2xl 2xl:mx-auto">
      {sectionTitle && <span className="contact-section-title text-left">{sectionTitle}</span>}
      {sectionTitle && <Divider className="section-divider w-1440"/>}
      <div
        className={`flex flex-col-reverse lg:flex-row ${withImage ? '' : 'place-items-center'} justify-center gap-1 ${withImage ? 'sm:gap-24 md:gap-[24px] lg:gap-[24px]' : 'sm:gap-20 md:gap-60 lg:gap-60 py-20 px-20 md:px-40'} lg:w-1440 contact-from bg-[#ffffff] mt-24 2xl:max-w-screen-2xl 2xl:mx-auto rounded-3xl overflow-hidden`}
      >
        {withImage ? (
          <div className="relative w-full min-h-[300px] lg:min-h-0 lg:self-stretch lg:w-[45%] flex-shrink-0 overflow-hidden rounded-b-3xl lg:rounded-b-none lg:rounded-l-3xl">
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
        <div className={`w-[100%] ${withImage ? 'p-[48px]' : 'p-0'}`}>
          <Formik
            initialValues={{
              title: predefinedTitle,
              email: '',
              firstName: '',
              lastName: '',
              phoneNumber: '',
              address: '',
              message: '',
            }}
            validationSchema={validateContact}
            onSubmit={onSubmit}
          >
            {() => (
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
                    <MainTextInput
                      error={errors.title}
                      setErrors={setErrors}
                      label="Naslov"
                      name="title"
                      type="text"
                      disabled={true}
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
                      sitekey={process.env.RECAPTCHA_SITE_KEY}
                      ref={recaptchaRef}
                    />
                    <AuthValidationErrors
                      className="mb-1"
                      errors={errors.recaptcha_token}
                    />
                  </>
                )}

                {formSuccess && (
                  <div className="text-sm text-green-600 py-2 mb-2">{formSuccess}</div>
                )}

                <AuthValidationErrors className="mb-1" errors={errors.failed} />

                <Button
                  key="contact-form-button"
                  type="submit-outlined-dark"
                  name={isLoading ? 'Šalje se...' : 'Pošalji poruku'}
                  disabled={isLoading}
                  className="w-full mt-2"
                />
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  )
}

export default ContactForm;
