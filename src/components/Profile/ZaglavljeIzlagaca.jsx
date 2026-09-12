'use client'

import { Avatar } from '@nextui-org/react'

/**
 * Tamna traka na vrhu stranica za prijavljenog izlagača.
 *
 * Ista je na Profilu, izmeni profila, Mojim i Prethodnim rezervacijama — a bila
 * je prepisana u sve četiri komponente, pa su joj se mere razilazile: avatar je
 * negde bio 150 umesto 223, naslov 30 ili 39 umesto 48, razmak 24 umesto 46.
 * Otuda i ovde, na jednom mestu.
 *
 * Mere su iz izvoza (okvir 1920): avatar 223 na x 240, razmak do naslova 46,
 * naslov 48/65 na x 509. Odmak od 24 sa strane treba na uskim ekranima; da bi
 * sadržaj ipak počinjao na levoj ivici kolone, najveća širina je za toliko veća.
 *
 * @param avatarSrc   putanja do logotipa; bez nje se prikazuje početno slovo
 * @param avatarIme   ime za početno slovo
 * @param avatar      gotov element umesto podrazumevanog avatara (izmena
 *                    profila ima svoj, sa otpremanjem slike preko njega)
 * @param naslov      naziv brenda ili naslov stranice
 * @param podnaslov   delatnost ispod naziva; izostaje na stranicama rezervacija
 * @param children    dugmad uz desnu ivicu
 */
const ZaglavljeIzlagaca = ({
  avatarSrc = null,
  avatarIme = 'U',
  avatar = null,
  naslov,
  podnaslov = null,
  children = null,
}) => (
  /* Traka je u izvozu 1920 × 422; sadržaj se poravnava po dnu, 24 iznad donje
     ivice — tu su i naslov (333–398) i dugmad. Avatar (223 na y 253) prelazi
     preko donje ivice i ulazi u svetlu sekciju, pa mu je donja margina −78:
     tako mu dno padne na 476, a vrh na 253. */
  <div className="w-full bg-[#261A54] profile-page-header" style={{ minHeight: '422px', display: 'flex', alignItems: 'flex-end', paddingBottom: '24px' }}>
    <div
      className="w-full mx-auto nnb-gutter flex items-end justify-between gap-6 profile-page-header-inner"
      style={{ maxWidth: 'calc(var(--nnb-kolona) + 2 * var(--nnb-odmak))' }}
    >
      <div className="flex items-end gap-[46px] profile-page-header-left">
        <div className="relative z-10 flex-shrink-0 profile-page-avatar-wrapper" style={{ marginBottom: '-78px' }}>
          {avatar ?? (
            <Avatar
              isBordered
              showFallback
              src={avatarSrc || undefined}
              name={avatarIme}
              radius="full"
              className="w-[223px] h-[223px] text-2xl bg-[#3d2f7a] border-4 border-white"
            />
          )}
        </div>

        <div className="flex flex-col gap-0 profile-page-header-name">
          <span className="font-bold" style={{ color: '#ffffff', fontSize: '48px', lineHeight: '65px' }}>
            {naslov}
          </span>
          {podnaslov && (
            <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '22px', lineHeight: '30px' }}>
              {podnaslov}
            </span>
          )}
        </div>
      </div>

      {children && (
        <div className="flex items-end gap-5 profile-page-header-actions">
          {children}
        </div>
      )}
    </div>
  </div>
)

export default ZaglavljeIzlagaca
