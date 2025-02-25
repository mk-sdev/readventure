import React from 'react'
import { Pressable, View } from 'react-native'

import Text from '@/components/Text'
import { translations } from '@/constants/Translations'
import { homeLanguages } from '@/constants/Types'
import { returnFlag, setButtonBg } from '@/utils/functions'

import { OptionStyles } from './option_styles'

export default function HomeLanguages({
  theme,
  appLang,
  setLocalAppLang,
}: {
  theme: 'light' | 'dark'
  appLang: homeLanguages
  setLocalAppLang: Function
}) {
  return (
    <>
      <Text type="title">{translations[appLang].chooseHomeLanguage}</Text>
      <Text type="small">{translations[appLang].homeLanguageInfo}</Text>
      {(['en', 'pl'] as homeLanguages[]).map(lang => (
        <HomeOption
          key={lang}
          lang={lang}
          onPress={() => setLocalAppLang(lang)}
          isSelected={appLang === lang}
          theme={theme}
        />
      ))}
    </>
  )
}

function HomeOption({
  lang,
  onPress,
  isSelected,
  theme,
}: {
  lang: homeLanguages
  onPress: () => void
  isSelected: boolean
  theme: 'light' | 'dark'
}) {
  const text = lang === 'pl' ? 'Polski' : 'English'
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        OptionStyles.option,
        {
          elevation: isSelected ? 1 : 0,
          backgroundColor: setButtonBg(isSelected, pressed, theme),
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
