'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Divider } from '@nextui-org/divider';
import { formatTitleForUri } from '@/utils/transform-helper';

const AUTOPLAY_INTERVAL = 4500;

const EventsSlider = ({ events = [] }) => {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef(null);
  const total = events.length;

  const next = useCallback(() => setCurrent(c => (c + 1) % total), [total]);
  const prev = useCallback(() => setCurrent(c => (c - 1 + total) % total), [total]);

  useEffect(() => {
    if (total <= 1 || paused) return;
    timerRef.current = setInterval(next, AUTOPLAY_INTERVAL);
    return () => clearInterval(timerRef.current);
  }, [next, total, paused]);

  if (!total) return null;

  const ev = events[current];

  return (
    <div
      className="w-full bg-[#F0F0F0]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        className="w-full"
        style={{ maxWidth: '1400px', margin: '0 auto', padding: '64px 30px' }}
      >
        {/* Title + Divider — isti pattern kao Blog/Kalendar/Partneri */}
        <span className="our-team-title">Predstojeći događaji</span>
        <Divider className="section-divider" style={{ marginTop: '8px', marginBottom: '32px' }} />

        {/* Event Card — dark purple, teal akcenti */}
        <div
          style={{
            width: '100%',
            background: '#261A54',
            borderRadius: '30px',
            display: 'flex',
            flexDirection: 'row',
            overflow: 'hidden',
            minHeight: '240px',
          }}
        >
          {/* Info panel */}
          <div style={{
            flex: 1,
            padding: '40px 48px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            gap: '16px',
          }}>
            {/* Date badge */}
            <span style={{
              display: 'inline-block',
              background: '#56C4CF',
              color: '#261A54',
              fontFamily: 'Open Sans, sans-serif',
              fontWeight: 700,
              fontSize: '13px',
              padding: '4px 16px',
              borderRadius: '100px',
              alignSelf: 'flex-start',
            }}>
              {ev.date || ev.dateTime}
            </span>

            {/* Naziv događaja */}
            <h3 style={{
              fontFamily: '\'MADE GoodTime Script\', sans-serif',
              fontWeight: 400,
              fontSize: '40px',
              color: '#ffffff',
              lineHeight: 1.2,
              margin: 0,
            }}>
              {ev.title}
            </h3>

            {/* Adresa */}
            {ev.address && (
              <span style={{
                fontFamily: 'Open Sans, sans-serif',
                color: 'rgba(255,255,255,0.7)',
                fontSize: '15px',
              }}>
                {ev.address}
              </span>
            )}

            {/* CTA dugme */}
            <Link
              href={`/dogadjaj/${formatTitleForUri(ev.title)}`}
              prefetch={false}
              style={{
                display: 'inline-block',
                marginTop: '8px',
                padding: '12px 28px',
                background: '#56C4CF',
                color: '#261A54',
                borderRadius: '100px',
                fontFamily: 'Open Sans, sans-serif',
                fontWeight: 700,
                fontSize: '14px',
                textDecoration: 'none',
                alignSelf: 'flex-start',
              }}
            >
              Saznaj više →
            </Link>
          </div>

          {/* Cover slika — prikazuje se samo ako postoji */}
          {ev.coverImage && (
            <div
              className="events-slider-img"
              style={{
                position: 'relative',
                width: '360px',
                flexShrink: 0,
              }}
            >
              <Image
                src={ev.coverImage}
                alt={ev.title || 'Događaj'}
                fill
                sizes="360px"
                style={{ objectFit: 'cover' }}
                unoptimized
              />
            </div>
          )}
        </div>

        {/* Dot navigacija — samo pri više događaja */}
        {total > 1 && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '16px',
            marginTop: '24px',
          }}>
            <button
              type="button"
              onClick={prev}
              aria-label="Prethodni"
              style={{
                width: '40px', height: '40px', borderRadius: '50%',
                border: '2px solid #261A54', background: 'transparent',
                color: '#261A54', fontSize: '22px', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              ‹
            </button>

            <div style={{ display: 'flex', gap: '8px' }}>
              {events.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setCurrent(i)}
                  aria-label={`Događaj ${i + 1}`}
                  style={{
                    width: i === current ? '24px' : '10px',
                    height: '10px',
                    borderRadius: '100px',
                    border: 'none',
                    cursor: 'pointer',
                    background: i === current ? '#56C4CF' : '#aaa',
                    transition: 'width 0.25s, background 0.25s',
                    padding: 0,
                  }}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={next}
              aria-label="Sledeći"
              style={{
                width: '40px', height: '40px', borderRadius: '50%',
                border: '2px solid #261A54', background: 'transparent',
                color: '#261A54', fontSize: '22px', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              ›
            </button>
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 640px) {
          .events-slider-img { display: none !important; }
        }
      `}</style>
    </div>
  );
};

export default EventsSlider;
