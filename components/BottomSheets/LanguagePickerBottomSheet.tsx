import AntDesign from '@expo/vector-icons/AntDesign'
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet'
import { Portal } from '@gorhom/portal'
import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
  useState,
} from 'react'
import { FlatList, Pressable, StyleSheet } from 'react-native'

import Text from '@/components/Text'
import Colors from '@/constants/Colors'
import { foreignLanguage, languageItem } from '@/constants/Types'
import { returnFlag } from '@/utils/functions'
import useStore from '@/utils/zustand'

type Props = {
  languages: languageItem[]
  selectedLanguage: foreignLanguage | null
  onSelect: (language: foreignLanguage) => void
}

export const LanguagePickerBottomSheet = forwardRef<
  { open: () => void; close: () => void },
  Props
>(({ languages, selectedLanguage, onSelect }, ref) => {
  const bottomSheetRef = useRef<BottomSheet>(null)
  const [currentIndex, setCurrentIndex] = useState<number>(-1)
  const theme = useStore(state => state.theme)
  useImperativeHandle(ref, () => ({
    open: () => bottomSheetRef.current?.snapToIndex(0),
    close: () => bottomSheetRef.current?.close(),
  }))

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={theme === 'light' ? 0.15 : 0.35}
      />
    ),
    [],
  )

  return (
    <Portal hostName="PortalHost">
      <BottomSheet
        enablePanDownToClose
        ref={bottomSheetRef}
        index={-1}
        snapPoints={['50%']}
        backdropComponent={renderBackdrop}
        onChange={setCurrentIndex}
        handleIndicatorStyle={{
          backgroundColor: Colors[theme].bottomSheetHandle,
        }}
        handleStyle={{ backgroundColor: Colors[theme].background }}
        style={{ backgroundColor: Colors[theme].background }}
      >
        <BottomSheetScrollView
          style={[
            styles.container,
            { backgroundColor: Colors[theme].background },
          ]}
        >
          <FlatList
            data={languages}
            keyExtractor={item => item.value}
            renderItem={({ item }) => (
              <Pressable
                style={[
                  styles.item,
                  {
                    backgroundColor:
                      selectedLanguage === item.value
                        ? Colors[theme].buttonSecondary
                        : 'transparent',
                  },
                ]}
                onPress={() => {
                  if (currentIndex === 0) {
                    onSelect(item.value)
                    bottomSheetRef.current?.close()
                  }
                }}
              >
                {returnFlag(item.value)}
                <Text style={styles.text}>{item.label}</Text>
                {item.isFav && (
                  <AntDesign
                    name="star"
                    size={20}
                    color={theme === 'light' ? 'orange' : 'gold'}
                    style={{ opacity: 0.85, right: 40, position: 'absolute' }}
                  />
                )}
              </Pressable>
            )}
          />
        </BottomSheetScrollView>
      </BottomSheet>
    </Portal>
  )
})

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    paddingLeft: 40,
    borderRadius: 8,
  },
  selectedItem: {
    backgroundColor: '#e0e0e0',
  },
  text: {
    fontSize: 16,
    marginLeft: 10,
    fontWeight: 'bold',
    opacity: 0.75,
  },
})
