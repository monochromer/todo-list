import { fileURLToPath, URL } from 'node:url'
import path from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { serviceWorkerPlugin } from './src/vite-plugins/vite-plugin-service-worker/vite-plugin-service-worker.ts';

// https://vitejs.dev/config/
export default defineConfig(() => {
  const baseUrl = process.env.BASE_URL ?? '/'

  return {
    root: 'src',
    publicDir: path.join(process.cwd(), 'src', 'public'),
    base: baseUrl,
    build: {
      outDir: '../dist',
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              return 'vendor';
            }
            return null;
          }
        }
      }
    },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    plugins: [
      react(),
      serviceWorkerPlugin({
        baseUrl,
        webAppManifest: {
          name: "Todo List",
          description: "Simple todo list app",
          start_url: baseUrl,
          display: "standalone",
          theme_color: "#1cb9ff",
          background_color: "#ffffff",
          icons: [
            { "src": `${baseUrl}icon-192.png`, "type": "image/png", "sizes": "192x192" },
            { "src": `${baseUrl}icon-512.png`, "type": "image/png", "sizes": "512x512" },
            { "src": `${baseUrl}icon.svg`, "type": "image/svg+xml", "sizes": "any" }
          ]
        }
      })
    ],
  }
})
