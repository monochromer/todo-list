import path from 'node:path'
import fs from 'node:fs'
import crypto from 'node:crypto'
import type { Plugin, ResolvedConfig } from 'vite'
import type { WebAppManifest } from 'web-app-manifest';

type ServiceWorkerPluginOptions = {
  importPrefix?: string;
  outputFile?: string;
  baseUrl?: string;
  webAppManifest?: WebAppManifest;
}

export function serviceWorkerPlugin(options?: ServiceWorkerPluginOptions): Plugin {
  const {
    outputFile = 'service-worker.js',
    importPrefix = 'service-worker:',
    baseUrl = '/',
    webAppManifest
  } = options ?? {}

  let config: ResolvedConfig;

  return {
    name: 'vite-plugin-service-worker',

    enforce: 'post',

    configResolved(cfg) {
      config = cfg;
    },

    async resolveId(id, importer) {
      if (!id.startsWith(importPrefix)) return
      const plainId = id.slice(importPrefix.length)
      const result = await this.resolve(plainId, importer)
      if (!result) return
      return importPrefix + result.id
    },

    load(id) {
      if (!id.startsWith(importPrefix)) return
      const fileId = this.emitFile({
        type: 'chunk',
        id: id.slice(importPrefix.length),
        fileName: outputFile,
      });
      // https://github.com/rollup/rollup/issues/4713
      // https://github.com/vitejs/vite/issues/13459
      // return `export default import.meta.ROLLUP_FILE_URL_${fileId};`;
      const fileUrl = `__VITE_ASSET__${fileId}__`;
      return `export default "${fileUrl}"`;
    },

    async generateBundle(_options, bundle) {
      const resourcesUrls = []
      const hash = crypto.createHash('md5')
      for (const [fileName, chunk] of Object.entries(bundle)) {
        // ignore `service-worker.js` file
        if (fileName === outputFile) {
          continue
        }
        resourcesUrls.push(fileName === 'index.html' ? baseUrl : baseUrl + fileName)
        hash.update(chunk.type === 'chunk' ? chunk.code : chunk.source)
      }
      const hashVersion = hash.digest('hex')

      const cacheName = `TodoList.${hashVersion}`;
      const resourcesFile = `${cacheName}.json`

      await fs.promises.writeFile(
        path.join(config.root, config.build.outDir, resourcesFile),
        JSON.stringify(resourcesUrls)
      )

      const serviceWorkerChunk = bundle[outputFile]
      if (serviceWorkerChunk.type === 'chunk') {
        serviceWorkerChunk.code = [
          `const __CACHE_NAME__ = ${JSON.stringify(cacheName)};`,
          serviceWorkerChunk.code
        ].join('')
      }

      this.emitFile({
        type: 'asset',
        name: 'webmanifest.json',
        fileName: 'webmanifest.json',
        source: JSON.stringify(webAppManifest, null, 2),
      })
    },

    transformIndexHtml() {
      return [
        {
          tag: 'link',
          attrs: {
            rel: 'manifest',
            href: baseUrl + 'webmanifest.json'
          },
          injectTo: 'head'
        }
      ]
    }
  }
}
