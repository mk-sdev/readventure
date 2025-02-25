import React from 'react'
import { Pressable, View } from 'react-native'

import Text from '@/components/Text'
import { FAV_LANGUAGES_STORAGE_KEY } from '@/constants/StorageKeys'
import { translations } from '@/constants/Translations'
import { foreignLanguages } from '@/constants/Types'
import { getValue, setValue } from '@/utils/async-storage'
import { returnFlag, setButtonBg } from '@/utils/functions'
import useStore from '@/utils/zustand'

import { OptionStyles } from './option_styles'

export default function ForeignLanguages({
  favLangs,
  setFavLangs,
}: {
  favLangs: foreignLanguages[]
  setFavLangs: Function
}) {
  const appLang = useStore(state => state.appLang)
  const theme = useStore(state => state.theme)

  async function handleSelectForeignLanguages(lang: foreignLanguages) {
    let interestLanguages = await getValue(FAV_LANGUAGES_STORAGE_KEY)
    interestLanguages ||= []
    if (interestLanguages.includes(lang)) {
      interestLanguages = interestLanguages.filter(
        (item: foreignLanguages) => item !== lang,
      )
    } else {
      interestLanguages.push(lang)
    }
    setFavLangs(interestLanguages)
    setValue(FAV_LANGUAGES_STORAGE_KEY, interestLanguages)
  }
  return (
    <>
      <Text type="title">{translations[appLang].chooseForeignLanguage}</Text>

      {Object.keys(translations[appLang].foreignLanguages).map(key => {
        const langCode = key as foreignLanguages
        let langText: string =
          // @ts-ignore
          translations[appLang].foreignLanguages[langCode]
        return (
          <ForeignOption
            key={langCode}
            selectedForeignLanguages={favLangs}
            lang={langCode}
            text={langText}
            onPress={() => handleSelectForeignLanguages(langCode)}
            theme={theme}
          />
        )
      })}
    </>
  )
}

function ForeignOption({
  lang,
  onPress,
  selectedForeignLanguages,
  text,
  theme,
}: {
  lang: foreignLanguages
  onPress: () => void
  selectedForeignLanguages: foreignLanguages[]
  text: string
  theme: 'light' | 'dark'
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        OptionStyles.option,
        {
          elevation: selectedForeignLanguages.includes(lang) ? 1 : 0,
          backgroundColor: setButtonBg(
            selectedForeignLanguages.includes(lang),
            pressed,
            theme,
          ),
        },
      ]}
    >
      <View style={OptionStyles.optionView}>
        {returnFlag(lang)}
        <Text style={{ fontWeight: 'bold' }}>{text}</Text>
      </View>
    </Pressable>
  )
}
