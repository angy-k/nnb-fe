'use client'
import { useEffect, useState } from 'react'
import CardComponent from "../CardComponent"
import { Divider } from "@nextui-org/divider"

const OurTeam = ({ title = 'Naš tim' }) => {
  const [members, setMembers] = useState([])

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/index/about-us`,
          { cache: 'no-store' }
        )
        if (!res.ok) return
        const data = await res.json()
        if (data?.success && Array.isArray(data?.data?.team)) {
          setMembers(data.data.team)
        }
      } catch {
        // tihо ne prikazujemo grešku — sekcija jednostavno ostaje prazna
      }
    }
    load()
  }, [])

  if (members.length === 0) return null

  return (
    <div className="w-full blogs-container pt-24 grid place-items-start mx-auto 2xl:max-w-screen-2xl 2xl:mx-auto pb-48 bg-[#f0f0f0]">
      <div className="text-start" style={{ justifySelf: 'center', maxWidth: '1400px' }}>
        <span className="our-team-title">{title}</span>
        <Divider className="section-divider" />
        <div className="our-team-container">
          {members.map((member, index) => (
            <div className="card-container team-card-gradient" key={`team-member-div-card-${index}`}>
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
                description={member.about}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default OurTeam
