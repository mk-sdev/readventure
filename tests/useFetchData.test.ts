import { act, renderHook } from '@testing-library/react-hooks'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'

import { STORED_TEXTS_STORAGE_KEY } from '@/constants/StorageKeys'
import { request, response } from '@/constants/Types'

import { getValue, setValue } from '../utils/async-storage'
import useFetchText from '../utils/useFetchText'

const mockAxios = new MockAdapter(axios)

jest.mock('../utils/async-storage', () => ({
  getValue: jest.fn(),
  setValue: jest.fn(),
}))

describe('useFetchText', () => {
  afterEach(() => {
    mockAxios.reset()
  })

  it('should fetch data and update the state', async () => {
    const mockData: response = {
      text: 'Sample Text',
      translation: 'Translated Text',
    }

    mockAxios.onPost('http://localhost:8081/api/generate').reply(200, mockData)
    ;(getValue as jest.Mock).mockResolvedValueOnce([])
    ;(setValue as jest.Mock).mockResolvedValueOnce(undefined)

    const { result } = renderHook(() => useFetchText('en'))

    const reqData: request = {
      description: 'Sample Description',
      lang: 'en',
      homeLang: 'pl',
      level: 'A2',
    }

    await act(async () => {
      await result.current.fetchData(reqData)
    })

    expect(result.current.res).toEqual(mockData)

    expect(setValue).toHaveBeenCalledWith(
      STORED_TEXTS_STORAGE_KEY,
      expect.any(Array),
    )

    expect(setValue).toHaveBeenCalledTimes(1)
  })

  it('should handle errors during the fetch operation', async () => {
    mockAxios.onPost('http://localhost:8081/api/generate').reply(500)

    const { result } = renderHook(() => useFetchText('en'))

    const reqData: request = {
      description: 'Sample Description',
      lang: 'en',
      homeLang: 'pl',
      level: 'A1',
    }

    await act(async () => {
      await result.current.fetchData(reqData)
    })

    expect(result.current.res).toBeNull()
  })
})
