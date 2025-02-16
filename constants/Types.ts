export type homeLanguages = 'en' | 'pl'
export type foreignLanguages = 'en' | 'pl' | 'es' | 'it' | 'de'

export type levels = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2'
export type request = {
  description: string
  lang: foreignLanguages
  homeLang: homeLanguages
  level: levels
}
export type response = { text: string; translation: string }
