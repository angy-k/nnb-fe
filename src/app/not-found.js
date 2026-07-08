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
      }}
    >
      {/* Logo */}
      <div style={{ paddingTop: '48px', paddingBottom: '0' }}>
        <Image
          src="/logo-dark.svg"
          alt="Novosadski noćni bazar"
          width={220}
          height={70}
          priority
        />
      </div>

      {/* Content row */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          flex: 1,
          width: '100%',
          maxWidth: '1400px',
          padding: '40px 80px',
          gap: '40px',
        }}
      >
        {/* Left — text */}
        <div style={{ flex: '0 0 auto', maxWidth: '560px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h1
            style={{
              fontSize: '48px',
              fontWeight: '800',
              color: '#ffffff',
              lineHeight: '1.2',
              margin: 0,
            }}
          >
            Greška 404 - Stranica nije pronađena.
          </h1>

          <p
            style={{
              fontSize: '18px',
              fontWeight: '400',
              color: 'rgba(255,255,255,0.75)',
              lineHeight: '1.6',
              margin: 0,
            }}
          >
            Ne brinite, ovakve stvari se ponekad dešavaju. Možda ste pogrešili URL ili je stranica premeštena?
          </p>

          <button
            type="button"
            onClick={() => router.back()}
            style={{
              alignSelf: 'flex-start',
              marginTop: '12px',
              background: '#EC4923',
              color: '#ffffff',
              borderRadius: '30px',
              padding: '16px 40px',
              fontSize: '17px',
              fontWeight: '600',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Vratite se na prethodnu stranicu
          </button>
        </div>

        {/* Right — owls illustration */}
        <div style={{ flex: '1 1 auto', display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
          <Image
            src="/owls.svg"
            alt="Sove noćnog bazara"
            width={680}
            height={412}
            priority
            style={{ maxWidth: '100%', height: 'auto' }}
          />
        </div>
      </div>
    </div>
  )
}

export default NotFoundPage;
