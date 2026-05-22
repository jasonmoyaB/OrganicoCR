import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './app/styles/globals.css'
import { AppProviders } from './app/providers/AppProviders'
import { AppRouter } from './app/router'

async function enableMocking() {
  if (import.meta.env.DEV) {
    const { worker } = await import('./shared/lib/msw/browser')
    return worker.start({ onUnhandledRequest: 'bypass' })
  }
}

enableMocking().then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <AppProviders>
        <AppRouter />
      </AppProviders>
    </StrictMode>
  )
})
