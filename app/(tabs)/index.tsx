import { useEffect, useState } from 'react'
import { ScrollView, StyleSheet } from 'react-native'

import StorySetup from '@/components/StorySetup/StorySetup'
import StoryViewer from '@/components/StoryViewer/StoryViewer'
import Colors from '@/constants/Colors'
import useStore from '@/utils/zustand'

export default function HomeScreen() {
  const [showStory, setShowStory] = useState(false)
  const [request, setRequest] = useState('')

  useEffect(() => {
    if (request) setShowStory(true)
  }, [request])

  const theme = useStore(state => state.theme)

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        { backgroundColor: Colors[theme].background },
      ]}
    >
      {showStory ? (
        <StoryViewer
          setShowStory={setShowStory}
          request={request}
        ></StoryViewer>
      ) : (
        <StorySetup setRequest={setRequest}></StorySetup>
      )}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    minHeight: '100%',
    paddingBottom: 20,
  },
})
