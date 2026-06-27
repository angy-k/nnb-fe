'use client';
import Image from 'next/image';
import Link from 'next/link';
import EventIcon from '@/icons/event-icon.svg';
import MarketIcon from '@/icons/market-icon.svg';
import UsersGroupIcon from '@/icons/users-group-icon.svg';

const HomeHero = ({
  nextEventName = null,
  nextEventDate = null,
  slogan = 'Zajedno smo veliki!',
  subtitle = 'Noćna tržnica umetničkih, zanatskih i kreativnih proizvoda — mesto gde kreativnost susreće zajednicu.',
  eventsCount = '11+',
  visitorsCount = '300.000+',
  exhibitorsCount = '3.000+',
}) => {
  return (
    <div className="home-hero-wrapper">
      <div className="home-hero-container">
        {/* Left content */}
        <div className="home-hero-left">
          <h1 className="home-hero-title">
            <span className="home-hero-title-white">Novosadski</span>
            <br />
            <span className="home-hero-title-teal">noćni </span><span className="home-hero-title-red">bazar</span>
          </h1>
          <p className="home-hero-slogan">{slogan}</p>
          <p className="home-hero-subtitle">{subtitle}</p>
        </div>

        {/* Right illustration — owls on branch */}
        <div className="home-hero-right">
          <Image
            src="/owls.svg"
            width={700}
            height={488}
            alt="Novosadski noćni bazar ilustracija"
            priority
            style={{ width: '100%', height: 'auto' }}
          />
        </div>
      </div>

      {/* Stats section — centered, below hero content, alternating cards/icons */}
      <div className="home-hero-stats-section">
        <div className="home-hero-stats-grid">
          {/* Row 1: card | icon | card */}
          <div className="home-hero-stat-card" style={{ gridColumn: 1, gridRow: 1 }}>
            <span className="home-hero-stat-card-value">{eventsCount}</span>
            <span className="home-hero-stat-card-label">Bazara</span>
          </div>
          <div className="home-hero-stat-circle home-hero-stat-circle--teal" style={{ gridColumn: 2, gridRow: 1 }}>
            <Image src={MarketIcon} width={56} height={56} alt="Izlagači" />
          </div>
          <div className="home-hero-stat-card" style={{ gridColumn: 3, gridRow: 1 }}>
            <span className="home-hero-stat-card-value">{visitorsCount}</span>
            <span className="home-hero-stat-card-label">Posetilaca</span>
          </div>

          {/* Row 2: icon | card | icon */}
          <div className="home-hero-stat-circle home-hero-stat-circle--orange" style={{ gridColumn: 1, gridRow: 2 }}>
            <Image src={EventIcon} width={56} height={56} alt="Bazara" style={{ filter: 'brightness(0) invert(1)' }} />
          </div>
          <div className="home-hero-stat-card" style={{ gridColumn: 2, gridRow: 2 }}>
            <span className="home-hero-stat-card-value">{exhibitorsCount}</span>
            <span className="home-hero-stat-card-label">Izlagača</span>
          </div>
          <div className="home-hero-stat-circle home-hero-stat-circle--yellow" style={{ gridColumn: 3, gridRow: 2 }}>
            <Image src={UsersGroupIcon} width={56} height={56} alt="Posetilaci" />
          </div>
        </div>
      </div>

      {/* Bottom info bar */}
      {(nextEventName || nextEventDate) && (
        <div className="home-hero-bar">
          <div className="home-hero-bar-inner">
            <span className="home-hero-bar-label">Sledeći bazar</span>
            <span className="home-hero-bar-sep">→</span>
            {nextEventName && (
              <span className="home-hero-bar-name">{nextEventName}</span>
            )}
            {nextEventDate && (
              <>
                <span className="home-hero-bar-sep">·</span>
                <span className="home-hero-bar-date">{nextEventDate}</span>
              </>
            )}
            <Link href="/dogadjaji" className="home-hero-bar-link">
              Više o bazaru →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomeHero;
