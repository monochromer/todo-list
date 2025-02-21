declare let self: ServiceWorkerGlobalScope
// injected by bundler
declare const __CACHE_NAME__: string

import { addResourcesToCache, fromCache, fromNetwork } from './utils'

// for early detect changes
const CACHE_NAME = __CACHE_NAME__;
const RESOURCES_FILE = `${CACHE_NAME}.json`;

self.addEventListener('install', (event) => {
  self.skipWaiting()
  event.waitUntil((async () => {
    const response = await fetch(RESOURCES_FILE, {
      cache: 'no-store'
    });
    const resourses = await response.json();
    await addResourcesToCache(CACHE_NAME, resourses);
  })())
})

self.addEventListener('activate', (event) => {
  self.clients.claim()
  event.waitUntil((async () => {
    const cacheNames = await caches.keys();
    await Promise.all(cacheNames.map((cacheName) => {
      return cacheName !== CACHE_NAME ? caches.delete(cacheName) : Promise.resolve()
    }))
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
    return response ?? fromNetwork(event.request)
  })())
})