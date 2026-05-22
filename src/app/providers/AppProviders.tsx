import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '@shared/lib/queryClient'
import { ErrorBoundary } from '@shared/components/ErrorBoundary'
import type { ReactNode } from 'react'

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </ErrorBoundary>
  )
}
