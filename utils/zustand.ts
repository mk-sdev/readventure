import { create } from 'zustand'

import { homeLanguages } from '@/constants/Types'

interface StoreState {
  appLang: homeLanguages
  setAppLang: (newLang: homeLanguages) => void
}

const useStore = create<StoreState>(set => ({
  appLang: 'en',
  setAppLang: newLang => set({ appLang: newLang }),
}))

export default useStore
