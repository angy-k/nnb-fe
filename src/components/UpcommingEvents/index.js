'use client';
import { useEffect, useState } from 'react';
import { Divider } from '@nextui-org/divider';
import { add, parse, startOfToday } from 'date-fns';
import eventService from '@/services/eventService';
import { formatDate } from '@/utils/dateHelpers';

const UpcommingEvents = ({
  title = 'Očekivani događaji',
}) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = eventService.getActiveEvents
          ? await eventService.getActiveEvents()
          : await eventService.getEvents();

        if (!response.ok) {
          setEvents([]);
          return;
        }

        const data = await response.json().catch(() => null);
        if (!data?.success) {
          setEvents([]);
          return;
        }

        const items = Array.isArray(data?.data)
          ? data.data
          : Array.isArray(data?.data?.data)
            ? data.data.data
            : [];

        const today = startOfToday();

        const parseWithFallbacks = (value, formats) => {
          for (const fmt of formats) {
            const d = parse(value, fmt, new Date());
            if (!Number.isNaN(d?.getTime?.())) return d;
          }
          return null;
        };

        const upcoming = items
          .map((item) => {
            const rawStart = (item?.dateTime ?? '').toString().trim();
            if (!rawStart) return null;

            const startDate = parseWithFallbacks(rawStart, [
              'dd.MM.yyyy HH:mm',
              'd.MM.yyyy HH:mm',
              'd MMM yyyy HH:mm',
              'd M yyyy HH:mm',
              'dd MMM yyyy HH:mm',
              'dd M yyyy HH:mm',
            ]) ?? new Date(rawStart);

            if (!startDate || isNaN(startDate.getTime())) return null;
            if (startDate < today) return null;

            return {
              id: (item?.id ?? '').toString(),
              name: (item?.title ?? item?.name ?? '').toString(),
              location: (item?.eventAddress ?? item?.location ?? item?.address ?? '').toString(),
              date: formatDate(startDate),
              applicationStart: (() => {
                const raw = (item?.applicationStartDate ?? '').toString().trim();
                if (!raw) return '—';
                const d = parseWithFallbacks(raw, [
                  'dd.MM.yyyy', 'd.MM.yyyy',
                  'd MMM yyyy', 'd M yyyy', 'dd MMM yyyy', 'dd M yyyy',
                ]) ?? new Date(raw);
                if (!d || isNaN(d.getTime())) return '—';
                return formatDate(d);
              })(),
            };
          })
          .filter(Boolean)
          .sort((a, b) => new Date(a.date) - new Date(b.date));

        setEvents(upcoming);
      } catch {
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Sakrij komponentu ako nema događaja (i nije u toku učitavanje)
  if (!loading && events.length === 0) return null;

  // Donji razmak je izjednačen sa gornjim. Ranije je bio `pb-48` (192px), što je
  // odgovaralo dok je tabela stajala poslednja na stranici; sada ide ispred
  // kalendara, pa je toliki razmak pravio praznu površinu između njih.
  return (
    <div
      className="w-full blogs-container pt-24 sm:pt-8 grid place-items-start mx-auto 2xl:max-w-screen-2xl 2xl:mx-auto pb-24 sm:pb-16"
      style={{ justifySelf: 'center', maxWidth: '1400px' }}
    >
      <span className="our-team-title">{title}</span>
      <Divider className="section-divider" />

      {loading && (
        <div className="w-full grid place-items-center py-12">Učitavanje...</div>
      )}

      {!loading && events.length > 0 && (
        <>
          {/* Desktop tabela */}
          <div className="hidden md:block lg:block w-full">
            <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 10px' }}>
              <thead>
                <tr>
                  {['Manifestacija', 'Mesto', 'Datum', 'Početak prijava'].map((col) => (
                    <th key={col} style={{ textAlign: 'left', padding: '4px 16px', fontFamily: 'Open Sans, sans-serif', fontSize: '18px', fontWeight: 700, color: '#1B1B1B' }}>
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {events.map((event, index) => (
                  <tr key={event.id || index}>
                    <td style={{ background: '#56C4CF', padding: '16px 20px', borderRadius: '102px 0 0 102px', fontFamily: 'Open Sans, sans-serif', fontSize: '18px', color: '#1B1B1B' }}>
                      {event.name}
                    </td>
                    <td style={{ background: '#56C4CF', padding: '16px 20px', fontFamily: 'Open Sans, sans-serif', fontSize: '18px', color: '#1B1B1B' }}>
                      {event.location}
                    </td>
                    <td style={{ background: '#56C4CF', padding: '16px 20px', fontFamily: 'Open Sans, sans-serif', fontSize: '18px', color: '#1B1B1B' }}>
                      {event.date}
                    </td>
                    <td style={{ background: '#56C4CF', padding: '16px 20px', borderRadius: '0 102px 102px 0', fontFamily: 'Open Sans, sans-serif', fontSize: '18px', color: '#1B1B1B' }}>
                      {event.applicationStart}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobilni card prikaz */}
          <div className="block md:hidden lg:hidden w-full space-y-3 px-4">
            {events.map((event, index) => (
              <div
                key={event.id || index}
                className="w-full text-[#1B1B1B]"
                style={{ backgroundColor: '#56C4CF', borderRadius: '24px', padding: '16px 20px' }}
              >
                <p className="font-bold text-[16px] capitalize mb-2">{event.name}</p>
                <div className="flex flex-col gap-1">
                  {event.location && (
                    <div className="flex items-center gap-2 text-[14px]">
                      <span className="font-semibold">Mesto:</span>
                      <span className="capitalize">{event.location}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-[14px]">
                    <span className="font-semibold">Datum:</span>
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[14px]">
                    <span className="font-semibold">Početak prijava:</span>
                    <span>{event.applicationStart}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default UpcommingEvents;
