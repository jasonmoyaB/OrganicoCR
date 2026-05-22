export interface Product {
  id: string
  name: string
  description: string
  price: number
  categoryId: string
  imageUrl: string
  stock: number
  isOrganic: boolean
  isFeatured: boolean
  slug: string
}

export interface Category {
  id: string
  name: string
  slug: string
}

export interface ProductFilters {
  categoryId?: string
  search?: string
  onlyOrganic?: boolean
}
