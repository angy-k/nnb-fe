'use client'

/**
 * Kratak izvod za modal — prikazuje se dok korisnik ne klikne „pročitaj više“.
 * Pun tekst je u komponenti ispod.
 */
export const PRIVACY_EXCERPT =
  'Rukovalac podacima je Udruženje Novosadski noćni bazar, Novi Sad, Vase Stajića br. 6/III. ' +
  'Vaše podatke prikupljamo radi prijave na događaje, kontaktiranja i obaveštavanja o aktivnostima ' +
  'organizatora, kao i za newsletter ako ste se na njega prijavili. Obrada se vrši na osnovu vašeg ' +
  'pristanka, ugovornog odnosa ili legitimnog interesa, a pristanak možete povući u svakom trenutku. ' +
  'Podaci se ne iznose u druge države i čuvaju se samo dok traje svrha za koju ste ih dali.'

/**
 * Pun tekst Politike privatnosti — jedan izvor za sva mesta gde se prikazuje
 * (stranica /politika-privatnosti, modal na registraciji i prijavi na događaj).
 *
 * Tekst je preuzet doslovno iz dokumenta koji je dostavio organizator i ne sme
 * se skraćivati ni prepravljati bez njihove saglasnosti.
 *
 * `compact` daje manju tipografiju za prikaz u modalu; stranica koristi punu.
 */
const PrivacyPolicyContent = ({ compact = true }) => {
  const H = ({ children }) => (
    <h3 className={`text-[#261A54] font-semibold mt-4 mb-1 ${compact ? 'text-sm' : 'text-lg mt-8 mb-2'}`}>
      {children}
    </h3>
  )

  const P = ({ children }) => (
    <p className={`text-[#1B1B1B] leading-relaxed mb-2 ${compact ? 'text-sm' : 'text-base mb-3'}`}>
      {children}
    </p>
  )

  const Li = ({ children }) => (
    <li className={`text-[#1B1B1B] leading-relaxed mb-1 ${compact ? 'text-sm' : 'text-base'}`}>
      {children}
    </li>
  )

  const A = ({ href, children }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" className="underline text-[#56C4CF]">
      {children}
    </a>
  )

  return (
    <>
      <H>Šta su podaci o ličnosti?</H>
      <P>
        Podatak o ličnosti je svaki podatak koji se odnosi na fizičko lice čiji je identitet određen ili odrediv,
        neposredno ili posredno, posebno na osnovu oznake identiteta, kao što je ime i identifikacioni broj,
        podataka o lokaciji, identifikatora u elektronskim komunikacionim mrežama ili jednog, odnosno više
        obeležja njegovog fizičkog, fiziološkog, genetskog, mentalnog, ekonomskog, kulturnog i društvenog identiteta.
      </P>
      <P>
        Obrada podataka o ličnosti odnosi se na bilo koju radnju koja se vrši sa podacima o ličnosti kao što su
        prikupljanje, beleženje, prepisivanje, umnožavanje, kopiranje, prenošenje, čuvanje, prilagođavanje, brisanje.
      </P>

      <H>Rukovalac podacima</H>
      <P>
        Rukovalac je subjekat koji samostalno ili sa drugim subjektima određuje svrhu i način obrade podataka o ličnosti.
      </P>
      <P>
        Rukovalac podacima za obradu podataka je Udruženje Novosadski noćni bazar, Novi Sad, Vase Stajića br. 6/III
        (u daljem tekstu: Novosadski noćni bazar ili samo skraćeno NNB).
      </P>

      <H>Razlozi zbog kojih prikupljamo podatke (svrha obrade podataka)</H>
      <P>
        <strong>1. internet sajt www.nocnibazar.rs</strong> — Prikupljanjem podataka na web stranici nocnibazar.rs
        nudi vam mogućnost što preciznije, lakše i jednostavnije pretrage našeg sajta. Ukoliko želite da budete
        redovno obavešteni o novitetima i novim bazarima, a ne želite da svaki dan ulazite na naš sajt ili društvene
        mreže — rado ćemo to učiniti umesto vas. Pre svega, kroz mogućnost newsletter prijave nudimo vam mogućnost
        da budete uvek i pravovremeno obavešteni o novim događajima, a potrebno je samo da ostavite vašu email adresu
        kao lični podatak, kako bismo vam omogućili ovu prijavu.
      </P>
      <P>
        <strong>2. izlagači</strong> — Kako biste postali deo priče Novosadskog noćnog bazara i uzeli učešće na njemu
        kao izlagač, potrebno je da posetite našu stranicu za prijavu i ostavite nam podatke na osnovu kojih možemo
        da vas kontaktiramo i izvršimo rezervaciju tezge za izlaganje na određenom događaju. Takođe i u slučaju da
        želite odgovor na neko vama bitno pitanje o našim uslugama, najlakši način da to činimo jeste da nam ostavite
        vaše lične podatke (ime i prezime, kontakt telefon, kontakt mail), kako bismo to pravovremeno i što pre učinili
        i kako bi informacije stigle do vas na vreme.
      </P>
      <P>
        <strong>3. cookies/kolačići</strong> — Da bismo vam obezbedili što bolje funkcionisanje našeg web sajta i
        pretragu naših web stranica, prikupljaćemo podatke prilikom same vaše posete našoj internet stranici. U tu
        svrhu koristimo kolačiće i Google Analytics, o čemu više informacija možete pronaći i u kasnijim redovima,
        kao i korišćenju i interakciji sa nalozima na društvenim mrežama Instagram stranica{' '}
        <A href="https://www.instagram.com/novosadskinocnibazar/?hl=hr">Noćni bazar</A> i Facebook stranici{' '}
        <A href="https://www.facebook.com/trg.preduzetnistva/">Trg preduzetništva</A>, ili korišćenju platformi
        društvenih mreža za obezbeđivanje što boljih informacija o našim proizvodima i uslugama.
      </P>
      <P>
        Pored navedenih svrha, može se desiti da obrađujemo lične podatke u svrhu pregovora, zaključenja i ispunjenja ugovora.
      </P>
      <P>
        U te svrhe, možemo obrađivati vaše osnovne podatke (npr. ime i prezime, adresa, kontakt podaci), podatke o
        identifikaciji (npr. izvodi iz privrednog registra, podaci iz lične karte, primer potpisa), podatke u vezi
        našeg poslovnog odnosa (npr. podaci o plaćanju, podaci o izdatim nalozima), informacije o bonitetu, o strukturi
        kompanije i njene vlasničke strukture, fotografije i video snimci (npr. prilikom reklamiranja) kao i druge
        podatke u zavisnosti od konkretnog ugovornog odnosa. Nije moguće obezbediti potpunu listu svih ličnih podataka
        koje obrađujemo, ali ćemo se držati opšte navedenih, za sve ostalo ćemo tražiti posebnu saglasnost.
      </P>
      <P>
        Napominjemo da vi odlučujete da li ćete nam i koje podatke dostaviti. Iz tog razloga, prilikom unošenja podataka
        na internet stranici obratite pažnju da li su sva polja obavezna. Ako odlučite da popunite sva polja garantujemo
        vam sigurnost svih podataka kao i da ćemo ih koristiti samo u svrhu u koju ste nam ih i dali.
      </P>
      <P>
        U daljem tekstu ova Politika privatnosti pojašnjava na koji način Novosadski noćni bazar skuplja, čuva, obrađuje,
        koristi i prenosi vaše podatke o ličnosti. Obrada podataka se vrši u skladu sa važećom zakonskom regulativom.
        Upotrebom ili pristupom našim web stranicama potvrđujete da ste sa razumevanjem pročitali, te da ste saglasni sa
        prikupljanjem, čuvanjem, obradom, korišćenjem i prenosom vaših ličnih podataka. Pažljivo pročitajte ovu Politiku
        privatnosti kako bi vam bile jasnije glavne odredbe naše politike i prakse u vezi sa datim podacima i načinima na
        koje ćemo ih koristiti. Bitno je da vas upoznamo sa činjenicom da, upravo u zavisnosti od svrhe obrade, Novosadski
        noćni bazar nekada ima svojstvo Rukovaoca, a nekada Obrađivača ličnih podataka. Obrađivač je fizičko ili pravno
        lice, odnosno organ vlasti koji obrađuje podatke o ličnosti u ime rukovaoca.
      </P>
      <P>
        Uveravamo se da je svaka vaša poseta sigurna i obezbeđena po svim zakonskim regulativama, kao i sigurnog korišćenja
        interneta. Ako se, pak, ne slažete sa našim politikama i praksama, vaš će izbor biti da ne koristite naš veb-sajt.
        Pristupanjem dajete pristanak za korišćenje vašom voljom datih podataka.
      </P>

      <H>Pravni osnov obrade podataka</H>
      <P>
        Za neke svrhe obrade, vaše lične podatke obrađujemo na osnovu vašeg pristanka za obradu podataka o ličnosti uz
        prethodno obaveštavanje o svim bitnim aspektima obrade. Bitno je da znate da pristanak u bilo kom momentu i bez
        obrazloženja možete povući, što za posledicu ima prestanak dalje obrade, ali ne utiče na legalnost prethodne
        obrade podataka pre povlačenja saglasnosti.
      </P>
      <P>
        U nekim situacijama je pravni osnov za obradu ličnih podataka ugovorni odnos sa licem na koje se lični podaci
        odnose, kao što je npr. slučaj kod obrade neophodne za sam pristup i korišćenje sajta za potrebe rezervacije na
        učešće na bazarima i drugim događajima u organizaciji Novosadskog noćnog bazara i njegovih partnerskih organizacija.
      </P>
      <P>
        Takođe, u nekim situacijama imamo legitiman interes za obradu vaših podataka, kao npr. kada je obrada neophodna
        u svrhu sprečavanja prevara ili eventualnih zloupotreba.
      </P>
      <P>
        Možemo da obrađujemo vaše lične podatke ukoliko to od nas zakon zahteva ili ukoliko je obrada neophodna u cilju
        zaštite vaših životnih interesa. Ukoliko obrađujemo vaše lične podatke kada to od nas zakon zahteva ili u cilju
        zaštite vaših životnih interesa, obavestićemo vas o tome.
      </P>

      <H>Legitimni interes</H>
      <P>
        Kako bismo ostvarili našu poslovnu svrhu, obrađujemo vaše lične podatke na osnovu legitimnog interesa. Naravno,
        to radimo samo ukoliko vaš interes ili vaša osnovna prava i slobode ne pretežu nad našim legitimnim interesom.
        Legitimni interes koristimo kako bismo:
      </P>
      <ul className="list-disc pl-6 mb-2">
        <Li>dijagnostikovali tehničke probleme sa servisom;</Li>
        <Li>obradili vašu prijavu na bazar, odgovorili na vaše zahteve i moguće pritužbe;</Li>
        <Li>zaštitili naše poslovanje i pružili podršku našim korisnicima;</Li>
        <Li>testirali i razvijali nove usluge i kako bismo poboljšali postojeće;</Li>
        <Li>identifikovali i zaštitili korisnike servisa i sam servis od prevare ili nelegalnih aktivnosti.</Li>
      </ul>
      <P>
        Upotrebom naših servisa slažete se da određeni zaposleni mogu da vas kontaktiraju na osnovu vaših kontakt podataka
        koje ste obezbedili kako bi vas upozorili na određene nepravilnosti zarad dijagnostikovanja tehničkih problema sa
        servisom ili u slučaju da postoji sumnja da se određene štetne ili nelegalne aktivnosti (npr. hakerski napadi,
        preuzimanje naloga, slanje neprikladnih fajlova, spam i slično) pokušavaju nad imenom korisnika da bi ga zaštitili
        od neželjenih posledica. Osnov obrade jeste naš legitimni interes kao vlasnika servisa kojima pristupate.
      </P>
      <P>
        U svakom trenutku možete da izjavite prigovor na ovakvu obradu vaših ličnih podataka. Za više informacija o vašim
        pravima, upućujemo vas na sekciju Vaša prava u nastavku.
      </P>

      <H>Pravo na korišćenje</H>
      <P>
        Pristup vašim podacima imaju članovi tima u organizaciji Novosadskog noćnog bazara i to samo oni kojima su potrebni
        kako bi ispunili sve vaše zahteve.
      </P>
      <P>
        U određenim situacijama, pristup podacima mogu imati naši eksterni partneri kojima poveravamo određene poslove kako
        bismo usluge koje pružamo doveli na najviši nivo. To znači da nam je za neke usluge potrebna pomoć partnera —
        kompanija kojoj smo poverili održavanje našeg web sajta ili kompanija koja brine da imate sve potrebne i verodostojne
        informacije na našim nalozima na društvenim mrežama. Svi naši partneri su izabrani na veoma strog i pažljiv način
        obavezujući se Ugovorom na čuvanje ličnih podataka u tajnosti, kao i svih poslovnih tajni kompanije. Bitno je da
        razumete da to ne znači da eksterni partneri mogu koristiti vaše podatke za svoje potrebe, već isključivo i samo u
        cilju pružanja usluge za koju su angažovani, kako je objašnjeno u prethodnim odredbama.
      </P>

      <H>Prenos ličnih podataka u druge države</H>
      <P>Vaši podaci se ne iznose u druge države.</P>

      <H>Trajnost podataka</H>
      <P>
        Podatke čuvamo samo onoliko koliko su nam potrebni da bismo ostvarili svrhu za koju ste nam podatke i dali ili do
        vašeg opoziva. Nakon toga, vaše podatke ćemo obrisati ili učiniti neprepoznatljivim.
      </P>
      <P>
        Podatke koje nam dostavite prilikom prijave na newsletter, čuvamo do vaše odjave. U svakom trenutku se možete
        odjaviti sa newslettera slanjem zahteva na{' '}
        <A href="mailto:office@nocnibazar.rs">office@nocnibazar.rs</A>.
      </P>
      <P>
        Izuzetno, vaše podatke možemo čuvati i nakon povlačenja pristanka ili ispunjenja svrhe, u situacijama kada je to
        neophodno radi izvršenja naše zakonske obaveze ili radi podnošenja, ostvarivanja ili odbrane pravnog zahteva.
      </P>

      <H>Stroge mere čuvanja podataka i primena poverljivosti</H>
      <P>
        Sigurnost podataka, i vas kao klijenta i korisnika naših usluga, je važna stvar za nas kao organizatore događaja.
        U tom smislu, ulažemo svakodnevne napore, kao i usavršavanje našeg tima, kako bi ovaj segment posla izvodili u
        skladu sa važećim pravnim propisima i po najvišim svetskim standardima.
      </P>
      <P>
        Obezbedićemo da saradnici koji imaju pristup ili obrađuju podatke o ličnosti budu savesni i da postupaju u skladu
        sa sadržajem ove Politike kao i da će adekvatno informisati i obučiti svoje osoblje kada je u pitanju ova Politika.
      </P>
      <P>
        Nepostupanje u skladu sa ovom Politikom može biti sankcionisano izricanjem disciplinskih mera, ili čak prestankom saradnje.
      </P>
      <P>
        U tu svrhu preduzimamo sve potrebne mere i možemo da vam garantujemo da će vaši podaci biti tretirani po najvišim
        svetskim i zakonskim regulativama.
      </P>

      <H>Vaša prava u vezi sa ličnim podacima koje obrađujemo</H>
      <ol className="list-decimal pl-6 mb-2">
        <Li>
          <strong>TRANSPARENTNOST:</strong> Kada nam ostavljate lične podatke, transparentno ćemo vas obavestiti o svrsi
          za koji su nam određeni podaci potrebni, ko koristi ove podatke, te ćemo vam pružiti sve ostale informacije
          relevantne za obradu vaših podataka (ovo pravo je ispunjeno davanjem saglasnosti nakon čitanja i razumevanja
          ovog Obaveštenja).
        </Li>
        <Li>
          <strong>PRAVO NA UVID:</strong> Imate pravo da budete obavešteni o tome da li obrađujemo vaše podatke o ličnosti,
          te ukoliko ih obrađujemo, imate pravo po osnovu izvršenog uvida da zahtevate ispravku, dopunu, ažuriranje, brisanje
          podataka, kao i prekid i privremenu obustavu obrade. Ukoliko vaše lične podatke mi obrađujemo kao rukovaoci —
          imate pravo od nas da dobijete sve informacije o predmetnoj obradi.
        </Li>
        <Li>
          <strong>PRAVO NA ISPRAVKU, DOPUNU I AŽURIRANJE:</strong> Podaci koji se obrađuju treba da budu tačni i potpuni.
          Imate pravo da se vaši netačni lični podaci bez nepotrebnog odlaganja isprave, odnosno nepotpuni podaci dopune.
        </Li>
        <Li>
          <strong>PRAVO NA BRISANJE:</strong> Imate pravo da vaši lični podaci budu obrisani u skladu sa ZZPL. Ukoliko je
          neophodno da i dalje vršimo obradu kako bi izvršili svoje zakonske obaveze (npr. Zakon o računovodstvu i slično)
          ili radi podnošenja, ostvarivanja ili odbrane pravnog zahteva, izbrisaćemo samo deo podataka koji nam više nisu
          neophodni. <strong>VAŽNO:</strong> Ukoliko zahtevate pravo na brisanje vaših ličnih podataka, sa istom adresom
          nećete više biti u mogućnosti da se prijavljujete na događaje.
        </Li>
        <Li>
          <strong>PRAVO NA PRENOSIVOST:</strong> Ukoliko želite od nas (i) da dobijete u strukturisanom, uobičajeno
          korišćenom i elektronski čitljivom obliku lične podatke koje ste nam dostavili prilikom registracije ili (ii) da
          prenesemo drugom rukovaocu lične podatke koje ste nam dostavili kao rukovaocu, imate pravo da to tražite od nas,
          pod uslovom da je obrada zasnovana na pristanku ili ugovoru i da se obrada vrši automatizovanim putem.
        </Li>
        <Li>
          <strong>PRAVO NA OGRANIČENJE OBRADE:</strong> Imate pravo da tražite ograničenje obrade vaših ličnih podataka u
          određenim situacijama.
        </Li>
        <Li>
          <strong>PRAVO NA PRIGOVOR:</strong> Imate pravo da podnesete prigovor na obradu vaših podataka o ličnosti koja se
          vrši na osnovu legitimnog interesa.
        </Li>
        <Li>
          <strong>PRAVO NA OBRAĆANJE NADLEŽNOM ORGANU:</strong> pravo podnošenja pritužbe Povereniku za pristup informacijama
          od javnog značaja i zaštitu podataka o ličnosti — Bulevar kralja Aleksandra broj 15, 11120 Beograd,
          telefon: +381 11 3408 900, e-mail: <A href="mailto:office@poverenik.rs">office@poverenik.rs</A>.
        </Li>
        <Li>
          <strong>SVA DRUGA PRAVA PREDVIĐENA ZAKONSKOM REGULATIVOM:</strong> Lice na koje se podaci odnose može svoja prava
          ostvariti upućivanjem zahteva na mail adresu:{' '}
          <A href="mailto:office@nocnibazar.rs">office@nocnibazar.rs</A>.
        </Li>
      </ol>
      <P>
        Povodom ostvarivanja gore navedenih zahteva, Novosadski noćni bazar će vam pružiti sve neophodne dodatne informacije,
        kao i pomoć, u skladu sa uslovima i na način propisan važećim zakonom.
      </P>
      <P>
        Na vaš zahtev odgovorićemo u najkraćem mogućem roku, a najkasnije u roku od 30 dana od dana prijema zahteva. U slučaju
        složenosti ili velikog broja zahteva, moguće je da će nam biti potreban dodatan rok za odgovor na zahtev. Taj rok ne
        može biti duži od 90 dana i o tome ćemo vas posebno obavestiti.
      </P>
      <P>
        Ukoliko je vaš zahtev očigledno neosnovan ili se učestalo ponavlja, možemo da ga odbijemo ili da naplatimo troškove za
        njegovo ostvarivanje. Smatra se da je učestalo ponavljanje kada nam se obratite sa zahtevom za ostvarenje nekog od prava
        više od jednog puta u jednoj godini. Ukoliko nam se obratite dva ili više puta u toku jedne godine za isto pravo,
        odgovorićemo na vaš zahtev samo ukoliko imate opravdan razlog.
      </P>
      <P>
        Za bilo koje informacije u vezi sa Politikom privatnosti, ili upućivanje zahteva za dopunu, ažuriranje, brisanje i prekid
        korišćenja vaših ličnih podataka, možete nas kontaktirati direktno putem emaila:{' '}
        <A href="mailto:office@nocnibazar.rs">office@nocnibazar.rs</A>.
      </P>

      <H>Pristanak i opoziv pristanka</H>
      <P>
        Ukoliko ste nam dali pristanak za obradu, možete ga opozvati u bilo kom trenutku. U slučaju da opozovete pristanak,
        prestajemo sa daljom obradom vaših ličnih podataka i brišemo te lične podatke u najdužem roku od 90 dana od dana kada
        ste poslali opoziv pristanka. Opoziv pristanka je besplatan i možete da ga prosledite na sledeću e-mail adresu{' '}
        <A href="mailto:office@nocnibazar.rs">office@nocnibazar.rs</A>.
      </P>

      <H>Šta su kolačići (cookies) i u koju svrhu se koriste?</H>
      <P>
        Kolačići, odnosno „cookies“, su informacije koje internet stranica šalje računaru korisnika. Oni obično čuvaju vaša
        podešavanja za internet stranicu, kao što su željeni jezik ili adresa i sl. Kasnije, kada opet otvorite istu stranicu,
        pretraživač šalje nazad kolačiće što omogućava da vam se na stranici prikažu informacije prilagođene vašim potrebama.
        Takođe, ovi kolačići su neophodni za brži, efikasniji pristup našoj stranici kao i za njenu bezbednost, čime vam se
        omogućuje brža, jednostavnija, sigurnija i lakša pretraga. Kolačići povezani s društvenim mrežama omogućavaju pristup
        društvenim mrežama i deljenje sadržaja.
      </P>
      <P>
        Podaci o pregledu stranice se čuvaju u vidu log in datoteka. Svaki takozvani log zapis podataka se sastoji od: internet
        stranice sa koje ste pristupili našoj stranici, IP adrese, vremena i datuma pristupa stranici, upita posetioca stranice,
        http kod odgovora, preuzete količine podataka, informacije o pretraživaču koji koristite, kao i informacije o vašem
        operativnom sistemu. Neki kolačići su privremeni i nestaju kada isključite pretraživač, a drugi su trajni i ostaju na računaru.
      </P>
      <P>
        Naravno, u svakom trenutku možete da odlučite da ne koristite kolačiće tokom posete našoj ili bilo kojoj web stranici.
        Međutim, imajte na umu da u tom slučaju neke funkcije i stranice neće raditi onako kako očekujete, kao i da ćete biti
        uskraćeni za što bolju mogućnost pretrage. To možete učiniti tako što ćete na pretraživaču podesiti da se kolačići ne
        čuvaju kao i da se već sačuvani obrišu. Za onemogućavanje i brisanje kolačića potražite uputstva u opciji „Pomoć“ vašeg
        internet pretraživača.
      </P>

      <H>Šta je Google Analytics i čemu služi?</H>
      <P>
        Za analizu poseta i kvaliteta korišćenja naših web stranica koristi se Google Analytics, zvanična internet alatka
        čuvenog Google servisa. Ovu uslugu pruža kompanija Google Inc. („Google“) koja primenjuje kolačiće koji se čuvaju na
        vašem računaru i koji omogućuju analizu korišćenja naše internet stranice.
      </P>
      <P>
        Ovi kolačići omogućavaju da vaše korisničko iskustvo, kao i naše usluge, poboljšamo u skladu sa vašim željama odnosno
        sa pokazateljima kako koristite našu internet stranicu.
      </P>
      <P>
        Ono što dodatno napominjemo — vaša sigurnost je korišćenjem naših web stranica trajno zagarantovana visokim standardima
        politike privatnosti koje primenjujemo.
      </P>
      <P>
        Kako je gore pomenuto, možete onemogućiti čuvanje kolačića putem podešavanja na vašem pretraživaču. Osim toga možete
        sprečiti čuvanje podataka nastalih od strane kolačića i podataka koji se odnose na web stranicu koju koristite kao i
        obradu ovih podataka od strane Google-a, tako što ćete skinuti i instalirati Browser-Plugin.
      </P>
      <P>
        Molimo da obratite pažnju da je korišćenje aplikacije browser-plugin rezervisano samo za neke pretraživače kao i da ih
        nakon instalacije ne smete deaktivirati ili brisati kako bi se i nadalje zadržala deaktivacija od strane Google Analytics.
      </P>
      <P>
        Detaljnije informacije kako Google obrađuje vaše podatke pronaći ćete na sledećem linku{' '}
        <A href="https://policies.google.com/privacy?hl=sr">policies.google.com/privacy</A>.
      </P>

      <H>Linkovi ka drugim web stranicama</H>
      <P>
        Napominjemo da naša internet stranica može da sadrži linkove za upućivanje na druge web sajtove čiji sadržaj nije uvek
        u našem vlasništvu. Ti linkovi su postavljeni na našoj stranici isključivo radi dodatnog informisanja i lakšeg snalaženja
        samih korisnika i posetilaca sajta. Mi ne uređujemo njihov sadržaj te ne snosimo nikakvu odgovornost njihovog uređivanja,
        sadržaja i posete istim.
      </P>

      <H>Obrada podataka na društvenim mrežama</H>
      <P>
        Zaštita naših pratilaca, kao i korisnika, nam je na prvom mestu zbog čega zadržavamo pravo da obrišemo, odnosno da
        prijavimo uvredljive i protivzakonite izjave kao i komercijalne reklame, pre svega zbog zaštite prava svih naših korisnika
        i pratilaca. Pritom napominjemo, da shodno tome, ne možemo da preuzmemo odgovornost za komentare i linkove koje postavljaju
        naši pratioci.
      </P>
      <P>
        Novosadski noćni bazar u svrhu promocije svojih događaja koristi sledeće poznate društvene mreže: Facebook, Instagram, Youtube.
      </P>
      <P>
        Na navedenim društvenim mrežama obrađujemo sledeće podatke: vaše komentare, video snimke, fotografije, lajkove, reakcije na
        postove i druga obaveštenja, kao i druge podatke koje podelite sa nama. Vaše podatke obrađujemo samo u svrhu u koju ste nam
        ih i dali odnosno u svrhe u koje ste ih objavili na našoj društvenoj mreži. Ukoliko bude neophodno, vaše podatke ćemo podeliti
        na našoj stranici i zadržavamo pravo da iste obrišemo.
      </P>
      <P>
        Vaše podatke obrađujemo i u svrhu komuniciranja sa vama. Ukoliko nam putem društvene mreže pošaljete upit, možemo da vas
        uputimo na druge puteve komunikacije koji garantuju poverljivost. Imajte na umu, uvek imate mogućnost da nam poverljive upite
        pošaljete putem email adrese navedene u opštim informacijama ili putem kontakt obrasca na našem sajtu.
      </P>
      <P>
        Takođe, Novosadski noćni bazar ne odgovara i nema veze sa načinom korišćenja podataka od strane same kompanije Facebook, kao
        vlasnika platforme ovih društvenih mreža. Kao ni načine njihove oglašivačke prakse. Takođe, naša kompanija koristi usluge
        Facebook kompanije u smislu deljenja sadržaja i promocije istog na društvenim mrežama u skladu sa datim mogućnostima same
        kompanije Facebook i njihovim načinom poslovanja i prikupljanja podataka.
      </P>
      <P>
        Za više informacija o generalnoj Facebook praksi privatnosti posetite:{' '}
        <A href="http://www.facebook.com/policy.php">facebook.com/policy.php</A>
      </P>
      <P>
        Ukoliko vas zanima da saznate više na koji način sama Facebook platforma sakuplja i čuva podatke posetite:{' '}
        <A href="http://www.facebook.com/help/186325668085084">facebook.com/help</A> i{' '}
        <A href="http://www.facebook.com/about/privacy/your-info#everyoneinfo">facebook.com/about/privacy</A>
      </P>

      <H>Izmena Politike privatnosti</H>
      <P>
        NNB je ovlašćen da s vremena na vreme ažurira ovu Politiku privatnosti, bez prethodne najave, a sa ciljem da se unesu izmene
        do kojih je došlo u praksi obrade podataka. Izmenjeni tekst Politike privatnosti će biti objavljen na veb-sajtu i stupiće na
        snagu odmah po objavljivanju. Bilo kakvo korišćenje internet stranica od strane Korisnika nakon obaveštavanja o izmeni Politike
        privatnosti podrazumevaće da je Korisnik prihvatio promene i da je dao saglasnost za dalju upotrebu ličnih podataka. Prihvatanjem
        ove Politike se obavezujete da povremeno iznova pročitate Politiku privatnosti kako biste se upoznali s eventualnim promenama.
        Ukoliko nastavite da koristite internet stranice nakon izmene Politike privatnosti, pretpostavlja se da ste se upoznali s izmenama,
        da ih razumete i u celosti prihvatate.
      </P>
      <P>Ako imate bilo kakvih dodatnih pitanja i nedoumica stojimo vam na raspolaganju.</P>
      <P><strong>Vaš Novosadski noćni bazar!</strong></P>
    </>
  )
}

export default PrivacyPolicyContent
