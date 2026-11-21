import { formatDateAttribute, formatVisitDate } from '../calendar.js';

export default function TimeSlots({ date, slots, selectedTime, onTimeClick }) {
  const isFullyBooked = slots.every((slot) => !slot.available);

  return (
    <section className="schedule-card time-card" aria-labelledby="time-title">
      <div className="time-card__available">
        <h2 className="time-card__title" id="time-title">Свободное время</h2>
        <time className="time-card__date" dateTime={formatDateAttribute(date)}>{formatVisitDate(date)}</time>
        <div className="slots" role="group" aria-label="Время визита">
          {!isFullyBooked && slots.map(({ time, available }) => (
            <button
              key={time}
              className="action slot"
              type="button"
              aria-pressed={time === selectedTime}
              aria-label={available ? undefined : time + ', занято'}
              disabled={!available}
              onClick={() => onTimeClick(time)}
            >
              {time}
            </button>
          ))}
        </div>
        <p className="time-card__message" role="status" hidden={!isFullyBooked}>На этот день свободных слотов нет.</p>
      </div>
    </section>
  );
}
