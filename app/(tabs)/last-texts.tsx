import React, { useState } from 'react'
import { ScrollView, StyleSheet } from 'react-native'

import StoryList from '@/components/StoryList'
import StoryViewer from '@/components/StoryViewer'

export default function LastTextsScreen() {
  const [showStory, setShowStory] = useState(false)
  const [index, setIndex] = useState(0)

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {!showStory ? (
        <StoryList setIndex={setIndex} setShowStory={setShowStory}></StoryList>
      ) : (
        <StoryViewer setShowStory={setShowStory} index={index}></StoryViewer>
      )}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
})
