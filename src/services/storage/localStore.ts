import { createMMKV } from 'react-native-mmkv'
import type { MMKV } from 'react-native-mmkv'
import type { StateStorage } from 'zustand/middleware'

const storage: MMKV = createMMKV()

/**
 * MMKV storage adapter compatible with Zustand's persist middleware.
 * Provides synchronous, high-performance local persistence.
 */
export const mmkvStorage: StateStorage = {
  getItem: (key: string) => {
    const value = storage.getString(key)
    return value ?? null
  },
  setItem: (key: string, value: string) => {
    storage.set(key, value)
  },
  removeItem: (key: string) => {
    storage.remove(key)
  },
}

export { storage as mmkvInstance }
