import axios from 'axios'

import { foreignLanguages, homeLanguages, levels } from '@/constants/Types'

export async function POST(request: Request) {
  const { description, lang, homeLang, level } = await request
    .json()
    .then(body => body.params)

  try {
    const generatedText = await generateText(description, lang, homeLang, level)
    const [text, translation] = generatedText.split('###')

    return Response.json({ text, translation })
  } catch (error) {
    console.error('Error generating text:', error)
    return Response.json(
      { error: 'An error occurred while processing your request.' },
      { status: 500 },
    )
  }
}

const apiKey = process.env.OPENAI_API_KEY

const headers = {
  'Content-Type': 'application/json',
  Authorization: `Bearer ${apiKey}`,
}

async function generateText(
  description: string,
  lang: foreignLanguages,
  homeLang: homeLanguages,
  level: levels,
): Promise<string> {
  const content = description
    ? `Napisz historyjkę na około sto słów na podany temat: ${description} w języku ${lang} na poziomie: ${level}. Następnie na jej końcu postaw znaki "###". Po nich podaj tłumaczenie na język: ${homeLang} odwzorowując strukturę zdań.`
    : `Napisz historyjkę na około sto słów na dowolny temat w języku ${lang} na poziomie: ${level}. Następnie na jej końcu postaw znaki "###". Po nich podaj tłumaczenie na język: ${homeLang} odwzorowując strukturę zdań.`

  const data = {
    model: 'gpt-3.5-turbo', 
    messages: [{ role: 'user', content }],
    max_tokens: 350, 
  }

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      data,
      { headers },
    )

    const responseData = response.data
    if (responseData.choices && responseData.choices.length > 0) {
      return responseData.choices[0].message.content
    } else {
      throw new Error('No choices found in response')
    }
  } catch (error) {
    console.error('Error during API request:', error)
    throw error
  }
}
