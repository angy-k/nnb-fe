'use client'
import CardComponent from "@/components/CardComponent";
import { Divider } from "@nextui-org/divider";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@nextui-org/modal";
import Button from "../Button";
import { formatTitleForUri } from '@/utils/transform-helper';
import { useRouter } from 'next/navigation'
import PageHeroSection from '@/components/Hero/pageOwl';
import { useState, useEffect } from 'react';
import eventService from '@/services/eventService';
import useUser from '@/data/use-user'

const Events = ({
  title,
  numberForDisplay,
  events: propEvents,
  pagination = false, 
  sectionType = 'event',
  showHero = true
}) => {
  const router = useRouter()
  const { user, loggedOut } = useUser()
  const [events, setEvents] = useState(propEvents || [])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [isReserveModalOpen, setIsReserveModalOpen] = useState(false)
  const [electricityOption, setElectricityOption] = useState('none')
  const [marketingOption, setMarketingOption] = useState('none')

  useEffect(() => {
    // Only fetch from API if no events were passed as props
    if (!propEvents) {
      fetchEvents()
    }
  }, [propEvents])

  const fetchEvents = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await eventService.getEvents()
      
      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          const items = Array.isArray(data.data)
            ? data.data
            : Array.isArray(data.data?.data)
              ? data.data.data
              : []
          setEvents(items)
        } else {
          throw new Error(data.message || 'Failed to fetch events')
        }
      } else {
        throw new Error('Failed to fetch events')
      }
    } catch (err) {
      console.error('Error fetching events:', err)
      setError(err.message)
      setEvents([])
    } finally {
      setLoading(false)
    }
  }

  function goToSingleEvent(event) {
    console.log('preview single event: ', event.name)
    setSelectedEvent(event)
    setIsModalOpen(true)
  }

  function closeModal() {
    setIsModalOpen(false)
    setSelectedEvent(null)
  }

  function closeReserveModal() {
    setIsReserveModalOpen(false)
  }

  function openReserveModal() {
    setIsReserveModalOpen(true)
  }

  function submitReservationOptions() {
    const eventId = selectedEvent?.id

    if (loggedOut || !user) {
      const query = new URLSearchParams({
        ...(eventId ? { event_id: String(eventId) } : {}),
        electricity: electricityOption,
        marketing: marketingOption,
      }).toString()

      closeReserveModal()
      router.push(`/prijava?${query}`)
      return
    }

    console.log('Reservation options selected', {
      eventId,
      electricityOption,
      marketingOption,
    })
    closeReserveModal()
  }

  function previewAllEvents() {
    console.log('preview all events')
  }

  let limitedEvents = numberForDisplay ? events.slice(0,numberForDisplay) : events
  
  if (loading) {
    return (
      <>
        {showHero && <PageHeroSection 
          title={`Događaji`}
        />}
        <div className="w-full events-container pt-24 grid place-items-center pb-48 z-1 bg-[#F0F0F0]">
          <div className="text-center">Loading events...</div>
        </div>
      </>
    )
  }
  
  return (
    <>
      {showHero && <PageHeroSection 
        title={`Događaji`}
      />}
      <div className="w-full blogs-container pt-24 grid place-items-center pb-48 z-1 bg-[#F0F0F0]">
        {!showHero && (
          <>
            <Divider className="section-divider w-1440" style={{marginBottom: '35px'}}/>
            <div className="flex justify-start">
              <span className="event-title text-start">Pogledaj još događaja</span>
            </div>
          </>
        )}
        {error && (
          <div className="text-red-500 text-center mb-4">
            Error loading events: {error}
          </div>
        )}
        {title && <span className="event-title">{title}</span>}
        {title && <Button
            key={`section-component-title-button-${sectionType}`}
            type={'outlined-dark'}
            name={'Pogledaj sve događaje'}
            onClick={() => previewAllEvents()}
        />}
        {title && <Divider className="section-divider"/>}
        <div className="blog-container grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {limitedEvents.map((event, index) => (
            <div className="event-card" key={`event-card-${index}`}>
              <CardComponent
                key={`events-card-${index}`}
                {...(event.coverImage && { imageSrc: event.coverImage })}
                imageWidth={438}
                imageHeight={344}
                imageRadius={"30px"}
                imageAltText={`Događaj - ${event.name || event.title}`}
                sectionType={'event'}
                title={event.name || event.title}
                creationDate={event.dateTime || event.createdAt}
                buttonAction={() => goToSingleEvent(event)}
                buttonText="Detaljnije"
              />
            </div>
          ))}
        </div>
        {/* pagination */}
        {(pagination && events.length > 12) && <Divider className="section-divider w-1440" style={{marginTop: '35px'}}/>}
        {/* {(pagination || events.length > 12) && <PaginationComponent />} */}
      </div>

      {/* Event Details Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={closeModal}
        size="2xl"
        backdrop="blur"
        placement="center"
        classNames={{
          backdrop: "backdrop-blur-sm bg-black/30",
          base: "bg-white shadow-2xl",
          body: "bg-white",
          header: "bg-white border-b border-gray-200",
          footer: "bg-white border-t border-gray-200"
        }}
      >
        <ModalContent className="bg-white rounded-2xl overflow-hidden">
          {(onClose) => (
            <>
              <ModalBody className="p-0 bg-white">
                <div className="flex flex-col md:flex-row">
                  {/* Left side - Event Image/Poster */}
                  <div className="md:w-1/2 relative overflow-hidden">
                    {/* Event cover image or gradient background */}
                    {selectedEvent?.coverImage ? (
                      <div className="absolute inset-0">
                        <img 
                          src={selectedEvent.coverImage} 
                          alt={selectedEvent.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-br from-black/60 to-black/40"></div>
                      </div>
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-indigo-800 to-purple-700"></div>
                    )}
                    
                    {/* Content overlay */}
                    <div className="relative z-10 p-8 h-full flex flex-col justify-center items-center text-white">
                      {/* Close button */}
                      <button 
                        onClick={onClose}
                        className="absolute top-4 right-4 text-white hover:text-gray-300 text-2xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors"
                      >
                        ×
                      </button>
                      
                      {/* Event poster content */}
                      <div className="text-center">
                        <h1 className="text-4xl font-bold mb-4 leading-tight">
                          {selectedEvent?.name || selectedEvent?.title}
                        </h1>
                        
                        {/* Event logo/icon placeholder */}
                        <div className="flex justify-center items-center mb-8">
                          <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                            <span className="text-3xl">🏪</span>
                          </div>
                        </div>
                        
                        {/* Date and time info */}
                        <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 border border-white/30">
                          <div className="space-y-2">
                            <p className="text-2xl font-bold">
                              {selectedEvent?.dateTime?.split(' ')[0]} {selectedEvent?.dateTime?.split(' ')[1]}
                            </p>
                            <p className="text-lg opacity-90">
                              Početak u {selectedEvent?.dateTime?.split(' ')[2] || '18:00'}
                            </p>
                            <p className="text-sm opacity-75">
                              {selectedEvent?.eventAddress}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right side - Event Details */}
                  <div className="md:w-1/2 p-8 flex flex-col">
                    <div className="mb-6">
                      <h2 className="text-3xl font-bold text-gray-900 mb-3">
                        {selectedEvent?.name || selectedEvent?.title}
                      </h2>
                      <p className="text-gray-600 leading-relaxed">
                        Pridružite se našem događaju i uživajte u jedinstvenom iskustvu. 
                        Rezervišite svoje mesto na vreme!
                      </p>
                    </div>

                    {/* Event details */}
                    <div className="space-y-6 mb-8 flex-grow">
                      <div className="flex items-start space-x-4">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <span className="text-blue-600 text-lg">📅</span>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">Datum i vreme</p>
                          <p className="text-gray-600">{selectedEvent?.dateTime}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-4">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <span className="text-green-600 text-lg">📍</span>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">Lokacija</p>
                          <p className="text-gray-600">{selectedEvent?.eventAddress}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-4">
                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <span className="text-purple-600 text-lg">👥</span>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">Dostupno mesta</p>
                          <p className="text-gray-600">{selectedEvent?.maxNumOfSeats} mesta</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-4">
                        <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <span className="text-yellow-600 text-lg">💰</span>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">Kapara</p>
                          <p className="text-gray-600">{selectedEvent?.downPayment} RSD</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-4">
                        <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <span className="text-red-600 text-lg">📧</span>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">Kontakt</p>
                          <p className="text-gray-600">{selectedEvent?.eventContactEmail}</p>
                        </div>
                      </div>
                    </div>

                    {/* Action button */}
                    <div className="flex justify-end">
                      <button 
                        onClick={() => {
                          console.log('Reserve spot for event:', selectedEvent?.name)
                          onClose()
                          openReserveModal()
                        }}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-semibold transition-colors shadow-lg hover:shadow-xl"
                      >
                        Rezerviši mesto
                      </button>
                    </div>
                  </div>
                </div>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Reservation Options Modal */}
      <Modal
        isOpen={isReserveModalOpen}
        onClose={closeReserveModal}
        size="2xl"
        backdrop="blur"
        placement="center"
        classNames={{
          backdrop: "backdrop-blur-sm bg-black/30",
          base: "bg-white shadow-2xl",
          body: "bg-white",
        }}
      >
        <ModalContent className="bg-white rounded-2xl overflow-hidden">
          {(onClose) => (
            <>
              <ModalBody className="p-0 bg-white">
                <div className="p-10">
                  <h2 className="text-center text-[#261A54] text-xl font-semibold mb-6">
                    Da li Vam je osim osvetljenja potreban
                    <br />
                    strujni priključak za određeni uređaj
                    <br />
                    neophodan za izlaganje?
                  </h2>

                  <div className="space-y-3 mb-8">
                    <label className="flex items-center gap-3 text-[#261A54]">
                      <input
                        type="radio"
                        name="electricity"
                        value="kw_xx"
                        checked={electricityOption === 'kw_xx'}
                        onChange={() => setElectricityOption('kw_xx')}
                      />
                      <span className="text-sm">Da, potreban nam je strujni priključak od XX kW</span>
                    </label>
                    <label className="flex items-center gap-3 text-[#261A54]">
                      <input
                        type="radio"
                        name="electricity"
                        value="kw_yy"
                        checked={electricityOption === 'kw_yy'}
                        onChange={() => setElectricityOption('kw_yy')}
                      />
                      <span className="text-sm">Da, potreban nam je strujni priključak od YY kW</span>
                    </label>
                    <label className="flex items-center gap-3 text-[#261A54]">
                      <input
                        type="radio"
                        name="electricity"
                        value="kw_zz"
                        checked={electricityOption === 'kw_zz'}
                        onChange={() => setElectricityOption('kw_zz')}
                      />
                      <span className="text-sm">Da, potreban nam je strujni priključak od ZZ kW</span>
                    </label>
                    <label className="flex items-center gap-3 text-[#261A54]">
                      <input
                        type="radio"
                        name="electricity"
                        value="none"
                        checked={electricityOption === 'none'}
                        onChange={() => setElectricityOption('none')}
                      />
                      <span className="text-sm">Ne, strujni priključak nam nije potreban</span>
                    </label>
                  </div>

                  <h3 className="text-[#261A54] text-lg font-semibold mb-4">
                    Da li vam je potrebna reklama?
                  </h3>

                  <div className="space-y-3 mb-8">
                    <label className="flex items-center gap-3 text-[#261A54]">
                      <input
                        type="radio"
                        name="marketing"
                        value="instagram"
                        checked={marketingOption === 'instagram'}
                        onChange={() => setMarketingOption('instagram')}
                      />
                      <span className="text-sm">Da, potrebna nam je na instagramu</span>
                    </label>
                    <label className="flex items-center gap-3 text-[#261A54]">
                      <input
                        type="radio"
                        name="marketing"
                        value="facebook"
                        checked={marketingOption === 'facebook'}
                        onChange={() => setMarketingOption('facebook')}
                      />
                      <span className="text-sm">Da, potrebna nam je na fejsbuku</span>
                    </label>
                    <label className="flex items-center gap-3 text-[#261A54]">
                      <input
                        type="radio"
                        name="marketing"
                        value="instagram_facebook"
                        checked={marketingOption === 'instagram_facebook'}
                        onChange={() => setMarketingOption('instagram_facebook')}
                      />
                      <span className="text-sm">Da, potrebna nam je na instagramu i fejsbuku</span>
                    </label>
                    <label className="flex items-center gap-3 text-[#261A54]">
                      <input
                        type="radio"
                        name="marketing"
                        value="none"
                        checked={marketingOption === 'none'}
                        onChange={() => setMarketingOption('none')}
                      />
                      <span className="text-sm">Ne, nije nam potrebna reklama</span>
                    </label>
                  </div>

                  <div className="flex justify-start">
                    <button
                      onClick={submitReservationOptions}
                      className="bg-[#56C4CF] hover:opacity-90 text-white px-8 py-3 rounded-full font-semibold transition"
                    >
                      Prijavite se
                    </button>
                  </div>
                </div>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  )
}

export default Events;