import crypto from 'node:crypto'
import type { Plugin } from 'vite'
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

  return {
    name: 'vite-plugin-service-worker',

    apply: 'build',

    enforce: 'post',

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

      return `export default ${fileId};`
    },

    async generateBundle(_options, bundle) {
      const resourcesUrls = []
      const hash = crypto.createHash('md5')

      for (const [fileName, chunk] of Object.entries(bundle)) {
        if (fileName === outputFile) {
          continue
        }
        resourcesUrls.push(fileName === 'index.html' ? baseUrl : baseUrl + fileName)
        hash.update(chunk.type === 'chunk' ? chunk.code : chunk.source)
      }

      const hashVersion = hash.digest('hex')

      const serviceWorkerChunk = bundle[outputFile]
      if (serviceWorkerChunk.type === 'chunk') {
        serviceWorkerChunk.code = [
          `const __VERSION_HASH__ = ${JSON.stringify(hashVersion)};`,
          `const __RESOURCES__ = ${JSON.stringify(resourcesUrls)};`,
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

    // transformIndexHtml() {
    //   return [
    //     {
    //       tag: 'link',
    //       attrs: {
    //         rel: 'manifest',
    //         href: baseUrl + 'webmanifest.json'
    //       },
    //       injectTo: 'head'
    //     }
    //   ]
    // }
  }
}
