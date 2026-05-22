import { http, HttpResponse } from 'msw'
import { mockProducts, mockCategories } from '@domains/catalog/api/products.mock'

export const handlers = [
  http.get('/api/products', ({ request }) => {
    const url = new URL(request.url)
    const categoryId = url.searchParams.get('categoryId')
    const search = url.searchParams.get('search')
    const onlyOrganic = url.searchParams.get('onlyOrganic') === 'true'

    let results = mockProducts
    if (categoryId) results = results.filter(p => p.categoryId === categoryId)
    if (search) results = results.filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
    if (onlyOrganic) results = results.filter(p => p.isOrganic)

    return HttpResponse.json(results)
  }),

  http.get('/api/products/:id', ({ params }) => {
    const product = mockProducts.find(p => p.id === params.id)
    if (!product) return new HttpResponse(null, { status: 404 })
    return HttpResponse.json(product)
  }),

  http.get('/api/categories', () => HttpResponse.json(mockCategories)),
]
