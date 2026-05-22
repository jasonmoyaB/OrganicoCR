import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import { useCart } from '@domains/cart/hooks/useCart'
import { formatPrice } from '@shared/utils/formatPrice'
import type { Product } from '@domains/catalog/types/product.types'

interface Props {
  product: Product
}

export function ProductCard({ product }: Props) {
  const { addItem } = useCart()

  return (
    <div className="bg-white rounded-xl border border-stone-200 overflow-hidden hover:shadow-md transition-shadow">
      <Link to={`/catalog/${product.id}`} className="block w-full h-48 bg-stone-100">
        {product.imageUrl ? (
          <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
        ) : (
          <div className="flex items-center justify-center h-full text-stone-400 text-sm font-medium">
            {product.name}
          </div>
        )}
      </Link>
      <div className="p-4">
        <div className="h-6 flex items-center mb-0">
          {product.isOrganic && (
            <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
              🌿 Orgánico
            </span>
          )}
        </div>
        <Link to={`/catalog/${product.id}`}>
          <h3 className="font-semibold text-stone-800 hover:text-green-700 transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>
        <p className="text-stone-500 text-sm mt-1 line-clamp-2">{product.description}</p>
        <div className="mt-3 flex items-center justify-between">
          <span className="font-bold text-green-700 text-lg">{formatPrice(product.price)}</span>
          <button
            onClick={() => { addItem(product); toast.success('Producto agregado correctamente') }}
            disabled={product.stock === 0}
            className="bg-green-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {product.stock === 0 ? 'Agotado' : 'Agregar'}
          </button>
        </div>
      </div>
    </div>
  )
}
