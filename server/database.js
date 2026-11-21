export const today = { day: 17, month: 9, year: 2026 };

const morningSlots = [
  { time: '10:00', available: true },
  { time: '11:30', available: false },
  { time: '14:30', available: true },
  { time: '16:00', available: false },
  { time: '18:00', available: false },
  { time: '19:00', available: false },
];

const eveningSlots = [
  { time: '10:00', available: false },
  { time: '11:30', available: true },
  { time: '14:30', available: false },
  { time: '16:00', available: true },
  { time: '18:00', available: true },
  { time: '19:00', available: false },
];

export function getSlots(day) {
  if (day === 25) return [];
  return day % 2 === 0 ? eveningSlots : morningSlots;
}
