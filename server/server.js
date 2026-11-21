import { setTimeout as delay } from 'node:timers/promises';
import { getSlots, today } from './database.js';

const DELAY_MS = 550;

function sendJson(response, status, body) {
  response.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
  });
  response.end(JSON.stringify(body));
}

function readDate(params) {
  const fields = ['day', 'month', 'year'];
  if (!fields.every((field) => /^\d+$/.test(params.get(field) ?? ''))) return null;

  const [day, month, year] = fields.map((field) => Number(params.get(field)));
  const value = new Date(year, month, day);
  if (value.getFullYear() !== year || value.getMonth() !== month || value.getDate() !== day) {
    return null;
  }
  return { day, month, year };
}

export function bookingApi() {
  function install(server) {
    server.middlewares.use(async (request, response, next) => {
      const url = new URL(request.url, 'http://localhost');
      if (!url.pathname.startsWith('/api/')) return next();

      const endpoints = {
        '/api/booking/today': 'today',
        '/api/slots': 'slots',
      };
      const endpoint = endpoints[url.pathname];
      if (!endpoint) return sendJson(response, 404, { error: 'Адрес API не найден.' });
      if (request.method !== 'GET') {
        response.setHeader('Allow', 'GET');
        return sendJson(response, 405, { error: 'Используйте метод GET.' });
      }

      await delay(DELAY_MS);
      if (response.destroyed) return;
      if (process.env.MOCK_API_ERROR === endpoint) {
        return sendJson(response, 500, { error: 'Имитация ошибки сервера.' });
      }

      if (endpoint === 'today') return sendJson(response, 200, today);

      const date = readDate(url.searchParams);
      if (!date) return sendJson(response, 400, { error: 'Укажите корректные day, month и year.' });

      return sendJson(response, 200, { date, slots: getSlots(date.day) });
    });
  }

  return { name: 'booking-mock-api', configureServer: install, configurePreviewServer: install };
}
