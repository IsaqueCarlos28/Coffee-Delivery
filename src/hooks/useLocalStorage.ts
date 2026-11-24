import { useEffect, useState, type Dispatch, type SetStateAction } from 'react'

type InitialValue<T> = T | (() => T)

function resolveInitialValue<T>(initialValue: InitialValue<T>): T {
  return initialValue instanceof Function ? initialValue() : initialValue
}

export function useLocalStorage<T>(
  key: string,
  initialValue: InitialValue<T>,
): [T, Dispatch<SetStateAction<T>>] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') return resolveInitialValue(initialValue)

    try {
      const item = window.localStorage.getItem(key)
      if (item === null) return resolveInitialValue(initialValue)
      return JSON.parse(item) as T
    } catch {
      return resolveInitialValue(initialValue)
    }
  })

  useEffect(() => {
    if (typeof window === 'undefined') return

    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue))
    } catch {
      // Storage indisponível ou quota excedida: mantém estado em memória.
    }
  }, [key, storedValue])

  return [storedValue, setStoredValue]
}
