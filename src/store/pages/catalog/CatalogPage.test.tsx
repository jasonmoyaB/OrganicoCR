import { describe, it, expect } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router-dom'
import CatalogPage from './CatalogPage'
import { mockProducts } from '@domains/catalog/api/products.mock'

function renderPage() {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(
    <QueryClientProvider client={client}>
      <MemoryRouter>
        <CatalogPage />
      </MemoryRouter>
    </QueryClientProvider>
  )
}

describe('CatalogPage', () => {
  it('shows a search input', () => {
    renderPage()
    expect(screen.getByPlaceholderText(/producto/i)).toBeInTheDocument()
  })

  it('renders product cards after loading', async () => {
    renderPage()
    await waitFor(() => {
      expect(screen.getByText(mockProducts[0].name)).toBeInTheDocument()
    })
  })

  it('shows a spinner while loading', () => {
    renderPage()
    expect(screen.getByRole('status')).toBeInTheDocument()
  })
})
