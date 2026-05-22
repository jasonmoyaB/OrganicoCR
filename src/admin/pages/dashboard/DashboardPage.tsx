import { useProducts } from '@domains/catalog/hooks/useProducts'
import { useCart } from '@domains/cart/hooks/useCart'
import { formatPrice } from '@shared/utils/formatPrice'
import { Spinner } from '@shared/components/Spinner'

export default function DashboardPage() {
  const { data: products = [], isPending } = useProducts()
  const { totalItems, totalPrice } = useCart()

  if (isPending) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>

  const stats = [
    { label: 'Total Productos', value: products.length, icon: '🌿' },
    { label: 'Con Stock', value: products.filter(p => p.stock > 0).length, icon: '✅' },
    { label: 'Items en Carrito', value: totalItems, icon: '🛒' },
    { label: 'Valor Carrito', value: formatPrice(totalPrice), icon: '💰' },
  ]

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-stone-800 mb-8">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map(({ label, value, icon }) => (
          <div key={label} className="bg-white rounded-xl border border-stone-200 p-6">
            <div className="text-3xl mb-3">{icon}</div>
            <div className="text-2xl font-bold text-stone-800">{value}</div>
            <div className="text-sm text-stone-500 mt-1">{label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
