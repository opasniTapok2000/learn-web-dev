import { useEffect, useState } from 'react';
import { fetchSlots, fetchToday } from './api.js';
import { formatDateAttribute, isDateSelectable, sameDay } from './calendar.js';
import BookingHeader from './components/BookingHeader.jsx';
import BookingSteps from './components/BookingSteps.jsx';
import Calendar from './components/Calendar.jsx';
import TimeSlots from './components/TimeSlots.jsx';
import BookingBottomBar from './components/BookingBottomBar.jsx';

function Booking({ today }) {
  const [selectedDay, setSelectedDay] = useState(today);
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedTime, setSelectedTime] = useState(null);
  const [slotsRequest, setSlotsRequest] = useState({ status: 'loading' });

  const selectedKey = formatDateAttribute(selectedDay);
  const request = slotsRequest.dateKey === selectedKey ? slotsRequest : { status: 'loading' };

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    fetchSlots(selectedDay, signal)
      .then(({ date, slots }) => {
        if (signal.aborted) return;

        const responseDate = new Date(date.year, date.month, date.day);
        if (!sameDay(responseDate, selectedDay)) {
          throw new Error('Дата в ответе сервера не совпадает с запросом.');
        }
        setSlotsRequest({ dateKey: selectedKey, status: 'ready', slots });
      })
      .catch(() => {
        if (!signal.aborted) setSlotsRequest({ dateKey: selectedKey, status: 'error' });
      });

    return () => controller.abort();
  }, [selectedDay, selectedKey]);

  function handleDayClick(date) {
    if (!isDateSelectable(date, today) || sameDay(date, selectedDay)) return;

    setSlotsRequest({ status: 'loading' });
    setSelectedDay(date);
    setSelectedTime(null);
  }

  function handleMonthChange(offset) {
    const next = new Date(currentYear, currentMonth + offset, 1);
    setCurrentMonth(next.getMonth());
    setCurrentYear(next.getFullYear());
  }

  return (
    <>
      <BookingSteps />
      <div className="booking-heading">
        <h1 className="booking-heading__title">Выберите дату и время</h1>
        <p className="booking-heading__hint">Выберите день в календаре, затем нажмите на свободное время.</p>
      </div>
      <div className="schedule">
        <Calendar
          year={currentYear}
          month={currentMonth}
          today={today}
          selectedDay={selectedDay}
          onDayClick={handleDayClick}
          onMonthChange={handleMonthChange}
        />
        <TimeSlots
          date={selectedDay}
          request={request}
          selectedTime={selectedTime}
          onTimeClick={setSelectedTime}
        />
      </div>
      <BookingBottomBar date={selectedDay} time={selectedTime} />
    </>
  );
}

export default function App() {
  const [request, setRequest] = useState({ status: 'loading' });

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    fetchToday(signal)
      .then((today) => {
        if (!signal.aborted) setRequest({ status: 'ready', today });
      })
      .catch(() => {
        if (!signal.aborted) setRequest({ status: 'error' });
      });

    return () => controller.abort();
  }, []);

  return (
    <div className="booking">
      <BookingHeader />
      <main className="booking-main">
        {request.status === 'loading' && <p className="time-card__message" role="status">Загрузка…</p>}
        {request.status === 'error' && <p className="time-card__message" role="alert">Не удалось загрузить календарь. Обновите страницу.</p>}
        {request.status === 'ready' && <Booking today={request.today} />}
      </main>
    </div>
  );
}
