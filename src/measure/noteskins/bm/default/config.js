const jimp = require("jimp");
const path = require("path");
const fallbackNoteskin = require("../../common/common/config.js").config;

const guessGraphicFolder = (lane, style) => {
  switch (style) {
    case 'double7': {
      return ["red", 'white', 'blue', 'white', 'blue', 'white', 'blue', 'white',    "white", "blue", "white", "blue", "white", "blue", "white", "red"][lane]
    }
    case 'single7': {
      return ["red", 'white', 'blue', 'white', 'blue', 'white', 'blue', 'white'][lane]
    }
    case 'double5': {
      return ["white", "blue", "white", "blue", "white", "red",  "white", "blue", "white", "blue", "white", "red"][lane]
    }
    default: {
      return ["white", "blue", "white", "blue", "white", "red"][lane];
    }
  }
};

const noteWidth = (laneName) => {
  switch (laneName) {
    case 'red':
      return 60;
    case 'blue':
      return 28;
    default:
      return 36;
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
    uniqueFakes: false,
  },
  supports: {
    mine: true,
    minefieldTop: false,
    minefieldBody: false,
    minefieldBottom: false,
    holdTop: true,
    holdBody: true,
    holdBottom: true,
    rollTop: false,
    rollBody: false,
    rollBottom: false,
    tapNotes: true,
    lift: false,
    liftHold: false,
    liftRoll: false,
  },
  measurements: (
    asset,
    timing,
    endChar,
    notetype,
    lane,
    styleconfig,
    style
  ) => {
    switch (asset) {
      case 'fake': {
        return {
          width: noteWidth(guessGraphicFolder(lane, style)),
          height: 12
        }
      }
      case 'tapNote': {
        return {
          width: noteWidth(guessGraphicFolder(lane, style)),
          height: 12
        }
      }
      case 'mine': {
        return {
          width: noteWidth(guessGraphicFolder(lane, style)),
          height: 12
        }
      }
      case 'holdTop': {
        return {
          width: noteWidth(guessGraphicFolder(lane, style)),
          height: 12
        }
      }
      case 'holdBody': {
        return {
          width: 64 + noteWidth(guessGraphicFolder(lane, style)),
          height: 1
        }
      }
      case 'holdBottom': {
        return {
          width: noteWidth(guessGraphicFolder(lane, style)),
          height: 12
        }
      }
      default:
        return fallbackNoteskin.measurements(asset, timing, endChar, notetype, lane, styleconfig, style)
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
  collectAsset: async (
    asset,
    timing,
    endChar,
    notetype,
    lane,
    styleconfig,
    style
  ) => {
    switch (asset) {
      case "fake": {
        const note = await jimp.read(
          path.join(__dirname, `/${guessGraphicFolder(lane, style)}/tap.png`)
        );

        note.resize(noteWidth(guessGraphicFolder(lane, style)), 12);

        return note;
      }
      case "tapNote": {
        const note = await jimp.read(
          path.join(__dirname, `/${guessGraphicFolder(lane, style)}/tap.png`)
        );

        note.resize(noteWidth(guessGraphicFolder(lane, style)), 12);

        return note;
      }
      case "mine": {
        const mine = await jimp.read(
          path.join(__dirname, `/${guessGraphicFolder(lane, style)}/mine.png`)
        );

        mine.resize(noteWidth(guessGraphicFolder(lane, style)), 12);

        return mine;
      }
      case "holdTop": {
        const holdTop = await jimp.read(path.join(__dirname, "/_blank.png"));

        return holdTop;
      }
      case "holdBody": {
        const holdBody = await jimp.read(
          path.join(__dirname, `/${guessGraphicFolder(lane, style)}/hold.png`)
        );

        return holdBody;
      }
      case "holdBottom": {
        const holdBottom = await jimp.read(path.join(__dirname, "/_blank.png"));

        return holdBottom;
      }
      default:
        return fallbackNoteskin.collectAsset(
          asset,
          timing,
          endChar,
          notetype,
          lane,
          styleconfig
        );
    }
  },
};

exports.config = config;
