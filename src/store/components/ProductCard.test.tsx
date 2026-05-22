import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { act } from '@testing-library/react'
import { ProductCard } from './ProductCard'
import { mockProducts } from '@domains/catalog/api/products.mock'
import { useCartStore } from '@domains/cart/store/cart.store'

const product = mockProducts[0]

beforeEach(() => {
  act(() => useCartStore.setState({ items: [] }))
})

function renderCard(p = product) {
  return render(
    <MemoryRouter>
      <ProductCard product={p} />
    </MemoryRouter>
  )
}

describe('ProductCard', () => {
  it('renders the product name', () => {
    renderCard()
    expect(screen.getByText(product.name)).toBeInTheDocument()
  })

  it('renders an enabled "Agregar" button when in stock', () => {
    renderCard()
    expect(screen.getByRole('button', { name: /agregar/i })).toBeEnabled()
  })

  it('renders a disabled "Agotado" button when out of stock', () => {
    renderCard({ ...product, stock: 0 })
    expect(screen.getByRole('button', { name: /agotado/i })).toBeDisabled()
  })

  it('adds the product to cart when clicking Agregar', async () => {
    renderCard()
    await userEvent.click(screen.getByRole('button', { name: /agregar/i }))
    expect(useCartStore.getState().items).toHaveLength(1)
    expect(useCartStore.getState().items[0].product.id).toBe(product.id)
  })
})
