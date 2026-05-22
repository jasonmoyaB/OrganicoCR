import { Link } from 'react-router-dom'
import { useProducts } from '@domains/catalog/hooks/useProducts'
import { ProductCard } from '@store/components/ProductCard'
import { Spinner } from '@shared/components/Spinner'

export default function HomePage() {
  const { data: products, isPending } = useProducts()
  const featured = products?.filter(p => p.isFeatured) ?? []

  return (
    <div>
      <section className="bg-gradient-to-br from-green-800 to-green-600 text-white py-24">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">Productos Orgánicos de Costa Rica</h1>
          <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
            Del campo a tu mesa. Apoya a productores locales y cuida tu salud con nuestros productos 100% orgánicos.
          </p>
          <Link
            to="/catalog"
            className="bg-white text-green-800 px-8 py-3 rounded-full font-semibold hover:bg-green-50 transition-colors"
          >
            Ver Catálogo
          </Link>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-stone-800 mb-8">Productos Destacados</h2>
        {isPending ? (
          <div className="flex justify-center py-12"><Spinner /></div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {featured.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </section>
    </div>
  )
}
