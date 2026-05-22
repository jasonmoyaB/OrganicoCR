import { Link } from 'react-router-dom'
import { useCart } from '@domains/cart/hooks/useCart'

export function CartIcon() {
  const { totalItems } = useCart()
  return (
    <Link
      to="/cart"
      aria-label={`Carrito con ${totalItems} productos`}
      className="relative text-stone-600 hover:text-green-700 transition-colors"
    >
      <span className="text-2xl">🛒</span>
      {totalItems > 0 && (
        <span className="absolute -top-2 -right-2 bg-green-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
          {totalItems > 99 ? '99+' : totalItems}
        </span>
      )}
    </Link>
  )
}
