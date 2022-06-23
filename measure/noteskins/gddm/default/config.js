const jimp = require('jimp');
const path = require('path');
const fallbackNoteskin = require('../../common/common/config.js').config;

const guessGraphicFolder = (lane, style) => {
  switch (style) {
    case 'old':
      return ['hat', 'note4', 'top foot', 'note5', 'note7', 'crash'][lane];
    case 'new':
      return ['note1', 'hat', 'hi foot', 'note4', 'note5', 'top foot', 'note7', 'note8', 'crash'][lane];
    default: {
      return ['note1', 'hat', 'hi foot', 'note4', 'note5', 'top foot', 'note7', 'note8', 'crash', 'note10'][lane];
    }
  }
};

const noteWidth = () => {
  return 64;
};

const noteHeight = (laneName) => {
  return laneName.includes('note') ? 12 : 64;
};

const applyColor = (laneName, note) => {
  switch (laneName) {
    case 'note1':
      note.color([{ apply: 'red', params: ['255'] }])
      note.color([{ apply: 'blue', params: ['255'] }])
    break
    case 'crash':
    case 'hat':
      note.color([{ apply: 'green', params: ['255'] }])
      note.color([{ apply: 'blue', params: ['255'] }])
    break
    case 'hi foot':
      note.color([{ apply: 'red', params: ['255'] }])
      note.color([{ apply: 'blue', params: ['255'] }])

      note.color([{ apply: 'darken', params: ['20'] }])
    break
    case 'note4':
      note.color([{ apply: 'red', params: ['255'] }])
      note.color([{ apply: 'green', params: ['255'] }])
    break
    case 'note5':
      note.color([{ apply: 'green', params: ['255'] }])
    break
    case 'top foot':
      note.color([{ apply: 'red', params: ['128'] }])
      note.color([{ apply: 'blue', params: ['128'] }])

      note.color([{ apply: 'darken', params: ['30'] }])

    break
    case 'note7':
      note.color([{ apply: 'red', params: ['255'] }])
    break
    case 'note8':
      note.color([{ apply: 'red', params: ['255'] }])
      note.color([{ apply: 'green', params: ['165'] }])
    break
    case 'note10':
      note.color([{ apply: 'green', params: ['255'] }])
      note.color([{ apply: 'brighten', params: ['30'] }])
    break
  }

  note.color([{ apply: 'darken', params: ['20'] }])

  return note
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
          width: noteWidth(),
          height: noteHeight(guessGraphicFolder(lane, style))
        };
      }
      case 'tapNote': {
        return {
          width: noteWidth(),
          height: noteHeight(guessGraphicFolder(lane, style))
        };
      }
      case 'holdBody': {
        if (['open', 'wail'].includes(guessGraphicFolder(lane, style))) {
          return fallbackNoteskin.measurements(asset, timing, endChar, notetype, lane, styleconfig, style);
        }

        return {
          width: noteWidth(),
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
        const note = await jimp.read(path.join(__dirname, `/tap.png`));

        note.resize(noteWidth(), noteHeight(guessGraphicFolder(lane, style)));
        applyColor(guessGraphicFolder(lane, style), note)

        return note;
      }
      case 'tapNote': {
        const graphicFolder = guessGraphicFolder(lane, style)
        const isFoot = graphicFolder.includes('foot')
        if (!graphicFolder.includes('note')) {
          const extra = await jimp.read(path.join(__dirname, `/${isFoot ? 'foot' : graphicFolder}.png`));
          const note = await jimp.read(path.join(__dirname, `/tap.png`));

          note.resize(noteWidth(), 12);
          applyColor(guessGraphicFolder(lane, style), note)

          if (graphicFolder.includes('hi')) {
            extra.flip(true, false)
            extra.rotate(20, false)
          }

          if (graphicFolder.includes('top')) {
            extra.rotate(340, false)
          }

          if (graphicFolder === 'crash') {
            extra.flip(true, false)
          }

          extra.resize(noteWidth(), noteHeight(graphicFolder));
          applyColor(graphicFolder, extra)

          extra.blit(note, 0, 28)

          return extra
        }

        const note = await jimp.read(path.join(__dirname, `/tap.png`));

        note.resize(noteWidth(), noteHeight(graphicFolder));
        applyColor(graphicFolder, note)

        return note;
      }
      case 'holdBottom': {
        const blank = await jimp.read(path.join(__dirname, `/_blank.png`))

        return blank
      }
      default:
        return fallbackNoteskin.collectAsset(asset, timing, endChar, notetype, lane, styleconfig);
    }
  }
};

exports.config = config;
