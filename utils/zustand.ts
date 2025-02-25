import { create } from 'zustand'

import { homeLanguages } from '@/constants/Types'

interface StoreState {
  appLang: homeLanguages
  theme: 'dark' | 'light'
  fontSize: number
  setAppLang: (newLang: homeLanguages) => void
  setTheme: (newTheme: 'dark' | 'light') => void
  setFontSize: (newSize: number) => void
}

const useStore = create<StoreState>(set => ({
  appLang: 'en',
  theme: 'light',
  fontSize: 22,
  setAppLang: newLang => set({ appLang: newLang }),
  setTheme: newTheme => set({ theme: newTheme }),
  setFontSize: newFontSize => set({ fontSize: newFontSize }),
}))

export default useStore
