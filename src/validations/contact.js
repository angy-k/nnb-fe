import * as Yup from 'yup'

export const validateContact = Yup.object({
  email: Yup.string()
    .email(
        'Potrebno je uneti adresu u formatu:\n e-mailadresa@primer.com'
    )
    .required('Obavezno polje'
    ),
  firstName: Yup.string().required('Obavezno polje'),
  lastName: Yup.string().required('Obavezno polje'),
  message: Yup.string()
    .max(2047, 'Maksimalni dozvoljeni broj karaktera je 2047')
    .required(),
  // Saglasnost za obradu podataka o ličnosti je obavezna
  consent_accepted: Yup.boolean()
    .oneOf([true], 'Saglasnost je obavezna za slanje poruke.'),
})
