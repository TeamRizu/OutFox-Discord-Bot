const termFile = require('../term-class.js')
const TermClass = new termFile.TermClass()
const termArrMock = [
  {
    name: 'chart',
    properName: 'Chart',
    aliases: ['map', 'beatmap', 'pad chart', 'keyboard chart'],
    properAlias: {
      map: 'Map',
      beatmap: 'Beatmap',
      'pad chart': 'Pad Chart',
      'keyboard chart': 'Keyboard Chart'
    },
    explanation:
      'When you want to play a song you\'ll also need to select a **chart**, a chart contains difficulty and notedata that you select to play.',
    aliasesExplanation: {
      map: 'Term used for osu!',
      beatmap: 'Term used for "beat based" modes such as bemu/pomu.',
      'pad chart': 'Term used when a chart was created with pad play design.',
      'keyboard chart':
        'Term used when a chart was created with keyboard play design, popular in StepMania Fork "Etterna".'
    }
  }
]

describe('Terms Class Testing', () => {
  test('Terms getter must also return aliases', () => {
    TermClass.termArr = termArrMock

    expect(TermClass.terms.includes('map')).toBe(true)
  })

  test('termObjectByName should also return aliases', () => {
    TermClass.termArr = termArrMock

    expect(TermClass.termObjectByName('map')).not.toBe(null)
  })
})
