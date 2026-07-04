'use client';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import EventIcon from '@/icons/event-icon.svg';
import MarketIcon from '@/icons/market-icon.svg';
import UsersGroupIcon from '@/icons/users-group-icon.svg';

// "300.000+" → { num: 300000, suffix: '+' }
const parseStat = (str) => {
  const match = str.match(/^([\d.]+)(.*)$/);
  if (!match) return { num: 0, suffix: str };
  return { num: parseInt(match[1].replace(/\./g, ''), 10), suffix: match[2] };
};

// plain number, no thousands separator
const formatNum = (n) => Math.floor(n).toString();

const HomeHero = ({
  nextEventName = null,
  nextEventDate = null,
  slogan = 'Zajedno smo veliki!',
  subtitle = 'Noćna tržnica umetničkih, zanatskih i kreativnih proizvoda — mesto gde kreativnost susreće zajednicu.',
  eventsCount = '114+',
  visitorsCount = '300000+',
  exhibitorsCount = '2000+',
}) => {
  const ev = parseStat(eventsCount);
  const vi = parseStat(visitorsCount);
  const ex = parseStat(exhibitorsCount);

  const gridRef = useRef(null);
  const animated = useRef(false);
  const [counts, setCounts] = useState({ events: 0, visitors: 0, exhibitors: 0 });

  useEffect(() => {
    const section = gridRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !animated.current) {
          animated.current = true;
          const duration = 2000;
          const start = performance.now();
          const tick = (now) => {
            const elapsed = now - start;
            const p = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - p, 3); // ease-out cubic
            setCounts({
              events: Math.floor(eased * ev.num),
              visitors: Math.floor(eased * vi.num),
              exhibitors: Math.floor(eased * ex.num),
            });
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, [ev.num, vi.num, ex.num]);

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
        <div className="home-hero-stats-grid" ref={gridRef}>
          {/* Row 1: card | icon | card */}
          <div className="home-hero-stat-card" style={{ gridColumn: 1, gridRow: 1 }}>
            <span className="home-hero-stat-card-value">{formatNum(counts.events)}{ev.suffix}</span>
            <span className="home-hero-stat-card-label">Događaja</span>
          </div>
          <div className="home-hero-stat-circle home-hero-stat-circle--teal" style={{ gridColumn: 2, gridRow: 1 }}>
            <Image src={MarketIcon} width={56} height={56} alt="Tržnica" />
          </div>
          <div className="home-hero-stat-card" style={{ gridColumn: 3, gridRow: 1 }}>
            <span className="home-hero-stat-card-value">{formatNum(counts.visitors)}{vi.suffix}</span>
            <span className="home-hero-stat-card-label">Posetilaca</span>
          </div>

          {/* Row 2: icon | card | icon */}
          <div className="home-hero-stat-circle home-hero-stat-circle--orange" style={{ gridColumn: 1, gridRow: 2 }}>
            <Image src={EventIcon} width={56} height={56} alt="Događaji" style={{ filter: 'brightness(0) invert(1)' }} />
          </div>
          <div className="home-hero-stat-card" style={{ gridColumn: 2, gridRow: 2 }}>
            <span className="home-hero-stat-card-value">{formatNum(counts.exhibitors)}{ex.suffix}</span>
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
