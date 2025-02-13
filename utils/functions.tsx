import { Image } from 'react-native'

import { foreignLanguages } from '@/constants/Types'

// https://flagpedia.net/download/icons
export default function returnFlag(lang: foreignLanguages) {
  switch (lang) {
    case 'en':
      return <Image source={require(`@/assets/flags/en.png`)}></Image>
    case 'pl':
      return <Image source={require(`@/assets/flags/pl.png`)}></Image>
    case 'es':
      return <Image source={require(`@/assets/flags/es.png`)}></Image>
    case 'it':
      return <Image source={require(`@/assets/flags/it.png`)}></Image>
    case 'de':
      return <Image source={require(`@/assets/flags/de.png`)}></Image>
    default:
      return <Image source={require(`@/assets/flags/en.png`)}></Image>
  }
}
