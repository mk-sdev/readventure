import React, { useCallback, forwardRef, useImperativeHandle, useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet';

// Przekazujemy ref do BottomSheet
export const Sentence = forwardRef(({sentence}:{sentence:string}, ref) => {
  const bottomSheetRef = useRef<BottomSheet>(null);

  // Umożliwiamy nadrzędnemu komponentowi sterowanie bottomSheetRef
  useImperativeHandle(ref, () => ({
    open: () => bottomSheetRef.current?.snapToIndex(0),
    close: () => bottomSheetRef.current?.close(),
  }));

  const renderBackdrop = useCallback(
    (props:any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.15}
      />
    ),[],)
  
  return (
      <BottomSheet enablePanDownToClose={true} ref={bottomSheetRef} index={-1} snapPoints={['25%', '50%']} backdropComponent={renderBackdrop}>
          <BottomSheetView style={styles.contentContainer}>
          <Text>{sentence}</Text>
        </BottomSheetView>
      </BottomSheet>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'grey',
  },
  contentContainer: {
    flex: 1,
    padding: 36,
    alignItems: 'center',
  },
});
