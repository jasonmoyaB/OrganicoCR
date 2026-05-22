import { useQuery } from '@tanstack/react-query'
import { categoriesApi } from '../api/products.api'

export const useCategories = () =>
  useQuery({
    queryKey: ['categories'],
    queryFn: categoriesApi.getAll,
  })
