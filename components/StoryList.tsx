import { LinearGradient } from 'expo-linear-gradient'
import { useFocusEffect } from 'expo-router'
import React, { useCallback, useState } from 'react'
import { FlatList, Image, Pressable, StyleSheet, View } from 'react-native'

import Text from '@/components/Text'
import Colors from '@/constants/Colors'
import { STORED_TEXTS_STORAGE_KEY } from '@/constants/StorageKeys'
import { translations } from '@/constants/Translations'
import { storedText } from '@/constants/Types'
import { getValue } from '@/utils/async-storage'
import { returnFlag } from '@/utils/functions'
import useStore from '@/utils/zustand'

export default function StoryList({
  setIndex,
  setShowStory,
}: {
  setIndex: React.Dispatch<React.SetStateAction<number>>
  setShowStory: React.Dispatch<React.SetStateAction<boolean>>
}) {
  const [lastTexts, setLastTexts] = useState<storedText[]>([])
  const appLang = useStore(state => state.appLang)
  const theme = useStore(state => state.theme)
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
              <Text
                type="title"
                style={{ alignSelf: 'center', marginBottom: 40 }}
              >
                {`${translations[appLang].lastStoriesLabel}:`}
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
        <View
          style={{
            width: '100%',
            height: '100%',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Image
            style={{
              width: '50%',
              // resizeMode: 'cover',
              // backgroundColor: 'red',
              height: 'auto',
              aspectRatio: 1,
              opacity: theme === 'light' ? 1 : 0.5,
            }}
            source={require('@/assets/images/empty.png')}
          ></Image>
          <Text type="title">{translations[appLang].noStoriesTitle}</Text>
          <Text type="small">{translations[appLang].noStoriesCTA}</Text>
        </View>
      )}
    </React.Fragment>
  )
}

const styles = StyleSheet.create({
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
        backgroundColor: Colors[theme].tileBg,
        borderRadius: 10,
        borderWidth: 3,
        borderColor: Colors[theme].tileBorder,
        padding: 20,
        paddingBottom: 0,
        gap: 15,
        elevation: theme === 'light' ? 1 : 4,
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
        colors={[Colors[theme].tileGradient, 'transparent']}
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
