import { StyleSheet } from 'react-native'

import { Text, View } from '@/components/Themed'

const homeLanguages = ['English', 'Polish'] as const
function HomeOption({ lang }: { lang: (typeof homeLanguages)[number] }) {
  return (
    <View style={{ marginVertical: 10 }}>
      <Text>{lang}</Text>
    </View>
  )
}

const foreignLanguages = [
  'English',
  'German',
  'Italian',
  'Polish',
  'Spanish',
] as const
function ForeignOption({ lang }: { lang: (typeof foreignLanguages)[number] }) {
  return (
    <View style={{ marginVertical: 10 }}>
      <Text>{lang}</Text>
    </View>
  )
}

export default function SettingsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choose your home language</Text>
      <Text>
        If you don't see your home language, choose the one you're the most
        familiar with
      </Text>
      {homeLanguages.map(lang => (
        <HomeOption lang={lang} />
      ))}

      <Text style={styles.title}>
        Which of these languages are you most interested in?
      </Text>
      {foreignLanguages.map(lang => (
        <ForeignOption lang={lang} />
      ))}
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
