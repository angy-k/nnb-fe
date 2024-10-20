import EventDefaultImage from "./assets/event-default-image.png"
import CardComponent from "@/components/CardComponent";
import Link from 'next/link';
import { formatTitleForUri } from '@/utils/transform-helper';
import PageHeroSection from '@/components/Hero/pageOwl';

const Events = ({
  events = mockEvents
}) => {
  function moreAboutEvent() {
      //TODO: display dialog with more details about event
  }
  return (
    <>
      <PageHeroSection 
        title={`Događaji`}
      />
      <div className="w-full blogs-container pt-24 grid place-items-center pb-48 z-1 bg-[#F0F0F0]">
        <div className="blog-container grid sm:grid-template-1 md:grid-template-2">
          {events.map((event, index) => (
            <div className="event-card" key={`event-card-${index}`}>
              <Link
                prefetch={false}
                legacyBehavior
                href={`/dogadjaj/${formatTitleForUri(event.title)}`}
              >
                <CardComponent
                  key={`events-card-${index}`}
                  imageSrc={event.coverImage}
                  imageWidth={438}
                  imageHeight={344}
                  imageRadius={"30px"}
                  imageAltText={`Dogadjaj - ${event.title}`}
                  sectionType={'event'}
                  title={event.title}
                  buttonAction={() => goToSingleEvent()}
                  buttonText="Detaljnije"
                />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
const mockEvents = [
    {
      id: 1,
      coverImage: EventDefaultImage,
      title: "Noćni bazar u Rumi",
    },
    {
      id: 2,
      coverImage: './event-cover.svg',
      title: "Noćni bazar u Rumi",
    },
    {
      id: 3,
      coverImage: './event-cover.svg',
      title: "Noćni bazar u Rumi",
    },
    {
      id: 4,
      coverImage: './event-cover.svg',
      title: "Noćni bazar u Rumi",
    },
    {
      id: 5,
      coverImage: './event-cover.svg',
      title: "Noćni bazar u Rumi",
    },
    {
      id: 6,
      coverImage: './event-cover.svg',
      title: "Noćni bazar u Rumi",
    },
    {
        id: 7,
        coverImage: './event-cover.svg',
        title: "Noćni bazar u Rumi",
    },
    {
        id: 8,
        coverImage: './event-cover.svg',
        title: "Noćni bazar u Rumi",
    },
    {
        id: 9,
        coverImage: './event-cover.svg',
        title: "Noćni bazar u Rumi",
    },
    {
        id: 10,
        coverImage: './event-cover.svg',
        title: "Noćni bazar u Rumi",
    },
    {
        id: 11,
        coverImage: './event-cover.svg',
        title: "Noćni bazar u Rumi",
    },

];

export default Events;