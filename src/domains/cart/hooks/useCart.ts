import { useCartStore } from '../store/cart.store'

export function useCart() {
  const { items, addItem, removeItem, updateQuantity, clearCart } = useCartStore()

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  )

  return { items, addItem, removeItem, updateQuantity, clearCart, totalItems, totalPrice }
}
