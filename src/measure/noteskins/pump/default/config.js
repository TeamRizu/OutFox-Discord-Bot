const jimp = require("jimp");
const path = require("path");
const fallbackNoteskin = require("../../common/common/config.js").config;

/**
 *
 * @param {'single' | 'halfdouble' | 'double'} [style]
 * @returns {Array<string>}
 */
 const laneNames = (style) => {
  switch (style) {
    case 'halfdouble':
      return ['center', 'upright', 'downright', 'downleft', 'upleft', 'center']
    case 'double':
      return ['downleft', 'upleft', 'center', 'upright', 'downright', 'downleft', 'upleft', 'center', 'upright', 'downright']
    default:
      return ['downleft', 'upleft', 'center', 'upright', 'downright']
  }
}

/**
 *
 * @param {number} lane
 * @param {'single' | 'halfdouble' | 'double'} [style]
 * @returns {'downleft' | 'upleft' | 'center'}
 */
function guessGraphicFolder(lane, style) {
  switch (style) {
    case 'halfdouble':
      return ['center', 'upleft', 'downleft', 'downleft', 'upleft', 'center'][lane]
    case 'double':
      const laneNum = [0,1,2,3,4][lane]
      return ["downleft", "upleft", "center", "upleft", "downleft"][laneNum]
    default:
      return ["downleft", "upleft", "center", "upleft", "downleft"][lane];
  }
}

function liftGraphicName(lane, style) {
  switch (style) {
    case 'halfdouble':
      return (lane % 5) === 0 ? 'centerLift' : 'lift'
    case 'double':
      return [0, 1, 3, 4,   5, 6, 8, 9].includes(lane) ? 'lift' : 'centerLift'
    default:
      return lane === 2 ? 'centerLift' : 'lift'
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
    minefieldTop: false,
    minefieldBody: false,
    minefieldBottom: false,
    holdTop: false,
    holdBody: true,
    holdBottom: true,
    rollTop: false,
    rollBody: true,
    rollBottom: true,
    tapNotes: true,
    lift: true,
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
      case 'lift': {
        return {
          width: 64,
          height: 64
        }
      }
      case 'holdBody': {
        return {
          width: 128,
          height: 512
        }
      }
      case 'holdBottom': {
        return {
          width: 64,
          height: 32
        }
      }
      case 'rollBody': {
        return {
          width: 128,
          height: 512
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
      case 'mineBody': {
        return {
          width: 128,
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
        const graphicFolder = guessGraphicFolder(lane, style);
        const note = await jimp.read(
          path.join(__dirname, `/${graphicFolder}/${timing}${endChar}.png`)
        );

        note.rotate(styleconfig.noteRotation[lane], false);
        note.resize(64, 64);

        return note;
      }
      case "tapNote": {
        const graphicFolder = guessGraphicFolder(lane, style);
        const note = await jimp.read(
          path.join(__dirname, `/${graphicFolder}/${timing}${endChar}.png`)
        );

        note.rotate(styleconfig.noteRotation[lane], false);
        note.resize(64, 64);

        return note;
      }
      case "lift": {
        const lift = await jimp.read(
          path.join(__dirname, `/${liftGraphicName(lane, style)}.png`)
        );

        lift.rotate(styleconfig.liftRotation[lane], false);
        lift.resize(64, 64);

        return lift;
      }
      case "holdBody": {
        const body = await jimp.read(
          path.join(__dirname, `/${laneNames(style)[lane]}HoldBody.png`)
        );

        // Resizing hold/roll bodies are not done here.

        return body;
      }
      case "holdBottom": {
        const bottom = await jimp.read(path.join(__dirname, `/${laneNames(style)[lane]}HoldBottom.png`));

        bottom.resize(64, 64);

        return bottom;
      }
      case "rollBody": {
        const body = await jimp.read(
          path.join(__dirname, `/${laneNames(style)[lane]}RollBody.png`)
        );

        // Resizing hold/roll bodies are not done here.

        return body;
      }
      case "rollBottom": {
        const bottom = await jimp.read(
          path.join(__dirname, `/${laneNames(style)[lane]}RollBottom.png`)
        );

        bottom.resize(64, 64);

        return bottom;
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
