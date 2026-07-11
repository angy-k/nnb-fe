import PageHeroSection from "@/components/Hero/pageOwl";
import ContactForm from '@/components/ContactForm';
import ViberCommunity from '@/components/Communities/ViberCommunity';
import Faq from '@/components/FaQ'

async function getFaqs() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/faqs`,
      { next: { revalidate: 3600, tags: ['faqs'] } }
    )
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

const ContactPage = async () => {
  const faqs = await getFaqs()
  return (
    <>
      <PageHeroSection
        title={`Kontakt`}
        type="description"
        icons={false}
        description={`Ukoliko imate bilo kakvo pitanje, sugestiju, kritiku, ili samo želite da se dodatno informišete o našim dešavanjima, osećajte se slobodni da nam pišete u svako doba dana, odgovorićemo Vam u najbržem roku.`}
      />
      <div className="w-full grid place-items-center pb-48 z-1 bg-[#F0F0F0]">
        <Faq faq={faqs} />
        <ContactForm
          withImage={false}
          predefinedTitle="Pošaljite nam poruku"
        />
        <ViberCommunity type={'dark'}/>
      </div>
    </>
  )
}

export default ContactPage
