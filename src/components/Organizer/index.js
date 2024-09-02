
const OrganizerWord = ({
    mainWordText = mockWords
}) => {
    return (
        <div className='w-screen h-screen'>
            <div className="w-full section-main-word-background-image-div">
                <div className="section-main-word-wrapper">
                    <div className="section-main-word">
                        <div className="section-main-subcomponent">
                            <span className="section-main-word-title text-darkBlue">{`Marija Radojčić`}</span>
                            <span className="section-main-word-subtitle text-darkBlue">{`Organizator`}</span>
                            <div className="section-main-word-content text-black">{mainWordText()}</div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="bg-darkBlue organizer-section-quote justify-center">
                <span className="organizer-section-main-quote text-lightBlue">{`“Život nema reprizu”`}</span>
                <span className="organizer-section-sub-quote text-[#ffffff]">{`je misao koju ja živim u svakom smislu.`}</span>
            </div>
        </div>
    )
}

const mockWords = () => {
    return (
        <>
            <p>{`Marija Radojčić, velik pozitivac, svesna da u životu ne postoje problemi nego izazovi, sve je rešivo samo je pitanje napravljenog izbora i definisanog priorita. Po osnovnom obrazovanju ekonomistkinja, nositeljka je licence Business Cafea za Vojvodinu, radi prodaju i marketing za porodične sireve “Friški jazački”, vlasnica firme za brendiranje i konsalting sa posebnim akcentom na brendiranje proizvoda koji nastaju u poljoprivrednim gazdinstvima.`}</p>

            <p>{`Zaista sve ovo radim, možda zvuči neverovatno, ali je tako. Kada se desi da dođem u situaciju da između dva posla biram onaj koji je više plaćen i ne volim ga i onaj koji je manje plaćen i volim da ga radim, uvek ću izabrati ovaj drugi. Za mene je ljubav pokretač svega.`}</p>
    
            <p>{`Posao u vezi sa sirevima je porodični posao. Tu su angažovani i mama i brat. Nama je jako važna povratna informacija od naših kupaca i degustatora, te mi isključivo vršimo direktnu prodaju i isporuku na kućnim adresama naših kupaca u skladu sa dogovorom i njihovim potrebama.`}</p>
    
            <p>{`Situacija nije ni najmanje laka, generalno ni za preduzetništvo ni za žene preduzetnice. Ali jedno je sigurno, kada volite ono što radite, onda sve izazove lakše savladate. Umrežavanje preduzetnika je u povoju.`}</p>
    
            <p>{`Ako želite slobodu, budite hrabri i sledite svoje snove, radite ono što volite i uspeh je zagarantovan, pomozite drugima kad god možete i to će Vam se vratiti kad se najmanje budete nadali.`}</p>
    </>)
}
export default OrganizerWord;