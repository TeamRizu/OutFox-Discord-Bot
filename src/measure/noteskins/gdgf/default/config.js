const jimp = require('jimp');
const path = require('path');
const fallbackNoteskin = require('../../common/common/config.js').config;

const guessGraphicFolder = (lane, style) => {
  switch (style) {
    case 'bass-three':
    case 'three':
      return ['fret1', 'fret2', 'fret3', 'open', 'wail'][lane];
    case 'bass-six':
    case 'six':
      return ['fret1', 'fret2', 'fret3', 'fret4', 'fret5', 'fret6', 'open', 'wail'][lane];
    default: { // five/bass-five
      return ['fret1', 'fret2', 'fret3', 'fret4', 'fret5', 'open', 'wail'][lane];
    }
  }
};

const noteWidth = (laneName, style, fromSelf = true) => {
  switch (laneName) {
    case 'open':
      const width = {
        'bass-three': 192,
        three: 192,
        'bass-six': 384,
        six: 384,
        'bass-five': 320,
        five: 320
      }
      return width[style] + (fromSelf ? 0 : 64);
    default:
      return fromSelf ? 64 : 128;
  }
};

const noteHeight = (laneName) => {
  switch (laneName) {
    case 'wail':
      return 64;
    default:
      return 12;
  }
};

const applyColor = (laneName, note) => {
  switch (laneName) {
    case 'wail':
      note.color([{ apply: 'green', params: ['87'] }])

      note.color([{ apply: 'darken', params: ['60'] }])
    break
    case 'fret5':
    case 'open':
      note.color([{ apply: 'red', params: ['255'] }])
      note.color([{ apply: 'blue', params: ['255'] }])

      note.color([{ apply: 'darken', params: ['20'] }])
    break
    case 'fret1':
      note.color([{ apply: 'red', params: ['255'] }])
      note.color([{ apply: 'darken', params: ['20'] }])
    break
    case 'fret2':
      note.color([{ apply: 'green', params: ['255'] }])

      note.color([{ apply: 'darken', params: ['20'] }])
    break
    case 'fret3':
      note.color([{ apply: 'blue', params: ['255'] }])

      note.color([{ apply: 'darken', params: ['20'] }])
    break
    case 'fret4':
      note.color([{ apply: 'red', params: ['255'] }])
      note.color([{ apply: 'green', params: ['255'] }])

      note.color([{ apply: 'darken', params: ['20'] }])
    break
    case 'fret6':
      note.color([{ apply: 'green', params: ['255'] }])
      note.color([{ apply: 'blue', params: ['255'] }])

      note.color([{ apply: 'darken', params: ['20'] }])
    break
  }

  return note
}
const config = {
  features: {
    coloredMine: false,
    coloredHoldTop: false,
    coloredHoldBody: false,
    coloredHoldBottom: false,
    coloredRollTop: false,
    coloredRollBody: false,
    coloredRollBottom: false,
    coloredTapNotes: true,
    coloredLifts: false,
    coloredMinefieldTop: false,
    coloredMinefieldBody: false,
    coloredMinefieldBottom: false,
    coloredLiftHold: false,
    coloredLiftRoll: false,
    noteRotationPerLane: true,
    uniqueFakes: false
  },
  supports: {
    mine: false,
    minefieldTop: false,
    minefieldBody: false,
    minefieldBottom: false,
    holdTop: false,
    holdBody: true,
    holdBottom: false,
    rollTop: false,
    rollBody: false,
    rollBottom: false,
    tapNotes: true,
    lift: false,
    liftHold: false,
    liftRoll: false
  },
  measurements: (asset, timing, endChar, notetype, lane, styleconfig, style) => {
    switch (asset) {
      case 'fake': {
        return {
          width: noteWidth(guessGraphicFolder(lane, style), style, false),
          height: noteHeight(guessGraphicFolder(lane, style))
        };
      }
      case 'tapNote': {
        return {
          width: noteWidth(guessGraphicFolder(lane, style), style, false),
          height: noteHeight(guessGraphicFolder(lane, style))
        };
      }
      case 'holdBody': {
        if (['open', 'wail'].includes(guessGraphicFolder(lane, style))) {
          return fallbackNoteskin.measurements(asset, timing, endChar, notetype, lane, styleconfig, style);
        }

        return {
          width: noteWidth(guessGraphicFolder(lane, style), style, false),
          height: 64
        };
      }
      default:
        return fallbackNoteskin.measurements(asset, timing, endChar, notetype, lane, styleconfig, style);
    }
  },
  fallbackNoteskin,
  /**
   *
   * @param {'tapNote' | 'lift' | 'holdTop' | 'holdBody' | 'holdBottom' | 'rollTop' | 'rollBody' | 'rollBottom' | 'mine' | 'mineTop' | 'mineBody' | 'mineBottom'} asset
   * @param {4 | 8 | 12 | 16 | 24 | 32 | 48 | 64 | 192} timing
   * @param {'th' | 'nd'} endChar
   * @param {'1' | '2' | '3' | '4' | 'DL' | 'DM' | 'F' | 'L'} notetype
   * @param {number} lane
   * @returns {Promise<any>}
   */
  collectAsset: async (asset, timing, endChar, notetype, lane, styleconfig, style) => {
    switch (asset) {
      case 'fake': {
        const type = guessGraphicFolder(lane, style).includes('fret') ? 'tap' : guessGraphicFolder(lane, style)
        const note = await jimp.read(path.join(__dirname, `/${type}.png`));

        note.resize(noteWidth(guessGraphicFolder(lane, style), style), noteHeight(guessGraphicFolder(lane, style)));
        applyColor(guessGraphicFolder(lane, style), note)

        return note;
      }
      case 'tapNote': {
        const type = guessGraphicFolder(lane, style).includes('fret') ? 'tap' : guessGraphicFolder(lane, style)
        const note = await jimp.read(path.join(__dirname, `/${type}.png`));

        note.resize(noteWidth(guessGraphicFolder(lane, style), style), noteHeight(guessGraphicFolder(lane, style)));
        applyColor(guessGraphicFolder(lane, style), note)

        return note;
      }
      case 'holdBody': {
        if (['open', 'wail'].includes(guessGraphicFolder(lane, style))) {
          return fallbackNoteskin.collectAsset(asset, timing, endChar, notetype, lane, styleconfig);
        }

        const holdBody = await jimp.read(path.join(__dirname, `/body/${guessGraphicFolder(lane, style)}.png`));

        return holdBody;
      }
      case 'holdBottom': {
        const blank = await jimp.read(path.join(__dirname, `/_blank.png`))

        return blank
      }
      default:
        return fallbackNoteskin.collectAsset(asset, timing, endChar, notetype, lane, styleconfig);
    }
  }
};

exports.config = config;
