import { cn } from '../utils/cn'
import type { ReactNode } from 'react'

type Color = 'green' | 'stone' | 'red' | 'yellow'

interface Props {
  children: ReactNode
  color?: Color
  className?: string
}

const colors: Record<Color, string> = {
  green: 'bg-green-100 text-green-700',
  stone: 'bg-stone-100 text-stone-600',
  red: 'bg-red-100 text-red-600',
  yellow: 'bg-yellow-100 text-yellow-700',
}

export function Badge({ children, color = 'stone', className }: Props) {
  return (
    <span className={cn('inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium', colors[color], className)}>
      {children}
    </span>
  )
}
