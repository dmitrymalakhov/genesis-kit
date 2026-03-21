import { useState, useEffect } from "react";
import type { FC } from "react";
import type { DateWidgetProps } from "./types";
import {
  Widget,
  AccentBar,
  DateRow,
  DayNumber,
  DateRightCol,
  MonthText,
  YearText,
  DayName,
  Divider,
  WeekRow,
  WeekDay,
  WeekDayLabel,
  WeekDayNum,
  TimeRow,
  TimeDot,
  TimeText,
} from "./styled";

const MONTHS_RU = [
  "января", "февраля", "марта", "апреля", "мая", "июня",
  "июля", "августа", "сентября", "октября", "ноября", "декабря",
];

const DAYS_RU = [
  "воскресенье", "понедельник", "вторник", "среда",
  "четверг", "пятница", "суббота",
];

const DAYS_SHORT = ["вс", "пн", "вт", "ср", "чт", "пт", "сб"];

const getWeekDays = (today: Date): Date[] => {
  const monday = new Date(today);
  monday.setDate(today.getDate() - ((today.getDay() + 6) % 7));
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });
};

export const DateWidget: FC<DateWidgetProps> = ({ className }) => {
  const [now, setNow] = useState<Date>(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(timer);
  }, []);

  const day = now.getDate();
  const month = MONTHS_RU[now.getMonth()];
  const year = now.getFullYear();
  const dayName = DAYS_RU[now.getDay()];
  const hour = now.getHours();
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const weekDays = getWeekDays(now);
  const todayMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  return (
    <Widget className={className} role="region" aria-label="Текущая дата">
      <AccentBar />

      <DateRow>
        <DayNumber>{day}</DayNumber>
        <DateRightCol>
          <MonthText>{month}</MonthText>
          <YearText>{year}</YearText>
        </DateRightCol>
      </DateRow>

      <DayName>{dayName}</DayName>

      <Divider />

      <WeekRow>
        {weekDays.map((d, i) => {
          const $isToday = d.getDate() === day && d.getMonth() === now.getMonth();
          const $isPast = d < todayMidnight;
          const $isWeekend = d.getDay() === 0 || d.getDay() === 6;
          const props = { $isToday, $isPast, $isWeekend };
          return (
            <WeekDay key={i} {...props}>
              <WeekDayLabel {...props}>{DAYS_SHORT[d.getDay()]}</WeekDayLabel>
              <WeekDayNum {...props}>{d.getDate()}</WeekDayNum>
            </WeekDay>
          );
        })}
      </WeekRow>

      <TimeRow>
        <TimeDot />
        <TimeText>
          {String(hour).padStart(2, "0")}:{minutes}
        </TimeText>
      </TimeRow>
    </Widget>
  );
};
