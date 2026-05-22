import { http, HttpResponse } from 'msw'
import { mockProducts, mockCategories } from '@domains/catalog/api/products.mock'

function mapToSupabaseRow(product: typeof mockProducts[number]) {
  return {
    id: product.id,
    name: product.name,
    description: product.description,
    price: product.price,
    category_id: product.categoryId,
    image_url: product.imageUrl,
    stock: product.stock,
    presentation: product.presentation ?? null,
    is_organic: product.isOrganic,
    is_featured: product.isFeatured,
    slug: product.slug,
  }
}

export const handlers = [
  http.get(/\/rest\/v1\/products/, ({ request }) => {
    const url = new URL(request.url)

    if (url.searchParams.get('id')) {
      const id = url.searchParams.get('id')!.replace('eq.', '')
      const product = mockProducts.find(p => p.id === id)
      if (!product) return new HttpResponse(null, { status: 404 })
      return HttpResponse.json([mapToSupabaseRow(product)])
    }

    const categoryId = url.searchParams.get('category_id')?.replace('eq.', '')
    const search = url.searchParams.get('name')?.replace('ilike.', '').replace(/%/g, '')
    const onlyOrganic = url.searchParams.get('is_organic') === 'eq.true'
    const inStock = url.searchParams.get('stock')?.startsWith('gt.')

    let results = mockProducts
    if (categoryId) results = results.filter(p => p.categoryId === categoryId)
    if (search) results = results.filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
    if (onlyOrganic) results = results.filter(p => p.isOrganic)
    if (inStock) results = results.filter(p => p.stock > 0)

    return HttpResponse.json(results.map(mapToSupabaseRow))
  }),

  http.get(/\/rest\/v1\/categories/, () =>
    HttpResponse.json(mockCategories.map(c => ({ id: c.id, name: c.name, slug: c.slug }))),
  ),
]
