import CardComponent from "@/components/CardComponent";
import PlusIcon from "../../icons/plus-icon.svg";
import PageHeroSection from "@/components/Hero/pageOwl";
import ContactForm from '@/components/ContactForm';

const Partners = ({
  partners = mockPartners,
}) => {
  function moreAboutPartner() {
      //TODO: display dialog with more details about partner
  }
  return (
    <>
      <PageHeroSection 
        title={`Partneri`}
      />
      <div className="w-full blogs-container pt-24 grid place-items-center pb-48 z-1 bg-[#F0F0F0]">
        <div className="blog-container grid sm:grid-template-1 md:grid-template-2">
          {partners.map((partner, index) => (
            <CardComponent
              key={`partner-card-${index}`}
              imageSrc={partner.image}
              imageWidth={415}
              imageHeight={272}
              imageRadius={"0px"}
              imageAltText={`Prijatelj - ${partner.name}`}
              sectionType={'partner'}
              onClick={moreAboutPartner()}
              buttonIcon={PlusIcon}
              buttonIconSize={22}
            />
          ))}
        </div>
        {/* kontakt sekcija */}
        <ContactForm 
          title={`Želite da sarađujete sa nama?`}
          withImage={false}
        />
      </div>
    </>
  )
}

const mockPartners = [
    {
        id: 1,
        image: './partner-cover.svg',
        name: 'Fruški jazački'
    },
    {
        id: 2,
        image: './partner-cover.svg',
        name: 'Fruški jazački'
    },
    {
        id: 3,
        image: './partner-cover.svg',
        name: 'Fruški jazački'
    },
    {
        id: 4,
        image: './partner-cover.svg',
        name: 'Fruški jazački'
    },
    {
        id: 5,
        image: './partner-cover.svg',
        name: 'Fruški jazački'
    },
    {
        id: 6,
        image: './partner-cover.svg',
        name: 'Fruški jazački'
    },
    {
        id: 7,
        image: './partner-cover.svg',
        name: 'Fruški jazački'
    },
    {
        id: 8,
        image: './partner-cover.svg',
        name: 'Fruški jazački'
    },
    {
        id: 9,
        image: './partner-cover.svg',
        name: 'Fruški jazački'
    },
];

export default Partners