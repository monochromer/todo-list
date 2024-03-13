export async function addResourcesToCache(cacheName: string, resources: string[]) {
  const cache = await caches.open(cacheName)
  await cache.addAll(resources)
}

export async function fromCache(cacheName: string, request: RequestInfo | URL) {
  const cache = await caches.open(cacheName)
  const response = await cache.match(request)
  return response
}

export async function fromNetwork(request: RequestInfo | URL) {
  return fetch(request)
}