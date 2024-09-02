import CardComponent from "../CardComponent";
import EventDefaultImage from "./assets/event-default-image.png"

const Events = ({
    events = mockEvents
}) => {
    function moreAboutEvent() {
        //TODO: display dialog with more details about event
    }
    return (
        <div className="blog-container">
        {events.map((event, index) => {
            <div className="blog-card">
            <CardComponent 
                key={`event-card-${index}`}
                imageSrc={event.coverImage}
                imageWidth={445}
                imageHeight={445}
                imageRadius={"30px"}
                imageAltText={`Event card - ${event.title}`}
                sectionType={'event'}
                title={event.title}
                onClick={moreAboutEvent()}
                buttonText="Detaljnije"
            />
            </div>
        })}
        </div>
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
        coverImage: EventDefaultImage,
        title: "Noćni bazar u Rumi",
    },
    {
        id: 3,
        coverImage: EventDefaultImage,
        title: "Noćni bazar u Rumi",
    },
    {
        id: 4,
        coverImage: EventDefaultImage,
        title: "Noćni bazar u Rumi",
    },
    {
        id: 5,
        coverImage: EventDefaultImage,
        title: "Noćni bazar u Rumi",
    },
    {
        id: 6,
        coverImage: EventDefaultImage,
        title: "Noćni bazar u Rumi",
    },
    {
        id: 7,
        coverImage: EventDefaultImage,
        title: "Noćni bazar u Rumi",
    },
    {
        id: 8,
        coverImage: EventDefaultImage,
        title: "Noćni bazar u Rumi",
    },
    {
        id: 9,
        coverImage: EventDefaultImage,
        title: "Noćni bazar u Rumi",
    },
    {
        id: 10,
        coverImage: EventDefaultImage,
        title: "Noćni bazar u Rumi",
    },
    {
        id: 11,
        coverImage: EventDefaultImage,
        title: "Noćni bazar u Rumi",
    },

];

export default Events;