const jimp = require('jimp');
const path = require('path');
const fallbackNoteskin = require('../../common/common/config.js').config;

const guessGraphicFolder = (lane, style) => {
  switch (style) {
    default: { // five/bass-five
      return ['fret 1', 'fret 2', 'fret 3', 'fret 4', 'fret 5', 'strum'][lane];
    }
  }
};

const noteWidth = (laneName, style) => {
  switch (laneName) {
    case 'strum':
      return 320;
    default:
      return 64;
  }
};

const noteHeight = (laneName) => {
  switch (laneName) {
    case 'strum':
      return 8;
    default:
      return 64;
  }
};

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
          width: noteWidth(guessGraphicFolder(lane, style), style),
          height: noteHeight(guessGraphicFolder(lane, style))
        };
      }
      case 'lift': {
        return {
          width: noteWidth(guessGraphicFolder(lane, style), style),
          height: noteHeight(guessGraphicFolder(lane, style))
        };
      }
      case 'tapNote': {
        return {
          width: noteWidth(guessGraphicFolder(lane, style), style),
          height: noteHeight(guessGraphicFolder(lane, style))
        };
      }
      case 'holdBody': {

        if (guessGraphicFolder(lane, style) === 'strum') return {
          width: 160,
          height: 8
        }
        return {
          width: 26,
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
        const note = await jimp.read(path.join(__dirname, `/${guessGraphicFolder(lane, style)}/tap.png`));

        note.resize(noteWidth(guessGraphicFolder(lane, style), style), noteHeight(guessGraphicFolder(lane, style)));

        return note;
      }
      case 'tapNote': {
        const note = await jimp.read(path.join(__dirname, `/${guessGraphicFolder(lane, style)}/tap.png`));

        note.resize(noteWidth(guessGraphicFolder(lane, style), style), noteHeight(guessGraphicFolder(lane, style)));

        return note;
      }
      case 'holdBody': {
        const holdBody = await jimp.read(path.join(__dirname, `/${guessGraphicFolder(lane, style)}/holdBody.png`));

        return holdBody;
      }
      case 'holdBottom': {
        const blank = await jimp.read(path.join(__dirname, `/_blank.png`))

        return blank
      }
      case 'lift': {
        const note = await jimp.read(path.join(__dirname, `/${guessGraphicFolder(lane, style)}/hopo.png`));

        note.resize(noteWidth(guessGraphicFolder(lane, style), style), noteHeight(guessGraphicFolder(lane, style)));

        return note;
      }
      default:
        return fallbackNoteskin.collectAsset(asset, timing, endChar, notetype, lane, styleconfig);
    }
  }
};

exports.config = config;
