async function fetchJson(path, signal) {
  const response = await fetch(path, { signal });
  if (!response.ok) {
    throw new Error('Ошибка API: ' + response.status);
  }
  return response.json();
}

export async function fetchToday(signal) {
  const { day, month, year } = await fetchJson('/api/booking/today', signal);
  return new Date(year, month, day);
}

export async function fetchSlots(date, signal) {
  const params = new URLSearchParams({
    day: date.getDate(),
    month: date.getMonth(),
    year: date.getFullYear(),
  });
  return fetchJson('/api/slots?' + params, signal);
}
