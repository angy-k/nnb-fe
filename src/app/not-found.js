'use client';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const NotFoundPage = () => {
  const router = useRouter()

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 999,
        background: 'radial-gradient(ellipse at 55% 40%, #2a1b6e 0%, #1c1050 35%, #0d0726 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        overflowY: 'auto',
        overflowX: 'hidden',
      }}
    >
      {/* Logo */}
      {/* Logo je na izvozu 264 × 74, na 76 od vrha — dakle 257 ovde. */}
      <div style={{ paddingTop: '74px', paddingBottom: '0' }}>
        <Image
          src="/logo-light.svg"
          alt="Novosadski noćni bazar"
          width={257}
          height={72}
          priority
        />
      </div>

      {/* Content row */}
      <div
        className="error-page-content"
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          flex: 1,
          width: '100%',
          maxWidth: '1400px',
          // Bez bočnog razmaka: u dizajnu tekst kreće tačno od leve ivice
          // kolone sadržaja (238 na okviru od 1920), a ne 80px unutar nje.
          padding: '40px 0',
          gap: '40px',
        }}
      >
        {/* Left — text */}
        <div className="error-page-text" style={{ flex: '0 0 auto', maxWidth: '560px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h1
            className="error-page-title"
            style={{
              fontSize: '44px',
              fontWeight: '800',
              color: '#ffffff',
              lineHeight: '1.2',
              margin: 0,
            }}
          >
            Greška 404 - Stranica nije pronađena.
          </h1>

          <p
            className="error-page-desc"
            style={{
              fontSize: '20px',
              fontWeight: '400',
              color: 'rgba(255,255,255,0.85)',
              lineHeight: '1.6',
              margin: 0,
            }}
          >
            Ne brinite, ovakve stvari se ponekad dešavaju. Možda ste pogrešili URL ili je stranica premeštena?
          </p>

          <button
            type="button"
            onClick={() => router.back()}
            className="error-page-btn"
            style={{
              alignSelf: 'flex-start',
              marginTop: '12px',
              background: '#EC4923',
              color: '#ffffff',
              borderRadius: '29px',
              width: '384px',
              height: '57px',
              fontSize: '18px',
              fontWeight: '600',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Vratite se na prethodnu stranicu
          </button>
        </div>

        {/* Right — owls illustration */}
        {/* Sove se u dizajnu prelivaju preko desne ivice kolone, sve do ivice
            ekrana. `overflow: visible` na roditelju to dozvoljava. */}
        <div className="error-page-owls" style={{ flex: '1 1 auto', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginRight: '-20px' }}>
          <Image
            src="/owls.svg"
            alt="Sove noćnog bazara"
            width={845}
            height={585}
            priority
            style={{ maxWidth: '100%', height: 'auto' }}
          />
        </div>
      </div>
    </div>
  )
}

export default NotFoundPage;
