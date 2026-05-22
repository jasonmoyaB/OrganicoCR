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
    <div className="min-h-[calc(100dvh-12rem)] max-w-5xl mx-auto px-4 flex flex-col justify-center py-10">
      <button
        onClick={() => navigate(-1)}
        className="text-stone-400 hover:text-stone-600 mb-10 text-sm transition-colors self-start"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="inline-block mr-1.5 -mt-0.5">
          <path d="M19 12H5"/>
          <path d="m12 19-7-7 7-7"/>
        </svg>
        Volver
      </button>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14 items-center">
        <div className="overflow-hidden rounded-2xl bg-stone-100">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full aspect-square object-cover hover:scale-105 transition-transform duration-700 ease-out"
          />
        </div>
        <div>
          {product.isOrganic && (
            <span className="text-[0.7rem] font-semibold text-brand-lime tracking-widest uppercase">
              Organico
            </span>
          )}
          <h1 className="text-3xl md:text-4xl font-bold text-brand-dark mt-2 leading-tight">
            {product.name}
          </h1>
          <p className="text-2xl font-semibold text-brand-dark mt-3">
            {formatPrice(product.price)}
          </p>
          <p className="text-stone-500 mt-5 leading-relaxed">
            {product.description}
          </p>
          <div className="mt-8 flex items-center gap-4">
            <div className="flex items-center border border-stone-200 rounded-xl overflow-hidden">
              <button
                onClick={() => setQty(q => Math.max(1, q - 1))}
                className="px-3 py-2.5 text-stone-400 hover:text-brand-dark hover:bg-stone-50 transition-colors"
                aria-label="Disminuir cantidad"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14"/>
                </svg>
              </button>
              <span className="px-4 py-2.5 font-medium text-brand-dark text-sm min-w-[2.5rem] text-center border-x border-stone-200">
                {qty}
              </span>
              <button
                onClick={() => setQty(q => Math.min(product.stock, q + 1))}
                className="px-3 py-2.5 text-stone-400 hover:text-brand-dark hover:bg-stone-50 transition-colors"
                aria-label="Aumentar cantidad"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 5v14"/>
                  <path d="M5 12h14"/>
                </svg>
              </button>
            </div>
            <button
              onClick={() => addItem(product, qty)}
              disabled={product.stock === 0}
              className="flex-1 bg-brand-green text-white py-3 rounded-xl font-semibold hover:bg-brand-dark disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              {product.stock === 0 ? 'Agotado' : 'Agregar al carrito'}
            </button>
          </div>
          {product.stock > 0 && (
            <p className="text-sm text-stone-400 mt-3">
              {product.stock} {product.stock === 1 ? 'unidad disponible' : 'unidades disponibles'}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
