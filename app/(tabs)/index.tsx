import { useEffect, useState } from 'react'
import { ScrollView, StyleSheet } from 'react-native'

import StorySetup from '@/components/StorySetup'
import StoryViewer from '@/components/StoryViewer'
import { setStory } from '@/utils/async-storage'
import useStore from '@/utils/zustand'

export default function HomeScreen() {
  const appLang = useStore(state => state.appLang)
  const [showStory, setShowStory] = useState(false)
  const [request, setRequest] = useState('')

  useEffect(() => {
    if (request) setShowStory(true)
  }, [request])

  const theme = useStore(state => state.theme)
  // setStory()
  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        { backgroundColor: theme === 'light' ? 'white' : 'black' },
      ]}
    >
      {showStory ? (
        <StoryViewer
          appLang={appLang}
          setShowStory={setShowStory}
          request={request}
        ></StoryViewer>
      ) : (
        <StorySetup
          theme={theme}
          appLang={appLang}
          setRequest={setRequest}
        ></StorySetup>
      )}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    height: '100%'
  },
})
