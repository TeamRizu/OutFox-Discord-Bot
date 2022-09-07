const jimp = require("jimp");
const path = require("path");
const fallbackNoteskin = require("../../common/common/config.js").config;

const guessGraphicFolder = (lane, style) => {
  switch (style) {
    case 'single': {
      return ['upLeft', 'handUp', 'footDown', 'handUp', 'upLeft'][lane]
    }
    case 'real': {
      return ['upLeft', 'handLr', 'handUp', 'footDown', 'handUp', 'handLr', 'upLeft'][lane]
    }
    default: // double
      return ['upLeft', 'handUp', 'footDown', 'handUp', 'upLeft',        'upLeft', 'handUp', 'footDown', 'handUp', 'upLeft'][lane]
  }
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
    uniqueFakes: false,
  },
  supports: {
    mine: false,
    minefieldTop: false,
    minefieldBody: false,
    minefieldBottom: false,
    holdTop: true,
    holdBody: true,
    holdBottom: true,
    rollTop: true,
    rollBody: true,
    rollBottom: true,
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
          width: 64,
          height: 64
        }
      }
      case 'tapNote': {
        return {
          width: 64,
          height: 64
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
  collectAsset: async (asset, timing, endChar, notetype, lane, styleconfig, style) => {
    switch (asset) {
      case 'fake': {
        const note = await jimp.read(
          path.join(__dirname, `/${guessGraphicFolder(lane, style)}/tap.png`)
        );

        note.rotate(styleconfig.noteRotation[lane], false);
        note.resize(64, 64);

        return note;
      }
      case "tapNote": {
        const note = await jimp.read(
          path.join(__dirname, `/${guessGraphicFolder(lane, style)}/tap.png`)
        );

        note.rotate(styleconfig.noteRotation[lane], false); // Fix timing notes res
        note.resize(64, 64);

        return note;
      }
      case 'holdTop': {
        const holdTop = await jimp.read(path.join(__dirname, `${guessGraphicFolder(lane, style)}//holdTop.png`));

        holdTop.resize(64, 32)

        return holdTop
      }
      case 'holdBody': {
        const holdBody = await jimp.read(path.join(__dirname, `${guessGraphicFolder(lane, style)}//holdBody.png`));

        return holdBody
      }
      case 'holdBottom': {
        const holdBottom = await jimp.read(path.join(__dirname, `${guessGraphicFolder(lane, style)}//holdBottom.png`));

        holdBottom.resize(64, 32)

        return holdBottom
      }
      case 'rollTop': {
        const rollTop = await jimp.read(path.join(__dirname, "/rollTop.png"));

        rollTop.resize(64, 32)

        return rollTop
      }
      case 'rollBody': {
        const rollBody = await jimp.read(path.join(__dirname, "/rollBody.png"));

        return rollBody
      }
      case 'rollBottom': {
        const rollBottom = await jimp.read(path.join(__dirname, "/rollBottom.png"));

        rollBottom.resize(64, 32)

        return rollBottom
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



/*

single

red blue yellow blue red

topleft ball down(center?) ball topright


real

red green blue yellow blue green red

topleft greenball blueball yellow blueball greenball topright


double

topleft ball yellow blue topright topleft ball yellow blue topright 

topleft ball down(center?) ball topright topleft ball down(center?) ball topright
*/