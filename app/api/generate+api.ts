import axios from 'axios'

import { foreignLanguage, homeLanguage, level } from '@/constants/Types'
import { returnFullLanguageName } from '@/utils/functions'
import { transformGeneratedText } from '@/utils/functions'

export async function POST(request: Request) {
  const { description, lang, homeLang, level } = await request
    .json()
    .then(body => body.params)

  try {
    const generatedText = await generateText(description, lang, homeLang, level)
    const [text, translation] = transformGeneratedText(generatedText)
    return Response.json({
      text,
      translation,
      lang,
      level,
    })
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
  lang: foreignLanguage,
  homeLang: homeLanguage,
  level: level,
): Promise<string> {
  const content = description
    ? `Write a short story of approximately one hundred words on the given topic: ${description} in ${returnFullLanguageName(lang)} at the ${level} level. Then, at the end, place the characters "###". After that, provide a translation into ${returnFullLanguageName(homeLang)}, maintaining the sentence structure.`
    : `Write a short story of approximately one hundred words on any topic in ${returnFullLanguageName(lang)} at the ${level} level. Then, at the end, place the characters "###". After that, provide a translation into ${returnFullLanguageName(homeLang)}, maintaining the sentence structure.`

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
