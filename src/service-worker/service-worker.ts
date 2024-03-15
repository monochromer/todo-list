declare let self: ServiceWorkerGlobalScope
// injected by bundler
declare const __RESOURCES__: string[]
declare const __VERSION_HASH__: string

import { addResourcesToCache, fromCache, fromNetwork } from './utils'

const NAMESPACE = 'TodoList'
const CACHE_NAME = `${NAMESPACE}.cache.v${__VERSION_HASH__}`
const resourses = __RESOURCES__

self.addEventListener('install', (event) => {
  self.skipWaiting()
  event.waitUntil((async () => {
    await addResourcesToCache(CACHE_NAME, resourses)
    // self.skipWaiting()
  })())
})

self.addEventListener('activate', (event) => {
  self.clients.claim()
  event.waitUntil((async () => {
    const cacheNames = await caches.keys();
    await Promise.all(cacheNames.map(async (cacheName) => {
      return cacheName !== CACHE_NAME ? await caches.delete(cacheName) : Promise.resolve()
    }))
    // self.clients.claim()
  })())
})

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  if (url.origin !== location.origin) {
    return
  }
  if (event.request.method !== 'GET') {
    return
  }
  event.respondWith((async () => {
    const response = await fromCache(CACHE_NAME, event.request)
    if (response) {
      return response
    }
    return await fromNetwork(event.request)
  })())
})