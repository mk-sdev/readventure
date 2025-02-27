import { create } from 'zustand'

import { homeLanguage } from '@/constants/Types'

interface StoreState {
  appLang: homeLanguage
  theme: 'dark' | 'light'
  fontSize: number
  setAppLang: (newLang: homeLanguage) => void
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
