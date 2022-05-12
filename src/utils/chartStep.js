exports.ChartStepFile = class ChartStep {
  #specialTags
  #currentState
  #currentMeasure
  #stopTags
  constructor() {
    this.stepData = {
      notedata: '',
      chartname: '',
      stepstype: '',
      description: '',
      chartstyle: '',
      radarvalues: [],
      credit: '',
      notes: [],
      labels: [],
      fakes: [],
      combos: [],
      meter: '',
      bpms: [],
      stops: [],
      delays: [],
      warps: [],
      tickcounts: [],
      speeds: [],
      scrolls: [],
      offset: '',
      timesignatures: []
    }
    this.acceptedNotes = ['0', '1', '2', '3', '4', 'M', 'K', 'L', 'F']

    this.#currentState = ''
    this.#currentMeasure = 0
    this.#specialTags = ['attacks', 'delays', 'notes', 'radarvalues', 'labels', 'fakes', 'combos', 'bpms', 'stops', 'delays', 'warps', 'tickcounts', 'speeds', 'scrolls', 'timesignatures']
    this.#stopTags = ['stops', 'freezes']
  }

  parse(stepLines) {
    for (let i = 0; i < stepLines.length; i++) {
      const line = stepLines[i]

      if (line === '') continue

      if (line === ',' && this.#currentState === 'measure') {
        this.#currentMeasure++
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
        const lineValue = splitLine.slice(1).join().substring(0, splitLine[1].length - (removeLastLine ? 1 : 0))

        if (lineValue === '' && lineTag !== 'notes') {
          this.#currentState = ''
          continue
        }

        if (!this.#specialTags.includes(lineTag)) {
          this.#currentState = ''
          console.log(`STEP: Changed ${lineTag} value to ${lineValue}`)
          this.stepData[lineTag] = lineValue
          continue
        }

        if (lineTag === 'radarvalues') {
          this.#currentState = ''
          this.stepData.radarvalues.concat(lineValue.split(','))
          continue
        }

        this.#currentState = lineTag

        if (this.#stopTags.includes(lineTag)) {
          this.pushStops(lineTag, lineValue)
          continue
        }

        switch (lineTag) {
          case 'notes':
            this.#currentState = 'measure'
            if (lineValue) this.pushMeasureLine(lineValue)
            continue
          case 'attacks':
            this.pushAttack(lineValue)
          break
          case 'delays':
            this.pushDelays(lineValue)
          break
          case 'labels':
            this.pushLabels(lineValue)
          break
          case 'fakes':
            this.pushFakes(lineValue)
          break
          case 'combos':
            this.pushCombos(lineValue)
          break
          case 'bpms':
            this.pushBPM(lineValue)
          break
          case 'warps':
            this.pushWarps(lineValue)
          break
          case 'tickcounts':
            this.pushTickcounts(lineValue)
          break
          case 'speeds':
            this.pushSpeeds(lineValue)
          break
          case 'scrolls':
            this.pushScrolls(lineValue)
          break
          case 'timesignatures':
            this.pushTimesignatures(lineValue)
          break
        }
      }

      // todo: Deal with multi lines, and this....thing: ,269.125000=0.000000
    }
  }

  isLastLineToRemove(tag, value) {
    if (tag !== 'attack') return true

    if (value.endsWith(';')) return true

    return false
  }

  pushMeasureLine(line) {
    if (!this.acceptedNotes.includes(line)) return false

    if (!this.stepData.notes[this.#currentMeasure]) this.stepData.notes[this.#currentMeasure] = []

    this.stepData.notes[this.#currentMeasure].push(line)

    return true
  }

  pushBPM(value) {
    if (value.split('=').length !== 2) return false

    this.stepData.bpms.push(value)
    return true
  }

  pushTimesignatures(value) {
    if (value.split('=').length !== 3) return false

    this.stepData.timesignatures.push(value)
    return true
  }

  pushAttack(value) {
    if (value.split('=').length !== 3) return false

    this.stepData.attacks.push(value)
    return true
  }

  pushDelays(value) {
    if (value.split('=').length !== 2) return false

    this.stepData.delays.push(value)
    return true
  }

  pushTickcounts(value) {
    if (value.split('=').length !== 2) return false

    this.stepData.tickcounts.push(value)
    return true
  }

  pushLabels(value) {
    if (value.split('=').length !== 2) return false

    this.stepData.labels.push(value)
    return true
  }

  pushFakes(value) {
    if (value.split('=').length !== 2) return false

    this.stepData.fakes.push(value)
    return true
  }

  pushCombos(value) {
    if (value.split('=').length !== 2) return false

    this.stepData.combos.push(value)
    return true
  }

  pushWarps(value) {
    if (value.split('=').length !== 2) return false

    this.stepData.warps.push(value)
    return true
  }

  pushSpeeds(value) {
    if (value.split('=').length !== 4) return false

    this.stepData.speeds.push(value)
    return true
  }

  pushScrolls(value) {
    if (value.split('=').length !== 4) return false

    this.stepData.speeds.push(value)
    return true
  }
}
