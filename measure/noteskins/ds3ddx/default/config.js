const jimp = require("jimp");
const path = require("path");
const fallbackNoteskin = require("../../common/common/config.js").config;

const laneName = (curStyle, curLane) => {
  switch (curStyle) {
    default:
      return ['HandLeft', 'FootDownLeft', 'FootUpLeft', 'HandDown', 'HandDown', 'FootUpLeft', 'FootDownLeft', 'HandLeft'][curLane]
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
      case 'holdTop': {
        return {
          width: 64,
          height: 64
        }
      }
      case 'holdBody': {
        return {
          width: 64,
          height: 64
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
          height: 64
        }
      }
      case 'rollBottom': {
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
          path.join(__dirname, `/tap/${laneName(style, lane)}.png`)
        );

        note.rotate(styleconfig.noteRotation[lane], false);
        note.resize(64, 64);

        return note;
      }
      case "tapNote": {
        const note = await jimp.read(
          path.join(__dirname, `/tap/${laneName(style, lane)}.png`)
        );

        note.rotate(styleconfig.noteRotation[lane], false);
        note.resize(64, 64);

        return note;
      }
      case "holdTop": {
        const holdTop = await jimp.read(path.join(__dirname, `/holdTop/${laneName(style, lane)}.png`));

        holdTop.resize(64, 64);

        if ([5, 6].includes(lane)) {
          holdTop.flip(false, true)
          holdTop.rotate(180)
        }

        return holdTop;
      }
      case "holdBody": {
        const body = await jimp.read(path.join(__dirname, `/holdBody/${laneName(style, lane)}.png`));

        // Resizing hold/roll bodies are not done here.

        return body;
      }
      case "holdBottom": {
        const bottom = await jimp.read(path.join(__dirname, `/holdBottom/${laneName(style, lane)}.png`));

        bottom.resize(64, 64);

        if ([5, 6].includes(lane)) {
          bottom.flip(false, true)
          bottom.rotate(180)
        }

        return bottom;
      }
      case "rollTop": {
        const rollTop = await jimp.read(path.join(__dirname, `/rollTop/${laneName(style, lane)}.png`));

        rollTop.resize(64, 64);
        if ([5, 6].includes(lane)) {
          rollTop.flip(false, true)
          rollTop.rotate(180)
        }

        return rollTop;
      }
      case "rollBody": {
        const body = await jimp.read(path.join(__dirname, `/rollBody/${laneName(style, lane)}.png`));

        // Resizing hold/roll bodies are not done here.

        return body;
      }
      case "rollBottom": {
        const bottom = await jimp.read(path.join(__dirname, `/rollBottom/${laneName(style, lane)}.png`));

        bottom.resize(64, 64);

        if ([5, 6].includes(lane)) {
          bottom.flip(false, true)
          bottom.rotate(180)
        }

        return bottom;
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
