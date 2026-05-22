import { describe, it, expect } from 'vitest'
import { formatPrice } from './formatPrice'

describe('formatPrice', () => {
  it('includes the numeric value in the output', () => {
    const result = formatPrice(5500)
    expect(result).toMatch(/5[.,\s]?500/)
  })

  it('formats USD when currency is specified', () => {
    const result = formatPrice(15, 'USD')
    expect(result).toMatch(/15/)
    expect(result).toMatch(/USD|\$|US/)
  })

  it('handles zero', () => {
    const result = formatPrice(0)
    expect(result).toMatch(/0/)
  })
})
