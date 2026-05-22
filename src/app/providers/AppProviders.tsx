import { QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'sonner'
import { queryClient } from '@shared/lib/queryClient'
import { ErrorBoundary } from '@shared/components/ErrorBoundary'
import type { ReactNode } from 'react'

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: '#003023',
              color: '#F6FEF9',
              border: '1px solid #83C441',
              fontFamily: 'Outfit, sans-serif',
            },
          }}
        />
      </QueryClientProvider>
    </ErrorBoundary>
  )
}
