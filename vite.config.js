import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { bookingApi } from './server/server.js';

export default defineConfig({
  base: './',
  plugins: [react(), bookingApi()],
  server: { port: 3000 },
});
