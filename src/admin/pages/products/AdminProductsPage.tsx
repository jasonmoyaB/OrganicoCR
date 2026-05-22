import { Link } from 'react-router-dom'
import { useProducts } from '@domains/catalog/hooks/useProducts'
import { formatPrice } from '@shared/utils/formatPrice'
import { Spinner } from '@shared/components/Spinner'

export default function AdminProductsPage() {
  const { data: products, isPending, isError } = useProducts()

  if (isError) return <p className="p-8 text-red-600">Error al cargar los productos.</p>

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-stone-800">Productos</h1>
        <Link
          to="/admin/products/new"
          className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
        >
          + Nuevo Producto
        </Link>
      </div>

      {isPending ? (
        <div className="flex justify-center py-20"><Spinner /></div>
      ) : (
        <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-stone-50 border-b border-stone-200">
              <tr>
                <th className="text-left px-6 py-3 font-medium text-stone-600">Producto</th>
                <th className="text-left px-6 py-3 font-medium text-stone-600">Precio</th>
                <th className="text-left px-6 py-3 font-medium text-stone-600">Stock</th>
                <th className="text-left px-6 py-3 font-medium text-stone-600">Orgánico</th>
                <th className="px-6 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {!products?.length ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-stone-400">
                    No hay productos aún.{' '}
                    <Link to="/admin/products/new" className="text-green-600 hover:underline">
                      Crear el primero
                    </Link>
                  </td>
                </tr>
              ) : (
                products.map(product => (
                  <tr key={product.id} className="hover:bg-stone-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img src={product.imageUrl} alt={product.name} className="w-10 h-10 rounded-lg object-cover" />
                        <span className="font-medium text-stone-800">{product.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-green-700 font-medium">{formatPrice(product.price)}</td>
                    <td className="px-6 py-4">
                      <span className={product.stock > 0 ? 'text-green-600' : 'text-red-500 font-medium'}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="px-6 py-4">{product.isOrganic ? '✅' : '—'}</td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        to={`/admin/products/${product.id}`}
                        className="text-green-600 hover:text-green-800 font-medium"
                      >
                        Editar
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
