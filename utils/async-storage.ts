import AsyncStorage from '@react-native-async-storage/async-storage'

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

export async function setStory() {
  try {
    const lastTexts = [
      {
        lang: 'de',
        level: 'A1',
        text: 'Manchmal gehe ich mit meinem Hund spazieren. Er heißt Max und ist sehr verspielt. Wir gehen oft in den Park, wo er gerne mit anderen Hunden spielt. Gestern haben wir einen neuen Freund kennengelernt. Ein kleiner weißer Terrier, der so süß war! Max und der Terrier haben sofort miteinander gespielt und um die Wette gerannt. Ich habe mich gefreut, dass Max einen neuen Freund gefunden hat. Es ist immer schön, neue Bekanntschaften zu machen, auch für Hunde',
        translation:
          "Sometimes I go for a walk with my dog. His name is Max and he is very playful. We often go to the park, where he likes to play with other dogs. Yesterday we met a new friend. A little white terrier who was so cute! Max and the terrier started playing and racing each other immediately. I was happy that Max found a new friend. It's always nice to make new acquaintances, even for dogs.",
      },
      {
        lang: 'de',
        level: 'A1',
        text: 'Manchmal gehe ich mit meinem Hund spazieren. Er heißt Max und ist sehr verspielt. Wir gehen oft in den Park, wo er gerne mit anderen Hunden spielt. Gestern haben wir einen neuen Freund kennengelernt. Ein kleiner weißer Terrier, der so süß war! Max und der Terrier haben sofort miteinander gespielt und um die Wette gerannt. Ich habe mich gefreut, dass Max einen neuen Freund gefunden hat. Es ist immer schön, neue Bekanntschaften zu machen, auch für Hunde',
        translation:
          "Sometimes I go for a walk with my dog. His name is Max and he is very playful. We often go to the park, where he likes to play with other dogs. Yesterday we met a new friend. A little white terrier who was so cute! Max and the terrier started playing and racing each other immediately. I was happy that Max found a new friend. It's always nice to make new acquaintances, even for dogs.",
      },
      {
        lang: 'de',
        level: 'A1',
        text: 'Manchmal gehe ich mit meinem Hund spazieren. Er heißt Max und ist sehr verspielt. Wir gehen oft in den Park, wo er gerne mit anderen Hunden spielt. Gestern haben wir einen neuen Freund kennengelernt. Ein kleiner weißer Terrier, der so süß war! Max und der Terrier haben sofort miteinander gespielt und um die Wette gerannt. Ich habe mich gefreut, dass Max einen neuen Freund gefunden hat. Es ist immer schön, neue Bekanntschaften zu machen, auch für Hunde',
        translation:
          "Sometimes I go for a walk with my dog. His name is Max and he is very playful. We often go to the park, where he likes to play with other dogs. Yesterday we met a new friend. A little white terrier who was so cute! Max and the terrier started playing and racing each other immediately. I was happy that Max found a new friend. It's always nice to make new acquaintances, even for dogs.",
      },
      {
        lang: 'de',
        level: 'A1',
        text: 'Manchmal gehe ich mit meinem Hund spazieren. Er heißt Max und ist sehr verspielt. Wir gehen oft in den Park, wo er gerne mit anderen Hunden spielt. Gestern haben wir einen neuen Freund kennengelernt. Ein kleiner weißer Terrier, der so süß war! Max und der Terrier haben sofort miteinander gespielt und um die Wette gerannt. Ich habe mich gefreut, dass Max einen neuen Freund gefunden hat. Es ist immer schön, neue Bekanntschaften zu machen, auch für Hunde',
        translation:
          "Sometimes I go for a walk with my dog. His name is Max and he is very playful. We often go to the park, where he likes to play with other dogs. Yesterday we met a new friend. A little white terrier who was so cute! Max and the terrier started playing and racing each other immediately. I was happy that Max found a new friend. It's always nice to make new acquaintances, even for dogs.",
      },
    ]
    await AsyncStorage.setItem('lastTexts', JSON.stringify(lastTexts))
  } catch (error) {
    console.error('Błąd podczas dodawania historyjki do AsyncStorage:', error)
  }
}
