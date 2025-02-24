import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import dotenv from 'dotenv'

import { POST } from '../app/api/generate+api'

jest.mock('axios')
dotenv.config()
describe('POST function', () => {
  const mockAxios = new MockAdapter(axios)

  afterEach(() => {
    mockAxios.reset()
  })

  it('should return an error message when API request fails', async () => {
    const requestData = {
      description: 'Test description',
      lang: 'pl',
      homeLang: 'en',
      level: 'A1',
    }

    // Mockujemy odpowiedź API jako błąd
    mockAxios.onPost('https://api.openai.com/v1/chat/completions').reply(500)

    const mockRequest = {
      json: jest.fn().mockResolvedValue({
        params: requestData,
      }),
    }

    const response = await POST(mockRequest as any)

    // Sprawdzamy, czy odpowiedź jest błędna
    const responseData = await response.json() // Używamy await dla odpowiedzi JSON
    expect(response.status).toBe(500)
    expect(responseData).toEqual({
      error: 'An error occurred while processing your request.',
    })
  })
})
