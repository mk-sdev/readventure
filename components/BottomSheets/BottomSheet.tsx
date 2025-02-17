import React, { useCallback, forwardRef, useImperativeHandle, useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet';

// Definicja propsów
type SentenceProps = {
  sentence: string;
  onClose: () => void;
};

export const Sentence = forwardRef<{ open: () => void; close: () => void }, SentenceProps>(
  ({ sentence, onClose }, ref) => {
    const bottomSheetRef = useRef<BottomSheet>(null);

    useImperativeHandle(ref, () => ({
      open: () => bottomSheetRef.current?.snapToIndex(0),
      close: () => {
        bottomSheetRef.current?.close();
        onClose(); 
      },
    }));

    const renderBackdrop = useCallback(
      (props: any) => (
        <BottomSheetBackdrop onPress={()=>onClose()} {...props} disappearsOnIndex={-1} appearsOnIndex={0} opacity={0.15} />
      ),
      []
    );

    return (
      <BottomSheet
        enablePanDownToClose={true}
        ref={bottomSheetRef}
        index={-1}
        snapPoints={['25%']}
        backdropComponent={renderBackdrop}
        onClose={onClose} 
      >
        <BottomSheetView style={styles.contentContainer}>
          <Text>{sentence}</Text>
        </BottomSheetView>
      </BottomSheet>
    );
  }
);

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    padding: 36,
    alignItems: 'center',
  },
});
