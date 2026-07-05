import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    // tests/ needs a live Firestore emulator — run separately via `npm run test:rules`,
    // never as part of the default fast unit-test run.
    exclude: ['**/node_modules/**', '**/dist/**', 'tests/**'],
  },
});
