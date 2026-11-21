import { formatDateAttribute, formatVisitDate } from '../calendar.js';

export default function TimeSlots({ date, request, selectedTime, onTimeClick }) {
  const isReady = request.status === 'ready';
  const slots = isReady ? request.slots : [];
  const isFullyBooked = isReady && slots.every((slot) => !slot.available);

  return (
    <section className="schedule-card time-card" aria-labelledby="time-title">
      <div className="time-card__available">
        <h2 className="time-card__title" id="time-title">Свободное время</h2>
        <time className="time-card__date" dateTime={formatDateAttribute(date)}>{formatVisitDate(date)}</time>
        {request.status === 'loading' && <p className="time-card__message" role="status">Загрузка слотов…</p>}
        {request.status === 'error' && <p className="time-card__message" role="alert">Не удалось загрузить слоты. Выберите другую дату или обновите страницу.</p>}
        <div className="slots" role="group" aria-label="Время визита">
          {isReady && !isFullyBooked && slots.map(({ time, available }) => (
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
