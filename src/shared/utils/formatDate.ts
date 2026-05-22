export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('es-CR', { dateStyle: 'medium' }).format(
    typeof date === 'string' ? new Date(date) : date
  )
}
