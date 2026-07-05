import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    build: {
      // Target modern browsers (Vercel/Netlify support)
      target: 'es2020',
      // Chunk splitting for better caching
      rollupOptions: {
        output: {
          manualChunks: {
            'supabase': ['@supabase/supabase-js'],
            'react-vendor': ['react', 'react-dom'],
          },
        },
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
