export type homeLanguages = 'en' | 'pl'
export type foreignLanguages = 'en' | 'pl' | 'es' | 'it' | 'de'

export type levels = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2'
export type request = {
  description: string
  lang: foreignLanguages
  homeLang: homeLanguages
  level: levels
}
export type response = {
  text: string
  translation: string
  lang: foreignLanguages
  level: levels
}

// a story remembered in the local storage
export type storedText = {
  id: string
  lang: foreignLanguages
  transLang: homeLanguages
  text: string
  translation: string
  level: levels
}

// the element inside DropDown list
export type languageItem = {
  label: string // full name of a language - e.g., "Polish"
  value: foreignLanguages // abbreviation of a language - e.g., "pl"
  isFav: boolean
}
