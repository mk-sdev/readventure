import { Image, StyleSheet } from 'react-native'

import Colors from '@/constants/Colors'
import { foreignLanguages } from '@/constants/Types'

// https://flagpedia.net/download/icons
export function returnFlag(lang: foreignLanguages) {
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
    borderColor: 'rgba(0,0,0,.1)',
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
}
