import { describe, it, expect, beforeEach } from 'vitest'
import { act } from '@testing-library/react'
import { useCartStore } from './cart.store'
import { mockProducts } from '@domains/catalog/api/products.mock'

const [p1, p2] = mockProducts

beforeEach(() => {
  act(() => useCartStore.setState({ items: [] }))
})

describe('cart store', () => {
  it('adds a new item with quantity 1', () => {
    act(() => useCartStore.getState().addItem(p1))
    expect(useCartStore.getState().items).toHaveLength(1)
    expect(useCartStore.getState().items[0].quantity).toBe(1)
  })

  it('increments quantity when adding an existing item', () => {
    act(() => {
      useCartStore.getState().addItem(p1)
      useCartStore.getState().addItem(p1)
    })
    expect(useCartStore.getState().items).toHaveLength(1)
    expect(useCartStore.getState().items[0].quantity).toBe(2)
  })

  it('adds a custom quantity', () => {
    act(() => useCartStore.getState().addItem(p1, 3))
    expect(useCartStore.getState().items[0].quantity).toBe(3)
  })

  it('removes an item', () => {
    act(() => {
      useCartStore.getState().addItem(p1)
      useCartStore.getState().removeItem(p1.id)
    })
    expect(useCartStore.getState().items).toHaveLength(0)
  })

  it('updates quantity', () => {
    act(() => {
      useCartStore.getState().addItem(p1)
      useCartStore.getState().updateQuantity(p1.id, 5)
    })
    expect(useCartStore.getState().items[0].quantity).toBe(5)
  })

  it('removes item when quantity is set to 0', () => {
    act(() => {
      useCartStore.getState().addItem(p1)
      useCartStore.getState().updateQuantity(p1.id, 0)
    })
    expect(useCartStore.getState().items).toHaveLength(0)
  })

  it('clears all items', () => {
    act(() => {
      useCartStore.getState().addItem(p1)
      useCartStore.getState().addItem(p2)
      useCartStore.getState().clearCart()
    })
    expect(useCartStore.getState().items).toHaveLength(0)
  })
})
