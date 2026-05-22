import { useQuery } from '@tanstack/react-query'
import { productsApi } from '../api/products.api'
import type { ProductFilters } from '../types/product.types'

export const useProducts = (filters?: ProductFilters) =>
  useQuery({
    queryKey: ['products', filters],
    queryFn: () => productsApi.getAll(filters),
  })
