import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  plugins: [react()],
  base: '/calculate_mst/',  // The base path for your GitHub Pages deployment
});
