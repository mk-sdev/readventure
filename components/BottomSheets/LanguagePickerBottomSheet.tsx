import AntDesign from '@expo/vector-icons/AntDesign'
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetView,
} from '@gorhom/bottom-sheet'
import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
  useState,
} from 'react'
import { FlatList, Pressable, StyleSheet } from 'react-native'

import Text from '@/components/texts'
import Colors from '@/constants/Colors'
import { foreignLanguages } from '@/constants/Types'
import { returnFlag } from '@/utils/functions'

type Props = {
  languages: { label: string; value: foreignLanguages; isFav: boolean }[]
  selectedLanguage: foreignLanguages | null
  onSelect: (language: foreignLanguages) => void
  theme: 'light' | 'dark'
}

export const LanguagePickerBottomSheet = forwardRef<
  { open: () => void; close: () => void },
  Props
>(({ languages, selectedLanguage, onSelect, theme }, ref) => {
  const bottomSheetRef = useRef<BottomSheet>(null)
  const [currentIndex, setCurrentIndex] = useState<number>(-1)

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
      <BottomSheetView
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
      </BottomSheetView>
    </BottomSheet>
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
