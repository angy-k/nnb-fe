'use client'; 
import { Calendar } from "@/components/Calendar"
import PageHeroSection from '@/components/Hero/pageOwl';
import Button from '@/components/Button';
import UpcommingEvents from '@/components/UpcommingEvents';
import useUser from '@/data/use-user'

const CalendarPage = () => {
  const { user } = useUser()

  return (
    <div className="mt-60 grid place-items-center w-full">
      <PageHeroSection 
          title={`Kalendar`}
        />
      <div className="w-full grid place-items-center mx-auto 2xl:max-w-screen-2xl 2xl:mx-auto pb-48 bg-[#f0f0f0]">
        <div className="hidden md:block lg:block" style={{width: '100%', height: '100%', maxWidth: '1400px'}}>
          <Calendar view={'month'} />
        </div>
        <div className="block md:hidden lg:hidden" style={{width: '100%', height: '100%', maxWidth: '1400px'}}>
          <Calendar view={'day'} />
        </div>
        {!user && (
          <div className="pt-12 flex flex-row justify-between items-center" style={{width: '100%', height: '100%', maxWidth: '1400px'}}>
            <span className="text-[darkBlue] underline text-[22px]">{`Pogledajte instrukcije za registraciju`}</span>
            <Button 
              type={'outlined-orange'}
              name={'Postani izlagač'}
              onClick={() => {
                window.dispatchEvent(new CustomEvent('nnb:open-auth-modal'))
              }}
            />
          </div>
        )}
        <UpcommingEvents />
      </div>
      
    </div>
  )
}

export default CalendarPage;
