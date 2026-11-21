export const weekHeaders = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
const monthFormat = new Intl.DateTimeFormat('ru-RU', { month: 'long' });
const dateFormat = new Intl.DateTimeFormat('ru-RU', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});
const weekdayFormat = new Intl.DateTimeFormat('ru-RU', { weekday: 'long' });

export function capitalize(text) {
  return text[0].toUpperCase() + text.slice(1);
}

export function buildCalendarGrid(year, month) {
  const firstDay = new Date(year, month, 1);
  const emptyBefore = (firstDay.getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cellCount = Math.ceil((emptyBefore + daysInMonth) / 7) * 7;

  return Array.from({ length: cellCount }, (_, index) => {
    const day = index - emptyBefore + 1;
    return day > 0 && day <= daysInMonth ? day : null;
  });
}

export function getLocalDay(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function sameDay(first, second) {
  return getLocalDay(first).getTime() === getLocalDay(second).getTime();
}

export function isDateSelectable(date, today) {
  return getLocalDay(date) >= today;
}

export function formatVisitDate(date) {
  const weekday = capitalize(weekdayFormat.format(date));
  return weekday + ', ' + dateFormat.format(date);
}

export function formatDateAttribute(date) {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return date.getFullYear() + '-' + month + '-' + day;
}

export function formatCalendarMonth(year, month) {
  return capitalize(monthFormat.format(new Date(year, month, 1))) + ' ' + year;
}
