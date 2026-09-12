import Image from 'next/image';
import { uPasuse } from '@/utils/tekst'

const OrganizerWord = ({
    name      = 'Marija Radojčić',
    role      = 'Organizator',
    photoUrl  = '/handsome-confident-smiling-man-with-hands-crossed-chest.png',
    quote     = '"Život nema reprizu"',
    quoteSub  = 'je misao koju ja živim u svakom smislu.',
    bio       = null,
}) => {
  const bioContent = bio
    ? uPasuse(bio).map((p, i) => <p key={i} style={{ whiteSpace: 'pre-wrap' }}>{p}</p>)
    : <DefaultBio />;

  return (
    <div className='w-full organizer-outer' style={{position: 'relative', width: '100%', display: 'flex', flexDirection: 'column'}}>
      {/* Visina fotografije je iz dizajna: 1523px. Kartica je 1070px, pa iznad
          i ispod nje ostaje po oko 226px vazduha. Ranijih 1743px je ostavljalo
          341px sa svake strane, pa je sekcija delovala razvučeno.

          Ispod 1300px širine visina prelazi na `auto` (vidi global.css) — tamo
          se tekst prelama u više redova i fiksna mera bi pukla. */}
      <div className="w-full section-main-word-background-image-div" style={{width: '100%', height: '1523px',  display: 'block', position: 'relative'}}>
        <Image
          src={photoUrl}
          fill={true}
          alt='organizer-main-word-bg'
        />
        <div className="section-main-word-wrapper items-center" style={{ maxWidth: 'var(--nnb-kolona)', justifySelf: 'center',}}>
          <div className="section-main-word">
            <div className="section-main-subcomponent">
              <span className="section-main-word-title text-darkBlue">{name}</span>
              <span className="section-main-word-subtitle text-darkBlue">{role}</span>
              {/* Tekst je po dizajnu poravnat levo, sa nazubljenom desnom
                  ivicom. Obostrano poravnanje je razvlačilo razmake među
                  rečima, što se na uskoj koloni jasno videlo. */}
              <div className="section-main-word-content text-black">{bioContent}</div>
            </div>
          </div>
        </div>
      </div>
      {/* Traka sa citatom stoji ISPOD fotografije, kao zasebna tamna traka —
          tako je na dizajnu (fotografija se završava na 4529, traka ide
          4530–4801). Ranije je bila `position: absolute; bottom: 0`, pa je
          ležala preko donjih 211px fotografije i, čim bi se tekst biografije
          prelomio u više redova, nalećala na karticu. */}
      <div className="bg-darkBlue organizer-section-quote justify-center" style={{width: '100%'}}>
        <span className="organizer-section-main-quote text-lightBlue" style={{ whiteSpace: 'pre-wrap' }}>{quote}</span>
        <span className="organizer-section-sub-quote text-[#ffffff]" style={{ whiteSpace: 'pre-wrap' }}>{quoteSub}</span>
      </div>
    </div>
  )
}

const DefaultBio = () => (
  <>
    <p>{`Marija Radojčić, velik pozitivac, svesna da u životu ne postoje problemi nego izazovi, sve je rešivo samo je pitanje napravljenog izbora i definisanog prioriteta. Po osnovnom obrazovanju ekonomistkinja, nositeljka je licence Business Cafea za Vojvodinu, radi prodaju i marketing za porodične sireve "Friški jazački", vlasnica firme za brendiranje i konsalting sa posebnim akcentom na brendiranje proizvoda koji nastaju u poljoprivrednim gazdinstvima.`}</p>
    <p>{`Zaista sve ovo radim, možda zvuči neverovatno, ali je tako. Kada se desi da dođem u situaciju da između dva posla biram onaj koji je više plaćen i ne volim ga i onaj koji je manje plaćen i volim da ga radim, uvek ću izabrati ovaj drugi. Za mene je ljubav pokretač svega.`}</p>
    <p>{`Posao u vezi sa sirevima je porodični posao. Tu su angažovani i mama i brat. Nama je jako važna povratna informacija od naših kupaca i degustatora, te mi isključivo vršimo direktnu prodaju i isporuku na kućnim adresama naših kupaca u skladu sa dogovorom i njihovim potrebama.`}</p>
    <p>{`Situacija nije ni najmanje laka, generalno ni za preduzetništvo ni za žene preduzetnice. Ali jedno je sigurno, kada volite ono što radite, onda sve izazove lakše savladate. Umrežavanje preduzetnika je u povoju.`}</p>
    <p>{`Ako želite slobodu, budite hrabri i sledite svoje snove, radite ono što volite i uspeh je zagarantovan, pomozite drugima kad god možete i to će Vam se vratiti kad se najmanje budete nadali.`}</p>
  </>
)

export default OrganizerWord;
