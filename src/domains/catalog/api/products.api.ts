import type { Product, Category, ProductFilters } from '../types/product.types'

export const productsApi = {
  async getAll(filters?: ProductFilters): Promise<Product[]> {
    const params = new URLSearchParams()
    if (filters?.categoryId) params.set('categoryId', filters.categoryId)
    if (filters?.search) params.set('search', filters.search)
    if (filters?.onlyOrganic) params.set('onlyOrganic', 'true')
    const res = await fetch(`/api/products?${params}`)
    if (!res.ok) throw new Error('Failed to fetch products')
    return res.json() as Promise<Product[]>
  },

  async getById(id: string): Promise<Product> {
    const res = await fetch(`/api/products/${id}`)
    if (!res.ok) throw new Error(`Product ${id} not found`)
    return res.json() as Promise<Product>
  },
}

export const categoriesApi = {
  async getAll(): Promise<Category[]> {
    const res = await fetch('/api/categories')
    if (!res.ok) throw new Error('Failed to fetch categories')
    return res.json() as Promise<Category[]>
  },
}
