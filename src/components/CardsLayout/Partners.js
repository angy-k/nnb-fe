'use client'
import CardComponent from "@/components/CardComponent";
import PlusIcon from "../../icons/plus-icon.svg";
import PageHeroSection from "@/components/Hero/pageOwl";
import ContactForm from '@/components/ContactForm';
import { useEffect, useState } from 'react';
import partnerService from '@/services/partnerService';

const Partners = ({
  partners: propPartners,
}) => {
  const [partners, setPartners] = useState(propPartners || [])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!propPartners) {
      fetchPartners()
    }
  }, [propPartners])

  const fetchPartners = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await partnerService.getPartners()
      if (!response.ok) {
        throw new Error('Failed to fetch partners')
      }

      const data = await response.json()
      if (!data.success) {
        throw new Error(data.message || 'Failed to fetch partners')
      }

      const items = Array.isArray(data.data)
        ? data.data
        : Array.isArray(data.data?.data)
          ? data.data.data
          : []

      setPartners(items)
    } catch (err) {
      console.error('Error fetching partners:', err)
      setError(err.message)
      setPartners([])
    } finally {
      setLoading(false)
    }
  }

  function moreAboutPartner() {
      //TODO: display dialog with more details about partner
  }
  return (
    <>
      <PageHeroSection 
        title={`Prijatelji`}
      />
      <div className="w-full blogs-container pt-24 grid place-items-center pb-48 z-1 bg-[#F0F0F0]">
        {loading && (
          <div className="text-center">Loading partners...</div>
        )}
        {error && (
          <div className="text-red-500 text-center mb-4">
            Error loading partners: {error}
          </div>
        )}
        <div className="blog-container grid sm:grid-template-1 md:grid-template-2">
          {partners.map((partner, index) => (
            <CardComponent
              key={`partner-card-${index}`}
              imageSrc={partner.image || '/partner-cover.svg'}
              imageWidth={415}
              imageHeight={272}
              imageRadius={"0px"}
              imageAltText={`Prijatelj - ${partner.name || ''}`}
              sectionType={'partner'}
              buttonAction={() => moreAboutPartner(partner)}
              buttonIcon={PlusIcon}
              buttonIconSize={22}
            />
          ))}
        </div>
        {/* kontakt sekcija */}
        <ContactForm
          sectionTitle={`Želite da sarađujete sa nama?`}
          predefinedTitle={`Želim da sarađujem sa vama`}
          withImage={false}
        />
      </div>
    </>
  )
}

export default Partners