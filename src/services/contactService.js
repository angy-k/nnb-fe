import { post } from '@/lib/fetchAPI';

const sendContact = async (values) => {
  return post(`/api/v1/contacts`, values, { withCSRF: true })
  //TODO mabe implement sending mails direct from fe
}

export default {
  sendContact
}
