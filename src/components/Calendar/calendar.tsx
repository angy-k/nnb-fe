"use client";
import React, { useState, useCallback } from "react";
import { DayView } from "./day-view";
import { WeekView } from "./week-view";
import { MonthView } from "./month-view";
import ArrowLeft from "../../icons/arrow-left.svg";
import ArrowRight from "../../icons/arrow-right.svg";
import Image from 'next/image';
import { eventsMock } from "./event-mocks";
import { Divider } from "@nextui-org/divider";
import { add, sub, endOfWeek, startOfWeek } from "date-fns";

import type { Event } from "./types";
import { formatDanMesecGodina, formatMesecGodina, formatMesecKratko, formatGodina } from '@/utils/dateHelpers';

type View = "day" | "week" | "month";

export type CalendarProps = {
  view?: View;
  events?: Event[];
  date?: string | number | Date;
  onEventClick?: (eventId: string) => void;
  onDayClick?: (date: Date) => void;
};

export const Calendar: React.FC<CalendarProps> = ({
    date = new Date(),
    events = eventsMock,
    view = "month",
    onEventClick,
    onDayClick,
}) => {
    const [curView, setCurView] = useState<View>(view);
    const [curDate, setCurDate] = useState<Date>(new Date(date));

    const onPrev = useCallback(() => {
        if (curView === "day") {
            return setCurDate((prev) => sub(prev, { days: 1 }));
        }

        if (curView === "week") {
            return setCurDate((prev) => sub(prev, { weeks: 1 }));
        }

        return setCurDate((prev) => sub(prev, { months: 1 }));
    }, [curView]);

    const onNext = useCallback(() => {
        if (curView === "day") {
            return setCurDate((prev) => add(prev, { days: 1 }));
        }

        if (curView === "week") {
            return setCurDate((prev) => add(prev, { weeks: 1 }));
        }

        return setCurDate((prev) => add(prev, { months: 1 }));
    }, [curView]);

    // Nazivi meseca dolaze iz zajedničkog mesta (`dateHelpers`), koje koristi
    // `date-fns` sa srpskom latinicom. Ranije je ovde stajao `toLocaleDateString`
    // pa je trebalo ručno skidati završnu tačku koju srpska lokalizacija dodaje
    // uz godinu — a ishod je zavisio od pregledača.
    const formatDateForView = useCallback((date: Date) => {
        if (curView === "day") {
            return formatDanMesecGodina(date);
        }

        if (curView === "week") {
            const weekStart = startOfWeek(date, { weekStartsOn: 1 });
            const weekEnd = endOfWeek(date, { weekStartsOn: 1 });

            const startMonth = formatMesecKratko(weekStart);
            const endMonth = formatMesecKratko(weekEnd);
            const year = formatGodina(weekStart);

            if (startMonth !== endMonth) {
                return `${startMonth} – ${endMonth} ${year}`;
            } else {
                return `${startMonth} ${year}`;
            }
        }

        return formatMesecGodina(date);
    }, [curView]);

// Gornji razmak je ranije bio `pt-60` (240px) — toliko je trebalo dok je kalendar
// stajao odmah ispod hero sekcije, da se ne sudari sa sovom koja se preliva preko
// granice. Sada iznad njega stoji tabelarni prikaz, pa je toliki razmak ostavljao
// praznu površinu. Na mobilnom je i dalje `sm:pt-4`.
return (
    <div key={"calendar-component"} className={"2xl:max-w-screen-2xl w-full h-full flex-1 flex flex-col overflow-hidden sm:overflow-visible pt-16 sm:pt-4 sm:h-auto"}>
        {/* `sm:px-4` — dugmad za prethodni/sledeći mesec su na mobilnom
            dodirivala desnu ivicu ekrana. Sama mreža dana ostaje od ivice do
            ivice, jer su ćelije uske pa im svaki piksel znači. */}
        {/* Naziv meseca je bio pomeren ulevo za 48px u odnosu na dizajn.

            Uzrok je bio raspored: zaglavlje je `justify-between`, a naslov je
            stajao u delu sa `flex-1`, pa se centrirao unutar *preostale* širine
            — one bez strelica. Pomeraj je zato bio tačno pola širine bloka sa
            strelicama.

            Mreža sa tri kolone, gde su leva i desna jednake (`1fr`), centrira
            naslov po punoj širini. Prazna leva kolona služi samo kao protivteža
            strelicama u desnoj.

            Na telefonu se vraća stari raspored. Sa mrežom bi se dug naziv, kao
            „septembar 2026.", uvukao pod strelice — mereno do 36px preklopa na
            320px širine. Ispod 600px nema ni smisla brinuti za centriranje, a
            ima smisla da se tekst ne sudara. */}
        <section id="calendar-header" className="mb-6 sm:mb-3 nnb-gutter w-full flex md:grid lg:grid md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] justify-between items-center gap-2 pb-8 sm:pb-4">
            <div aria-hidden="true" />
            <div className="flex gap-2 items-center min-w-0 justify-center flex-1 md:flex-none lg:flex-none">
                <span className="calendar-title capitalize sm:text-[20px]">
                    {formatDateForView(curDate).toLowerCase()}
                </span>
            </div>
            <div className="flex gap-2 calendar-buttons h-[48px] flex-shrink-0 justify-self-end">
                <button onClick={onPrev} aria-label={`prev ${curView}`} className="w-[42px] aspect-square border-none button-one font-semibold flex justify-center items-center hover:bg-[lightBlue] hover:opacity-75 transition-colors duration-300">
                    <Image
                        src={ArrowLeft}
                        width={24}
                        height={15}
                        alt={'Calendar arrow left icon.'}
                    />
                </button>
                <Divider orientation="vertical" className="section-divider" />
                <button onClick={onNext} aria-label={`next ${curView}`} className="w-[42px] aspect-square border-none button-two font-semibold flex justify-center items-center hover:bg-[lightBlue] hover:opacity-75 transition-colors duration-300">
                    <Image
                        src={ArrowRight}
                        width={24}
                        height={15}
                        alt={'Calendar arrow right icon.'}
                    />
                </button>
                {/* <button aria-label="set month view"
                    onClick={() => setCurView("month")}
                    className={cn(
                        "py-2 px-3 border border-gray-200 rounded-md font-semibold hover:bg-blue-100 transition-colors duration-300",
                        curView === "month" && "bg-blue-400 text-white hover:bg-blue-700"
                    )}
                >
                    Month
                </button>
                <button
                    aria-label="set month week"
                    onClick={() => setCurView("week")}
                    className={cn(
                        "py-2 px-3 border border-gray-200 rounded-md font-semibold hover:bg-blue-100 transition-colors duration-300",
                        curView === "week" && "bg-blue-400 text-white hover:bg-blue-700"
                    )}
                >
                    Week
                </button>
                <button
                    aria-label="set month day"
                    onClick={() => setCurView("day")}
                    className={cn(
                        "py-2 px-3 border border-gray-200 rounded-md font-semibold hover:bg-blue-100 transition-colors duration-300",
                        curView === "day" && "bg-blue-400 text-white hover:bg-blue-700"
                    )}
                >
                    Day
                </button> */}
            </div>
        </section>
        {curView === "day" && <DayView date={curDate} events={events} onEventClick={onEventClick} />}
        {curView === "week" && <WeekView date={curDate} events={events} onEventClick={onEventClick} />}
        {curView === "month" && <MonthView date={curDate} events={events} onEventClick={onEventClick} onDayClick={onDayClick} />}
    </div>
    );
};
