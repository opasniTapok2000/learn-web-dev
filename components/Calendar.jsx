import {
  buildCalendarGrid,
  formatCalendarMonth,
  formatVisitDate,
  isDateSelectable,
  sameDay,
  weekHeaders,
} from '../calendar.js';

export default function Calendar({ year, month, today, selectedDay, onDayClick, onMonthChange }) {
  const days = buildCalendarGrid(year, month);

  return (
    <section className="schedule-card calendar" aria-labelledby="month">
      <div className="calendar__header">
        <h2 className="calendar__month" id="month" aria-live="polite">{formatCalendarMonth(year, month)}</h2>
        <div className="calendar__navigation">
          <button className="action month-arrow" type="button" aria-label="Предыдущий месяц" onClick={() => onMonthChange(-1)}>‹</button>
          <button className="action month-arrow" type="button" aria-label="Следующий месяц" onClick={() => onMonthChange(1)}>›</button>
        </div>
      </div>
      <div className="calendar__grid" role="group" aria-label="Выбор дня">
        {weekHeaders.map((weekday) => (
          <span key={weekday} className="day day--weekday" aria-hidden="true">{weekday}</span>
        ))}
        {days.map((day, index) => {
          if (day === null) return <span key={'empty-' + index} className="day day--blank" aria-hidden="true" />;

          const date = new Date(year, month, day);
          return (
            <button
              key={day}
              className="day day--choice"
              type="button"
              aria-label={formatVisitDate(date)}
              aria-pressed={sameDay(date, selectedDay)}
              disabled={!isDateSelectable(date, today)}
              onClick={() => onDayClick(date)}
            >
              {day}
            </button>
          );
        })}
      </div>
    </section>
  );
}
