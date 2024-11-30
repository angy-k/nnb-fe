import CardComponent from "../CardComponent"
import { Divider } from "@nextui-org/divider";

const OurTeam = ({
  title = 'Naš tim',
  members = mockMembers
}) => {
  return (
    <div className="w-full blogs-container pt-24 grid place-items-start mx-auto 2xl:max-w-screen-2xl 2xl:mx-auto pb-48 bg-[#f0f0f0]">
      <div className="text-start" style={{justifySelf: 'center', maxWidth: '1400px'}}>
        <span className="our-team-title">{title}</span>
        <Divider className="section-divider"/>
        <div className="our-team-container">
          {members.map((member, index) => (
            <div className="card-container team-card-gradient" key={`team-member-div-card-${index}`}>
              <CardComponent 
                key={`team-member-card-${index}`}
                className="card-item"
                imageSrc={member.image}
                imageWidth={345}
                imageHeight={443}
                imageRadius={"30px"}
                imageAltText={`Team member - ${member.firstName} ${member.lastName}`}
                sectionType={'our-team'}
                title={`${member.firstName} ${member.lastName}`}
                subtitle={member.position}
                description={member.about}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const mockMembers = [
    {
        id: 1,
        firstName: 'Petar',
        lastName: 'Petrovic',
        image: './our-team-cover.svg',
        position: 'Lorem ipsum dolor',
        about: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris dapibus convallis nisl sit amet finibus.'
    },
    {
        id: 2,
        firstName: 'Petar',
        lastName: 'Petrovic',
        image: './our-team-cover.svg',
        position: 'Lorem ipsum dolor',
        about: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris dapibus convallis nisl sit amet finibus.'
    },
    {
        id: 3,
        firstName: 'Petar',
        lastName: 'Petrovic',
        image: './our-team-cover.svg',
        position: 'Lorem ipsum dolor',
        about: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris dapibus convallis nisl sit amet finibus.'
    },
    {
        id: 4,
        firstName: 'Petar',
        lastName: 'Petrovic',
        image: './our-team-cover.svg',
        position: 'Lorem ipsum dolor',
        about: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris dapibus convallis nisl sit amet finibus.'
    },
    {
        id: 5,
        firstName: 'Petar',
        lastName: 'Petrovic',
        image: './our-team-cover.svg',
        position: 'Lorem ipsum dolor',
        about: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris dapibus convallis nisl sit amet finibus.'
    },
    {
        id: 6,
        firstName: 'Petar',
        lastName: 'Petrovic',
        image: './our-team-cover.svg',
        position: 'Lorem ipsum dolor',
        about: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris dapibus convallis nisl sit amet finibus.'
    },
    {
        id: 7,
        firstName: 'Petar',
        lastName: 'Petrovic',
        image: './our-team-cover.svg',
        position: 'Lorem ipsum dolor',
        about: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris dapibus convallis nisl sit amet finibus.'
    },
    {
        id: 8,
        firstName: 'Petar',
        lastName: 'Petrovic',
        image: './our-team-cover.svg',
        position: 'Lorem ipsum dolor',
        about: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris dapibus convallis nisl sit amet finibus.'
    }
];

export default OurTeam