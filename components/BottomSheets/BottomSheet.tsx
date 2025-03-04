import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetView,
} from '@gorhom/bottom-sheet'
import { Portal } from '@gorhom/portal'
import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
} from 'react'
import { StyleSheet } from 'react-native'

import Text from '@/components/Text'
import Colors from '@/constants/Colors'
import useStore from '@/utils/zustand'

// Definicja propsów
type SentenceProps = {
  sentence: string
  onClose: () => void
}

export const Sentence = forwardRef<
  { open: () => void; close: () => void },
  SentenceProps
>(({ sentence, onClose }, ref) => {
  const bottomSheetRef = useRef<BottomSheet>(null)
  const theme = useStore(state => state.theme)
  useImperativeHandle(ref, () => ({
    open: () => bottomSheetRef.current?.snapToIndex(0),
    close: () => {
      bottomSheetRef.current?.close()
      onClose()
    },
  }))

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        onPress={() => onClose()}
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.15}
      />
    ),
    [],
  )

  return (
    <Portal hostName="PortalHost">
      <BottomSheet
        enablePanDownToClose={true}
        ref={bottomSheetRef}
        index={-1}
        snapPoints={['30%']}
        backdropComponent={renderBackdrop}
        onClose={onClose}
        handleStyle={{ backgroundColor: Colors[theme].background }}
        style={{ backgroundColor: Colors[theme].background }}
        handleIndicatorStyle={{
          backgroundColor: Colors[theme].bottomSheetHandle,
        }}
      >
        <BottomSheetView
          style={[
            styles.contentContainer,
            { backgroundColor: Colors[theme].background },
          ]}
        >
          <Text style={{ color: Colors[theme].text, fontSize: 20 }}>
            {sentence}
          </Text>
        </BottomSheetView>
      </BottomSheet>
    </Portal>
  )
})

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    padding: 36,
    alignItems: 'center',
  },
})
