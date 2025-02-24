import React from 'react'
import { Pressable, StyleSheet, View } from 'react-native'

import Text from '@/components/texts'
import { translations } from '@/constants/Translations'
import { levels } from '@/constants/Types'
import { setButtonBg } from '@/utils/functions'
import useStore from '@/utils/zustand'

export default function LevelButtons({
  levels,
  advancementLevel,
  setAdvancementLevel,
}: {
  levels: levels[]
  advancementLevel: levels
  setAdvancementLevel: React.Dispatch<React.SetStateAction<levels>>
}) {
  const appLang = useStore(state => state.appLang)
  const theme = useStore(state => state.theme)
  return (
    <>
      <Text type="title">{translations[appLang].chooseLevel}</Text>
      <View style={styles.levelContainer}>
        {levels.map(level => (
          <Pressable
            key={level}
            onPress={() => setAdvancementLevel(level)}
            style={({ pressed }) => [
              styles.option,
              {
                elevation: level === advancementLevel ? 3 : 1,
                backgroundColor: setButtonBg(
                  level === advancementLevel,
                  pressed,
                  theme,
                ),
              },
            ]}
          >
            <Text style={styles.level}>{level}</Text>
          </Pressable>
        ))}
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  levelContainer: {
    flexDirection: 'row',
    gap: 10,
    width: '90%',
    marginTop: 10,
    justifyContent: 'center',
  },
  option: {
    // padding: 10,
    marginVertical: 5,
    borderRadius: 10,
    // backgroundColor: '#ddd',
    width: 40,
    height: 40,
    alignItems: 'center',
    textAlign: 'center',
    // flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
  },
  level: {
    fontSize: 20,
    fontWeight: 'bold',
    opacity: 0.9,
  },
})
