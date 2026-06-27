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
      <div className="faq-container place-items-center p-5 w-full mx-auto lg:w-1440 2xl:max-w-screen-2xl 2xl:mx-auto">
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
