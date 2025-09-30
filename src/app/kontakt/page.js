'use client';
import PageHeroSection from "@/components/Hero/pageOwl";
import ContactForm from '@/components/ContactForm';
import ViberCommunity from '@/components/Communities/ViberCommunity';
import Faq from '@/components/FaQ'

const ContactPage = () => {
    return (
      <div className="grid place-items-center w-full pt-80">
        <PageHeroSection 
          title={`Kontakt`}
          type="description"
          icons={false}
          description={`Ukoliko imate bilo kakvo pitanje, sugestiju, kritiku, ili samo želite da se dodatno informišete o našim dešavanjima, 
              osećajte se slobodni da nam pišete u svako doba dana, odgovorićemo Vam u najbržem roku.`}
        />
        <div className="w-full grid place-items-center pb-48 z-1 bg-[#F0F0F0]">
          
          <Faq />
          <ContactForm 
            withImage={false}
          />
          <ViberCommunity type={'dark'}/>
        </div>
      </div>
    );
}

export default ContactPage;