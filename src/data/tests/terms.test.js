const termsFile = require('../terms.json')

describe('Test if terms.json follows expected structure', () => {
  test('An array key called "termArr" must be present with at least one element', () => {
    expect(termsFile.termArr).toBeTruthy()
    expect(Array.isArray(termsFile.termArr)).toBe(true)
    expect(termsFile.termArr.length).toBeGreaterThanOrEqual(1)
  })

  test('All terms must have the the base fields and no invalid fields', () => {
    const terms = termsFile.termArr
    terms.forEach((term) => {
      // Name Field Check (Required)
      expect(term.name).toBeTruthy()
      expect(typeof term.name).toBe('string')
      expect(term.name === term.name.toLowerCase()).toBe(true) // "name" must be lowercase

      // Explanation Field Check (Required)
      expect(term.explanation).toBeTruthy()
      expect(typeof term.explanation).toBe('string')

      // ProperName Field Check (Required)
      expect(term.properName).toBeTruthy()
      expect(typeof term.properName).toBe('string')

      if (term.aliases) {
        expect(Array.isArray(term.aliases)).toBeTruthy()

        term.aliases.forEach((alias) => {
          expect(typeof alias).toBe('string')
          expect(alias === alias.toLowerCase()).toBe(true)

          expect(term.properAlias).toBeTruthy()
          expect(typeof term.properAlias).toBe('object')
          expect(Object.keys(term.properAlias).includes(alias)).toBe(true)
          expect(typeof term.properAlias[alias]).toBe('string')
        })
      }

      if (term.aliasesExplanation) {
        expect(typeof term.aliasesExplanation).toBe('object')

        Object.keys(term.aliasesExplanation).forEach((alias) => {
          expect(term.aliases.includes(alias)).toBe(true)
        })
      }

      if (term.decorations) {
        expect(typeof term.decorations).toBe('object')

        if (term.decorations.image) {
          expect(typeof term.decorations.image).toBe('string')
        }

        if (term.decorations.thumbnail) {
          expect(typeof term.decorations.thumbnail).toBe('string')
        }

        if (term.decorations.color) {
          expect(typeof term.decorations.color).toBe('string')
          expect(term.decorations.color).toMatch(/^#[0-9A-F]{6}$/i)
        }
      }

      if (term.references) {
        expect(Array.isArray(term.references)).toBe(true)
        expect(term.references.length).toBeLessThanOrEqual(5)

        term.references.forEach((reference) => {
          expect(['term', 'url'].includes(reference.type)).toBe(true) // reference.type must be either "url" or "term"

          if (reference.type === 'url') {
            expect(reference.url).toBeTruthy()
            expect(typeof reference.url).toBe('string')
            expect(reference.label).toBeTruthy()
            expect(typeof reference.label).toBe('string')
          } else {
            expect(reference.term).toBeTruthy()
            expect(typeof reference.term).toBe('string')
            const termExists = terms.find(elem => elem.name === reference.term || elem.aliases?.includes(reference.term))

            expect(termExists).toBeTruthy()

            if (reference.label) {
              expect(typeof reference.label).toBe('string')
            }
          }
        })
      }
    })
  })
})
