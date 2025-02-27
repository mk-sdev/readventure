import { Image, StyleSheet } from 'react-native'

import Colors from '@/constants/Colors'
import { foreignLanguage, homeLanguage } from '@/constants/Types'
import { translations } from '@/constants/Translations'

// https://flagpedia.net/download/icons
export function returnFlag(lang: foreignLanguage) {
  switch (lang) {
    case 'en':
      return (
        <Image
          style={styles.image}
          source={require(`@/assets/flags/en.png`)}
        ></Image>
      )
    case 'pl':
      return (
        <Image
          style={styles.image}
          source={require(`@/assets/flags/pl.png`)}
        ></Image>
      )
    case 'es':
      return (
        <Image
          style={styles.image}
          source={require(`@/assets/flags/es.png`)}
        ></Image>
      )
    case 'it':
      return (
        <Image
          style={styles.image}
          source={require(`@/assets/flags/it.png`)}
        ></Image>
      )
    case 'de':
      return (
        <Image
          style={styles.image}
          source={require(`@/assets/flags/de.png`)}
        ></Image>
      )
    default:
      return (
        <Image
          style={styles.image}
          source={require(`@/assets/flags/en.png`)}
        ></Image>
      )
  }
}

const styles = StyleSheet.create({
  image: {
    borderRadius: 3,
    aspectRatio: 3 / 2,
    borderWidth: 1,
    borderColor: 'rgba(150, 150, 150, .5)',
  },
})

export function setButtonBg(
  isSelected: boolean,
  pressed: boolean,
  theme: 'dark' | 'light',
) {
  if (isSelected && !pressed && theme === 'light') return Colors[theme].button
  if (!isSelected && !pressed && theme === 'light')
    return Colors[theme].buttonSecondary
  if (isSelected && pressed && theme === 'light')
    return Colors[theme].buttonSecondary
  if (!isSelected && pressed && theme === 'light')
    return Colors[theme].buttonSecondary

  if (isSelected && !pressed && theme === 'dark') return Colors[theme].button
  if (!isSelected && !pressed && theme === 'dark')
    return Colors[theme].buttonSecondary
  if (isSelected && pressed && theme === 'dark')
    return Colors[theme].buttonSecondary
  if (!isSelected && pressed && theme === 'dark')
    return Colors[theme].buttonSecondary
}

export function transformGeneratedText(
  generatedText: string,
): [string, string] {
  const [text, translation] = generatedText.split('###')
  const trimmedText = text.trim()
  const trimmedTranslation = translation
    .replace(/^\s*translation:\s*/i, '')
    .trim()

  return [trimmedText, trimmedTranslation]
}

export function returnFullLanguageName(lang: homeLanguage | foreignLanguage) {
  const languageEntry = Object.entries(translations.en.foreignLanguages).find(
    ([key]) => key === lang,
  )
  return languageEntry ? languageEntry[1] : 'English'
}