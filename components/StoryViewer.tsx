import React from 'react'
import {
    Button,
    StyleSheet
} from 'react-native'

import { homeLanguages } from '@/constants/Types'

export default function StoryViewer({
  appLang,
  setShowStory,
}: {
  appLang: homeLanguages
  setShowStory: Function
}) {

  return (
    <React.Fragment>
        <Button onPress={()=>setShowStory(false)} title="go back"></Button>
    </React.Fragment>
  )
}

const styles = StyleSheet.create({

})
function loadFavLangs() {
  throw new Error('Function not implemented.')
}
