import React, { useEffect, useState } from 'react'
import { ScrollView, StyleSheet } from 'react-native'

import StorySetup from '@/components/StorySetup/StorySetup'
import StoryViewer from '@/components/StoryViewer/StoryViewer'
import Colors from '@/constants/Colors'
import useStore from '@/utils/zustand'
import { PortalHost } from '@gorhom/portal'

export default function HomeScreen() {
  const [showStory, setShowStory] = useState(false)
  const [request, setRequest] = useState('')

  // useEffect(() => {
  //   if (request) setShowStory(true)
  // }, [request])

  const theme = useStore(state => state.theme)

  return (
    <React.Fragment>
      <PortalHost name="NetInfoHost" />
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
          <StorySetup setRequest={setRequest} setShowStory={setShowStory}></StorySetup>
        )}
      </ScrollView>
    </React.Fragment>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    minHeight: '100%',
    paddingBottom: 20,
  },
})
