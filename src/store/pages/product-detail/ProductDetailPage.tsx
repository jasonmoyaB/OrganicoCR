import { useParams, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useProductById } from '@domains/catalog/hooks/useProductById'
import { useCart } from '@domains/cart/hooks/useCart'
import { formatPrice } from '@shared/utils/formatPrice'
import { Spinner } from '@shared/components/Spinner'

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: product, isPending, isError } = useProductById(id!)
  const { addItem } = useCart()
  const [qty, setQty] = useState(1)

  if (isPending) {
    return <div className="flex justify-center py-20"><Spinner size="lg" /></div>
  }
  if (isError || !product) {
    return <div className="text-center py-20 text-stone-500">Producto no encontrado.</div>
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <button onClick={() => navigate(-1)} className="text-stone-500 hover:text-stone-700 mb-6 text-sm">
        ← Volver
      </button>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <img src={product.imageUrl} alt={product.name} className="rounded-xl w-full object-cover aspect-square" />
        <div>
          {product.isOrganic && (
            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
              🌿 Orgánico
            </span>
          )}
          <h1 className="text-3xl font-bold text-stone-800 mt-3">{product.name}</h1>
          <p className="text-2xl font-bold text-green-700 mt-2">{formatPrice(product.price)}</p>
          <p className="text-stone-600 mt-4 leading-relaxed">{product.description}</p>
          <div className="mt-6 flex items-center gap-4">
            <div className="flex items-center border border-stone-300 rounded-lg">
              <button
                onClick={() => setQty(q => Math.max(1, q - 1))}
                className="px-3 py-2 text-stone-500 hover:text-stone-800"
                aria-label="Disminuir cantidad"
              >
                −
              </button>
              <span className="px-4 py-2 font-medium">{qty}</span>
              <button
                onClick={() => setQty(q => Math.min(product.stock, q + 1))}
                className="px-3 py-2 text-stone-500 hover:text-stone-800"
                aria-label="Aumentar cantidad"
              >
                +
              </button>
            </div>
            <button
              onClick={() => addItem(product, qty)}
              disabled={product.stock === 0}
              className="flex-1 bg-green-600 text-white py-2.5 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 transition-colors"
            >
              {product.stock === 0 ? 'Agotado' : 'Agregar al carrito'}
            </button>
          </div>
          <p className="text-sm text-stone-400 mt-2">{product.stock} unidades disponibles</p>
        </div>
      </div>
    </div>
  )
}
