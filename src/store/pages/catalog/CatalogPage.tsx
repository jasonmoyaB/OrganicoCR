import { useState } from 'react'
import { useProducts } from '@domains/catalog/hooks/useProducts'
import { useCategories } from '@domains/catalog/hooks/useCategories'
import { ProductCard } from '@store/components/ProductCard'
import { Spinner } from '@shared/components/Spinner'
import { useDebounce } from '@shared/hooks/useDebounce'
import type { ProductFilters } from '@domains/catalog/types/product.types'

export default function CatalogPage() {
  const [search, setSearch] = useState('')
  const [categoryId, setCategoryId] = useState<string | undefined>()
  const debouncedSearch = useDebounce(search, 300)

  const filters: ProductFilters = {
    ...(debouncedSearch && { search: debouncedSearch }),
    ...(categoryId && { categoryId }),
  }

  const { data: products, isPending } = useProducts(filters)
  const { data: categories } = useCategories()

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-stone-800 mb-8">Catálogo</h1>

      <div className="flex flex-wrap gap-4 mb-8">
        <input
          type="text"
          placeholder="Buscar productos..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="border border-stone-300 rounded-lg px-4 py-2 text-sm flex-1 min-w-48 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <select
          value={categoryId ?? ''}
          onChange={e => setCategoryId(e.target.value || undefined)}
          className="border border-stone-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <option value="">Todas las categorías</option>
          {categories?.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      {isPending ? (
        <div className="flex justify-center py-20"><Spinner /></div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products?.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  )
}
