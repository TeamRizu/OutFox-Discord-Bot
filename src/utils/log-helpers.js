const defaultNoteskins = [
  'default',
  'common',
  'defaultsm5',
  'delta',
  'delta2019',
  'easyv2',
  'exactv2',
  'midi-note',
  'midi-note-3d',
  'midi-rainbow',
  'midi-solo',
  'midi-routine-p1',
  'midi-routine-p2',
  'midi-vivid',
  'midi-vivid-3d',
  'outfox-color-holds',
  'outfox-note',
  'outfox-itg',
  'outfox-itg-3d',
  'outfox-note-3D',
  'outfox-itg-3d+',
  'outfox-note-3D+',
  'outfox-note-3d',
  'outfox-note-3d+',
  'paw',
  'retro',
  'retrobar',
  'retrobar-splithand_whiteblue',
  'broadhead',
  'broadhead-3d',
  'broadhead-3d+',
  'broadhead-columns',
  'crystal',
  'crystal4k',
  'debugelements',
  'exact3d',
  'exactv3',
  'fourv2',
  'glider-note',
  'krazy',
  'krazy-classic',
  'lambda',
  'paws',
  'paws-co-op',
  'paws-simpleholds',
  'shadowtip',
  'shadowtip-3d',
  'shadowtip-3d+',
  'webbed',
]

function average(array) {
  var sum = 0

  for (let i = 0; i < array.length; i++) {
    sum += array[i]
  }

  return sum / array.length
}

const findMissingElements = (inputArray, predefinedArray) => {
  let missingElements = []

  for (let i = 0; i < predefinedArray.length; i++) {
    if (inputArray.indexOf(predefinedArray[i]) === -1) {
      missingElements.push(predefinedArray[i])
    }
  }

  return missingElements
}

/**
 *
 * @param {string} logData
 * @returns {object}
 */
const parseLog = (logData) => {
  const splitLines = logData.split(/\r\n|\n|\r/).map((line) => line.split('\t'))
  const finalObj = {
    discordSDKStarted: false,
    noteskins: [],
    themes: [],
    languages: [],
    songs: {
      timeToLoad: '0 seconds',
      packs: {},
    },
    courses: [],
    profiles: {
      MachineProfile: {
        loaded: false,
      },
    },
    graphics: {
      lastSeenVideoDriver: null,
      glVersion: {
        requested: 0,
        got: 0,
        contextMask: 0,
        using: 0,
      },
      renderer: 'opengl',
      supportedRenderers: [],
      sdl: {
        compiled: '',
        linked: '',
      },
      failedShaders: [],
      currentVideoDriver: null,
      lineWidth: [0, 0],
      pointSize: [0, 0],
    },
    devices: [],
    seeds: {
      game: [],
      stage: [],
    },
    inputDrivers: [],
    soundDrivers: [],
    lastSeenScreen: '',
    properClose: false,
    performance: {
      FPS: {
        lowest: 0,
        highest: 0,
        average: 0,
      },
      memory: {
        lowest: 0,
        highest: 0,
        average: 0,
      },
    },
  }

  const detectedSoundDrivers = []
  const recordedFPS = []
  const recordedMemory = []
  const detectedInputDrivers = []

  for (let i = 0; i < splitLines.length; i++) {
    const line = splitLines[i]

    if (!line || !line[0] || !line[0]?.length) continue

    if (line[0].startsWith('created log at') || line[0].startsWith('[Time]') || line[0].startsWith('FileSink'))
      continue

    if (line[0].includes('FoxClock: Game uptime was')) {
      finalObj.properClose = true
      continue
    }

    const [time, level, _, thread, log] = line

    // Each if case will have a comment inside of it to show the expected line.

    if (!log || typeof log !== 'string') {
      continue
    }

    if (log.includes('Discord Core Creation Returned: Succeeded')) {
      // OutFox Engine: Discord Core Creation Returned: Succeeded 0
      finalObj.discordSDKStarted = true
      continue
    }

    if (log.includes('LoadNoteSkinDataRecursive')) {
      // LoadNoteSkinDataRecursive: default (Appearance/NoteSkins/dance/default/)
      const noteskinName = log.split(' ')[1]

      if (!noteskinName || finalObj.noteskins.includes(noteskinName)) continue

      finalObj.noteskins.push(noteskinName)
      continue
    }

    if (log.includes('Theme:')) {
      // Theme: default
      const themeName = log.split(' ')[1]

      if (!themeName || finalObj.themes.includes(themeName)) continue

      finalObj.themes.push(themeName)
      continue
    }

    if (log.startsWith('Language: ')) {
      // Language: pt
      const languageCode = log.split(' ')[1]

      if (!languageCode || finalObj.languages.includes(languageCode)) continue

      finalObj.languages.push(languageCode)
      continue
    }

    if (log.includes('Attempting to load')) {
      // Attempting to load  14 songs from "AdditionalSongs"
      const numberOfSongs = Number(log.split(' ')[4])
      const pack = log.split('from ').at(-1)?.replace(/"/g, '')

      if (!pack || isNaN(numberOfSongs)) continue

      if (!finalObj.songs.packs[pack]) {
        finalObj.songs.packs[pack] = {
          detected: 0,
          loaded: 0,
        }
      }

      finalObj.songs.packs[pack].detected = numberOfSongs
      continue
    }

    if (log.includes('Loaded') && log.includes('songs from')) {
      // Loaded 0 songs from "AdditionalSongs"
      const loadedSongsCount = Number(log.split(' ')[1])
      const pack = log.split('from ').at(-1)?.replace(/"/g, '')

      if (!pack || isNaN(loadedSongsCount)) continue

      if (!finalObj.songs.packs[pack]) {
        finalObj.songs.packs[pack] = {
          detected: 0,
          loaded: 0,
        }
      }

      finalObj.songs.packs[pack].loaded = loadedSongsCount
      continue
    }

    if (log.includes('Loading ') && log.includes('Stats.xml')) {
      // Loading /Save/MachineProfile/Stats.xml
      const profileName = log.split(' ').at(1)?.split('/')?.at(-2)

      if (!profileName) continue

      if (profileName === 'MachineProfile') {
        finalObj.profiles.MachineProfile.loaded = true
        continue
      }

      if (!finalObj.profiles[profileName]) {
        finalObj.profiles[profileName] = {
          loaded: true,
        }
        continue
      }

      finalObj.profiles[profileName].loaded = true
      continue
    }

    if (log.includes('Last seen video driver:')) {
      // Last seen video driver: ATI Technologies Inc. - Radeon RX560XT Series
      const driver = log.split(': ')[1]

      if (!driver) continue

      finalObj.graphics.lastSeenVideoDriver = driver
      continue
    }

    if (log.includes('Requested GL Version Context:')) {
      // Requested GL Version Context: 4.1
      const context = Number(log.split(': ')[1])

      if (!context || isNaN(context)) continue

      finalObj.graphics.glVersion.requested = context
      continue
    }

    if (log.includes('Got GL Version Context:')) {
      // Got GL Version Context: 4.1
      const context = Number(log.split(': ')[1])

      if (!context || isNaN(context)) continue

      finalObj.graphics.glVersion.got = context
      continue
    }

    if (log.includes('Got Context Profile Mask:')) {
      // Got Context Profile Mask: 2 (2 = compatibility)
      const profileMask = Number(log.split(': ')[1]?.split(' ')[0])

      if (!profileMask || isNaN(profileMask)) continue

      finalObj.graphics.glVersion.contextMask = profileMask
      continue
    }

    if (log.includes('OutFox Engine: You are using')) {
      // OutFox Engine: You are using a modern GL Context: 4.1
      const context = Number(log.split(': ')[2])

      if (!context || isNaN(context)) continue

      finalObj.graphics.glVersion.using = context
    }

    if (log.includes('RageDisplay_GLAD::RageDisplay_GLAD')) {
      // RageDisplay_GLAD::RageDisplay_GLAD()
      finalObj.graphics.renderer = 'glad'
      continue
    }

    if (log.includes('Renderer Found By SDL')) {
      // Renderer Found By SDL: direct3d
      const renderer = log.split(': ')[1]

      if (!renderer || finalObj.graphics.supportedRenderers.includes(renderer)) continue

      finalObj.graphics.supportedRenderers.push(renderer)
      continue
    }

    if (log.includes('SDL compiled version')) {
      // Outfox Engine: SDL compiled version: 2.28.1
      const context = log.split(': ')[2]

      if (!context) continue

      finalObj.graphics.sdl.compiled = context
      continue
    }

    if (log.includes('SDL linked version')) {
      // Outfox Engine: SDL linked version: 2.28.1
      const context = log.split(': ')[2]

      if (!context) continue

      finalObj.graphics.sdl.linked = context
      continue
    }

    // TODO: Shaders

    if (
      log.includes(':Input') &&
      log.includes(':Sound') &&
      log.includes(':Video')
    ) {
      // Unknown :Input, WaveOut :Sound, GLAD :Video, , 0.14 FPS, 1.00 av FPS, 0.00 LPS, 0 VPF, 258 MB
      const inputDrivers = log.split(' ')[0]
      const soundDrivers = log.split(' ')[2]
      const fps = log.split(' ')[7]
      const memory = log.split(' ')[16]

      if (inputDrivers && !inputDrivers.includes('Unknown')) {
        if (inputDrivers.includes('/')) {
          inputDrivers.split('/').forEach((inputDriver) => {
            if (detectedInputDrivers.includes(inputDriver)) return

            detectedInputDrivers.push(inputDriver)
          })
        } else {
          if (!detectedInputDrivers.includes(inputDrivers))
            detectedInputDrivers.push(inputDrivers)
        }
      }

      if (soundDrivers && !soundDrivers.includes('Unknown')) {
        if (soundDrivers.includes(',')) {
          soundDrivers.split(',').forEach((soundDriver) => {
            if (detectedSoundDrivers.includes(soundDriver)) return

            detectedSoundDrivers.push(soundDriver)
          })
        } else {
          if (!detectedSoundDrivers.includes(soundDrivers))
            detectedSoundDrivers.push(soundDrivers)
        }
      }

      if (fps && !isNaN(fps)) {
        recordedFPS.push(Number(fps))
      }

      if (memory && !isNaN(memory)) {
        recordedMemory.push(Number(memory))
      }

      continue
    }

    if (log.includes('OpenGL Line width range')) {
      // OpenGL Line width range: Min=1.00, Max=8191.00
      const min = log.split(': ')[1]?.split(',')[0]?.split('=')[1]
      const max = log.split(': ')[1]?.split(',')[1]?.split('=')[1]

      finalObj.graphics.lineWidth = [min, max]
    }

    if (log.includes('OpenGL Point size range')) {
      // OpenGL Point size range: Min=1.00, Max=63.00
      const min = log.split(': ')[1]?.split(',')[0]?.split('=')[1]
      const max = log.split(': ')[1]?.split(',')[1]?.split('=')[1]

      finalObj.graphics.pointSize = [min, max]
      continue
    }

    if (log.includes('Current video driver')) {
      // Current video driver: ATI Technologies Inc. - Radeon RX560XT Series
      const driver = log.split(': ')[1]

      if (!driver) continue

      finalObj.graphics.currentVideoDriver = driver
      continue
    }

    if (log.includes('OutFox Engine: Opening device')) {
      // OutFox Engine: Opening device 'Teclado'
      const deviceName = log.split(' ').at(-1)?.replace(/'/g, '')

      if (!deviceName || finalObj.devices.includes(deviceName)) continue

      finalObj.devices.push(deviceName)
      continue
    }

    if (log.includes('Loading screen:')) {
      // Loading screen: "ScreenSystemLayer"
      const screenName = log.split(': ')[1]?.replace(/"/g, '')

      finalObj.lastSeenScreen = screenName
      continue
    }

    if (log.includes('Game Seed set to')) {
      // Game Seed set to 699776445
      const seed = Number(log.split(' ').at(-1))

      if (!seed || isNaN(seed)) continue

      finalObj.seeds.game.push(seed)
      continue
    }

    if (log.includes('Stage Seed set to')) {
      // Stage Seed set to 1855629488
      const seed = Number(log.split(' ').at(-1))

      if (!seed || isNaN(seed)) continue

      finalObj.seeds.stage.push(seed)
      continue
    }

    if (log.startsWith('Found') && log.includes('songs in')) {
      // Found 389 songs in 2.831416 seconds.
      const timeTook = log.split(' ').at(-2)

      if (!timeTook) continue

      finalObj.songs.timeToLoad = String(Number(timeTook).toFixed(2))
      continue
    }
  }

  finalObj.inputDrivers = detectedInputDrivers
  finalObj.soundDrivers = detectedSoundDrivers

  finalObj.performance.FPS.average = average(recordedFPS).toFixed(2)
  finalObj.performance.FPS.highest = Math.max(...recordedFPS)
  finalObj.performance.FPS.lowest = Math.min(...recordedFPS)

  finalObj.performance.memory.average = average(recordedMemory).toFixed(2)
  finalObj.performance.memory.highest = Math.max(...recordedMemory)
  finalObj.performance.memory.lowest = Math.min(...recordedMemory)

  return finalObj
}

const multilineResume = (mainKey, obj) => {
  const keys = Object.keys(obj)
  const values = Object.values(obj)
  let finalString = `- ${mainKey}:`

  for (let i = 0; i < keys.length; i++) {
    finalString += `\n  - ${keys[i]}: ${
      Array.isArray(values[i]) ? values[i].join(', ') : values[i]
    }`
  }

  return finalString
}

const inlineResume = (mainKey, obj) => {
  const keys = Object.keys(obj)
  const values = Object.values(obj)
  let finalString = `- ${mainKey}:`

  for (let i = 0; i < keys.length; i++) {
    if (i !== 0) finalString += ' |'
    finalString += ` ${keys[i]}: ${
      typeof values[i] === 'string' || typeof values[i] === 'number'
        ? values[i]
        : values[i].join(', ')
    }`
  }

  return finalString
}

const resumeLog = (logObj) => {
  let finalString = '## Main Log Overview\n\n'

  finalString += '### Graphics\n\n'

  // ### Graphics

  finalString += multilineResume('Video Driver', {
    'Current Driver': logObj.graphics.currentVideoDriver || '**Not detected**',
    'Last Driver': logObj.graphics.lastSeenVideoDriver || '**Not detected**',
  })

  finalString += '\n'

  finalString += `- Renderer: ${logObj.graphics.renderer || '**Not detected**'}`

  finalString += '\n'

  finalString += `- Supported Renderers: ${
    logObj.graphics.supportedRenderers?.join(', ') || '**Not detected**'
  }`

  finalString += '\n'

  finalString += inlineResume('SDL', logObj.graphics.sdl)

  finalString += '\n'

  finalString += inlineResume('glVersion', logObj.graphics.glVersion)

  finalString += '\n'

  finalString += inlineResume('Line Width', {
    Min: logObj.graphics.lineWidth[0],
    Max: logObj.graphics.lineWidth[1],
  })

  finalString += '\n'

  finalString += inlineResume('Points Size', {
    Min: logObj.graphics.pointSize[0],
    Max: logObj.graphics.pointSize[1],
  })

  // ### Game

  finalString += '\n\n### Game\n\n'

  finalString += `- Game Properly Closed: ${logObj.properClose ? 'Yes' : 'No'}`

  finalString += '\n'

  finalString += `- Devices: ${
    logObj.devices?.join(', ') || '**Not detected**'
  }`

  finalString += '\n'

  finalString += `- Discord SDK Started: ${
    logObj.discordSDKStarted ? 'Yes' : 'No'
  }`

  finalString += '\n'

  finalString += `- Input Drivers: ${
    logObj.inputDrivers?.join(', ') || '**Not detected**'
  }`

  finalString += '\n'

  finalString += `- Sound Drivers: ${
    logObj.soundDrivers?.join(', ') || '**Not detected**'
  }`

  finalString += '\n'

  finalString += inlineResume('FPS', logObj.performance.FPS)

  finalString += '\n'

  finalString += inlineResume('Memory', logObj.performance.memory)

  finalString += ' (MB)\n'

  finalString += multilineResume('Seeds', logObj.seeds)

  finalString += '\n'

  const filteredNoteskins = logObj.noteskins.filter(
    (localNoteskin) => !defaultNoteskins.includes(localNoteskin)
  )

  finalString += `- Noteskins: ${
    filteredNoteskins.join(', ') || 'No additional noteskins detected.'
  }`

  const missingDefaultNoteskins = findMissingElements(
    logObj.noteskins,
    defaultNoteskins
  )

  if (missingDefaultNoteskins.length > 0) {
    finalString += ` | **Those default noteskins are missing**: ${missingDefaultNoteskins.join(
      ', '
    )}`
  }

  finalString += '\n'

  let songsToShow = ''

  const packNames = Object.keys(logObj.songs.packs)
  const packValues = Object.values(logObj.songs.packs)
  let detectedSongs = 0
  let loadedSongs = 0
  for (let i = 0; i < packNames.length; i++) {
    const currentPackValue = packValues[i]

    if (packNames[i] === 'AdditionalSongs') continue

    detectedSongs += currentPackValue.detected
    loadedSongs += currentPackValue.loaded
    if (currentPackValue.detected === currentPackValue.loaded) continue

    songsToShow += `\n    ${inlineResume(packNames[i], currentPackValue)} (${
      currentPackValue.loaded - currentPackValue.detected
    })`
  }

  finalString += multilineResume('Songs', {
    'Seconds to Load': logObj.songs.timeToLoad,
    'Faulty Packs': songsToShow,
    Overview: `A total of ${detectedSongs} songs were detected and ${loadedSongs} loaded.`
  })

  // ### Theme

  finalString += '\n\n### Theme\n\n'

  finalString += `- Theme: ${logObj.themes.join(', ') || '**Not Detected**'}`

  finalString += '\n'

  finalString += `- Languages: ${
    logObj.languages.join(', ') || '**Not Detected**'
  }`

  return finalString
}


exports.parseLog = parseLog
exports.resumeLog = resumeLog