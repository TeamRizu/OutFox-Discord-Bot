const { ChartStepFile } = require('./chartStep.js')

exports.ChartHeaderFile = class ChartHeaderInstance {
  #temporaryNotes
  #currentState
  #specialTags
  #changeTags
  #stopTags
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
      jacket: '',
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
    this.#changeTags = ['bgchanges', 'bgchanges2', 'bgchanges3', 'animations', 'fgchanges']
    this.#stopTags = ['stops', 'freezes']
  }

  parse(file) {
    const lines = file.split('\r\n')
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]

      if (line === '') continue

      if (line.startsWith(';') && this.#currentState === 'chart') { // End of chart
        this.#currentState = ''
        const ChartStep = new ChartStepFile()
        ChartStep.parse(this.#temporaryNotes)
        this.headerData.notes.push(ChartStep)
        this.#temporaryNotes = []
        continue
      }

      if (line.startsWith('//')) { // Chart Start
        this.#currentState = 'chart'
        continue
      }

      if (line.startsWith('#') && this.#currentState !== 'chart') {
        const splitLine = line.split(':')

        if (splitLine.length !== 2) {
          console.log(`skipped line ${line}`)
          this.#currentState = ''
          continue // bad file
        }

        const lineTag = splitLine[0].substring(1).toLowerCase()
        const removeLastLine = this.isLastLineToRemove(lineTag, splitLine.slice(1).join())
        const lineValue = this.clearLine(splitLine.slice(1).join().substring(0, splitLine[1].length - (removeLastLine ? 1 : 0)))

        if (lineValue === '') {
          this.#currentState = ''
          continue
        }

        if (!this.#specialTags.includes(lineTag)) {
          this.#currentState = ''
          console.log(`Changed ${lineTag} value to ${lineValue}`)
          this.headerData[lineTag] = lineValue
          continue
        }

        if (lineTag === 'keysounds') {
          this.#currentState = ''
          this.headerData.keysounds.concat(lineValue.split(','))
          continue
        }

        this.#currentState = lineTag

        if (this.#changeTags.includes(lineTag)) {
          this.pushChanges(lineTag, lineValue)
          continue
        }

        if (this.#stopTags.includes(lineTag)) {
          this.pushStops(lineTag, lineValue)
          continue
        }

        switch (lineTag) {
          case 'bpms':
            this.pushBPM(lineValue)
          break
          case 'timesignatures':
            this.pushTimesignatures(lineValue)
          break
          case 'attacks':
            this.pushAttack(lineValue)
          break
          case 'delays':
            this.pushDelays(lineValue)
          break
          case 'tickcounts':
            this.pushTickcounts(lineValue)
          break
        }

        continue
      }

      if (this.#changeTags.includes(this.#currentState)) {
        this.pushChanges(this.#currentState, line)
        continue
      }

      if (this.#stopTags.includes(this.#currentState)) {
        this.pushStops(this.#currentState, line)
        continue
      }

      switch (this.#currentState) {
        case 'bpms':
          this.pushBPM(line)
        break
        case 'timesignatures':
          this.pushTimesignatures(line)
        break
        case 'attacks':
          this.pushAttack(line)
        break
        case 'delays':
          this.pushDelays(line)
        break
        case 'tickcounts':
          this.pushTickcounts(line)
        break
        case 'chart':
          this.#temporaryNotes.push(line)
        break
      }
    }
  }

  /**
   * Clear the start and end of a line.
   * @param {string} line
   * @returns {string}
   */
   clearLine(line) {
    if (line.startsWith(',')) line = line.substring(0, line.length)
    if (line.endsWith(';')) line = line.substring(0, line.length - 1)

    return line
  }

  removeCommentFromLine(line) {
    const split = line.split('//')[0]

    return split[0].endsWith(' ') ? split[0].substring(0, split[0].length - 1) : split[0]
  }

  isLastLineToRemove(tag, value) {
    if (tag !== 'attack') return true

    if (value.endsWith(';')) return true

    return false
  }

  pushChanges(bgtag, value) {
    value = this.removeCommentFromLine(value)

    if (value.split('=').length === 5) {
      this.headerData[bgtag].push(value)
      return true
    }

    if (value.split('=').length !== 11) {
      return false
    }

    this.headerData[bgtag].push(value)
    return true
  }

  pushStops(stoptag,value) {
    if (value.split('=').length !== 2) return false

    this.headerData[stoptag].push(value)
    return true
  }

  pushBPM(value) {
    if (value.split('=').length !== 2) return false

    this.headerData.bpms.push(value)
    return true
  }

  pushTimesignatures(value) {
    if (value.split('=').length !== 3) return false

    this.headerData.timesignatures.push(value)
    return true
  }

  pushAttack(value) {
    if (value.split('=').length !== 3) return false

    this.headerData.attacks.push(value)
    return true
  }

  pushDelays(value) {
    if (value.split('=').length !== 2) return false

    this.headerData.delays.push(value)
    return true
  }

  pushTickcounts(value) {
    if (value.split('=').length !== 2) return false

    this.headerData.tickcounts.push(value)
    return true
  }
}
