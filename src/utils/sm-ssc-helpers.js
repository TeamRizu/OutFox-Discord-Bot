const axios = require('axios')
const emotesForDif = {
  'beginner': '<:beginner:1156324979563053066>',
  'easy': '<:easy:1156325014518378527>',
  'medium': '<:normal:1156325064212484251>',
  'hard': '<:hard:1156325092599529562>',
  'challenge': '<:expert:1156325106956644444>',
  'edit': '<:edit:1156325125268979772>',
  'unknown': ':grey_question:'
}
const acceptedDifs = ['beginner', 'easy', 'medium', 'hard', 'challenge', 'edit']

const fixVolumeCredit = (credit) => {
  if (credit.includes('.5')) {
    return credit.includes('1.5') ? 'OutFox Serenity Volume 1 Winter Update' : 'OutFox Serenity Volume 2 Winter Update'
  }

  return credit
}

const compareWithMain = async (chart) => {

  if (!chart.title) {
    return [false, 'No title tag.']
  }

  if (!chart.credit) {
    return [false, 'No credit tag.']
  }

  const serenityDBRequest = await axios.get('https://wiki.projectoutfox.com/en/user-guide/meta/serenity_db.json') 
  
  if (!serenityDBRequest || serenityDBRequest?.status !== 200) {
    return [false, 'Could not get file from SerenityDB']
  }

  const serenityDb = serenityDBRequest.data
  const fixedChartCredit = fixVolumeCredit(chart.credit)
  const requestedVolume = serenityDb.volumes.find(volume => volume.title === fixedChartCredit)

  if (!requestedVolume) {
    return [false, '`#CREDIT` tag matches no volume.']
  }

  const requestedSong = requestedVolume.songs.find(song => song.title === chart.title)

  if (!requestedSong) {
    return [false, '`TITLE` tag matches no song.']
  }

  if (Array.isArray(requestedSong.bpm)) {
    const [lowest, highest] = requestedSong.bpm

    if (lowest !== chart.bpms.lowest(chart) || highest !== chart.bpms.highest(chart)) {
      return [false, '`#BPMS` does no match.']
    }
  }

  return [true, '']
}

const resumeSMSSC = async (chart, { skipCompare } = {}) => {
  if (!chart) {
    return [false, 'No chart was given or something bad happened.']
  }

  let sucessStatus
  let errorMessage
  
  if (skipCompare) {
    sucessStatus = true
    errorMessage = ''
  } else {
    [sucessStatus, errorMessage] = await compareWithMain(chart)
  }

  let finalMessage = `## Main Header Check`

  if (!sucessStatus) {
    finalMessage += `\n\n:exclamation: - **${errorMessage}**`
    return [false, finalMessage]
  }

  finalMessage += `\n\n:thumbup: - **Header is ok.**\n\n## Charts Check\n\n`

  if (0 >= chart.charts.length) {
    finalMessage += '_No charts detected._'
    return [false, finalMessage]
  }

  for (let i = 0; i < chart.charts.length; i++) {
    const step = chart.charts[i]
    let chartMessage = '- '
    let chartProblems = ''

    if (!step.difficulty || !acceptedDifs.includes(step.difficulty?.toLowerCase())) {
      chartProblems += 'Unknown difficulty field or empty.'
      chartMessage += emotesForDif.unknown + ' '
    } else {
      chartMessage += emotesForDif[step.difficulty.toLowerCase()] + ' '
    }

    if (!step.stepstype) {
      chartProblems += ' Unknown stepstype of empty.'
      chartMessage += '??? '
    } else {
      chartMessage += step.stepstype + ' '
    }
  
    if (!step.meter && !step.meterf) {
      chartProblems += ' No meter was applied to this chart.'
      chartMessage += 'Lv. ?, '
    } else {
      chartMessage += `Lv. ${step.meter || step.meterf}, `
    }

    if (step.chartname || step.description) {
      chartMessage += `${step.chartname || step.description} | `
    }

    if (!step.credit) {
      chartProblems += ' No credit was applied.'
      chartMessage += '**Missing Credit**'
    } else {
      chartMessage += `Credited as \`${step.credit}\` `
    }

    if (!step.notes) {
      chartProblems += ' No notes detected.'
    }

    chartMessage += chartProblems ? ' - (' + chartProblems  + ' )': ''
    finalMessage += chartMessage + '\n'
  }

  return [true, finalMessage]
}

const parseSMData = (data) => {
  const defaultChartObj = {
    chartname: '',
    charthash: '',
    banner: '',
    stepstype: '',
    difficulty: '',
    meter: 0,
    meterf: 0,
    lastsecondhint: 0,
    credit: '',
    description: '',
    radarvalues: '',
    notes: '',
    chartstyle: '',
    offset: 0,
    reports: [],
    bpms: {
      raw: '',
      at: (chartObj, fSeconds) => {
        const rawData = chartObj.bpms.raw

        if (!rawData) {
          return 0
        }

        const bpmLines = rawData.split(',')
        let latestBPM = 0

        for (let i = 0; i < bpmLines.length; i++) {
          const splitLine = bpmLines[i].split('=')
          const time = Number(splitLine[0])
          const bpm = Number(splitLine[1])

          if (time > fSeconds) {
            return latestBPM
          }

          if (time === fSeconds) {
            return bpm
          }

          latestBPM = bpm
        }

        return latestBPM
      },
      highest: (chartObj) => {
        const rawData = chartObj.bpms.raw

        if (!rawData) {
          return 0
        }

        const bpmLines = rawData.split(',')
        const bpms = []

        for (let i = 0; i < bpmLines.length; i++) {
          const splitLine = bpmLines[i].split('=')
          const bpm = Number(splitLine[1])

          bpms.push(bpm)
        }

        return Number.isFinite(Math.max(...bpms)) ? Math.max(...bpms) : 0 
      },
      lowest: () => {
        const rawData = chartObj.bpms.raw

        if (!rawData) {
          return 0
        }

        const bpmLines = rawData.split(',')
        const bpms = []

        for (let i = 0; i < bpmLines.length; i++) {
          const splitLine = bpmLines[i].split('=')
          const bpm = Number(splitLine[1])

          bpms.push(bpm)
        }

        return Number.isFinite(Math.min(...bpms)) ? Math.min(...bpms) : 0 
      },
    },
    stops: {
      raw: '',
      at: (chartObj, fBeat) => {
        const rawData = chartObj.stops.raw

        if (!rawData) {
          return 0
        }

        const stopLines = rawData.split(',')

        for (let i = 0; i < stopLines.length; i++) {
          const splitLine = stopLines[i].split('=')
          const beat = Number(splitLine[0])
          const stop = Number(splitLine[1])

          if (beat === fBeat) {
            return stop
          }
        }

        return 0
      },
    },
    timesignatures: {
      raw: '',
      at: (chartObj, fBeat) => {
        const rawData = chartObj.timesignatures.raw

        if (!rawData) {
          return '4/4'
        }

        const timeSigLines = rawData.split(',')
        let latestValues = ''

        for (let i = 0; i < timeSigLines.length; i++) {
          const splitLine = timeSigLines[i].split('=')
          const time = Number(splitLine[0])
          const numerator = splitLine[1]
          const denominator = splitLine[2]

          if (time > fBeat) {
            return latestValues
          }

          if (time === fBeat) {
            return `${numerator}=${denominator}`
          }

          latestValues = `${numerator}=${denominator}`
        }

        return latestValues
      },
    },
    combos: {
      raw: '',
      at: (chartObj, fBeat) => {
        // FIXME: This func is prob wrong, I don't really know how this works.
        const rawData = chartObj.combos.raw

        if (!rawData) {
          return 0
        }

        const comboLines = rawData.split(',')

        for (let i = 0; i < comboLines.length; i++) {
          const splitLine = comboLines[i].split('=')
          const beat = Number(splitLine[0])
          const combo = Number(splitLine[1])

          if (beat === fBeat) {
            return combo
          }
        }

        return 0
      },
    },
    speeds: {
      raw: '',
      // at: () => {} // I have no idea how speeds works.
    },
    scrolls: {
      raw: '',
      // at: () => {} // I have no idea how scroll works.
    },
    fakes: {
      raw: '',
      //at: () => // I have no idea how fakes works.
    },
    labels: {
      raw: '',
      // I'm guessing the first param is in beats.
      at: (chartObj, fBeat) => {
        const rawData = chartObj.labels.raw

        if (!rawData) {
          return ''
        }

        const labelLines = rawData.split(',')
        let latestLabel = ''

        for (let i = 0; i < labelLines.length; i++) {
          const splitLine = labelLines[i].split('=')
          const beat = Number(splitLine[0])
          const label = splitLine[1]

          if (beat > fBeat) {
            return latestLabel
          }

          if (beat === fBeat) {
            return label
          }

          latestLabel = label
        }

        return latestLabel
      },
    },
  }

  const finalObj = {
    version: 0.83,
    title: '',
    subtitle: '',
    artist: '',
    titletranslit: '',
    subtitletranslit: '',
    artisttranslit: '',
    genre: '',
    origin: '',
    tags: '',
    credit: '',
    banner: '',
    background: '',
    previewvid: '',
    jacket: '',
    cdimage: '',
    discimage: '',
    lyricspath: '',
    cdtitle: '',
    music: '',
    offset: 0.0,
    samplestart: 0.0,
    samplelength: 0.0,
    selectable: true,
    bpms: {
      raw: '',
      at: (chartObj, fSeconds) => {
        const rawData = chartObj.bpms.raw

        if (!rawData) {
          return 0
        }

        const bpmLines = rawData.split(',')
        let latestBPM = 0

        for (let i = 0; i < bpmLines.length; i++) {
          const splitLine = bpmLines[i].split('=')
          const time = Number(splitLine[0])
          const bpm = Number(splitLine[1])

          if (time > fSeconds) {
            return latestBPM
          }

          if (time === fSeconds) {
            return bpm
          }

          latestBPM = bpm
        }

        return latestBPM
      },
      highest: (chartObj) => {
        const rawData = chartObj.bpms.raw

        if (!rawData) {
          return 0
        }

        const bpmLines = rawData.split(',')
        const bpms = []

        for (let i = 0; i < bpmLines.length; i++) {
          const splitLine = bpmLines[i].split('=')
          const bpm = Number(splitLine[1])

          bpms.push(bpm)
        }

        return Number.isFinite(Math.max(...bpms)) ? Math.max(...bpms) : 0 
      },
      lowest: (chartObj) => {
        const rawData = chartObj.bpms.raw

        if (!rawData) {
          return 0
        }

        const bpmLines = rawData.split(',')
        const bpms = []

        for (let i = 0; i < bpmLines.length; i++) {
          const splitLine = bpmLines[i].split('=')
          const bpm = Number(splitLine[1])

          bpms.push(bpm)
        }
        return Number.isFinite(Math.min(...bpms)) ? Math.min(...bpms) : 0 
      },
    },
    stops: {
      raw: '',
      at: (chartObj, fBeat) => {
        const rawData = chartObj.stops.raw

        if (!rawData) {
          return 0
        }

        const stopLines = rawData.split(/\r\n|\n|\r/)

        for (let i = 0; i < stopLines.length; i++) {
          const splitLine = stopLines[i].split('=')
          const beat = Number(splitLine[0])
          const stop = Number(splitLine[1])

          if (beat === fBeat) {
            return stop
          }
        }

        return 0
      },
    },
    freezes: {
      raw: '',
      at: (chartObj, fBeat) => {
        const rawData = chartObj.freezes.raw

        if (!rawData) {
          return 0
        }

        const freezeLines = rawData.split(/\r\n|\n|\r/)

        for (let i = 0; i < freezeLines.length; i++) {
          const splitLine = freezeLines[i].split('=')
          const beat = Number(splitLine[0])
          const freeze = Number(splitLine[1])

          if (beat === fBeat) {
            return freeze
          }
        }

        return 0
      },
    },
    delays: {
      raw: '',
      at: (chartObj, fBeat) => {
        const rawData = chartObj.delays.raw

        if (!rawData) {
          return 0
        }

        const delayLines = rawData.split(/\r\n|\n|\r/)

        for (let i = 0; i < delayLines.length; i++) {
          const splitLine = delayLines[i].split('=')
          const beat = Number(splitLine[0])
          const delay = Number(splitLine[1])

          if (beat === fBeat) {
            return delay
          }
        }

        return 0
      },
    },
    warps: {
      raw: '',
      at: (chartObj, fBeat) => {
        // FIXME: This func is prob wrong, I don't really know how warps work.
        const rawData = chartObj.warps.raw

        if (!rawData) {
          return 0
        }

        const warpLines = rawData.split(/\r\n|\n|\r/)

        for (let i = 0; i < warpLines.length; i++) {
          const splitLine = warpLines[i].split('=')
          const beat = Number(splitLine[0])
          const warp = Number(splitLine[1])

          if (beat === fBeat) {
            return warp
          }
        }

        return 0
      },
    },
    timesignatures: {
      raw: '',
      at: (chartObj, fSeconds) => {
        const rawData = chartObj.timesignatures.raw

        if (!rawData) {
          return '4/4'
        }

        const timeSigLines = rawData.split(/\r\n|\n|\r/)
        let latestValues = ''

        for (let i = 0; i < timeSigLines.length; i++) {
          const splitLine = timeSigLines[i].split('=')
          const time = Number(splitLine[0])
          const numerator = splitLine[1]
          const denominator = splitLine[2]

          if (time > fSeconds) {
            return latestValues
          }

          if (time === fSeconds) {
            return `${numerator}=${denominator}`
          }

          latestValues = `${numerator}=${denominator}`
        }

        return latestValues
      },
    },
    tickcounts: {
      raw: '',
      at: (chartObj, fBeat) => {
        // FIXME: This func is prob wrong, I don't really know how tickcounts work.
        const rawData = chartObj.tickcounts.raw

        if (!rawData) {
          return 0
        }

        const tickLines = rawData.split(/\r\n|\n|\r/)

        for (let i = 0; i < tickLines.length; i++) {
          const splitLine = tickLines[i].split('=')
          const beat = Number(splitLine[0])
          const checkpoints = Number(splitLine[1])

          if (beat === fBeat) {
            return checkpoints
          }
        }

        return 0
      },
    },
    combos: {
      raw: '',
      at: (chartObj, fBeat) => {
        // FIXME: This func is prob wrong, I don't really know how this works.
        const rawData = chartObj.combos.raw

        if (!rawData) {
          return 0
        }

        const comboLines = rawData.split(/\r\n|\n|\r/)

        for (let i = 0; i < comboLines.length; i++) {
          const splitLine = comboLines[i].split('=')
          const beat = Number(splitLine[0])
          const combo = Number(splitLine[1])

          if (beat === fBeat) {
            return combo
          }
        }

        return 0
      },
    },
    speeds: {
      raw: '',
      // at: () => {} // I have no idea how speeds works.
    },
    scrolls: {
      raw: '',
      // at: () => {} // I have no idea how scroll works.
    },
    fakes: {
      raw: '',
      //at: () => // I have no idea how fakes works.
    },
    labels: {
      raw: '',
      // I'm guessing the first param is in beats.
      at: (chartObj, fBeat) => {
        const rawData = chartObj.labels.raw

        if (!rawData) {
          return ''
        }

        const labelLines = rawData.split(/\r\n|\n|\r/)
        let latestLabel = ''

        for (let i = 0; i < labelLines.length; i++) {
          const splitLine = labelLines[i].split('=')
          const beat = Number(splitLine[0])
          const label = splitLine[1]

          if (beat > fBeat) {
            return latestLabel
          }

          if (beat === fBeat) {
            return label
          }

          latestLabel = label
        }

        return latestLabel
      },
    },
    bgchanges: {
      raw: '',
      at: (chartObj, fBeat) => {
        const rawData = chartObj.bgchanges.raw

        if (!rawData) {
          return ''
        }

        const changesLines = rawData.split(/\r\n|\n|\r/)

        for (let i = 0; i < changesLines.length; i++) {
          const splitLine = changesLines[i].split('=')
          const beat = Number(splitLine[0])
          const aLotOfShit = rawData.substring(
            splitLine[0].length,
            rawData.length
          )

          if (beat === fBeat) {
            return aLotOfShit
          }
        }

        return ''
      },
    },
    bgchanges2: {
      raw: '',
      at: (chartObj, fBeat) => {
        const rawData = chartObj.bgchanges2.raw

        if (!rawData) {
          return ''
        }

        const changesLines = rawData.split(/\r\n|\n|\r/)

        for (let i = 0; i < changesLines.length; i++) {
          const splitLine = changesLines[i].split('=')
          const beat = Number(splitLine[0])
          const aLotOfShit = rawData.substring(
            splitLine[0].length,
            rawData.length
          )

          if (beat === fBeat) {
            return aLotOfShit
          }
        }

        return ''
      },
    },
    bgchanges3: {
      raw: '',
      at: (chartObj, fBeat) => {
        const rawData = chartObj.bgchanges3.raw

        if (!rawData) {
          return ''
        }

        const changesLines = rawData.split(/\r\n|\n|\r/)

        for (let i = 0; i < changesLines.length; i++) {
          const splitLine = changesLines[i].split('=')
          const beat = Number(splitLine[0])
          const aLotOfShit = rawData.substring(
            splitLine[0].length,
            rawData.length
          )

          if (beat === fBeat) {
            return aLotOfShit
          }
        }

        return ''
      },
    },
    animations: {
      raw: '',
      at: (chartObj, fBeat) => {
        const rawData = chartObj.animations.raw

        if (!rawData) {
          return ''
        }

        const changesLines = rawData.split(/\r\n|\n|\r/)

        for (let i = 0; i < changesLines.length; i++) {
          const splitLine = changesLines[i].split('=')
          const beat = Number(splitLine[0])
          const aLotOfShit = rawData.substring(
            splitLine[0].length,
            rawData.length
          )

          if (beat === fBeat) {
            return aLotOfShit
          }
        }

        return ''
      },
    },
    fgchanges: {
      raw: '',
      at: (chartObj, fBeat) => {
        const rawData = chartObj.fgchanges.raw

        if (!rawData) {
          return ''
        }

        const changesLines = rawData.split(/\r\n|\n|\r/)

        for (let i = 0; i < changesLines.length; i++) {
          const splitLine = changesLines[i].split('=')
          const beat = Number(splitLine[0])
          const aLotOfShit = rawData.substring(
            splitLine[0].length,
            rawData.length
          )

          if (beat === fBeat) {
            return aLotOfShit
          }
        }

        return ''
      },
    },
    keysounds: '',
    attacks: {
      raw: '',
      // FIXME: I know how attacks work enough to properly add them,
      // however, quite a bit of math will be required for a function
      // that will likely not be used at all.
    },
    charts: [{ ...defaultChartObj }],
    filetype: 'unknown',
    reports: [],
  }

  const splitLines = data.split(/\r\n|\n|\r/)
  const smNotesHeaders = [
    'stepstype',
    'description',
    'difficulty',
    'meter',
    'radarvalues',
  ]

  for (
    let i = 0,
      currentHeader = '',
      readingChart = 0,
      editingObj = finalObj,
      smNotesHeaderIndex = 0,
      passedFirstNotedata = false,
      acceptedProps = Object.keys(finalObj);
    i < splitLines.length;
    i++
  ) {
    let line = splitLines[i]

    if (!line) continue

    if (
      (line.startsWith('#NOTES') && splitLines[i + 1].startsWith('     '))
    ) {
      if (splitLines[i + 1].includes('NOTEDATA')) {
        continue
      }

      finalObj.filetype = 'sm'
      smNotesHeaderIndex = 0

      if (!passedFirstNotedata) {
        passedFirstNotedata = true
      } else {
        readingChart++
      }

      if (!finalObj.charts[readingChart]) {
        finalObj.charts.push({ ...defaultChartObj })
      }

      editingObj = finalObj.charts[readingChart]
      continue
    }

    if (line.startsWith('#')) {
      if (currentHeader !== '') {
        editingObj.reports.push(
          `${currentHeader} possibily missing ';', jumping header before line ${i}`
        )
      }

      const lineHeader = line
        .substring(1, line.length)
        .split(':')[0]
        .toLowerCase()
      const lineValue = line.substring(1, line.length).split(':')[1] || ''

      if (lineHeader === 'notes' && finalObj.filetype === 'sm') {
        continue // The line of notes on .sm will never have anything
      }

      if (lineHeader === 'notedata') {
        // SSC File

        if (!passedFirstNotedata) {
          finalObj.filetype = 'ssc'
          passedFirstNotedata = true
          acceptedProps = Object.keys(finalObj.charts[0])
          editingObj = finalObj.charts[readingChart]
          continue
        }

        readingChart++

        if (!finalObj.charts[readingChart]) {
          finalObj.charts.push({ ...defaultChartObj })
        }

        editingObj = finalObj.charts[readingChart]
      }

      if (!acceptedProps.includes(lineHeader)) {
        continue
      }

      const cleanLineValue = lineValue.replace(';', '')

      if (lineHeader === 'notes' && finalObj.filetype === 'ssc') {
        currentHeader = 'notes'
        continue
      }

      if (cleanLineValue !== '') {
        if (typeof editingObj[lineHeader] === 'object') {
          editingObj[lineHeader].raw += cleanLineValue
        } else {
          if (['YES', 'NO'].includes(cleanLineValue)) {
            editingObj[lineHeader] = 'YES' === cleanLineValue
          } else if (isNaN(cleanLineValue)) {
            editingObj[lineHeader] = cleanLineValue
          } else {
            editingObj[lineHeader] = Number(cleanLineValue)
          }
        }
      }

      if (line.replace('\n', '').endsWith(';')) {
        continue
      }

      currentHeader = lineHeader
      continue
    }

    if (line.startsWith('// measure') || line.startsWith('//measure')) {
      continue
    }

    if (
      line.startsWith(',') &&
      (line.includes('// measure') || line.includes('//measure'))
    ) {
      line = ','
    }

    if (currentHeader === '') {
      if (finalObj.filetype === 'sm') {
        if (smNotesHeaderIndex > 4) {
          currentHeader = 'notes'
        } else {
          const currentHeader = smNotesHeaders[smNotesHeaderIndex]
          const value = line.replace('     ', '').replace(':', '')

          editingObj[currentHeader] = isNaN(value) ? value : Number(value)

          if (currentHeader === 'meter') {
            editingObj.meterf = Number(value)
          }

          smNotesHeaderIndex++
        }
      }

      continue
    } else {
      if (typeof editingObj[currentHeader] === 'object') {
        editingObj[currentHeader].raw += line.replace(';', '')
      } else {
        editingObj[currentHeader] += line.replace(';', '')
      }
    }

    if (line.endsWith(';')) {
      currentHeader = ''
    }
  }

  return finalObj
}

exports.parseSMSSC = parseSMData
exports.resumeSMSSC = resumeSMSSC