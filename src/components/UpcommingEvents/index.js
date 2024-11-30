"use client";
import { Divider } from "@nextui-org/divider";
import {Table, TableHeader, TableColumn, TableBody, TableRow, TableCell} from "@nextui-org/table";


const UpcommingEvents = ({
    title = 'Očekivani događaji',
    otherEvents = mockedEvents
}) => {
    return (
      <div 
        className="w-full blogs-container pt-24 grid place-items-start mx-auto 2xl:max-w-screen-2xl 2xl:mx-auto pb-48" 
        style={{justifySelf: 'center', maxWidth: '1400px'}}
      >
        {/* <div className="text-start"> */}
          <span className="our-team-title">{title}</span>
          <Divider className="section-divider"/>
          <Table aria-label="Example static collection table" radius>
            <TableHeader>
              <TableColumn className="text-[#1B1B1B] capitalize font-bold font-[18px]">Manifestacija</TableColumn>
              <TableColumn className="text-[#1B1B1B] capitalize font-bold font-[18px]">Mesto</TableColumn>
              <TableColumn className="text-[#1B1B1B] capitalize font-bold font-[18px]">Datum</TableColumn>
              <TableColumn className="text-[#1B1B1B] capitalize font-bold font-[18px]">Početak prijava</TableColumn>
            </TableHeader>
            <TableBody>
              {otherEvents.map((event, index) => (
                <TableRow
                  key={index}
                >
                  <TableCell className="text-[#1B1B1B] capitalize font-normal font-[18px] rounded-l-full"
                    style={{ flex: 1, padding: '16px', backgroundColor: '#56C4CF', }}
                  >
                    {event.name}
                  </TableCell>
                  <TableCell className="text-[#1B1B1B] capitalize font-normal font-[18px]"
                    style={{ flex: 1, backgroundColor: '#56C4CF', padding: '16px' }}
                  >
                    {event.location}
                  </TableCell>
                  <TableCell className="text-[#1B1B1B] capitalize font-normal font-[18px]"
                    style={{ flex: 1, backgroundColor: '#56C4CF', padding: '16px' }}
                  >
                    {event.date}
                  </TableCell>
                  <TableCell className="text-[#1B1B1B] capitalize font-normal font-[18px] rounded-r-full"
                    style={{flex: 1,  padding: '16px', backgroundColor: '#56C4CF' }}
                  >
                    {event.applicationStart}
                  </TableCell>
              </TableRow>
              ))}
            </TableBody>
          </Table>
        {/* </div> */}
      </div>
    )
}

export default UpcommingEvents;

const mockedEvents = [
  {
    name: 'Start up NNB (Umetnost kroz ples)',
    location: 'Riblja pijaca, Novi Sad',
    date: '21.06.2024.',
    applicationStart: '07.06.2024.'
  },
  {
    name: 'Start up NNB (Umetnost kroz ples)',
    location: 'Riblja pijaca, Novi Sad',
    date: '21.06.2024.',
    applicationStart: '07.06.2024.'
  },
]