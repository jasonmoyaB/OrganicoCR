import { useState, useMemo } from 'react'
import { useProducts } from '@domains/catalog/hooks/useProducts'
import { useCategories } from '@domains/catalog/hooks/useCategories'
import { ProductCard } from '@store/components/ProductCard'
import { Spinner } from '@shared/components/Spinner'
import { useDebounce } from '@shared/hooks/useDebounce'
import type { ProductFilters } from '@domains/catalog/types/product.types'

const PER_PAGE = 40

export default function CatalogPage() {
  const [search, setSearch] = useState('')
  const [categoryId, setCategoryId] = useState<string | undefined>()
  const [inStock, setInStock] = useState(false)
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [sort, setSort] = useState('name-asc')
  const [page, setPage] = useState(1)
  const debouncedSearch = useDebounce(search, 300)

  const filters: ProductFilters = {
    ...(debouncedSearch && { search: debouncedSearch }),
    ...(categoryId && { categoryId }),
    ...(inStock && { inStock: true }),
    ...(minPrice && { minPrice: Number(minPrice) }),
    ...(maxPrice && { maxPrice: Number(maxPrice) }),
  }

  const { data: products, isPending, isError } = useProducts(filters)
  const { data: categories } = useCategories()

  const sorted = useMemo(() => {
    if (!products) return []
    const list = [...products]
    if (sort === 'price-asc') list.sort((a, b) => a.price - b.price)
    else if (sort === 'price-desc') list.sort((a, b) => b.price - a.price)
    else list.sort((a, b) => a.name.localeCompare(b.name))
    return list
  }, [products, sort])

  const totalPages = Math.max(1, Math.ceil(sorted.length / PER_PAGE))
  const safePage = Math.min(page, totalPages)
  const pageProducts = sorted.slice((safePage - 1) * PER_PAGE, safePage * PER_PAGE)

  function goTo(p: number) {
    setPage(Math.max(1, Math.min(p, totalPages)))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function resetPage() { setPage(1) }

  const activeCount = [categoryId, inStock && 'stock', minPrice, maxPrice].filter(Boolean).length

  function clearFilters() {
    setCategoryId(undefined)
    setInStock(false)
    setMinPrice('')
    setMaxPrice('')
    setSearch('')
    setSort('name-asc')
    setPage(1)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 lg:py-10">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl lg:text-3xl font-bold text-stone-800">Catálogo</h1>
        {products && (
          <span className="text-sm text-stone-400">{sorted.length} producto{sorted.length !== 1 ? 's' : ''}</span>
        )}
      </div>

      <div className="lg:flex lg:gap-8">
        <aside className="lg:w-64 lg:flex-shrink-0 mb-6 lg:mb-0">
          <div className="lg:sticky lg:top-24 space-y-5">
            <div className="flex items-center justify-between lg:hidden">
              <span className="text-sm font-medium text-stone-600">Filtros</span>
              {activeCount > 0 && (
                <button onClick={clearFilters} className="text-xs text-red-500 hover:text-red-600 transition-colors">
                  Limpiar todo
                </button>
              )}
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-stone-400 font-semibold mb-1.5">Buscar</label>
              <input
                type="text"
                placeholder="Producto..."
                value={search}
                onChange={e => { setSearch(e.target.value); resetPage() }}
                className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-shadow"
              />
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-stone-400 font-semibold mb-1.5">Categoría</label>
              <select
                value={categoryId ?? ''}
                onChange={e => { setCategoryId(e.target.value || undefined); resetPage() }}
                className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-shadow"
              >
                <option value="">Todas</option>
                {categories?.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-stone-400 font-semibold mb-1.5">Precio</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="₡0"
                  value={minPrice}
                  onChange={e => { setMinPrice(e.target.value); resetPage() }}
                  className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-shadow"
                />
                <span className="text-stone-300 text-sm">—</span>
                <input
                  type="number"
                  placeholder="₡99999"
                  value={maxPrice}
                  onChange={e => { setMaxPrice(e.target.value); resetPage() }}
                  className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-shadow"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-stone-400 font-semibold mb-1.5">Ordenar</label>
              <select
                value={sort}
                onChange={e => setSort(e.target.value)}
                className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-shadow"
              >
                <option value="name-asc">Nombre A-Z</option>
                <option value="price-asc">Menor precio</option>
                <option value="price-desc">Mayor precio</option>
              </select>
            </div>

            <button
              onClick={() => { setInStock(!inStock); resetPage() }}
              className={`flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm font-medium border transition-colors ${
                inStock
                  ? 'bg-green-600 border-green-600 text-white'
                  : 'bg-white border-stone-300 text-stone-600 hover:border-green-400'
              }`}
            >
              <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              Solo con stock
            </button>

            {activeCount > 0 && (
              <button
                onClick={clearFilters}
                className="hidden lg:flex items-center gap-1.5 w-full px-3 py-2 text-sm text-stone-500 hover:text-red-600 transition-colors rounded-lg hover:bg-stone-50"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
                Limpiar filtros
              </button>
            )}
          </div>
        </aside>

        <main className="flex-1 min-w-0">
          {isPending ? (
            <div className="flex justify-center py-20"><Spinner /></div>
          ) : isError ? (
            <p className="text-center text-stone-500 py-20">Error al cargar productos. Intenta de nuevo más tarde.</p>
          ) : !sorted.length ? (
            <p className="text-center text-stone-500 py-20">No se encontraron productos.</p>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-5">
                {pageProducts.map((p, i) => (
                  <div key={p.id} style={{ animationDelay: `${(i % 8) * 50}ms` }} className="animate-[fadeIn_0.3s_ease-out_both]">
                    <ProductCard product={p} />
                  </div>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-10">
                  <button
                    onClick={() => goTo(safePage - 1)}
                    disabled={safePage <= 1}
                    className="px-3 py-1.5 text-sm rounded-lg border border-stone-200 text-stone-600 hover:border-green-300 hover:text-green-700 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                  >
                    ← Anterior
                  </button>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                      .filter(p => {
                        if (totalPages <= 7) return true
                        if (p === 1 || p === totalPages) return true
                        if (Math.abs(p - safePage) <= 1) return true
                        return false
                      })
                      .map((p, i, arr) => (
                        <span key={p} className="flex items-center">
                          {i > 0 && arr[i - 1] !== p - 1 && (
                            <span className="px-1 text-stone-300">...</span>
                          )}
                          <button
                            onClick={() => goTo(p)}
                            className={`min-w-[2rem] h-8 text-sm rounded-lg font-medium transition-colors ${
                              p === safePage
                                ? 'bg-green-600 text-white'
                                : 'text-stone-600 hover:bg-stone-100'
                            }`}
                          >
                            {p}
                          </button>
                        </span>
                      ))}
                  </div>

                  <button
                    onClick={() => goTo(safePage + 1)}
                    disabled={safePage >= totalPages}
                    className="px-3 py-1.5 text-sm rounded-lg border border-stone-200 text-stone-600 hover:border-green-300 hover:text-green-700 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                  >
                    Siguiente →
                  </button>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  )
}
