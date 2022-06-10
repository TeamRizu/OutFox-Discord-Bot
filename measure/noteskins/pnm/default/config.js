const jimp = require("jimp");
const path = require("path");
const fallbackNoteskin = require("../../common/common/config.js").config;

function laneGraphicName(style, lane) {
  switch (style) {
    case 'three': {
      return ['white', 'yellow', 'green'][lane]
    }
    case 'four': {
      return ['red', 'blue', 'yellow', 'green'][lane]
    }
    case 'five': {
      return ['green', 'blue', 'red', 'blue', 'green'][lane]
    }
    case 'seven': {
      return ['yellow', 'green', 'blue', 'red', 'blue', 'green', 'yellow'][lane]
    }
    case 'nine': {
      return ['white', 'yellow', 'green', 'blue', 'red', 'blue', 'green', 'yellow', 'white'][lane]
    }
    case 'nine-double': {
      return ['white', 'yellow', 'green', 'blue', 'red', 'blue', 'green', 'yellow', 'white',         'white', 'yellow', 'green', 'blue', 'red', 'blue', 'green', 'yellow', 'white'][lane]
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
    mine: true,
    minefieldTop: false,
    minefieldBody: false,
    minefieldBottom: false,
    holdTop: false,
    holdBody: true,
    holdBottom: false,
    rollTop: false,
    rollBody: true,
    rollBottom: false,
    tapNotes: true,
    lift: false,
    liftHold: false,
    liftRoll: false
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
          width: 28,
          height: 16
        }
      }
      case 'tapNote': {
        return {
          width: 28,
          height: 16
        }
      }
      case 'mine': {
        return {
          width: 28,
          height: 16
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
          path.join(__dirname, `/${laneGraphicName(style, lane)}/tap.png`)
        );

        note.resize(28, 16);

        return note;
      }
      case "tapNote": {
        const note = await jimp.read(
          path.join(__dirname, `/${laneGraphicName(style, lane)}/tap.png`)
        );

        note.resize(28, 16);

        return note;
      }
      case 'holdTop': {
        const holdTop = await jimp.read(
          path.join(__dirname, `/_blank.png`)
        );

        return holdTop
      }
      case 'holdBody': {
        const holdBody = await jimp.read(
          path.join(__dirname, `/${laneGraphicName(style, lane)}/hold.png`)
        );

        return holdBody
      }
      case 'holdBottom': {
        const holdBottom = await jimp.read(
          path.join(__dirname, `/_blank.png`)
        );

        return holdBottom
      }
      case 'rollTop': {
        const rollTop = await jimp.read(
          path.join(__dirname, `/_blank.png`)
        );

        return rollTop
      }
      case 'rollBody': {
        const rollBody = await jimp.read(
          path.join(__dirname, `/${laneGraphicName(style, lane)}/roll.png`)
        );

        return rollBody
      }
      case 'rollBottom': {
        const rollBottom = await jimp.read(
          path.join(__dirname, `/_blank.png`)
        );

        return rollBottom
      }
      case "mine": {
        const mine = await jimp.read(path.join(__dirname, `/${laneGraphicName(style, lane)}/mine.png`));

        mine.resize(28, 16);

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
