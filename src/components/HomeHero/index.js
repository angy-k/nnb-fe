'use client';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import EventIcon from '@/icons/event-icon.svg';
import MarketIcon from '@/icons/market-icon.svg';
import UsersGroupIcon from '@/icons/users-group-icon.svg';
import LeafTopLeft from '@/icons/leaf-top-left.svg';
import LeafBottomLeft from '@/icons/leaf-bottom-left.svg';
import LeafBottomRight from '@/icons/leaf-bottom-right.svg';
import MoonIcon from '@/icons/moon-icon.svg';
import WhiteStarIcon from '@/icons/white-star-icon.svg';
import YellowStarIcon from '@/icons/yellow-star-icon.svg';
import ShoppingBagIcon from '@/icons/shopping-bag-icon.svg';

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
  tickerEvents = [],  // [{ name, date }] — svi nadolazeći događaji za ticker
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

  // Ticker events: fallback na nextEventName ako nema niza
  const ticker = tickerEvents.length > 0
    ? tickerEvents
    : (nextEventName ? [{ name: nextEventName, date: nextEventDate }] : [])

  return (
    <div className="home-hero-wrapper" style={{ position: 'relative', overflow: 'hidden' }}>

      {/* ── Dekorativni listovi ─────────────────── */}
      <div className="home-hero-decor home-hero-decor--leaf-tl" aria-hidden="true">
        <Image src={LeafTopLeft} width={220} height={196} alt="" />
      </div>
      <div className="home-hero-decor home-hero-decor--leaf-bl" aria-hidden="true">
        <Image src={LeafBottomLeft} width={240} height={140} alt="" />
      </div>
      <div className="home-hero-decor home-hero-decor--leaf-br" aria-hidden="true">
        <Image src={LeafBottomRight} width={180} height={210} alt="" />
      </div>

      {/* ── Mesec ───────────────────────────────── */}
      <div className="home-hero-decor home-hero-decor--moon" aria-hidden="true">
        <Image src={MoonIcon} width={130} height={130} alt="" />
      </div>

      {/* ── Zvezdice ────────────────────────────── */}
      <div className="home-hero-decor home-hero-decor--star1" aria-hidden="true">
        <Image src={WhiteStarIcon} width={22} height={22} alt="" />
      </div>
      <div className="home-hero-decor home-hero-decor--star2" aria-hidden="true">
        <Image src={YellowStarIcon} width={18} height={28} alt="" />
      </div>
      <div className="home-hero-decor home-hero-decor--star3" aria-hidden="true">
        <Image src={WhiteStarIcon} width={16} height={16} alt="" />
      </div>
      <div className="home-hero-decor home-hero-decor--star4" aria-hidden="true">
        <Image src={YellowStarIcon} width={14} height={22} alt="" />
      </div>

      {/* ── Kese ────────────────────────────────── */}
      <div className="home-hero-decor home-hero-decor--bag1" aria-hidden="true">
        <Image src={ShoppingBagIcon} width={72} height={86} alt="" />
      </div>
      <div className="home-hero-decor home-hero-decor--bag2" aria-hidden="true">
        <Image src={ShoppingBagIcon} width={56} height={67} alt="" />
      </div>

      <div className="home-hero-container" style={{ position: 'relative', zIndex: 1 }}>
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
      <div className="home-hero-stats-section" style={{ position: 'relative', zIndex: 1 }}>
        <div className="home-hero-stats-grid" ref={gridRef}>
          {/* Row 1: card | icon | card */}
          <div className="home-hero-stat-card" style={{ gridColumn: 1, gridRow: 1, background: '#56C4CF', border: 'none' }}>
            <span className="home-hero-stat-card-value" style={{ color: '#261A54' }}>{formatNum(counts.events)}{ev.suffix}</span>
            <span className="home-hero-stat-card-label" style={{ color: '#261A54', opacity: 1 }}>Događaja</span>
          </div>
          <div className="home-hero-stat-circle home-hero-stat-circle--teal" style={{ gridColumn: 2, gridRow: 1 }}>
            <Image src={MarketIcon} width={56} height={56} alt="Tržnica" />
          </div>
          <div className="home-hero-stat-card" style={{ gridColumn: 3, gridRow: 1, background: '#F18020', border: 'none' }}>
            <span className="home-hero-stat-card-value" style={{ color: '#261A54' }}>{formatNum(counts.visitors)}{vi.suffix}</span>
            <span className="home-hero-stat-card-label" style={{ color: '#261A54', opacity: 1 }}>Posetilaca</span>
          </div>

          {/* Row 2: icon | card | icon */}
          <div className="home-hero-stat-circle home-hero-stat-circle--orange" style={{ gridColumn: 1, gridRow: 2 }}>
            <Image src={EventIcon} width={56} height={56} alt="Događaji" style={{ filter: 'brightness(0) invert(1)' }} />
          </div>
          <div className="home-hero-stat-card" style={{ gridColumn: 2, gridRow: 2, background: '#F4C430', border: 'none' }}>
            <span className="home-hero-stat-card-value" style={{ color: '#261A54' }}>{formatNum(counts.exhibitors)}{ex.suffix}</span>
            <span className="home-hero-stat-card-label" style={{ color: '#261A54', opacity: 1 }}>Izlagača</span>
          </div>
          <div className="home-hero-stat-circle home-hero-stat-circle--yellow" style={{ gridColumn: 3, gridRow: 2 }}>
            <Image src={UsersGroupIcon} width={56} height={56} alt="Posetilaci" />
          </div>
        </div>
      </div>

      {/* Bottom ticker — scrolling marquee sa svim događajima */}
      {ticker.length > 0 && (
        <div className="home-hero-bar" style={{ position: 'relative', zIndex: 1 }}>
          <div className="home-hero-ticker-overflow">
            {/* Duplirani niz za beskonačni loop */}
            <div className="home-hero-ticker-track">
              {[...ticker, ...ticker, ...ticker].map((ev, i) => (
                <span key={i} className="home-hero-ticker-item">
                  <span className="home-hero-bar-name">{ev.name}</span>
                  {ev.date && (
                    <>
                      <span className="home-hero-bar-sep">→</span>
                      <span className="home-hero-bar-date">{ev.date}</span>
                    </>
                  )}
                  <span className="home-hero-bar-bullet">·</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomeHero;
