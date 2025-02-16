import { useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';



import { Text, View } from '@/components/Themed';
import { HOME_LANGUAGE_STORAGE_KEY, STORED_TEXTS_STORAGE_KEY } from '@/constants/StorageKeys';
import { storedText } from '@/constants/Types';
import { getValue } from '@/utils/async-storage';


export default function LastTextsScreen() {
  const [lastTexts, setLastTexts] = useState([])

  useFocusEffect(
    useCallback(
      () => {
        ;(async () => {
          const storedTexts: Array<storedText> = await getValue(
            STORED_TEXTS_STORAGE_KEY,
          )
          setLastTexts(storedTexts ? storedTexts : [])
        })()
      },
      [], // Empty array ensures this effect runs only once when the component mounts.
    ),
  )

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Here will be lastly generated texts</Text>

      {lastTexts.length > 0 ? (
        lastTexts.map((text, index) => (
          <View style={{ width: '90%', height: 150, borderWidth: 2 }}>
            <Text key={index}>{text?.text}</Text>
          </View>
        ))
      ) : (
        <Text>No texts generated yet.</Text>
      )}

      {/* <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <EditScreenInfo path="app/(tabs)/three.tsx" /> */}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
})