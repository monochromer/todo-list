import { fileURLToPath, URL } from 'node:url'
import path from 'node:path'
import crypto from 'node:crypto'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import esbuild from 'esbuild'

// https://vitejs.dev/config/
export default defineConfig((context) => {
  return {
    root: 'src',
    publicDir: path.join(process.cwd(), 'src', 'public'),
    base: process.env.BASE_URL ?? '/',
    build: {
      outDir: '../dist'
    },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    plugins: [
      react(),
      {
        name: 'vite-plugin-service-worker',
        apply: 'build',
        enforce: 'post',
        async writeBundle(_, bundle) {
          const bundleFiles = Object.entries(bundle)
            .map(([, entry]) => entry.fileName)

          const versionHash = (() => {
            const md5Hash = crypto.createHash('md5')
            for (const fileName of bundleFiles) {
              md5Hash.update(fileName)
            }
            return md5Hash.digest('hex')
          })()

          await esbuild.build({
            format: 'iife',
            minify: context.mode === 'production',
            bundle: true,
            entryPoints: [path.join(process.cwd(), 'src', 'service-worker', 'service-worker.js')],
            outfile: path.join(process.cwd(), 'dist', 'service-worker.js'),
            define: {
              '__RESOURCES__': JSON.stringify(bundleFiles),
              '__VERSION_HASH__': JSON.stringify(versionHash),
            }
          })
        }
      }
    ],
  }
})
