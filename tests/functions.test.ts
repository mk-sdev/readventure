import {
  returnFullLanguageName,
  transformGeneratedText,
} from '@/utils/functions'

describe('transformGeneratedText', () => {
  test('normal case', () => {
    const generatedText = 'Hello, World. ### Witaj świecie.'
    const expectedOutput0 = 'Hello, World.'
    const expectedOutput1 = 'Witaj świecie.'
    expect(transformGeneratedText(generatedText)[0]).toBe(expectedOutput0)
    expect(transformGeneratedText(generatedText)[1]).toBe(expectedOutput1)
  })

  test('many spacebars after', () => {
    const generatedText = 'Hello, World. ### Witaj świecie.     '
    const expectedOutput = 'Witaj świecie.'
    expect(transformGeneratedText(generatedText)[1]).toBe(expectedOutput)
  })

  test('`Translation:` string', () => {
    const generatedText = 'Hello, World. ### Translation: Witaj świecie.     '
    const expectedOutput = 'Witaj świecie.'
    expect(transformGeneratedText(generatedText)[1]).toBe(expectedOutput)
  })

  test('`translation:` string', () => {
    const generatedText = 'Hello, World. ### translation: Witaj świecie.     '
    const expectedOutput = 'Witaj świecie.'
    expect(transformGeneratedText(generatedText)[1]).toBe(expectedOutput)
  })
})

describe('returnFullLanguageName', () => {
  it('should return Polish', () => {
    expect(returnFullLanguageName('pl')).toBe('Polish')
  })
  it('should return English', () => {
    expect(returnFullLanguageName('en')).toBe('English')
  })
})
