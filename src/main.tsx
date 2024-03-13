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

if (navigator.serviceWorker) {
  // https://web.dev/articles/service-worker-lifecycle#avoid-url-change
  navigator.serviceWorker.register('./service-worker.js', {
    scope: import.meta.env.BASE_URL ?? '/',
    updateViaCache: 'imports'
  })
    .catch(console.error);
}