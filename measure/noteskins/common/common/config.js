const jimp = require("jimp");
const path = require("path");

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
    noteRotationPerLane: false,
    uniqueFakes: true,
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
    console.log(`FALLBACK MEASUREMENT | Asset: ${asset} | timing ${timing} | endChar ${endChar} | notetype ${notetype} | lane ${lane}`)
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
      case 'mine': {
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
          height: 64
        }
      }
      case 'holdBody': {
        return {
          width: 64,
          height: 128
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
          height: 64
        }
      }
      case 'rollBody': {
        return {
          width: 64,
          height: 128
        }
      }
      case 'rollBottom': {
        return {
          width: 64,
          height: 32
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
          width: 64,
          height: 128
        }
      }
      case 'mineBottom': {
        return {
          width: 64,
          height: 32
        }
      }
      default:
        return {
          width: 64,
          height: 64
        }
    }
  },
  fallbackNoteskin: null,
  /**
   *
   * @param {'tapNote' | 'lift' | 'holdTop' | 'holdBody' | 'holdBottom' | 'rollTop' | 'rollBody' | 'rollBottom' | 'mine' | 'mineTop' | 'mineBody' | 'mineBottom'} asset
   * @param {4 | 8 | 12 | 16 | 24 | 32 | 48 | 64 | 192} timing
   * @param {'th' | 'nd'} endChar
   * @param {'1' | '2' | '3' | '4' | 'DL' | 'DM' | 'F' | 'L'} notetype
   * @param {number} lane
   * @returns {Promise<any>}
   */
  collectAsset: async (asset, timing, endChar, notetype, lane, styleconfig) => {
    console.log(`FALLBACK ASSET | Asset: ${asset} | timing ${timing} | endChar ${endChar} | notetype ${notetype} | lane ${lane}`)
    switch (asset) {
      case 'fake': {
        const fake = await jimp.read(path.join(__dirname, '/fake.png'))

        return fake
      }
      case "tapNote": {
        const note = await jimp.read(path.join(__dirname, "/tapNote.png"));

        // note.resize(64, 64) Graphic is already 64x64

        return note;
      }
      case "lift": {
        const lift = await jimp.read(path.join(__dirname, "/lift.png"));

        // lift.resize(64, 64) Graphic is already 64x64

        return lift;
      }
      case "liftHold": {
        const blank = await jimp.read(path.join(__dirname, "/_blank.png"));

        blank.resize(64, 64);

        return blank;
      }
      case "liftRoll": {
        const blank = await jimp.read(path.join(__dirname, "/_blank.png"));

        blank.resize(64, 64);

        return blank;
      }
      case "holdTop": {
        const blank = await jimp.read(path.join(__dirname, "/_blank.png"));

        blank.resize(64, 64);

        return blank;
      }
      case "holdBody": {
        const body = await jimp.read(path.join(__dirname, "/holdBody.png"));

        // Resizing hold/roll bodies are not done here.

        return body;
      }
      case "holdBottom": {
        const bottom = await jimp.read(path.join(__dirname, "/holdBottom.png"));

        bottom.resize(64, 32);

        return bottom;
      }
      case "rollTop": {
        const blank = await jimp.read(path.join(__dirname, "/_blank.png"));

        blank.resize(64, 64);

        return blank;
      }
      case "rollBody": {
        const body = await jimp.read(path.join(__dirname, "/rollBody.png"));

        // Resizing hold/roll bodies are not done here.

        return body;
      }
      case "rollBottom": {
        const bottom = await jimp.read(path.join(__dirname, "/rollBottom.png"));

        bottom.resize(64, 32);

        return bottom;
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
        const blank = await jimp.read(path.join(__dirname, "/_blank.png"));

        blank.resize(64, 64);

        return blank;
    }
  },
};

exports.config = config;
