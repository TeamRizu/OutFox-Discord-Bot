const jimp = require("jimp");
const path = require("path");
const fallbackNoteskin = require("../../common/common/config.js").config;

const guessGraphicFolder = (lane, style) => {
  switch (style) {
    case 'double6': {
      return ['tap', 'center', 'tap', 'tap', 'center', 'tap'][lane]
    }
    case 'double10': {
      return [2,7].includes(lane) ? 'center' : 'tap'
    }
    default: {
      return lane === 2 ? 'center' : 'tap'
    }
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
    mine: true,
    minefieldTop: true,
    minefieldBody: true,
    minefieldBottom: true,
    holdTop: true,
    holdBody: true,
    holdBottom: true,
    rollTop: true,
    rollBody: true,
    rollBottom: true,
    tapNotes: true,
    lift: true,
    liftHold: true,
    liftRoll: true,
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
      case 'lift': {
        return {
          width: 64,
          height: 64
        }
      }
      case 'liftHold': {
        return {
          width: 32,
          height: 32
        }
      }
      case 'liftRoll': {
        return {
          width: 32,
          height: 32
        }
      }
      case 'holdTop': {
        return {
          width: 64,
          height: 32
        }
      }
      case 'holdBody': {
        return {
          width: 128,
          height: 64
        }
      }
      case 'holdBottom': {
        return {
          width: 64,
          height: 32
        }
      }
      case "rollTop": {
        return {
          width: 64,
          height: 32
        }
      }
      case 'rollBody': {
        return {
          width: 128,
          height: 64
        }
      }
      case 'rollBottom': {
        return {
          width: 64,
          height: 32
        }
      }
      case 'mine': {
        return {
          width: 64,
          height: 64
        }
      }
      case 'mineTop': {
        return {
          width: 64,
          height: 32
        }
      }
      case 'mineBody': {
        return {
          width: 128,
          height: 64
        }
      }
      case 'mineBottom': {
        return {
          width: 64,
          height: 32
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
          path.join(__dirname, `/${guessGraphicFolder(lane, style)}/${timing}${endChar}.png`)
        );

        note.rotate(styleconfig.noteRotation[lane], false);
        note.resize(64, 64);

        return note;
      }
      case "tapNote": {
        const note = await jimp.read(
          path.join(__dirname, `/${guessGraphicFolder(lane, style)}/${timing}${endChar}.png`)
        );

        note.rotate(styleconfig.noteRotation[lane], false);
        note.resize(64, 64);

        return note;
      }
      case "lift": {
        const lift = await jimp.read(path.join(__dirname, `/${guessGraphicFolder(lane, style)}/lift.png`));

        lift.rotate(styleconfig.noteRotation[lane], false);
        lift.resize(64, 64);

        return lift;
      }
      case "liftHold": {
        const liftHold = await jimp.read(path.join(__dirname, "/liftHold.png"));

        liftHold.resize(32, 32);

        return liftHold;
      }
      case "liftRoll": {
        const liftRoll = await jimp.read(path.join(__dirname, "/liftRoll.png"));

        liftRoll.resize(32, 32);

        return liftRoll;
      }
      case "mineTop": {
        const mineTop = await jimp.read(path.join(__dirname, "/mineTop.png"));

        mineTop.resize(64, 32);

        return mineTop;
      }
      case "mineBody": {
        const mineBody = await jimp.read(path.join(__dirname, "/mineBody.png"));

        return mineBody;
      }
      case "mineBottom": {
        const mineBottom = await jimp.read(
          path.join(__dirname, "/mineBottom.png")
        );

        mineBottom.resize(64, 32);

        return mineBottom;
      }
      case "mine": {
        const mine = await jimp.read(path.join(__dirname, "/mine.png"));

        mine.resize(64, 64);

        return mine;
      }
      case 'holdTop': {
        const holdTop = await jimp.read(path.join(__dirname, "/holdTop.png"));

        holdTop.resize(64, 32)

        return holdTop
      }
      case 'holdBody': {
        const holdBody = await jimp.read(path.join(__dirname, "/holdBody.png"));

        return holdBody
      }
      case 'holdBottom': {
        const holdBottom = await jimp.read(path.join(__dirname, "/holdBottom.png"));

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
