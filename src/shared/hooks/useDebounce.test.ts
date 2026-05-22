import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, vi, afterEach } from 'vitest'
import { useDebounce } from './useDebounce'

describe('useDebounce', () => {
  afterEach(() => vi.useRealTimers())

  it('returns the initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('hello', 300))
    expect(result.current).toBe('hello')
  })

  it('does not update until the delay has passed', () => {
    vi.useFakeTimers()
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 300),
      { initialProps: { value: 'hello' } }
    )
    rerender({ value: 'world' })
    expect(result.current).toBe('hello')
    act(() => vi.advanceTimersByTime(300))
    expect(result.current).toBe('world')
  })

  it('resets the timer on rapid updates', () => {
    vi.useFakeTimers()
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 300),
      { initialProps: { value: 'a' } }
    )
    rerender({ value: 'ab' })
    act(() => vi.advanceTimersByTime(200))
    rerender({ value: 'abc' })
    act(() => vi.advanceTimersByTime(200))
    expect(result.current).toBe('a')
    act(() => vi.advanceTimersByTime(100))
    expect(result.current).toBe('abc')
  })
})
