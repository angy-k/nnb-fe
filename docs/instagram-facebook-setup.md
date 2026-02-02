# Instagram Feed (9 poslednjih objava) — podešavanje Facebook/Instagram naloga i tokena

Ovaj dokument objašnjava kako da podesiš Meta/Facebook i Instagram tako da aplikacija može da učita poslednjih 9 objava u sekciji Instagram feed-a.

## 1) Šta je već implementirano u kodu

U projektu postoji Next.js API ruta:

- `GET /api/instagram?limit=9`

Ona **server-side** čita token iz env var-a:

- `INSTAGRAM_ACCESS_TOKEN`

i trenutno poziva endpoint:

- `https://graph.instagram.com/me/media`

To znači da je postojeća implementacija **najdirektnije kompatibilna sa Instagram Basic Display API** tokenom.

Ako želiš da koristiš **Instagram Graph API (Business/Creator)** (preko `graph.facebook.com`), to je moguće, ali onda se ruta obično prilagođava da koristi `/{ig_user_id}/media` i odgovarajuće permisije.

## 2) Koju opciju da izabereš

### Opcija A: Instagram Basic Display API (najbliže trenutnoj implementaciji)

Koristi se endpoint `graph.instagram.com`.

- Prednost: radi bez Facebook Page veze.
- Mana: setup je ponekad nezgodniji (OAuth redirect URI, testeri, tokeni se obnavljaju).

### Opcija B: Instagram Graph API (Business/Creator) (najčešće najbolja za produkciju)

Koristi se endpoint `graph.facebook.com`.

- Prednost: stabilnija integracija za profesionalne naloge, bolji ekosistem oko Meta app-a.
- Mana: IG nalog mora biti **Business/Creator** i povezan sa Facebook Page.

## 3) Opcija A — Kako da dobiješ `INSTAGRAM_ACCESS_TOKEN` (Basic Display)

### 3.1 Pre-req

- Meta/Facebook developer nalog: https://developers.facebook.com/
- Instagram nalog kojem imaš pristup

### 3.2 Kreiraj Meta app

1. Idi na **My Apps** → **Create App**
2. Izaberi tip (bilo koji koji UI dozvoljava, najčešće “Consumer”)
3. U app-u dodaj produkt: **Instagram Basic Display**

### 3.3 Podesi OAuth redirect URI (potrebno zbog token generatora)

U okviru Instagram Basic Display podešavanja:

- **Valid OAuth Redirect URIs**: dodaj `http://localhost:3000/` (za lokalni dev)

Napomena:
- Meta UI traži da redirect URI bude tačan. Ovo je samo da bi token generator radio; aplikacija u ovom projektu nema poseban OAuth callback endpoint.

### 3.4 Dodaj testera / uloguj se kao vlasnik

Ako je app u “Development” modu:

- dodaj svoj Facebook/Instagram nalog kao **Tester** ili **Developer** u app roles

### 3.5 Generiši token

U Instagram Basic Display sekciji potraži:

- **User Token Generator** (ili sličan naziv)

Prođi login flow i na kraju prekopiraj token.

### 3.6 (Opcionalno) Long-lived token

Ako UI ponudi “Extend token” ili uputstvo za produženje (long-lived), uradi to.

## 4) Opcija B — Kako da dobiješ token (Instagram Graph API / Business)

Ovo je “Meta/Facebook” ruta i često najpraktičnija za profesionalne profile.

### 4.1 Prebaci Instagram na Business/Creator

Instagram aplikacija:

- Settings & privacy
- Account type and tools
- Switch to professional account

### 4.2 Poveži Instagram sa Facebook Page

Potrebno je da IG bude povezan sa Facebook Page.

- U Meta Accounts Center / Instagram settings poveži nalog sa Facebook nalogom
- Poveži sa odgovarajućom Facebook Page

### 4.3 Kreiraj Meta app

1. https://developers.facebook.com/ → My Apps → Create App
2. Dodaj produkt: **Instagram Graph API**

### 4.4 Dobij User Access Token

Najlakše preko:

- **Tools** → **Graph API Explorer**

Izaberi svoju app, i generiši token sa permisijama (najčešće):

- `instagram_basic`
- `pages_show_list`

Zatim uradi “Extend Access Token” (long-lived), ako ti Meta UI ponudi.

### 4.5 Dobij `ig-user-id`

Za Graph API integraciju često treba `IG User ID` (ID Instagram business account-a).

Primeri poziva koje možeš nalepiti u Graph API Explorer (verzija API-ja zavisi od UI, npr. `v19.0`):

1. Listaj stranice:

`GET /me/accounts`

2. Za odabranu stranicu (PAGE_ID) dohvati povezani IG account:

`GET /PAGE_ID?fields=instagram_business_account`

Dobijeni `instagram_business_account.id` je tvoj `ig-user-id`.

### 4.6 Napomena za naš projekat

Trenutni kod koristi `graph.instagram.com/me/media`.

Ako želiš Graph API, uobičajeno je da se ruta prilagodi na:

- `https://graph.facebook.com/{ig-user-id}/media?fields=...&access_token=...`

Ako kreneš ovom rutom, javi i prilagodiću endpoint u projektu.

## 5) Povezivanje tokena sa projektom

### 5.1 Lokalno (dev)

U `nnb-fe` napravi/izmeni `.env.local` i dodaj:

```bash
INSTAGRAM_ACCESS_TOKEN=PASTE_TOKEN_HERE
```

Važno:
- **Ne koristi** `NEXT_PUBLIC_` prefiks (to bi izložilo token u browseru)
- Posle izmene env fajla obavezno **restartuj** `next dev`

Napomena o `.env.dev`:
- Next.js standardno automatski učitava `.env.local`, `.env.development`, itd.
- `.env.dev` se ne učitava automatski od strane Next.js-a, osim ako imate dodatnu custom logiku.
- Zato je najbezbednije da token bude u `.env.local` (lokalno) i u deployment env var-ovima (prod).

### 5.2 Produkcija / deploy

Na platformi gde deployuješ aplikaciju dodaj env var:

- `INSTAGRAM_ACCESS_TOKEN`

Zatim uradi redeploy/restart.

## 6) Kako da proveriš da sve radi

1. Pokreni aplikaciju.
2. Otvori:

- `http://localhost:3000/api/instagram?limit=9`

Očekivano:

- `success: true`
- `data` niz sa do 9 stavki

## 7) Najčešće greške i rešenja

### 7.1 `Instagram access token is not configured.`

- `INSTAGRAM_ACCESS_TOKEN` nije setovan ili je prazan
- Rešenje: stavi token u `.env.local` i restartuj dev server

### 7.2 `Invalid OAuth access token` / `Error validating access token`

- Token je pogrešan, istekao, ili nije za odgovarajući API

### 7.3 App je u Development modu, a nalog nije dodan kao tester

- Dodaj nalog u App Roles (Developer/Tester) i ponovi autorizaciju/token generator

### 7.4 Feed radi lokalno, ali ne radi na deploy-u

- Nisi dodala env var na deployment platformi
- Nije urađen redeploy

## 8) Bezbednosne napomene

- Token treba da postoji **samo na serveru** (API ruta `src/app/api/instagram/route.js`).
- Nemoj da ga commit-uješ u git.
- Nemoj da ga stavljaš u `NEXT_PUBLIC_*` varijable.
