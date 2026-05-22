import { useQuery } from '@tanstack/react-query'
import { productsApi } from '../api/products.api'

export const useProductById = (id: string) =>
  useQuery({
    queryKey: ['products', id],
    queryFn: () => productsApi.getById(id),
    enabled: !!id,
  })
