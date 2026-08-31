'use client'
import { useEffect, useState } from 'react'
import {Accordion, AccordionItem} from "@nextui-org/accordion";
import PlusIcon from '@/icons/plus-icon.svg';
import MinusIcon from '@/icons/minus-icon.svg';
import Image from 'next/image'
import faqService from '@/services/faqService'

const Faq = ({
    faq: propFaq,
    isHome = false,
}) => {
  const [faq, setFaq] = useState(Array.isArray(propFaq) ? propFaq : [])
  const [loading, setLoading] = useState(!Array.isArray(propFaq))
  const [error, setError] = useState(null)

  useEffect(() => {
    if (Array.isArray(propFaq)) {
      setFaq(propFaq)
      setLoading(false)
      setError(null)
      return
    }

    const fetchFaq = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await faqService.getFaqs()
        if (!response.ok) {
          setFaq([])
          setError('Greška prilikom učitavanja najčešćih pitanja.')
          return
        }

        const data = await response.json().catch(() => null)
        if (!data?.success) {
          setFaq([])
          setError(data?.message || 'Greška prilikom učitavanja najčešćih pitanja.')
          return
        }

        const items = Array.isArray(data?.data)
          ? data.data
          : Array.isArray(data?.data?.data)
            ? data.data.data
            : []

        setFaq(items)
      } catch (e) {
        setFaq([])
        setError('Greška prilikom učitavanja najčešćih pitanja.')
      } finally {
        setLoading(false)
      }
    }

    fetchFaq()
  }, [propFaq])

  return (
    <div className="grid place-items-center w-full pb-15 w-full mx-auto 2xl:max-w-screen-2xl 2xl:mx-auto" style={{background: isHome ? 'transparent' : 'linear-gradient(to bottom, #261A54 30%, #f0f0f0 30%)'}}>
      {/* `lg:w-1440` je bilo fiksnih 1440px, pa se sekcija prelivala na svakom
          ekranu užem od toga — a to je svaki laptop od 13 i 14 inča. Postojeća
          zaštita u CSS-u pokriva samo klasu `w-1440`, ne i `lg:` varijantu.
          Sa `max-w` širina prati ekran, a gornja granica ostaje ista. */}
      {/* `lg:max-w-[1440px]` je davalo punu širinu prozora, jer `lg` u ovom
          projektu znači od 1300 naviše — a panel je u dizajnu u koloni sadržaja
          (240–1679 na okviru od 1920), dakle sa marginama sa strane.

          Na Kontaktu panel još i prelazi preko donjeg dela hero sekcije, za
          254px na okviru od 1920. Na Početnoj toga nema, pa se preklop dodaje
          samo kad `isHome` nije postavljen. */}
      <div className={
        'faq-container place-items-center p-5 w-full mx-auto max-w-[1400px]'
        + (isHome ? '' : ' faq-container--preko-heroa')
      }>
        {loading && <div className="w-full grid place-items-center py-12">Učitavanje...</div>}
        {!loading && error && <div className="w-full grid place-items-center py-12 text-[#EC4923]">{error}</div>}
        {!loading && !error && faq.length === 0 && (
          <div className="w-full grid place-items-center py-12 text-[#A4A4A4]">Nema dostupnih pitanja.</div>
        )}
        {!loading && !error && faq.length > 0 && <Accordion variant="light">
            {faq.map((item, index) => (
                <AccordionItem 
                  key={`faq-item-${item?.id ?? index}`} 
                  aria-label={`Faq - ${index}`} 
                  title={item.question}
                  className="faq-container-accordion mb-5"
                  focusable={false}
                  indicator={({ isOpen }) => (!!isOpen ? <Image
                    src={MinusIcon}
                    alt="eye-unseen"
                    width="0"
                    height="0"
                    className='w-18 pr-4'
                  /> : <Image
                  src={PlusIcon}
                  alt="eye-unseen"
                  width="0"
                  height="0"
                  className='w-18 pr-4'
                />)}
                >
                    <p className="section p-0 m-0">{item.answer}</p>
              </AccordionItem>
            ))}
        </Accordion>}
      </div>
    </div>
  );
}
export default Faq;
