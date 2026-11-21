import { formatVisitDate } from '../calendar.js';

export default function BookingBottomBar({ date, time }) {
  return (
    <div className="booking-summary">
      <a className="action action--back" href="https://www.figma.com/proto/oosrQEJ6Nu3GuOsR931yX5?node-id=1-175">← К услугам</a>
      <p className="booking-summary__selection" aria-live="polite">
        {formatVisitDate(date)} • {time ?? 'Время не выбрано'}
      </p>
    </div>
  );
}
