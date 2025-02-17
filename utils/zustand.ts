import { create } from 'zustand'

import { homeLanguages } from '@/constants/Types'

interface StoreState {
  appLang: homeLanguages
  theme: 'dark' | 'light'
  setAppLang: (newLang: homeLanguages) => void
  setTheme: (newTheme: 'dark' | 'light') => void
}

const useStore = create<StoreState>(set => ({
  appLang: 'en',
  theme: 'light',
  setAppLang: newLang => set({ appLang: newLang }),
  setTheme: newTheme => set({ theme: newTheme }),
}))

export default useStore
