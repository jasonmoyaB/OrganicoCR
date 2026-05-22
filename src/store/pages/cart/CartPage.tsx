import { Link } from 'react-router-dom'
import { useCart } from '@domains/cart/hooks/useCart'
import { formatPrice } from '@shared/utils/formatPrice'

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart, totalItems, totalPrice } = useCart()

  return (
    <div className="max-w-4xl mx-auto px-4 py-16 md:py-24">
      {items.length === 0 ? (
        <div className="text-center flex flex-col items-center justify-center min-h-[70dvh]">
          <div className="w-20 h-20 mx-auto mb-8 rounded-full bg-brand-lime/10 flex items-center justify-center">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#83C441" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="9" cy="21" r="1"/>
              <circle cx="20" cy="21" r="1"/>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
            </svg>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-brand-dark mb-4">
            Tu carrito esta vacio
          </h1>
          <p className="text-stone-500 leading-relaxed mb-10 max-w-md mx-auto">
            Parece que aun no has agregado nada. Explora nuestro catalogo y descubre productos organicos frescos directamente de productores locales.
          </p>
          <Link
            to="/catalog"
            className="inline-flex items-center gap-2 bg-brand-green text-white px-8 py-3.5 rounded-xl font-semibold hover:bg-brand-dark transition-colors"
          >
            Explorar catalogo
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M5 12h14"/>
              <path d="m12 5 7 7-7 7"/>
            </svg>
          </Link>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between mb-12">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-brand-dark">
                Carrito
              </h1>
              <p className="text-stone-500 mt-1">
                {totalItems} {totalItems === 1 ? 'producto' : 'productos'}
              </p>
            </div>
            <button
              onClick={clearCart}
              className="text-sm text-stone-400 hover:text-red-500 transition-colors"
            >
              Vaciar carrito
            </button>
          </div>

          <div className="space-y-3">
            {items.map(({ product, quantity }) => (
              <div
                key={product.id}
                className="group bg-white rounded-xl border border-stone-200 p-4 flex items-center gap-4 hover:border-stone-300 transition-colors"
              >
                <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-stone-100">
                  {product.imageUrl ? (
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-stone-400 text-xs text-center px-1">
                      {product.name}
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-stone-800 truncate">{product.name}</h3>
                  <p className="text-brand-lime font-bold mt-0.5">{formatPrice(product.price)}</p>
                </div>
                <div className="flex items-center border border-stone-200 rounded-lg overflow-hidden">
                  <button
                    onClick={() => updateQuantity(product.id, quantity - 1)}
                    className="px-3 py-1.5 text-stone-400 hover:text-stone-800 hover:bg-stone-50 transition-colors"
                    aria-label="Disminuir cantidad"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14"/>
                    </svg>
                  </button>
                  <span className="px-3 py-1.5 font-medium text-sm text-stone-700 min-w-[2.5rem] text-center border-x border-stone-200">
                    {quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(product.id, quantity + 1)}
                    className="px-3 py-1.5 text-stone-400 hover:text-stone-800 hover:bg-stone-50 transition-colors"
                    aria-label="Aumentar cantidad"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 5v14"/>
                      <path d="M5 12h14"/>
                    </svg>
                  </button>
                </div>
                <button
                  onClick={() => removeItem(product.id)}
                  className="text-stone-300 hover:text-red-500 transition-colors p-1"
                  aria-label="Eliminar producto"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 6h18"/>
                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                    <line x1="10" y1="11" x2="10" y2="17"/>
                    <line x1="14" y1="11" x2="14" y2="17"/>
                  </svg>
                </button>
              </div>
            ))}
          </div>

          <div className="mt-10 bg-white rounded-xl border border-stone-200 p-6 md:p-8">
            <div className="flex items-center justify-between pb-6 border-b border-stone-100">
              <span className="text-stone-500">Total</span>
              <span className="text-2xl font-bold text-brand-dark">{formatPrice(totalPrice)}</span>
            </div>
            <button className="w-full mt-6 bg-brand-green text-white py-3.5 rounded-xl font-semibold hover:bg-brand-dark transition-colors">
              Proceder al pago
            </button>
            <Link
              to="/catalog"
              className="block text-center mt-4 text-sm text-stone-400 hover:text-stone-600 transition-colors"
            >
              Seguir comprando
            </Link>
          </div>
        </>
      )}
    </div>
  )
}
