'use client';
import { useEffect, useState } from 'react';
import { Divider } from '@nextui-org/divider';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from '@nextui-org/table';
import { add, parse, startOfToday } from 'date-fns';
import eventService from '@/services/eventService';

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
              location: (item?.location ?? item?.address ?? '').toString(),
              date: startDate.toLocaleDateString('sr-RS', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
              }),
              applicationStart: item?.applicationStart
                ? new Date(item.applicationStart).toLocaleDateString('sr-RS', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                  })
                : '—',
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

  return (
    <div
      className="w-full blogs-container pt-24 grid place-items-start mx-auto 2xl:max-w-screen-2xl 2xl:mx-auto pb-48"
      style={{ justifySelf: 'center', maxWidth: '1400px' }}
    >
      <span className="our-team-title">{title}</span>
      <Divider className="section-divider" />

      {loading && (
        <div className="w-full grid place-items-center py-12">Učitavanje...</div>
      )}

      {!loading && events.length > 0 && (
        <Table aria-label="Očekivani događaji" radius>
          <TableHeader>
            <TableColumn className="text-[#1B1B1B] capitalize font-bold font-[18px]">Manifestacija</TableColumn>
            <TableColumn className="text-[#1B1B1B] capitalize font-bold font-[18px]">Mesto</TableColumn>
            <TableColumn className="text-[#1B1B1B] capitalize font-bold font-[18px]">Datum</TableColumn>
            <TableColumn className="text-[#1B1B1B] capitalize font-bold font-[18px]">Početak prijava</TableColumn>
          </TableHeader>
          <TableBody>
            {events.map((event, index) => (
              <TableRow key={event.id || index}>
                <TableCell
                  className="text-[#1B1B1B] capitalize font-normal font-[18px] rounded-l-full"
                  style={{ flex: 1, padding: '16px', backgroundColor: '#56C4CF' }}
                >
                  {event.name}
                </TableCell>
                <TableCell
                  className="text-[#1B1B1B] capitalize font-normal font-[18px]"
                  style={{ flex: 1, backgroundColor: '#56C4CF', padding: '16px' }}
                >
                  {event.location}
                </TableCell>
                <TableCell
                  className="text-[#1B1B1B] capitalize font-normal font-[18px]"
                  style={{ flex: 1, backgroundColor: '#56C4CF', padding: '16px' }}
                >
                  {event.date}
                </TableCell>
                <TableCell
                  className="text-[#1B1B1B] capitalize font-normal font-[18px] rounded-r-full"
                  style={{ flex: 1, padding: '16px', backgroundColor: '#56C4CF' }}
                >
                  {event.applicationStart}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default UpcommingEvents;
