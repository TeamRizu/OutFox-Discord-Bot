const jimp = require("jimp");
const path = require("path");
const fallbackNoteskin = require("../../common/common/config.js").config;

function laneGraphicName(mode, style, lane) {
  switch (mode) {
    case 'techno': {
      switch (style) {
        case 'single4': {
          return ['left', 'down', 'down', 'left'][lane]
        }
        case 'single5': {
          return ['downleft', 'upleft', 'center', 'upleft', 'downleft'][lane]
        }
        case 'single8': {
          return ['downleft', 'left', 'upleft', 'down', 'down', 'upleft', 'left', 'downleft'][lane]
        }
        case 'single9': {
          return ['downleft', 'left', 'upleft', 'down', 'center', 'down', 'upleft', 'left', 'downleft'][lane]
        }
        case 'double4': {
          return ['left', 'down', 'down', 'left', 'left', 'down', 'down', 'left'][lane]
        }
        case 'double5': {
          return ['downleft', 'upleft', 'center', 'upleft', 'downleft', 'downleft', 'upleft', 'center', 'upleft', 'downleft'][lane]
        }
        case 'double8': {
          return ['downleft', 'left', 'upleft', 'down', 'down', 'upleft', 'left', 'downleft', 'downleft', 'left', 'upleft', 'down', 'down', 'upleft', 'left', 'downleft'][lane]
        }
        case 'double9': {
          return ['downleft', 'left', 'upleft', 'down', 'center', 'down', 'upleft', 'left', 'downleft', 'downleft', 'left', 'upleft', 'down', 'center', 'down', 'upleft', 'left', 'downleft'][lane]
        }
      }
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
    coloredTapNotes: false,
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
    lift: true,
    liftHold: true,
    liftRoll: false,
  },
  measurements: (
    asset,
    timing,
    endChar,
    notetype,
    lane,
    styleconfig,
    style,
    mode
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
      case 'holdTop': {
        return {
          width: 64,
          height: 32
        }
      }
      case 'holdBody': {
        return {
          width: 64,
          height: 32
        }
      }
      case 'holdBottom': {
        return {
          width: 64,
          height: 32
        }
      }
      case 'rollTop': {
        return {
          width: 64,
          height: 32
        }
      }
      case 'rollBody': {
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
  collectAsset: async (asset, timing, endChar, notetype, lane, styleconfig, style, mode) => {
    switch (asset) {
      case 'fake': {
        const note = await jimp.read(
          path.join(__dirname, `/tap/${laneGraphicName(mode, style, lane)}.png`)
        );

        note.rotate(styleconfig.noteRotation[lane], false);
        note.resize(64, 64);

        return note;
      }
      case "tapNote": {
        const note = await jimp.read(
          path.join(__dirname, `/tap/${laneGraphicName(mode, style, lane)}.png`)
        );

        note.rotate(styleconfig.noteRotation[lane], false);
        note.resize(64, 64);

        return note;
      }
      case "lift": {
        const lift = await jimp.read(path.join(__dirname, `/lift/${laneGraphicName(mode, style, lane)}.png`));

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
        const liftRoll = await jimp.read(path.join(__dirname, "/liftHold.png")); // Intentional use of LiftHold.

        liftRoll.resize(64, 64);

        return liftRoll;
      }
      case 'holdTop': {
        const holdTop = await jimp.read(path.join(__dirname, "/holdTop.png"))

        holdTop.resize(64, 32)

        return holdTop
      }
      case 'holdBody': {
        const holdBody = await jimp.read(path.join(__dirname, "/holdBody.png"))

        return holdBody
      }
      case 'holdBottom': {
        const holdBottom = await jimp.read(path.join(__dirname, "/holdBottom.png"))

        holdBottom.resize(64, 32)

        return holdBottom
      }
      case 'rollTop': {
        const rollTop = await jimp.read(path.join(__dirname, "/rollTop.png"))

        rollTop.resize(64, 32)

        return rollTop
      }
      case 'rollBody': {
        const rollBody = await jimp.read(path.join(__dirname, "/rollBody.png"))

        return rollBody
      }
      case 'rollBottom': {
        const rollBottom = await jimp.read(path.join(__dirname, "/rollBottom.png"))

        rollBottom.resize(64, 32)

        return rollBottom
      }
      case "mine": {
        const mine = await jimp.read(path.join(__dirname, "/mine.png"));

        mine.rotate(55, false)
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
