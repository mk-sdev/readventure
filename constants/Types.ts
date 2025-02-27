export const homeLanguages = ['en', 'pl'] as const
export type homeLanguage = (typeof homeLanguages)[number]

// when adding a new language, only this place, translations object and api switch must be updated
export const foreignLanguages = ['en', 'pl', 'es', 'it', 'de'] as const
export type foreignLanguage = (typeof foreignLanguages)[number]

export const levels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'] as const
export type level = (typeof levels)[number]

export type request = {
  description: string
  lang: foreignLanguage
  homeLang: homeLanguage
  level: level
}

export type response = {
  text: string
  translation: string
  lang: foreignLanguage
  level: level
}

// a story remembered in the local storage
export type storedText = {
  id: string
  lang: foreignLanguage
  transLang: homeLanguage
  text: string
  translation: string
  level: level
}

// the element inside DropDown list
export type languageItem = {
  label: string // full name of a language - e.g., "Polish"
  value: foreignLanguage // abbreviation of a language - e.g., "pl"
  isFav: boolean
}
