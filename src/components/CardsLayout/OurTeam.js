import CardComponent from "../CardComponent"
import DefaultProfile from "./assets/default-our-team-image.png"
import { Divider } from "@nextui-org/divider";

const OurTeam = ({
    title = 'Naš tim',
    members = mockMembers
}) => {
    return (
        <>
        <span className="our-team-title">{title}</span>
        <Divider className="section-divider"/>
        <div className="our-team-container">
            {members.map((member, index) => {
                <div className="card-container team-card-gradient">
                    <CardComponent 
                        key={`team-member-card-${index}`}
                        imageSrc={member.image}
                        imageWidth={345}
                        imageHeight={443}
                        imageRadius={"30px"}
                        imageAltText={`Team member - ${member.firstName} ${member.lastName}`}
                        sectionType={'our-team'}
                        title={`${member.firstName} ${member.lastName}`}
                        subtitle={member.position}
                        description={member.about}
                        className="card-item"
                    />
                </div>
            })}
        </div>
        </>
    )
}

const mockMembers = [
    {
        id: 1,
        firstName: 'Petar',
        lastName: 'Petrovic',
        image: DefaultProfile,
        position: 'Lorem ipsum dolor',
        about: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris dapibus convallis nisl sit amet finibus.'
    },
    {
        id: 2,
        firstName: 'Petar',
        lastName: 'Petrovic',
        image: DefaultProfile,
        position: 'Lorem ipsum dolor',
        about: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris dapibus convallis nisl sit amet finibus.'
    },
    {
        id: 3,
        firstName: 'Petar',
        lastName: 'Petrovic',
        image: DefaultProfile,
        position: 'Lorem ipsum dolor',
        about: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris dapibus convallis nisl sit amet finibus.'
    },
    {
        id: 4,
        firstName: 'Petar',
        lastName: 'Petrovic',
        image: DefaultProfile,
        position: 'Lorem ipsum dolor',
        about: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris dapibus convallis nisl sit amet finibus.'
    },
    {
        id: 5,
        firstName: 'Petar',
        lastName: 'Petrovic',
        image: DefaultProfile,
        position: 'Lorem ipsum dolor',
        about: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris dapibus convallis nisl sit amet finibus.'
    },
    {
        id: 6,
        firstName: 'Petar',
        lastName: 'Petrovic',
        image: DefaultProfile,
        position: 'Lorem ipsum dolor',
        about: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris dapibus convallis nisl sit amet finibus.'
    }
];

export default OurTeam