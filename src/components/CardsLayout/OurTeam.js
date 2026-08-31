'use client'

import { useState } from "react"
import CardComponent from "../CardComponent"
import { Divider } from "@nextui-org/divider"
import { teamAnchorId, teamMemberName } from '@/utils/team'
import TeamMemberAbout from './TeamMemberAbout'
import TeamMemberModal from '@/components/Modal/TeamMemberModal'

const OurTeam = ({ members = [], title = 'Naš tim' }) => {
  // Jedan modal za ceo tim, sa članom koji je poslednji otvoren — umesto po
  // modal uz svaku karticu, kojih na stranici ume da bude i desetak.
  //
  // Namerno običan `useState`, a ne `useDisclosure`: njegov `onOpenChange`
  // zanemaruje vrednost koju NextUI prosledi i samo prebacuje stanje, pa se
  // modal nije zatvarao. Ostali modali u projektu koriste isti obrazac kao ovde.
  const [izabrani, setIzabrani] = useState(null)
  const [otvoren, setOtvoren] = useState(false)

  if (members.length === 0) return null

  const otvori = (member) => {
    setIzabrani(member)
    setOtvoren(true)
  }

  return (
    <div className="w-full blogs-container pt-24 grid place-items-start mx-auto 2xl:max-w-screen-2xl 2xl:mx-auto pb-48 bg-[#f0f0f0]">
      <div className="text-start" style={{ justifySelf: 'center', maxWidth: '1400px' }}>
        <span className="our-team-title">{title}</span>
        <Divider className="section-divider" />
        <div className="our-team-container">
          {members.map((member, index) => (
            // Sidro po imenu — sa objave na blogu se dolazi pravo na karticu
            // autorke. `scroll-mt-40` ostavlja mesta za zaglavlje, koje bi inače
            // pokrilo vrh kartice pri skoku.
            <div
              id={teamAnchorId(teamMemberName(member))}
              className="card-container team-card-gradient scroll-mt-40"
              key={`team-member-div-card-${index}`}
            >
              <CardComponent
                key={`team-member-card-${index}`}
                className="card-item"
                imageSrc={member.photo || '/our-team-cover.svg'}
                imageWidth={345}
                imageHeight={443}
                imageRadius="30px"
                imageAltText={`${member.first_name} ${member.last_name}`}
                sectionType="our-team"
                title={`${member.first_name} ${member.last_name}`}
                subtitle={member.position}
                descriptionSlot={
                  <TeamMemberAbout
                    text={member.about}
                    onReadMore={() => otvori(member)}
                  />
                }
              />
            </div>
          ))}
        </div>
      </div>

      <TeamMemberModal
        member={izabrani}
        isOpen={otvoren}
        onOpenChange={setOtvoren}
        onClose={() => setOtvoren(false)}
      />
    </div>
  )
}

export default OurTeam
