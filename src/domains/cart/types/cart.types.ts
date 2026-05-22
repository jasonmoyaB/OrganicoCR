import type { Product } from '@domains/catalog/types/product.types'

export interface CartItem {
  product: Product
  quantity: number
}
