const hash = require('../hash.json')
const hashObjects = Object.values(hash)
const buildTypes = ['public', 'testbuild', 'private']
const noteTypes = ['release_candidate', 'notice', 'final_hash', 'hotfix', 'hotfix_notice']

describe('Hash file structure tests', () => {
  test('Each key must have a object value', () => {
    hashObjects.forEach((value) => {
      expect(typeof value).toBe('object')
    })
  })

  test('HashObjects must have expected properties', () => {
    hashObjects.forEach((hashBuild) => {
      expect(hashBuild.date).toBeTruthy()
      expect(typeof hashBuild.date).toBe('string')
      expect(Number(hashBuild.date)).not.toBeNaN()
      expect(hashBuild.date.length).toBe(8)

      expect(hashBuild.name).toBeTruthy()
      expect(typeof hashBuild.name).toBe('string')

      expect(hashBuild.buildtype).toBeTruthy()
      expect(typeof hashBuild.buildtype).toBe('string')
      expect(buildTypes.includes(hashBuild.buildtype)).toBe(true)

      if (hashBuild.exclusive !== null) {
        expect(typeof hashBuild.exclusive).toBe('string')
      } else {
        expect(hashBuild.exclusive).toBeNull()
      }

      if (hashBuild.notes !== null) {
        expect(Array.isArray(hashBuild.notes)).toBe(true)
      } else {
        expect(hashBuild.notes).toBeNull()
      }
    })
  })

  test('Each item inside a HashObject notes must be object and have expected properties', () => {
    hashObjects.forEach((hashBuild) => {
      if (Array.isArray(hashBuild.notes) && hashBuild.length > 0) {
        const notes = hashBuild.notes

        notes.forEach((note) => {
          expect(typeof note).toBe('object')
          expect(note.type).toBeTruthy()
          expect(typeof note.type).toBe('string')
          expect(noteTypes.includes(note.type)).toBe(true)

          if (note.type === 'notice') {
            expect(note.description).toBeTruthy()
            expect(typeof note.description).toBe('string')
          }

          if (note.type === 'release_candidate' && note.final_hash) {
            expect(typeof note.final_hash).toBe('string')
            expect(Object.keys(hash).includes(note.final_hash)).toBe(true)
          }

          if (note.type === 'hotfix_notice') {
            expect(note.hotfix_hash).toBeTruthy()
            expect(typeof note.hotfix_hash).toBe('string')
            expect(Object.keys(hash).includes(note.hotfix_hash)).toBe(true)
          }
        })
      }
    })
  })
})
