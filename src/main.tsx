/// <reference types="vite/client" />
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'

const rootElement = document.getElementById('root')

if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  )
}

if (import.meta.env.MODE === 'production') {
  if (navigator.serviceWorker) {
    import('service-worker:./service-worker/service-worker.ts')
      .then(m => m.default)
      .then((serviceWorkerUrl) => {
        // https://web.dev/articles/service-worker-lifecycle#avoid-url-change
        navigator.serviceWorker.register(serviceWorkerUrl, {
          scope: import.meta.env.BASE_URL ?? '/',
          updateViaCache: 'imports'
        })
          .catch(console.error);
      })
  }
}
