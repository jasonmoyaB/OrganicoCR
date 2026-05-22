import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { describe, it, expect } from 'vitest'
import { useProducts } from './useProducts'
import { mockProducts } from '../api/products.mock'
import type { ReactNode } from 'react'

function wrapper({ children }: { children: ReactNode }) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>
}

describe('useProducts', () => {
  it('returns all products', async () => {
    const { result } = renderHook(() => useProducts(), { wrapper })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toHaveLength(mockProducts.length)
  })

  it('filters by categoryId', async () => {
    const { result } = renderHook(() => useProducts({ categoryId: 'cat-1' }), { wrapper })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    const expected = mockProducts.filter(p => p.categoryId === 'cat-1')
    expect(result.current.data).toHaveLength(expected.length)
  })

  it('filters by search term', async () => {
    const { result } = renderHook(() => useProducts({ search: 'café' }), { wrapper })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.every(p => p.name.toLowerCase().includes('café'))).toBe(true)
  })
})
