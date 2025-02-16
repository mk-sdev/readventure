import { useEffect, useState } from 'react'
import { ScrollView, StyleSheet } from 'react-native'

import StorySetup from '@/components/StorySetup'
import StoryViewer from '@/components/StoryViewer'
import useStore from '@/utils/zustand'

export default function HomeScreen() {
  const appLang = useStore(state => state.appLang)
  const [showStory, setShowStory] = useState(false)
  const [request, setRequest] = useState('')

  useEffect(() => {
    if (request) setShowStory(true)
  }, [request])

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {showStory ? (
        <StoryViewer
          appLang={appLang}
          setShowStory={setShowStory}
          request={request}
        ></StoryViewer>
      ) : (
        <StorySetup appLang={appLang} setRequest={setRequest}></StorySetup>
      )}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
})
