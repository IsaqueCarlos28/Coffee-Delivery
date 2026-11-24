import { renderHook, act } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useLocalStorage } from '../hooks/useLocalStorage'

describe('useLocalStorage (RF-06, RNF-04)', () => {
  beforeEach(() => {
    window.localStorage.clear()
    vi.restoreAllMocks()
  })

  it('reads a stored value from localStorage', () => {
    window.localStorage.setItem('test-key', JSON.stringify({ value: 42 }))

    const { result } = renderHook(() => useLocalStorage('test-key', { value: 0 }))

    expect(result.current[0]).toEqual({ value: 42 })
  })

  it('falls back to initial value when JSON is invalid', () => {
    window.localStorage.setItem('test-key', '{invalid-json')

    const { result } = renderHook(() => useLocalStorage('test-key', ['fallback']))

    expect(result.current[0]).toEqual(['fallback'])
  })

  it('does not break when storage is unavailable', () => {
    const getItemSpy = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('storage unavailable')
    })
    const setItemSpy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('storage unavailable')
    })

    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'))

    expect(result.current[0]).toBe('initial')

    act(() => {
      result.current[1]('next')
    })

    expect(result.current[0]).toBe('next')
    expect(getItemSpy).toHaveBeenCalled()
    expect(setItemSpy).toHaveBeenCalled()
  })
})
