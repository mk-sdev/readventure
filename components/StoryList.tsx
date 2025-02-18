import { LinearGradient } from 'expo-linear-gradient'
import { useFocusEffect } from 'expo-router'
import React, { useCallback, useState } from 'react'
import { FlatList, Pressable, StyleSheet, View } from 'react-native'

import { Text } from '@/components/Themed'
import Colors from '@/constants/Colors'
import { STORED_TEXTS_STORAGE_KEY } from '@/constants/StorageKeys'
import { translations } from '@/constants/Translations'
import { homeLanguages, storedText } from '@/constants/Types'
import { clearAsyncStorage, getValue } from '@/utils/async-storage'
import returnFlag from '@/utils/functions'

export default function StoryList({
  setIndex,
  setShowStory,
  theme,
  appLang,
}: {
  setIndex: React.Dispatch<React.SetStateAction<number>>
  setShowStory: React.Dispatch<React.SetStateAction<boolean>>
  theme: 'light' | 'dark'
  appLang: homeLanguages
}) {
  const [lastTexts, setLastTexts] = useState<storedText[]>([])

  useFocusEffect(
    useCallback(() => {
      ;(async () => {
        const storedTexts: Array<storedText> = await getValue(
          STORED_TEXTS_STORAGE_KEY,
        )
        setLastTexts(storedTexts ? storedTexts : [])
      })()
    }, []),
  )
  //setStory()
  return (
    <React.Fragment>
      {lastTexts.length > 0 ? (
        <React.Fragment>
          <FlatList
            ListHeaderComponent={
              <Text style={styles.title}>
                {translations[appLang].lastStoriesLabel}
              </Text>
            }
            data={lastTexts}
            style={{ width: '100%' }}
            contentContainerStyle={{
              width: '100%',
              // backgroundColor: 'red',
            }}
            renderItem={({
              item,
              index,
            }: {
              item: storedText
              index: number
            }) => (
              <RenderItem
                story={item}
                index={index}
                setIndex={setIndex}
                setShowStory={setShowStory}
                Colors={Colors}
                theme={theme}
              ></RenderItem>
            )}
          />
        </React.Fragment>
      ) : (
        <Text
          style={{
            fontSize: 20,
            // flex: 1,
            // justifyContent: 'center',
            // alignItems: 'center',
            // textAlign: 'center',
          }}
        >
          No texts generated yet.
        </Text>
      )}
    </React.Fragment>
  )
}

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    width: '90%',
    maxWidth: 300,
    textAlign: 'center',
    alignSelf: 'center',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
})

const RenderItem = ({
  story,
  index,
  setIndex,
  setShowStory,
  Colors,
  theme,
}: {
  story: storedText
  index: number
  setIndex: Function
  setShowStory: Function
  Colors: any
  theme: 'light' | 'dark'
}) => {
  return (
    <Pressable
      style={{
        width: '90%',
        maxWidth: 500,
        height: 120,
        backgroundColor: Colors[theme].inputBg,
        borderRadius: 10,
        padding: 20,
        paddingBottom: 0,
        gap: 15,
        elevation: 1,
        marginBottom: 20,
        overflow: 'hidden',
        flexDirection: 'row',
        alignSelf: 'center',
      }}
      onPress={() => {
        setShowStory(true)
        setIndex(index)
      }}
    >
      <View style={{ paddingTop: '2%', gap: 10 }}>
        {returnFlag(story?.lang)}
        <Text
          style={{
            backgroundColor: 'transparent',
            fontSize: 16,
            textAlign: 'center',
            fontWeight: 'bold',
          }}
        >
          {story?.level}
        </Text>
      </View>
      <Text style={{ fontSize: 16, flex: 1 }} key={index}>
        {story?.text}
      </Text>
      <LinearGradient
        colors={[Colors[theme].inputBg, 'transparent']}
        start={{ x: 1, y: 1 }}
        end={{ x: 1, y: 0 }}
        style={{
          width: '120%',
          height: '50%',
          position: 'absolute',
          bottom: 0,
          left: 0,
        }}
      />
    </Pressable>
  )
}
