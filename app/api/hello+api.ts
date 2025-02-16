import { foreignLanguages, homeLanguages, levels } from '@/constants/Types'

export async function POST(request: Request) {
  const body = await request.json()
  const description = body.description
  const lang = body.lang
  const homeLang = body.homeLang
  const level = body.level

  const res = await fetchData(description, lang, homeLang, level)
  console.log('🚀 ~ GET ~ res:', res)
  const respo = res.split('###')
  const response = {
    text: respo[0],
    translation: respo[1],
  }
  return Response.json(response)
}

const apiKey = process.env.OPENAI_API_KEY

const headers = {
  'Content-Type': 'application/json',
  Authorization: `Bearer ${apiKey}`,
}

function fetchData(
  description: string,
  lang: foreignLanguages,
  homeLang: homeLanguages,
  level: levels,
) {
  const data = {
    model: 'gpt-3.5-turbo', // Możesz zmienić na inne modele (np. gpt-4)
    messages: [
      {
        role: 'user',
        content: `Napisz historyjkę na podany temat: ${description} w języku ${lang} na poziomie: ${level}. Następnie na jej końcu postaw znaki "###". Po nich podaj tłumaczenie na język: ${homeLang}.`,
      },
    ],
    max_tokens: 100, // Maksymalna liczba tokenów
  }

  const data_ = fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(data),
  })
    .then(response => response.json())
    .then(responseData => {
      console.log('Full response:', responseData) // Logowanie całej odpowiedzi
      if (responseData.choices && responseData.choices.length > 0) {
        // console.log(responseData.choices[0].message.content)
      } else {
        console.error('No choices found in response:', responseData)
      }
      return responseData.choices[0].message.content
    })
    .catch(error => {
      console.error('Error:', error)
    })
  return data_
}
