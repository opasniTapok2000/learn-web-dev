'use strict';

const weekHeaders = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
const visitTimes = ['10:00', '11:30', '14:30', '16:00', '18:00', '19:00'];
const monthFormat = new Intl.DateTimeFormat('ru-RU', { month: 'long' });
const dateFormat = new Intl.DateTimeFormat('ru-RU', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});
const weekdayFormat = new Intl.DateTimeFormat('ru-RU', { weekday: 'long' });

function capitalize(text) {
  return text[0].toUpperCase() + text.slice(1);
}

function buildCalendarGrid(year, month) {
  const firstDay = new Date(year, month, 1);
  const emptyBefore = (firstDay.getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cellCount = Math.ceil((emptyBefore + daysInMonth) / 7) * 7;

  return Array.from({ length: cellCount }, (_, index) => {
    const day = index - emptyBefore + 1;
    return day > 0 && day <= daysInMonth ? day : null;
  });
}

function getLocalDay(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function sameDay(first, second) {
  return getLocalDay(first).getTime() === getLocalDay(second).getTime();
}

function isDateSelectable(date, today) {
  return getLocalDay(date) >= today;
}

function getSlots(date) {
  const day = date.getDate();
  return visitTimes.map((time, index) => ({
    time,
    available: day !== 25 && (day + index) % 3 !== 1,
  }));
}

function formatVisitDate(date) {
  const weekday = capitalize(weekdayFormat.format(date));
  return weekday + ', ' + dateFormat.format(date);
}

function formatDateAttribute(date) {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return date.getFullYear() + '-' + month + '-' + day;
}

function init() {
  const today = getLocalDay(new Date());
  const defaultDay = new Date(today);
  if (getSlots(defaultDay).every((slot) => !slot.available)) {
    defaultDay.setDate(defaultDay.getDate() + 1);
  }

  const state = {
    currentMonth: defaultDay.getMonth(),
    currentYear: defaultDay.getFullYear(),
    selectedDay: defaultDay,
    selectedTime: null,
    slots: getSlots(defaultDay),
  };

  const heading = document.querySelector('#month');
  const grid = document.querySelector('#calendar-grid');
  const slotDate = document.querySelector('#slot-date');
  const timeSlots = document.querySelector('#time-slots');
  const noSlots = document.querySelector('#no-slots');
  const summary = document.querySelector('#booking-selection');

  function renderCalendar() {
    const { currentYear, currentMonth, selectedDay } = state;
    heading.textContent = capitalize(monthFormat.format(new Date(currentYear, currentMonth, 1))) + ' ' + currentYear;
    const weekdays = weekHeaders.map((day) => (
      '<span class="day day--weekday" aria-hidden="true">' + day + '</span>'
    ));
    const days = buildCalendarGrid(currentYear, currentMonth).map((day) => {
      if (day === null) return '<span class="day day--blank" aria-hidden="true"></span>';

      const date = new Date(currentYear, currentMonth, day);
      const disabled = isDateSelectable(date, today) ? '' : ' disabled';
      return '<button class="day day--choice" type="button" data-day="' + day
        + '" aria-label="' + formatVisitDate(date) + '" aria-pressed="' + sameDay(date, selectedDay)
        + '"' + disabled + '>' + day + '</button>';
    });

    grid.innerHTML = [...weekdays, ...days].join('');
    grid.querySelectorAll('[data-day]:not(:disabled)').forEach((button) => {
      button.addEventListener('click', onDayClick);
    });
  }

  function renderTimeSlots() {
    const { selectedDay, selectedTime, slots } = state;
    slotDate.dateTime = formatDateAttribute(selectedDay);
    slotDate.textContent = formatVisitDate(selectedDay);
    const isFullyBooked = slots.every((slot) => !slot.available);
    noSlots.hidden = !isFullyBooked;
    timeSlots.innerHTML = isFullyBooked ? '' : slots.map(({ time, available }) => {
      const status = available ? '' : ' disabled aria-label="' + time + ', занято"';
      return '<button class="action slot" type="button" data-time="' + time
        + '" aria-pressed="' + (time === selectedTime) + '"' + status + '>' + time + '</button>';
    }).join('');

    timeSlots.querySelectorAll('[data-time]:not(:disabled)').forEach((button) => {
      button.addEventListener('click', onTimeSlotClick);
    });
  }

  function updateBottomBar() {
    summary.textContent = formatVisitDate(state.selectedDay) + ' • ' + (state.selectedTime ?? 'Время не выбрано');
  }

  function onDayClick(event) {
    const button = event.currentTarget;
    const day = Number(button.dataset.day);
    const date = new Date(state.currentYear, state.currentMonth, day);
    if (!isDateSelectable(date, today) || sameDay(date, state.selectedDay)) return;

    state.selectedDay = date;
    state.selectedTime = null;
    state.slots = getSlots(date);
    renderCalendar();
    renderTimeSlots();
    updateBottomBar();
    grid.querySelector('[data-day="' + day + '"]').focus();
  }

  function onTimeSlotClick(event) {
    const time = event.currentTarget.dataset.time;
    if (!state.slots.some((slot) => slot.available && slot.time === time)) return;

    state.selectedTime = time;
    renderTimeSlots();
    updateBottomBar();
    timeSlots.querySelector('[data-time="' + time + '"]').focus();
  }

  function changeMonth(offset) {
    const next = new Date(state.currentYear, state.currentMonth + offset, 1);
    state.currentYear = next.getFullYear();
    state.currentMonth = next.getMonth();
    renderCalendar();
  }

  document.querySelector('#previous-month').addEventListener('click', () => changeMonth(-1));
  document.querySelector('#next-month').addEventListener('click', () => changeMonth(1));
  renderCalendar();
  renderTimeSlots();
  updateBottomBar();
}

document.addEventListener('DOMContentLoaded', init);
