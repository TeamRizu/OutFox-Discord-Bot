const { makeEmbed } = require('../index.js')
const { systemArchitecture, systemPlatform, systemCPU } = require('../functions.js')

describe('Status Command Tests', () => {
  test('Embed should have expected properties', () => {
    const mainEmbed = makeEmbed()

    expect(mainEmbed.data.author.name).toBeTruthy()
    expect(mainEmbed.data.description).toBeTruthy()
    expect(mainEmbed.data.color).toBeTruthy()

    const expectedFieldNames = ['RAM Usage', 'System Architecture & Platform', 'CPU', 'Uptime']
    const expectedValuesToBeIncluded = [
      /* systemMemUsage() */'(MB)',
      [systemArchitecture(), systemPlatform()],
      systemCPU(),
      /* processUptime() */ '(Seconds)'
    ]

    mainEmbed.data.fields.forEach((field, i) => {
      expect(field.inline).toBe(true)
      expect(expectedFieldNames).toContain(field.name)

      const expectedValue = expectedValuesToBeIncluded[i]
      const expectsMultipleValues = Array.isArray(expectedValue)

      if (expectsMultipleValues) {
        expectedValue.forEach((expectedString) => {
          expect(field.value).toContain(expectedString)
        })
      } else {
        expect(field.value).toContain(expectedValue)
      }
    })
  })
})
