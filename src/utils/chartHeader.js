exports.ChartHeaderFile = class ChartHeaderInstance {
  #temporaryNotes
  #currentState
  #specialTags
  constructor () {
    this.headerData = {
      version: '',
      title: '',
      subtitle: '',
      artist: '',
      titletranslit: '',
      subtitletranslit: '',
      artisttranslit: '',
      genre: '',
      credit: '',
      banner: '',
      background: '',
      lyricspath: '',
      cdtitle: '',
      music: '',
      instrumenttrack: '',
      samplestart: '',
      samplelength: '',
      displaybpm: '',
      selectable: '',
      bgchanges: [],
      bgchanges2: [],
      bgchanges3: [],
      animations: [],
      fgchanges: [],
      keysounds: [],
      offset: '',
      stops: [],
      freezes: [],
      bpms: [],
      timesignatures: [],
      attacks: [],
      delays: [],
      tickcounts: [],
      notes: []
    }

    this.#temporaryNotes = []
    this.#currentState = ''
    this.#specialTags = ['bgchanges', 'bgchanges2', 'bgchanges3', 'animations', 'fgchanges', 'keysounds', 'stops', 'freezes', 'bpms', 'timesignatures', 'attacks', 'delays', 'tickcounts', 'notes']
  }

  parse(file) {
    const lines = file.split('\r\n')
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]

      /*
      Tasks:

      - Use currentState when dealing with multi-line tags (bgchanges, charts..etc)
      - Use temporaryNotes when dealing with charts for the creation of chartStep class
      */
      if (line.startsWith('#')) {
        const splitLine = line.split(':')

        if (splitLine.length !== 2) {
          console.log(`skipped line ${line}`)
          continue // bad file
        }

        const lineTag = splitLine[0].substring(1).toLowerCase()
        const lineValue = splitLine[1].substring(0, splitLine[1].length - 1)

        if (!this.#specialTags.includes(lineTag) && lineValue !== '') {
          console.log(`Changed ${lineTag} value to ${lineValue}`)
          this.headerData[lineTag] = lineValue
        }
      }
    }
  }
}
