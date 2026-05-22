import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { describe, it, expect } from 'vitest'
import { useProductById } from './useProductById'
import { mockProducts } from '../api/products.mock'
import type { ReactNode } from 'react'

function wrapper({ children }: { children: ReactNode }) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>
}

describe('useProductById', () => {
  it('fetches a single product by id', async () => {
    const { result } = renderHook(() => useProductById('prod-1'), { wrapper })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toEqual(mockProducts[0])
  })

  it('does not fetch when id is empty', () => {
    const { result } = renderHook(() => useProductById(''), { wrapper })
    expect(result.current.fetchStatus).toBe('idle')
    expect(result.current.data).toBeUndefined()
  })
})
