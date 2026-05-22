import { Link } from 'react-router-dom'
import { useCart } from '@domains/cart/hooks/useCart'
import { formatPrice } from '@shared/utils/formatPrice'

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart, totalItems, totalPrice } = useCart()

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <p className="text-6xl mb-4">🛒</p>
        <h2 className="text-2xl font-bold text-stone-700 mb-2">Tu carrito está vacío</h2>
        <Link to="/catalog" className="text-green-600 hover:underline">
          Explorar el catálogo →
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-stone-800">
          Carrito ({totalItems} {totalItems === 1 ? 'producto' : 'productos'})
        </h1>
        <button onClick={clearCart} className="text-sm text-red-500 hover:text-red-700">
          Vaciar carrito
        </button>
      </div>

      <div className="space-y-4">
        {items.map(({ product, quantity }) => (
          <div key={product.id} className="bg-white rounded-xl border border-stone-200 p-4 flex items-center gap-4">
            <img src={product.imageUrl} alt={product.name} className="w-20 h-20 object-cover rounded-lg flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-stone-800 truncate">{product.name}</h3>
              <p className="text-green-700 font-bold">{formatPrice(product.price)}</p>
            </div>
            <div className="flex items-center border border-stone-300 rounded-lg">
              <button
                onClick={() => updateQuantity(product.id, quantity - 1)}
                className="px-3 py-1.5 text-stone-500 hover:text-stone-800"
                aria-label="Disminuir"
              >−</button>
              <span className="px-3 font-medium">{quantity}</span>
              <button
                onClick={() => updateQuantity(product.id, quantity + 1)}
                className="px-3 py-1.5 text-stone-500 hover:text-stone-800"
                aria-label="Aumentar"
              >+</button>
            </div>
            <button
              onClick={() => removeItem(product.id)}
              className="text-stone-400 hover:text-red-500 transition-colors"
              aria-label="Eliminar"
            >✕</button>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-white rounded-xl border border-stone-200 p-6">
        <div className="flex justify-between text-lg font-bold text-stone-800 mb-4">
          <span>Total</span>
          <span className="text-green-700">{formatPrice(totalPrice)}</span>
        </div>
        <button className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors">
          Proceder al pago
        </button>
        <Link to="/catalog" className="block text-center mt-3 text-sm text-stone-500 hover:text-stone-700">
          Seguir comprando
        </Link>
      </div>
    </div>
  )
}
