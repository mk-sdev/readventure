import React, { useState } from 'react'
import { StyleSheet, View } from 'react-native'

import StoryList from '@/components/StoryList'
import StoryViewer from '@/components/StoryViewer/StoryViewer'
import Colors from '@/constants/Colors'
import useStore from '@/utils/zustand'

export default function LastTextsScreen() {
  const [showStory, setShowStory] = useState(false)
  const [index, setIndex] = useState(0)
  const appLang = useStore(state => state.appLang)
  const theme = useStore(state => state.theme)
  return (
    <View
      style={[styles.container, { backgroundColor: Colors[theme].background }]}
    >
      {!showStory ? (
        <StoryList
          setIndex={setIndex}
          setShowStory={setShowStory}
        ></StoryList>
      ) : (
        <StoryViewer
          setShowStory={setShowStory}
          index={index}
        ></StoryViewer>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    //height: '100%',
    // justifyContent: 'center',
  },
})
