import React, { forwardRef } from 'react'
import { Pressable, StyleSheet } from 'react-native'

import Text from '@/components/Text'
import Colors from '@/constants/Colors'
import { translations } from '@/constants/Translations'
import { foreignLanguages, languageItem } from '@/constants/Types'
import { returnFlag } from '@/utils/functions'
import useStore from '@/utils/zustand'

type LanguageButtonProps = {
  topLanguage: foreignLanguages | null
  languageItems: languageItem[]
  onPress: () => void
}

const LanguageButton = forwardRef<any, LanguageButtonProps>(
  ({ topLanguage, languageItems, onPress }, ref) => {
    const appLang = useStore(state => state.appLang)
    const theme = useStore(state => state.theme)

    return (
      <>
        <Text type="title">{translations[appLang].languageLabel}</Text>
        <Pressable
          style={[
            styles.languageSelector,
            { backgroundColor: Colors[theme].button },
          ]}
          onPress={onPress}
          ref={ref}
        >
          {topLanguage && returnFlag(topLanguage)}
          <Text
            style={[
              styles.languageText,
              {
                color:
                  theme === 'light'
                    ? Colors[theme].background
                    : Colors[theme].text,
              },
            ]}
          >
            {languageItems.find(item => item.value === topLanguage)?.label ||
              'Select Language'}
          </Text>
        </Pressable>
      </>
    )
  },
)

export default LanguageButton

const styles = StyleSheet.create({
  languageSelector: {
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    elevation: 1,
  },
  languageText: {
    fontSize: 16,
    marginLeft: 10,
    fontWeight: 'bold',
    opacity: 0.95,
  },
})
