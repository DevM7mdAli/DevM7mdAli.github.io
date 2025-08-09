import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // User/Org GitHub Pages is served at root, so base can remain '/'
  base: '/',
});
