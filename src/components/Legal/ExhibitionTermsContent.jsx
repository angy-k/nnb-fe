'use client'

/**
 * Kratak izvod za modal — prikazuje se dok korisnik ne klikne „pročitaj više".
 */
export const TERMS_EXCERPT =
  'Svaki izlagač je potrebno da se upozna sa Opštim uslovima izlaganja i sa istima se saglasi. ' +
  'Uplatom kotizacije smatra se da je izlagač saglasan sa uslovima i oni su obavezujući do kraja događaja. ' +
  'Uslovi pokrivaju rok za uplatu, odustajanje najkasnije 7 dana pre događaja, pravila za izlagače hrane, ' +
  'obaveze oko higijene i radnog vremena, kao i odgovornost u slučaju loših vremenskih prilika.'

/**
 * Opšti uslovi izlaganja — deo koji važi za sve događaje.
 *
 * Podaci vezani za konkretan događaj (naziv, datum, cene kotizacija, satnica,
 * cena struje i reklame, rok za odustajanje) namerno NISU ovde — oni se
 * generišu po događaju i izlagač ih dobija uz prijavu. Ova stranica je opšti
 * pregled pravila, ne dokument koji se potpisuje.
 */
const ExhibitionTermsContent = ({ compact = false }) => {
  const H = ({ children }) => (
    <h2 className={`text-[#261A54] font-bold mt-8 mb-3 ${compact ? 'text-base mt-5 mb-2' : 'text-xl'}`}>
      {children}
    </h2>
  )

  const P = ({ children }) => (
    <p className={`leading-relaxed mb-3 ${compact ? 'text-sm' : 'text-base'}`} style={{ color: '#333333' }}>
      {children}
    </p>
  )

  const Li = ({ children }) => (
    <li className={`leading-relaxed mb-2 ${compact ? 'text-sm' : 'text-base'}`} style={{ color: '#333333' }}>
      {children}
    </li>
  )

  return (
    <>
      <P>
        Svaki izlagač je potrebno da se upozna sa Opštim uslovima izlaganja i sa istima se saglasi.
        Uplatom kotizacije prema dostavljenim instrukcijama smatra se da je izlagač saglasan sa dostavljenim
        Opštim uslovima izlaganja i isti su u tom slučaju obavezujući za istog do kraja završetka događaja.
      </P>
      <P>
        <strong>Napomena:</strong> cene kotizacija, satnica, rok za odustajanje i ostali podaci koji zavise od
        konkretnog događaja navedeni su u Opštim uslovima koje dobijate uz prijavu na taj događaj.
      </P>

      <H>Prijava i kotizacija</H>
      <P>
        Izlagač ima na raspolaganju 3 dana nakon prijema instrukcija da uplati kotizaciju, odnosno do krajnjeg
        datuma definisanog za uplatu u skladu sa instrukcijama, u protivnom smatraće se da je odustao od prijave.
        Prijave se primaju do popunjavanja kapaciteta. Organizator zadržava pravo da povuče prijavni formular
        ukoliko se izlagački kapaciteti popune.
      </P>
      <P>
        Svakom prijavljenom izlagaču obezbeđen je izlagački prostor. Svaki izlagač koji se prijavi, aplicira za
        celu tezgu i na osnovu podataka o brendu koje ostavi biće promovisan na društvenim mrežama. Nije moguće
        aplicirati i popuniti prijavu za pola tezge. Izlagači između sebe mogu deliti tezgu samo ako prodaju
        proizvode iste delatnosti (nije moguće mešati prehrambene proizvode i piće sa rukotvorinama). Izlagač koji
        deli tezgu sa nosiocem prijave nema mogućnost promovisanja na društvenim mrežama.
      </P>
      <P>
        Izlagački prostor će biti pripremljen na dan manifestacije najkasnije sat vremena pre početka, kada izlagači
        mogu početi sa opremanjem izlagačkog prostora. Nakon završetka bazara, izlagači su u obavezi da uklone svoju
        robu sa tezgi i ostave prostor u zatečenom stanju, vodeći računa o higijeni.
      </P>

      <H>Odustajanje od učešća</H>
      <P>
        Ako izlagač donese odluku da odustaje, u obavezi je da obavesti organizatore o odluci najkasnije 7 dana pre
        definisanog termina održavanja događaja, na imejl <strong>rezervacije@nocnibazar.rs</strong> za događaje u
        Novom Sadu, odnosno <strong>prijava.nocnibazar@gmail.com</strong> za događaje van Novog Sada. U suprotnom
        organizator nije u obavezi da vrati novac izlagaču.
      </P>

      <H>Vremenski uslovi i viša sila</H>
      <P>
        Koncept naših događaja je na otvorenom i pod uticajem svih godišnjih doba i vremenskih uslova. Izlagač koji
        se prijavi i uplatom kotizacije potvrdi svoje učešće svestan je svih prednosti i nedostataka, odnosno uticaja
        vremenskih prilika na održavanje samog događaja (kiša, sneg, grad, vetar, visoke i niske temperature), te
        stoga gubi pravo da potražuje od organizatora bilo kakvu naknadu štete ni za robu ni za izgubljenu dobit u
        slučaju loše prodaje nastale usled vremenskih prilika ili bilo kojih drugih slučajeva više sile.
      </P>
      <P>
        Imajte na umu da niste jedini izlagač na bazaru i da su u istoj situaciji i ostali izlagači koji su svesni
        rizika i posledica događaja na otvorenom kao i drugih okolnosti koji su izvan uticaja organizatora. Ukoliko
        pojedinom izlagaču uslovi nisu prihvatljivi za izlaganje, odnosno nije spreman da preuzme rizik izazvan
        nepovoljnim vremenskim uslovima ili drugim događajima, molimo vas da se ne prijavljujete na događaj.
      </P>
      <P>
        Neće se tolerisati širenje panike, vređanje ili bilo koji drugi vid uznemiravanja ostalih izlagača i
        organizatora. Ukoliko na samom događaju izlagač proceni da mu ne odgovara dalje učestvovanje, slobodan je da
        napusti poziciju bez prava na potraživanje plaćene kotizacije i bez mogućnosti za kasnije ponovo učestvovanje.
      </P>
      <P>
        Imajući u vidu da je vremenske prilike moguće samo u određenoj meri prognozirati, organizator u saradnji sa
        jedinicom lokalne samouprave na čijoj teritoriji se održava događaj odlučuje o održavanju istog, te u slučaju
        naročito loših vremenskih uslova ili drugih vidova više sile, organizator zadržava pravo da otkaže događaj ili
        odloži termin održavanja Bazara i na dan samog planiranog događaja.
      </P>

      <H>Politička i druga obeležja</H>
      <P>
        Kao društvena organizacija, a u cilju doslednog sprovođenja načela tržišnog poslovanja i međusobnog uvažavanja,
        na manifestacijama koje organizujemo isticanje političkih i drugih sličnih obeležja nije predviđeno. Noćni
        bazari okupljaju stvaraoce i ljubitelje proizvoda sa dušom, a fokus je na onome što nas povezuje — kreativnosti,
        lokalnoj tradiciji i posebnim pričama koje svaki proizvod nosi, kako bi atmosfera ostala prijatna i otvorena za sve.
      </P>

      <H>Odgovornost organizatora</H>
      <P>Organizator:</P>
      <ul className="list-disc pl-6 mb-3">
        <Li>
          nije odgovoran za nastanak bilo kakve materijalne štete, krađe, kao ni za povrede ljudi nastale od strane
          trećih lica ili više sile;
        </Li>
        <Li>
          ima pravo da naplati od Korisnika/ce stvarnu štetu koju Korisnik/ca prouzrokuje Pružaocu usluga ili trećem
          licu prema kom je Pružalac usluga odgovoran kao organizator/suorganizator, prouzrokovanu namerno ili krajnjom
          nepažnjom;
        </Li>
        <Li>
          ne snosi nikakvu odgovornost niti štetne posledice ako Korisnik/ca kao izlagač na bazaru nema odgovarajuće
          dozvole za rad ili postoji neki drugi nedostatak na strani Korisnika/ca zbog kojih on može da snosi zakonske
          ili druge posledice.
        </Li>
      </ul>
      <P>Organizator nije odgovoran za visinu prometa izlagača.</P>

      <H>Obaveze izlagača</H>
      <P>Korisnik/ca kao izlagač/ica dužan/dužna je:</P>
      <ul className="list-disc pl-6 mb-3">
        <Li>
          da se prema imovini koja mu je data na korišćenje tokom bazara stara sa pažnjom dobrog domaćina/domaćice;
        </Li>
        <Li>
          da obezbedi sve neophodne dozvole za promet proizvoda, da poštuje propisana zakonska pravila i procedure u
          vezi sa istima, kao i da u potpunosti i isključivo snosi odgovornost za sve propuste i manjkavosti u vezi sa
          tim, odnosno snosi eventualne štetne posledice koje iz toga proisteknu;
        </Li>
        <Li>da vodi računa i osigura svoju robu, opremu i ličnu imovinu od zlonamernih radnji trećih lica;</Li>
        <Li>
          da higijena prostora kao i lična higijena izlagača budu zadovoljavajući, da isti budu čisti i uredni, da
          prilikom prodaje hrane koriste zaštitne rukavice, ponašanje pristojno i kulturno, jer na taj način predstavljaju
          i svoj brend i proizvode, ali i samu manifestaciju i odražavaju njen ugled.
        </Li>
      </ul>
      <P>
        Izlagačima se savetuje da vode računa i osiguraju svoju robu, opremu i ličnu imovinu, odnosno izlagač je dužan
        preduzeti sve mere za zaštitu svoje robe od spoljnih uticaja u vidu obezbeđivanja dodatne zaštite (poneti najlone,
        zaštitne cirade, kanape, nepromočive kutije i sl.) na način da znatno ne narušava izgled izlagačkog prostora i
        samog događaja.
      </P>

      <H>Izlagači hrane i prehrambenih proizvoda</H>
      <P>
        Izlagači hrane i prehrambenih proizvoda, posebno izlagači mesa i mesnih prerađevina, kao i mleka i mlečnih
        proizvoda, dužni su da se pridržavaju svih zakonskih propisa i naloga veterinarske inspekcije, a u cilju
        očuvanja zdravlja posetilaca i zakonitog poslovanja svih učesnika. Organizator ne odgovara za propuste izlagača.
      </P>

      <H>1. Obavezna dokumentacija</H>
      <ul className="list-disc pl-6 mb-3">
        <Li>
          <strong>Rešenje o registraciji iz Uprave za veterinu</strong> — svi proizvođači proizvoda životinjskog porekla
          moraju posedovati ovo rešenje.
        </Li>
        <Li>
          <strong>Deklaracije za sve proizvode</strong> — svaka roba na tezgi mora imati urednu i vidljivu deklaraciju sa
          svim propisanim podacima.
        </Li>
        <Li>
          <strong>Otpremnica, faktura ili fiskalni račun</strong> — obavezni za sve izlagače koji pripremaju hranu od
          sirovina kupljenih u marketima ili drugim prodajnim mestima.
        </Li>
        <Li>
          <strong>Dokaz o poreklu proizvoda</strong> — za prerađevine i sveže proizvode, uključujući pečenje, mora postojati
          propratna dokumentacija i deklaracija.
        </Li>
      </ul>

      <H>2. Geografska ograničenja</H>
      <P>
        Privatna poljoprivredna gazdinstva (PG) mogu izlagati i prodavati proizvode isključivo u opštini registracije i
        susednim (graničnim) opštinama.
      </P>

      <H>3. Uslovi čuvanja i prodaje hrane</H>
      <ul className="list-disc pl-6 mb-3">
        <Li>
          Rashladne vitrine su obavezne za sve proizvode koji prema deklaraciji zahtevaju čuvanje na niskim temperaturama.
        </Li>
        <Li>Proizvodi moraju biti zaštićeni od sunca, toplote, insekata i prašine.</Li>
        <Li>Zabranjeno je držati lako kvarljive proizvode na otvorenom bez odgovarajuće zaštite i hlađenja.</Li>
      </ul>

      <P><strong>Posebno za izlagače mesa i pečenja:</strong></P>
      <ul className="list-disc pl-6 mb-3">
        <Li>Prodaja pečenja dozvoljena je isključivo uz validne deklaracije i dokumentaciju o poreklu mesa.</Li>
        <Li>Proizvodi moraju poticati iz objekata koji posluju u skladu sa propisima veterinarske inspekcije.</Li>
        <Li>Obavezna upotreba rashladnih uređaja za proizvode koji se ne konzumiraju odmah.</Li>
      </ul>

      <P><strong>Posebno za izlagače sira i mlečnih proizvoda:</strong></P>
      <ul className="list-disc pl-6 mb-3">
        <Li>Svi proizvodi moraju biti rashlađeni i zaštićeni tokom celog trajanja bazara.</Li>
        <Li>
          Sir ne sme biti izložen na visokim temperaturama — obavezno korišćenje termo-bokseva, frižidera ili rashladnih vitrina.
        </Li>
      </ul>

      <H>Međusobni odnosi</H>
      <P>
        Izlagači su obavezni da pokažu poštovanje prema svim članovima organizacionog tima, zvaničnim fotografima,
        snimateljima, članovima obezbeđenja, timu za održavanje higijene, kao i izvođačima zabavnog i kulturno-umetničkog
        programa. Uvrede, nepristojni gestovi, netrpeljivost ili omalovažavanje organizatora i drugih učesnika na bazaru
        nisu prihvatljivi.
      </P>
      <P>
        Održavanje profesionalnog i prijateljskog odnosa sa drugim izlagačima doprinosi pozitivnoj atmosferi na manifestaciji.
        Negujemo međusobnu solidarnost izlagača i podržavamo svaki vid uzajamne pomoći svih bazaraca.
      </P>

      <H>Strujni priključak</H>
      <P>
        Strujni priključak će biti obezbeđen samo izlagačima kojima je struja neophodna za obavljanje delatnosti, odnosno
        pripremu i/ili čuvanje hrane i/ili pića. Za priključak je potrebno podneti zahtev prilikom same prijave, navodeći
        obavezno jačinu strujnog priključka kao i razlog za obezbeđivanje istog. Kapaciteti su ograničeni, a cena je
        navedena u uslovima konkretnog događaja.
      </P>

      <H>Mogućnost reklame</H>
      <P>
        Moguće je zakupiti pojedinačnu objavu najavne reklame za izlaganje na Bazaru — za Facebook, Instagram ili obe mreže.
        Cene su navedene u uslovima konkretnog događaja.
      </P>
      <P>
        Ukoliko želite pojedinačnu objavu najavne reklame, potrebno je da posle prijave dostavite logo u vektorskom formatu
        ili fotografiju koju želite da koristimo, najkasnije sedam dana pre održavanja manifestacije. Neblagovremeno poslat
        materijal, kao i fotografije neodgovarajućeg formata odnosno neadekvatne rezolucije, nećemo moći da koristimo, u kom
        slučaju reklama neće biti realizovana bez obzira na izvršeno plaćanje iste, bez prava na povrat sredstava.
      </P>

      <H>Fotografisanje i snimanje</H>
      <P>
        U cilju dokumentovanja i promocije događaja, Organizatora i učesnika/izlagača, tokom trajanja događaja može se vršiti
        fotografisanje, audio i video snimanje prostora, izlagačkih štandova, proizvoda, promotivnih materijala, brendova i
        samih učesnika/ca/izlagača/ica. Učesnik/ica, odnosno izlagač/ica je saglasan/na da Organizator tako nastali foto,
        audio i video materijal može obrađivati, objavljivati i koristiti, bez naknade i bez potrebe za pribavljanjem dodatne
        saglasnosti za svaku pojedinačnu objavu, putem svojih internet stranica, društvenih mreža, promotivnih i informativnih
        materijala, medija i drugih odgovarajućih kanala komunikacije, isključivo u svrhu promocije, predstavljanja i
        informisanja javnosti o događaju, Organizatoru i njegovim aktivnostima.
      </P>
      <P>
        Obrada materijala na kojem je učesnik/ica odnosno izlagač/ica identifikovan ili odrediv kao fizičko lice vršiće se u
        skladu sa propisima o zaštiti podataka o ličnosti, uz pravo učesnika/ice, odnosno izlagača/ice da saglasnost za buduću
        obradu i objavljivanje takvog materijala opozove obraćanjem Organizatoru, pri čemu opoziv ne utiče na zakonitost obrade
        izvršene pre njegovog opoziva.
      </P>

      <H>Poštovanje radnog vremena</H>
      <P>
        Organizator u toku događaja kontroliše zauzetost pozicija/tezgi od strane prijavljenih izlagača/ica, odnosno prisustvo
        na tezgama i evidentira svako prevremeno napuštanje bazara.
      </P>
      <P>
        Organizator nakon završenog događaja sve izlagače/ice za koje je tokom kontrole utvrdio da nisu poštovali radno vreme
        bazara, elektronskim putem (imejlom) poziva na obavezu plaćanja penala u visini cene plaćene kotizacije sa dostavljenim
        instrukcijama za uplatu, te u slučaju nepoštovanja iste, nepoštovanje sankcioniše zabranom ponovnog izlaganja na drugim
        događajima koje organizuje.
      </P>
      <P>
        Izlagač je dužan ostati do kraja završetka događaja kako je predviđeno satnicom organizatora (ne rasprema tezgu), osim u
        slučaju nepredviđenih okolnosti kada je korisnik/ca o tome dužan/dužna da obavesti organizatora putem lica koje je tog
        dana određeno za komunikaciju.
      </P>
      <P>
        U slučaju bezrazložnog prevremenog napuštanja tezge i događaja, izlagač/ica je dužan na račun organizatora uplatiti
        novčani iznos u visini cene plaćene kotizacije u roku od 7 dana od dana završetka događaja koji nije ispoštovao, u
        suprotnom mu neće biti više dozvoljeno da izlaže na bazarima u režiji organizatora/suorganizatora.
      </P>
      <P>
        Nakon završetka bazara, izlagač/ica je u obavezi da ukloni svoju robu sa tezge i ostavi prostor u zatečenom stanju,
        vodeći računa o higijeni, ukloni ostatke i ambalažu iza sebe i iste odloži u prostor predviđen za tu namenu.
      </P>
    </>
  )
}

export default ExhibitionTermsContent
