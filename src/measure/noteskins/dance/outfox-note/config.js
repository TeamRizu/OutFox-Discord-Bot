const jimp = require("jimp");
const path = require("path");
const fallbackNoteskin = require("../default/config.js").config;

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
    holdTop: false,
    holdBody: false,
    holdBottom: false,
    rollTop: false,
    rollBody: false,
    rollBottom: false,
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
          width: 64,
          height: 64
        }
      }
      case 'liftRoll': {
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
      case 'mine': {
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
          path.join(__dirname, `/${timing}${endChar}.png`)
        );

        note.rotate(styleconfig.noteRotation[lane], false);
        note.resize(64, 64);

        return note;
      }
      case "tapNote": {
        const note = await jimp.read(
          path.join(__dirname, `/${timing}${endChar}.png`)
        );

        note.rotate(styleconfig.noteRotation[lane], false);
        note.resize(64, 64);

        return note;
      }
      case "lift": {
        const lift = await jimp.read(path.join(__dirname, `/lift.png`));

        lift.rotate(styleconfig.noteRotation[lane], false);
        lift.resize(64, 64);

        return lift;
      }
      case "liftHold": {
        const liftHold = await jimp.read(path.join(__dirname, "/liftHold.png"));

        liftHold.resize(64, 64);

        return liftHold;
      }
      case "liftRoll": {
        const liftRoll = await jimp.read(path.join(__dirname, "/liftRoll.png"));

        liftRoll.resize(64, 64);

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
      default:
        return fallbackNoteskin.collectAsset(
          asset,
          timing,
          endChar,
          notetype,
          lane,
          styleconfig,
          style
        );
    }
  },
};

exports.config = config;
