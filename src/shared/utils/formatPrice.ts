export function formatPrice(amount: number, currency = 'CRC'): string {
  return new Intl.NumberFormat('es-CR', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
  }).format(amount)
}
