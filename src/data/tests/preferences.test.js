const preferences = require('../preferences.json')

describe('Preferences JSON should follow expected structure', () => {
  test('The value of all keys must be string', () => {
    const values = Object.values(preferences)

    values.forEach((value) => {
      expect(typeof value).toBe('string')
    })
  })
})
