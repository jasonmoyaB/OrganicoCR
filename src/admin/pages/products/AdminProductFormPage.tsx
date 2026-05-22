import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useProductById } from '@domains/catalog/hooks/useProductById'
import { useCategories } from '@domains/catalog/hooks/useCategories'
import { Spinner } from '@shared/components/Spinner'
import type { Product } from '@domains/catalog/types/product.types'

type FormData = Omit<Product, 'id' | 'slug'>

const emptyForm: FormData = {
  name: '',
  description: '',
  price: 0,
  categoryId: '',
  imageUrl: '',
  stock: 0,
  isOrganic: true,
  isFeatured: false,
  presentation: null,
}

export default function AdminProductFormPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const isEdit = !!id
  const { data: product, isPending, isError } = useProductById(id ?? '')
  const { data: categories } = useCategories()
  const [form, setForm] = useState<FormData>(emptyForm)

  useEffect(() => {
    if (product) {
      const rest = (({ id: _i, slug: _s, ...r }) => r)(product)
      setForm(rest)
    }
  }, [product])

  if (isEdit && isPending) {
    return <div className="flex justify-center py-20"><Spinner /></div>
  }
  if (isEdit && isError) {
    return <p className="p-8 text-red-600">Error al cargar el producto.</p>
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    // TODO(backend): wire up POST /api/products or PUT /api/products/:id
    navigate('/admin/products')
  }

  const inputClass = 'w-full border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500'

  return (
    <div className="p-8 max-w-2xl">
      <h1 className="text-2xl font-bold text-stone-800 mb-8">
        {isEdit ? 'Editar Producto' : 'Nuevo Producto'}
      </h1>
      <form onSubmit={handleSubmit} className="space-y-5 bg-white rounded-xl border border-stone-200 p-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-stone-700 mb-1">Nombre</label>
          <input id="name" required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className={inputClass} />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-stone-700 mb-1">Descripción</label>
          <textarea id="description" required rows={3} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} className={inputClass} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-stone-700 mb-1">Precio (CRC)</label>
            <input id="price" type="number" required min={0} value={form.price} onChange={e => setForm(f => ({ ...f, price: Number(e.target.value) }))} className={inputClass} />
          </div>
          <div>
            <label htmlFor="stock" className="block text-sm font-medium text-stone-700 mb-1">Stock</label>
            <input id="stock" type="number" required min={0} value={form.stock} onChange={e => setForm(f => ({ ...f, stock: Number(e.target.value) }))} className={inputClass} />
          </div>
        </div>
        <div>
          <label htmlFor="categoryId" className="block text-sm font-medium text-stone-700 mb-1">Categoría</label>
          <select id="categoryId" required value={form.categoryId} onChange={e => setForm(f => ({ ...f, categoryId: e.target.value }))} className={inputClass}>
            <option value="">Seleccionar categoría</option>
            {categories?.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="imageUrl" className="block text-sm font-medium text-stone-700 mb-1">URL de Imagen</label>
          <input id="imageUrl" type="url" required value={form.imageUrl} onChange={e => setForm(f => ({ ...f, imageUrl: e.target.value }))} className={inputClass} />
        </div>
        <div className="flex gap-6">
          <label className="flex items-center gap-2 text-sm font-medium text-stone-700 cursor-pointer">
            <input type="checkbox" checked={form.isOrganic} onChange={e => setForm(f => ({ ...f, isOrganic: e.target.checked }))} className="rounded text-green-600" />
            Producto Orgánico
          </label>
          <label className="flex items-center gap-2 text-sm font-medium text-stone-700 cursor-pointer">
            <input type="checkbox" checked={form.isFeatured} onChange={e => setForm(f => ({ ...f, isFeatured: e.target.checked }))} className="rounded text-green-600" />
            Destacado en inicio
          </label>
        </div>
        <div className="flex gap-3 pt-2">
          <button type="submit" className="bg-green-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-green-700 transition-colors">
            {isEdit ? 'Guardar Cambios' : 'Crear Producto'}
          </button>
          <button type="button" onClick={() => navigate('/admin/products')} className="border border-stone-300 text-stone-600 px-6 py-2.5 rounded-lg font-medium hover:bg-stone-50 transition-colors">
            Cancelar
          </button>
        </div>
      </form>
    </div>
  )
}
