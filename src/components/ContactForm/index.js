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
  const [message, setMessage] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [address, setAddress] = useState('')
  const [title, setTitle] = useState(predefinedTitle || '');
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useUser();
  const recaptchaRef = useRef();



  const onSubmit = async(values, { resetForm }) => {
    //TODO: send mail message
    if (isLoading) return
    values.recaptcha_token = await recaptchaRef.current?.getValue()

    setIsLoading(true)

    const response = await contactService.sendContact(values)
    if (response.ok) {
      enqueueSnackbar('Uspešno je poslat email.', {variant: 'success'})
      resetForm()
    } else {
      switch(response.status) {
        case 422:
          const data = await response.json()
          setErrors(data.errors)
          enqueueSnackbar(data.message, { variant: 'error' })
          break
        default:
          throw Error('Error resetPassword')
      }
    }
    setLoading(false)
    recaptchaRef.current.reset()

  }
  //TODO: validacija input polja
  return (
    <div className="w-full contact-section grid place-items-center pt-24 mx-auto 2xl:max-w-screen-2xl 2xl:mx-auto">
      {sectionTitle && <span className="contact-section-title text-left">{sectionTitle}</span>}
      {sectionTitle && <Divider  className="section-divider w-1440"/>}
      <div 
        className={`flex flex-col-reverse lg:flex-row place-items-center justify-center gap-1 ${withImage ? 'sm:gap-24 md:gap-[24px] lg:gap-[24px] ' : 'sm:gap-20 md:gap-60 lg:gap-60 py-20 px-20 md:px-40'} lg:w-1440 contact-from bg-[#ffffff] mt-24 2xl:max-w-screen-2xl 2xl:mx-auto rounded-3xl`}
      >
        {withImage ? <Image
            src={DefaultImage}
            width={606}
            height={555}
            alt={'Contact form default image.'}
          /> : <ContactFormLogo />
        }
        <div className={`w-[100%] ${withImage ? 'p-[48px]' : 'p-0'}`}>
        <Formik
          initialValues={{
            title: title,
            email: user ? user.email : (email ? email : ''),
            firstName: user ? user.firstName : (firstName ? firstName : ''),
            lastName: user ? user.lastName : (lastName ? lastName : ''),
            address: user ? user.address : (address ? address : ''),
            phoneNumber: user ? user.phoneNumber : (phoneNumber ? phoneNumber : ''),
            message: message ? message : '',
          }}
          enagleReinitialize
          validationSchema={validateContact}
          
          onSubmit={onSubmit}>
            {() => (
              <Form className="w-full">
                <div className="grid grid-cols-1 2xl:grid 2xl:grid-cols-2 2xl:w-8/12">
                  <div className="contact-form-fields 2xl:grid 2xl:mr-5">
                    <div className="pb-5">
                      <MainTextInput
                        error={errors.firstName}
                        setErrors={setErrors}
                        label="Ime"
                        name="firstName"
                        palceholder="Ime"
                        type="text"
                        className="mt-1.5 line-flex pl-9 w-full pt-2"
                      />
                    </div>
                    
                    <div className="pb-5">
                      <MainTextInput
                        error={errors.lastName}
                        setErrors={setErrors}
                        label="Prezime"
                        name="lastName"
                        palceholder="Prezime"
                        type="text"
                        className="mt-1.5 line-flex pl-9 w-full pt-2"
                      />
                    </div>

                    <div className="pb-5">
                      <MainTextInput
                        error={errors.email}
                        setErrors={setErrors}
                        label="E-mail"
                        name="email"
                        palceholder="E-mail"
                        type="email"
                        className="mt-1.5 line-flex pl-9 w-full pt-2"
                      />
                    </div>

                    <div className="pb-5">
                      <MainTextInput
                        error={errors.phoneNumber}
                        setErrors={setErrors}
                        label="Telefon"
                        name="phoneNumber"
                        palceholder="Telefon"
                        type="text"
                        className="mt-1.5 line-flex pl-9 w-full pt-2"
                      />
                    </div>

                    <div className="pb-5">
                      <MainTextInput
                        error={errors.address}
                        setErrors={setErrors}
                        label="Adresa"
                        name="address"
                        palceholder="Adresa"
                        type="text"
                        className="mt-1.5 line-flex pl-9 w-full pt-2"
                      />
                    </div>

                    <div className="pb-5">
                      <MainTextInput
                        error={errors.title}
                        setErrors={setErrors}
                        label="Naslov"
                        name="title"
                        palceholder="Naslov"
                        type="text"
                        disabled={true}
                        className="mt-1.5 line-flex pl-9 w-full pt-2"
                      />
                    </div>
                  </div>
                  <div className="pb-5">
                      <MainTextAreaInput 
                        rows={5}
                        cols={5}
                        label={'Poruka'}
                        name="message"
                        palceholder="Poruka"
                        className="mt-2 w-full rounded-md shadow-sm border-none"
                        value={message}
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

                    {/* Validation Errors */}
                    <AuthValidationErrors className="mb-1" errors={errors.failed} />

                    <Button
                      key={`contact-form-button`}
                      type={'submit-outlined-dark'}
                      name={'Pošalji poruku'}
                      className={'button w-full 2xl:w-6/12 2xl:mll-auto 2xl:mt-0'}
                     />
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  )
}

export default ContactForm;
