import { supabase } from '@/utils/supabase'
import type { Product, Category, ProductFilters } from '../types/product.types'

function mapProduct(row: Record<string, unknown>): Product {
  return {
    id: row.id as string,
    name: row.name as string,
    description: (row.description as string) ?? '',
    price: Number(row.price),
    categoryId: row.category_id as string,
    imageUrl: (row.image_url as string) ?? '',
    stock: row.stock as number,
    isOrganic: row.is_organic as boolean,
    isFeatured: row.is_featured as boolean,
    slug: row.slug as string,
    presentation: (row.presentation as string) ?? null,
  }
}

function mapCategory(row: Record<string, unknown>): Category {
  return {
    id: row.id as string,
    name: row.name as string,
    slug: row.slug as string,
  }
}

export const productsApi = {
  async getAll(filters?: ProductFilters): Promise<Product[]> {
    let query = supabase.from('products').select('*')

    if (filters?.categoryId) {
      query = query.eq('category_id', filters.categoryId)
    }
    if (filters?.search) {
      query = query.ilike('name', `%${filters.search}%`)
    }
    if (filters?.onlyOrganic) {
      query = query.eq('is_organic', true)
    }
    if (filters?.inStock) {
      query = query.gt('stock', 0)
    }
    if (filters?.minPrice !== undefined) {
      query = query.gte('price', filters.minPrice)
    }
    if (filters?.maxPrice !== undefined) {
      query = query.lte('price', filters.maxPrice)
    }

    const { data, error } = await query.order('name')

    if (error) throw error
    return (data ?? []).map(mapProduct)
  },

  async getById(id: string): Promise<Product> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)

    if (error) throw error
    if (!data || data.length === 0) throw new Error(`Product ${id} not found`)
    return mapProduct(data[0])
  },
}

export const categoriesApi = {
  async getAll(): Promise<Category[]> {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name')

    if (error) throw error
    return (data ?? []).map(mapCategory)
  },
}
