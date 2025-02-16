import AsyncStorage from '@react-native-async-storage/async-storage';


export async function getValue(key: string): Promise<any> {
  try {
    const existingValue = await AsyncStorage.getItem(key)
    //console.log('Got value: ', key)
    return existingValue ? JSON.parse(existingValue) : null
  } catch (error) {
    console.error('Could not get the item: ', error, key)
    return null // return null in case of an error
  }
}

export async function setValue<T>(key: string, value: T): Promise<boolean> {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value))
    //console.log(value)
    return true
  } catch (e) {
    console.log('An error occurred while setting the key: ', e)
    return false
  }
}

export async function removeKey(key: string): Promise<boolean> {
  try {
    await AsyncStorage.removeItem(key)
    return true
  } catch (e) {
    console.log('An error occurred while removing the key:', e)
    return false
  }
}

//* dev mode *//
export async function clearAsyncStorage() {
  try {
    await AsyncStorage.clear()
    console.log('AsyncStorage został wyczyszczony.')
  } catch (error) {
    console.error('Błąd podczas czyszczenia AsyncStorage:', error)
  }
}