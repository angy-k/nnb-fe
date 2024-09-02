import CardComponent from "../CardComponent";
import PlusIcon from "../../icons/plus-icon.svg";
import ErasmusLogo from "./assets/erasmus-logo.svg"


const Partners = ({
    partners = mockPartners,
}) => {
    function moreAboutPartner() {
        //TODO: display dialog with more details about partner
    }
    return (
        <div className="blog-container">
        {partners.map((partner, index) => {
            <div className="blog-card">
            <CardComponent 
                key={`partner-card-${index}`}
                imageSrc={partner.image}
                imageWidth={415}
                imageHeight={272}
                imageRadius={"0px"}
                imageAltText={`Partner card- ${partner.name}`}
                sectionType={`partner`}
                onClick={moreAboutPartner()}
                buttonIcon={PlusIcon}
                buttonIconSize={22}
            />
            </div>
        })}</div>
    )
}

const mockPartners = [
    {
        id: 1,
        image: ErasmusLogo,
        name: 'Erasmus +'
    },
    {
        id: 2,
        image: ErasmusLogo,
        name: 'Erasmus +'
    },
    {
        id: 3,
        image: ErasmusLogo,
        name: 'Erasmus +'
    },
    {
        id: 4,
        image: ErasmusLogo,
        name: 'Erasmus +'
    },
    {
        id: 5,
        image: ErasmusLogo,
        name: 'Erasmus +'
    },
    {
        id: 6,
        image: ErasmusLogo,
        name: 'Erasmus +'
    },
    {
        id: 7,
        image: ErasmusLogo,
        name: 'Erasmus +'
    },
    {
        id: 8,
        image: ErasmusLogo,
        name: 'Erasmus +'
    },
    {
        id: 9,
        image: ErasmusLogo,
        name: 'Erasmus +'
    },
];

export default Partners