import { useState } from 'react';
import { getDefaultDay, getLocalDay, getSlots, isDateSelectable, sameDay } from './calendar.js';
import BookingHeader from './components/BookingHeader.jsx';
import BookingSteps from './components/BookingSteps.jsx';
import Calendar from './components/Calendar.jsx';
import TimeSlots from './components/TimeSlots.jsx';
import BookingBottomBar from './components/BookingBottomBar.jsx';

export default function App() {
  const [today] = useState(() => getLocalDay(new Date()));
  const [selectedDay, setSelectedDay] = useState(() => getDefaultDay(today));
  const [currentMonth, setCurrentMonth] = useState(selectedDay.getMonth());
  const [currentYear, setCurrentYear] = useState(selectedDay.getFullYear());
  const [selectedTime, setSelectedTime] = useState(null);
  const [slots, setSlots] = useState(() => getSlots(selectedDay));

  function handleDayClick(date) {
    if (!isDateSelectable(date, today) || sameDay(date, selectedDay)) return;

    setSelectedDay(date);
    setSelectedTime(null);
    setSlots(getSlots(date));
  }

  function handleTimeClick(time) {
    setSelectedTime(time);
  }

  function handleMonthChange(offset) {
    const next = new Date(currentYear, currentMonth + offset, 1);
    setCurrentMonth(next.getMonth());
    setCurrentYear(next.getFullYear());
  }

  return (
    <div className="booking">
      <BookingHeader />
      <main className="booking-main">
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
            slots={slots}
            selectedTime={selectedTime}
            onTimeClick={handleTimeClick}
          />
        </div>
        <BookingBottomBar date={selectedDay} time={selectedTime} />
      </main>
    </div>
  );
}
