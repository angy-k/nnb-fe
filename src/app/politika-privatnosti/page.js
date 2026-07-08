import PageHeroSection from "@/components/Hero/pageOwl";

export const metadata = {
  title: 'Politika privatnosti — Novosadski noćni bazar',
  robots: { index: false, follow: false },
}

const Section = ({ title, children }) => (
  <div className="mb-8">
    <h2 className="text-xl font-bold mb-3" style={{ color: '#261A54' }}>{title}</h2>
    {children}
  </div>
)

const P = ({ children }) => (
  <p className="mb-4 text-base leading-relaxed" style={{ color: '#333333' }}>{children}</p>
)

const Li = ({ children }) => (
  <li className="mb-2 text-base leading-relaxed" style={{ color: '#333333' }}>{children}</li>
)

export default function PolitikaPrivatnostiPage() {
  return (
    <>
      <PageHeroSection
        title="Politika privatnosti"
        type="description"
        icons={false}
        description="Novosadski noćni bazar, Novi Sad, Vase Stajića br. 20b/38"
      />

      <div className="w-full bg-[#F0F0F0]">
        <div className="max-w-[860px] mx-auto px-6 py-16">

          <Section title="Šta su podaci o ličnosti?">
            <P>Podatak o ličnosti je svaki podatak koji se odnosi na fizičko lice čiji je identitet određen ili odrediv, neposredno ili posredno, posebno na osnovu oznake identiteta, kao što je ime i identifikacioni broj, podataka o lokaciji, identifikatora u elektronskim komunikacionim mrežama ili jednog, odnosno više obeležja njegovog fizičkog, fiziološkog, genetskog, mentalnog, ekonomskog, kulturnog i društvenog identiteta.</P>
            <P>Obrada podataka o ličnosti odnosi se na bilo koju radnju koja se vrši sa podacima o ličnosti kao što su prikupljanje, beleženje, prepisivanje, umnožavanje, kopiranje, prenošenje, čuvanje, prilagođavanje, brisanje.</P>
          </Section>

          <Section title="Rukovalac podacima">
            <P>Rukovalac je subjekat koji samostalno ili sa drugim subjektima određuje svrhu i način obrade podataka o ličnosti.</P>
            <P>Rukovalac podacima za obradu podataka je Udruženje Novosadski noćni bazar, Novi Sad, Vase Stajića br. 20b/38 (u daljem tekstu: Novosadski noćni bazar ili samo skraćeno NNB).</P>
          </Section>

          <Section title="Razlozi zbog kojih prikupljamo podatke (svrha obrade podataka)">
            <h3 className="font-semibold mb-2" style={{ color: '#261A54' }}>1. Internet sajt www.nocnibazar.rs</h3>
            <P>Prikupljanjem podataka na web stranici nocnibazar.rs nudi vam mogućnost što preciznije, lakše i jednostavnije pretrage našeg sajta. Ukoliko želite da budete redovno obavešteni o novitetima i novim bazarima, a ne želite da svaki dan ulazite na naš sajt ili društvene mreže — rado ćemo to učiniti umesto vas. Pre svega, kroz mogućnost newsletter prijave nudimo vam mogućnost da budete uvek i pravovremeno obavešteni o novim događajima, a potrebno je samo da ostavite vašu email adresu kao lični podatak, kako bismo vam omogućili ovu prijavu.</P>

            <h3 className="font-semibold mb-2 mt-4" style={{ color: '#261A54' }}>2. Izlagači</h3>
            <P>Kako biste postali deo priče Novosadskog noćnog bazara i uzeli učešće na njemu kao izlagač/izlagačica, potrebno je da posetite našu stranicu za prijavu i ostavite nam podatke na osnovu kojih možemo da vas kontaktiramo i izvršimo rezervaciju tezge za izlaganje na određenom događaju. Takođe i u slučaju da želite odgovor na neko vama bitno pitanje o našim uslugama, najlakši način da to učinimo jeste da nam ostavite vaše lične podatke (ime i prezime, kontakt telefon, kontakt mail), kako bismo to pravovremeno i što pre učinili i kako bi informacije stigle do vas na vreme.</P>

            <h3 className="font-semibold mb-2 mt-4" style={{ color: '#261A54' }}>3. Cookies/Kolačići</h3>
            <P>Da bismo vam obezbedili što bolje funkcionisanje našeg web sajta i pretragu naših web stranica, prikupljaćemo podatke prilikom same vaše posete našoj internet stranici. U tu svrhu, koristimo kolačiće i Google Analytics, o čemu više informacija možete pronaći u kasnijim redovima, kao i korišćenju i interakciji sa nalozima na društvenim mrežama Instagram stranica Noćni bazar i Facebook stranici Trg preduzetništva, ili korišćenju platformi društvenih mreža za obezbeđivanje što boljih informacija o našim proizvodima i uslugama.</P>
            <P>Pored navedenih svrha, može se desiti da obrađujemo lične podatke u svrhu pregovora, zaključenja i ispunjenja ugovora. Napominjemo da vi odlučujete da li ćete nam i koje podatke dostaviti. Iz tog razloga, prilikom unošenja podataka na internet stranici obratite pažnju da li su sva polja obavezna.</P>
          </Section>

          <Section title="Pravni osnov obrade podataka">
            <P>Za neke svrhe obrade, vaše lične podatke obrađujemo na osnovu vašeg pristanka za obradu podataka o ličnosti uz prethodno obaveštavanje o svim bitnim aspektima obrade. Bitno je da znate da pristanak u bilo kom momentu i bez obrazloženja možete povući, što za posledicu ima prestanak dalje obrade, ali ne utiče na legalnost prethodne obrade podataka pre povlačenja saglasnosti.</P>
            <P>U nekim situacijama je pravni osnov za obradu ličnih podataka ugovorni odnos sa licem na koje se lični podaci odnose, kao što je npr. slučaj kod obrade neophodne za sam pristup i korišćenje sajta za potrebe rezervacije na učešće na bazarima i drugim događajima u organizaciji Novosadskog noćnog bazara i njegovih partnerskih organizacija.</P>
            <P>Takođe, u nekim situacijama imamo legitiman interes za obradu vaših podataka, kao npr. kada je obrada neophodna u svrhu sprečavanja prevara ili eventualnih zloupotreba.</P>
          </Section>

          <Section title="Legitimni interes">
            <P>Kako bismo ostvarili našu poslovnu svrhu, obrađujemo vaše lične podatke na osnovu legitimnog interesa. Naravno, to radimo samo ukoliko vaš interes ili vaša osnovna prava i slobode ne pretežu nad našim legitimnim interesom. Legitimni interes koristimo kako bismo:</P>
            <ul className="list-disc pl-6 mb-4">
              <Li>dijagnostikovali tehničke probleme sa servisom;</Li>
              <Li>obradili vašu prijavu na bazar, odgovorili na vaše zahteve i moguće pritužbe;</Li>
              <Li>zaštitili naše poslovanje i pružili podršku našim korisnicima;</Li>
              <Li>testirali i razvijali nove usluge i kako bismo poboljšali postojeće;</Li>
              <Li>identifikovali i zaštitili korisnike servisa i sam servis od prevare ili nelegalnih aktivnosti.</Li>
            </ul>
          </Section>

          <Section title="Pravo na korišćenje">
            <P>Pristup vašim podacima imaju članovi tima u organizaciji Novosadskog noćnog bazara i to samo oni kojima su potrebni kako bi ispunili sve vaše zahteve.</P>
            <P>U određenim situacijama, pristup podacima mogu imati naši eksterni partneri kojima poveravamo određene poslove kako bismo usluge koje pružamo doveli na najviši nivo. Svi naši partneri su izabrani na veoma strog i pažljiv način obavezujući se Ugovorom na čuvanje ličnih podataka u tajnosti, kao i svih poslovnih tajni kompanije.</P>
          </Section>

          <Section title="Prenos ličnih podataka u druge države">
            <P>Vaši podaci se ne iznose u druge države.</P>
          </Section>

          <Section title="Trajnost podataka">
            <P>Podatke čuvamo samo onoliko koliko su nam potrebni da bismo ostvarili svrhu za koju ste nam podatke i dali ili do vašeg opoziva. Nakon toga, vaše podatke ćemo obrisati ili učiniti neprepoznatljivim.</P>
            <P>Podatke koje nam dostavite prilikom prijave na newsletter, čuvamo do vaše odjave. U svakom trenutku se možete odjaviti sa newslettera.</P>
            <P>Izuzetno, vaše podatke možemo čuvati i nakon povlačenja pristanka ili ispunjenja svrhe, u situacijama kada je to neophodno radi izvršenja naše zakonske obaveze ili radi podnošenja, ostvarivanja ili odbrane pravnog zahteva.</P>
          </Section>

          <Section title="Vaša prava u vezi sa ličnim podacima koje obrađujemo">
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-1" style={{ color: '#261A54' }}>1) Transparentnost</h3>
                <P>Kada nam ostavljate lične podatke, transparentno ćemo vas obavestiti o svrsi za koji su nam određeni podaci potrebni, ko koristi ove podatke, te ćemo vam pružiti sve ostale informacije relevantne za obradu vaših podataka.</P>
              </div>
              <div>
                <h3 className="font-semibold mb-1" style={{ color: '#261A54' }}>2) Pravo na uvid</h3>
                <P>Imate pravo da budete obavešteni o tome da li obrađujemo vaše podatke o ličnosti, te ukoliko ih obrađujemo, imate pravo po osnovu izvršenog uvida da zahtevate ispravku, dopunu, ažuriranje, brisanje podataka, kao i prekid i privremenu obustavu obrade.</P>
              </div>
              <div>
                <h3 className="font-semibold mb-1" style={{ color: '#261A54' }}>3) Pravo na ispravku, dopunu i ažuriranje</h3>
                <P>Podaci koji se obrađuju treba da budu tačni i potpuni. Imate pravo da se vaši netačni lični podaci bez nepotrebnog odlaganja isprave, odnosno nepotpuni podaci dopune.</P>
              </div>
              <div>
                <h3 className="font-semibold mb-1" style={{ color: '#261A54' }}>4) Pravo na brisanje</h3>
                <P>Imate pravo da vaši lični podaci budu obrisani u skladu sa ZZPL. <strong>Važno:</strong> Ukoliko zahtevate pravo na brisanje vaših ličnih podataka, sa istom adresom nećete više biti u mogućnosti da se prijavljujete na događaje.</P>
              </div>
              <div>
                <h3 className="font-semibold mb-1" style={{ color: '#261A54' }}>5) Pravo na prenosivost</h3>
                <P>Imate pravo da dobijete u strukturisanom, uobičajeno korišćenom i elektronski čitljivom obliku lične podatke koje ste nam dostavili, ili da iste prenesemo drugom rukovaocu, pod uslovom da je obrada zasnovana na pristanku ili ugovoru i da se obrada vrši automatizovanim putem.</P>
              </div>
              <div>
                <h3 className="font-semibold mb-1" style={{ color: '#261A54' }}>6) Pravo na ograničenje obrade</h3>
                <P>Imate pravo da tražite ograničenje obrade vaših ličnih podataka u određenim situacijama.</P>
              </div>
              <div>
                <h3 className="font-semibold mb-1" style={{ color: '#261A54' }}>7) Pravo na prigovor</h3>
                <P>Imate pravo da podnesete prigovor na obradu vaših podataka o ličnosti koja se vrši na osnovu legitimnog interesa.</P>
              </div>
              <div>
                <h3 className="font-semibold mb-1" style={{ color: '#261A54' }}>8) Pravo na obraćanje nadležnom organu</h3>
                <P>Pravo podnošenja pritužbe Povereniku za pristup informacijama od javnog značaja i zaštitu podataka o ličnosti — Bulevar kralja Aleksandra broj 15, 11120 Beograd, telefon: +38111 3408 900, e-mail: office@poverenik.rs.</P>
              </div>
              <div>
                <h3 className="font-semibold mb-1" style={{ color: '#261A54' }}>9) Sva druga prava predviđena zakonskom regulativom</h3>
                <P>Lice na koje se podaci odnose može svoja prava ostvariti upućivanjem zahteva na mail adresu: <a href="mailto:office@nocnibazar.rs" className="underline" style={{ color: '#1D8A99' }}>office@nocnibazar.rs</a>.</P>
              </div>
            </div>
            <P className="mt-4">Na vaš zahtev odgovorićemo u najkraćem mogućem roku, a najkasnije u roku od 30 dana od dana prijema zahteva. U slučaju složenosti ili velikog broja zahteva, taj rok ne može biti duži od 90 dana.</P>
          </Section>

          <Section title="Pristanak i opoziv pristanka">
            <P>Ukoliko ste nam dali pristanak za obradu, možete ga opozvati u bilo kom trenutku. U slučaju da opozovete pristanak, prestajemo sa daljom obradom vaših ličnih podataka i brišemo te lične podatke u najdužem roku od 90 dana od dana kada ste poslali opoziv. Opoziv pristanka je besplatan i možete ga proslediti na: <a href="mailto:office@nocnibazar.rs" className="underline" style={{ color: '#1D8A99' }}>office@nocnibazar.rs</a>.</P>
          </Section>

          <Section title="Šta su kolačići (cookies) i u koju svrhu se koriste?">
            <P>Kolačići su informacije koje internet stranica šalje računaru korisnika. Oni obično čuvaju vaša podešavanja za internet stranicu. Ovi kolačići su neophodni za brži, efikasniji pristup našoj stranici kao i za njenu bezbednost.</P>
            <P>U svakom trenutku možete da odlučite da ne koristite kolačiće tokom posete našoj web stranici. Možete to učiniti tako što ćete na pretraživaču podesiti da se kolačići ne čuvaju, kao i da se već sačuvani obrišu. Za onemogućavanje i brisanje kolačića potražite uputstva u opciji „Pomoć" vašeg internet pretraživača.</P>
          </Section>

          <Section title="Šta je Google Analytics i čemu služi?">
            <P>Za analizu poseta i kvaliteta korišćenja naših web stranica koristi se Google Analytics. Ovi kolačići omogućavaju da vaše korisničko iskustvo, kao i naše usluge, poboljšamo u skladu sa vašim željama.</P>
            <P>Detaljnije informacije kako Google obrađuje vaše podatke pronaći ćete na sledećem linku: <a href="https://policies.google.com/privacy?hl=sr" target="_blank" rel="noopener noreferrer" className="underline" style={{ color: '#1D8A99' }}>https://policies.google.com/privacy</a>.</P>
          </Section>

          <Section title="Obrada podataka na društvenim mrežama">
            <P>Novosadski noćni bazar u svrhu promocije svojih događaja koristi sledeće društvene mreže: Facebook, Instagram, Youtube. Na navedenim društvenim mrežama obrađujemo sledeće podatke: vaše komentare, video snimke, fotografije, lajkove, reakcije na postove i druga obaveštenja, kao i druge podatke koje podelite sa nama.</P>
            <P>Vaše podatke obrađujemo samo u svrhu u koju ste nam ih i dali. Ukoliko nam putem društvene mreže pošaljete upit, možemo da vas uputimo na druge puteve komunikacije koji garantuju poverljivost.</P>
          </Section>

          <Section title="Izmena Politike privatnosti">
            <P>NNB je ovlašćen da s vremena na vreme ažurira ovu Politiku privatnosti, bez prethodne najave, a sa ciljem da se unesu izmene do kojih je došlo u praksi obrade podataka. Izmenjeni tekst Politike privatnosti će biti objavljen na veb-sajtu i stupiće na snagu odmah po objavljivanju.</P>
          </Section>

          <div className="mt-12 pt-8 border-t border-gray-300">
            <P>Ako imate bilo kakvih dodatnih pitanja i nedoumica stojimo vam na raspolaganju.</P>
            <P className="font-semibold" style={{ color: '#261A54' }}>Vaš Novosadski noćni bazar!</P>
            <P><a href="mailto:office@nocnibazar.rs" className="underline" style={{ color: '#1D8A99' }}>office@nocnibazar.rs</a></P>
          </div>

        </div>
      </div>
    </>
  )
}
