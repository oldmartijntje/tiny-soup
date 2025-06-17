// vite.config.js
import { defineConfig } from 'vite'
// https://vitejs.dev/config/
export default defineConfig({
    plugins: [],
    base: '/tiny-soup/',
    build: {
        outDir: 'dist',
        emptyOutDir: true
    },
})