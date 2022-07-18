const jimp = require('jimp');
const NoteSkinFile = require('./noteskin.js');
const stylechart = require('./stylechart.js');
const defaultstyle = require('./defaultstyle.js');

const main = async () => {
  // Selected mode/style input
  const curMode = 'kb4';
  const curStyle = '' || defaultstyle.defaultstyle[curMode];
  const reverse = true;
  const showMeasureLines = true;

  // Noteskin
  const NoteSkin = new NoteSkinFile.NoteSkinClass(curMode, curStyle);

  // Measure Width
  const measureWidth = NoteSkin.styleconfig.measureWidth || 254;

  // Draw background
  const background = await jimp.read('bg.png');
  const canvasWidth = NoteSkin.styleconfig.canvasWidth || 342;
  const canvasHeight = NoteSkin.styleconfig.canvasHeight || 512;

  background.resize(canvasWidth, canvasHeight);

  // Color Function
  function makeIteratorThatFillsWithColor(color) {
    return function (x, y, offset) {
      this.bitmap.data.writeUInt32BE(color, offset, true);
    };
  }

  // Draw measure lines
  const cutLines = reverse ? [3, 7] : [0, 4];

  if (showMeasureLines) {
    for (let i = 0; i < 8; i++) {
      if (cutLines.includes(i)) {
        background.scan(44, 30 + 64 * i, measureWidth, 3, makeIteratorThatFillsWithColor(0xffffffff));
        background.scan(44, 31 + 64 * i, measureWidth, 3, makeIteratorThatFillsWithColor(0xffffffff));
        continue;
      }

      background.scan(44, 31 + 64 * i, measureWidth, 2, makeIteratorThatFillsWithColor(0xffffffff));
    }
  }

  const perStyleTestData = stylechart.stylechart;

  if (!perStyleTestData[curMode + '-' + curStyle]) {
    console.warn('No steps for that style!');
    return;
  }

  // Measure Data Input
  const measureData = perStyleTestData[curMode + '-' + curStyle];

  /**
   * Returns a array of all lane notetypes, each index is a string of the notetype, DL(M) are merged into a single index.
   * @param {number} measureLine
   * @param {number} lane
   * @returns {Array<string>}
   */
  const apropriateCharByLane = (measureLine, lane) => {
    let laneArr = [];
    for (let i = 0; i < measureLine.length; i++) {
      const curChar = measureLine[i];

      if (curChar === 'D' && measureLine.length > i + 1) {
        laneArr.push(curChar + measureLine[i + 1]);
        i++;
        continue;
      }

      laneArr.push(curChar);
    }

    return laneArr[lane];
  };

  /**
   * This function is used to check if a a note had will end, be it hold, roll, liftHold, liftRoll or minefield
   * @param {number} lane - The measure lane we want to start searching.
   * @param {number} line - The line from the measre we want to search.
   * @param {0 | 1} measure - Which measure are we searching on.
   * @returns
   */
  const willHeadEnd = (lane, line, measure) => {
    if (lane > measureData[0][0].length) {
      console.warn('willHeadEnd(): Out of bounds lane.');
      return false;
    }

    let laneN = lane;
    for (let measureI = measure; measureI < 2; measureI++) {
      const curMeasure = measureData[measureI];

      for (let lineI = line; lineI < curMeasure.length; lineI++) {
        const curLine = curMeasure[lineI];
        let curChar = apropriateCharByLane(curLine, laneN);

        if (['DM', '2', '4'].includes(curChar)) return false; // Found another head.

        if (curChar === '3' || curChar === 'DL') {
          return true;
        }
      }
    }

    return false;
  };

  // Spacing between note timings
  const noteSpacing = {
    '4th': 64,
    '8th': 32,
    '12th': 21,
    '16th': 16,
    '24th': 10,
    '32nd': 8,
    '48th': 5,
    '64th': 4,
    '192nd': 1
  };

  // Last Seen "Head Defining" note per lane.
  const lastNoteByLane = [];

  // All possible note timing given measure timing.
  const timings = {
    4: [4],
    8: [4, 8],
    12: [4, 12, 12],
    16: [4, 16, 8, 16],
    24: [4, 24, 12, 8, 12, 24],
    32: [4, 32, 16, 32, 8, 32, 16, 32],
    48: [4, 48, 24, 16, 12, 48, 8, 48, 12, 16, 24, 48],
    64: [4, 64, 32, 64, 16, 64, 32, 64, 8, 64, 32, 64, 16, 64, 32, 64],
    192: [
      4, 192, 192, 64, 48, 192, 32, 192, 24, 64, 192, 192, 16, 192, 192, 64, 12, 192, 32, 192, 48, 64, 192, 192, 8, 192,
      192, 64, 48, 192, 32, 192, 12, 64, 192, 192, 16, 192, 192, 64, 24, 192, 32, 192, 48, 64, 192, 192
    ]
  };

  /**
   *
   * @param {string} mode
   * @param {string} style
   * @param {0 | 1} measure
   * @param {4 | 8 | 12 | 16 | 24 | 32 | 48 | 64 | 192} timing
   * @param {'th' | 'nd'} endChar
   * @param {number} depth
   * @param {number} line
   * @param {Array<string>} curMeasure
   * @param {number} curLane
   * @returns
   */
  const calculateNoteY = (mode, style, measure, timing, endChar, depth, line, curMeasure, curLane) => {
    const baseY = () => {
      if (reverse) {
        if (curMode === 'pnm') return [472, 216][measure];

        if (['bm', 'gdgf'].includes(curMode)) return [476, 220][measure];

        if (curMode === 'gddm') {
          const bigLanes = style === 'old' ? [0, 2, 5] : [1, 2, 5, 8];

          return bigLanes.includes(curLane) ? [448, 192][measure] : [476, 220][measure];
        }

        if (curMode.includes('kb')) return [464, 208][measure]

        if (curMode === 'gh' && curLane === 5) return [476, 220][measure]

        return [448, 192][measure];
      }

      if (curMode === 'pnm') return [24, 280][measure];

      if (['bm', 'gdgf'].includes(curMode)) return [28, 284][measure];

      if (curMode === 'gddm') {
        const bigLanes = style === 'old' ? [0, 2, 5] : [1, 2, 5, 8];

        return bigLanes.includes(curLane) ? [0, 256][measure] : [28, 284][measure];
      }

      if (curMode === 'gh' && curLane === 5) return [28, 286][measure]

      return [0, 256][measure];
    };

    if (reverse) {
      return (
        baseY() -
        (timing === 4
          ? noteSpacing[timing + endChar] * (line / timings[curMeasure.length].length)
          : noteSpacing[timing + endChar] * depth)
      );
    }

    return (
      baseY() +
      (timing === 4
        ? noteSpacing[timing + endChar] * (line / timings[curMeasure.length].length)
        : noteSpacing[timing + endChar] * depth)
    );
  };
  /**
   * 4th = red
   * 8th = blue
   * 12th = green
   * 16th = yellow
   * 24th = purple
   * 32th = blueish
   * 48th = rose
   * 64th = grey to green
   * 192th = grey
   */

  // Rendering notes

  for (let measure = 0; measure < 2; measure++) {
    // We will only render 2 measures
    const curMeasure = measureData[measure];
    let timingCount = 0;

    for (let line = 0; line < curMeasure.length; line++) {
      // Loop every measure line min 4 max 192
      const curLine = curMeasure[line];
      let curLane = 0;

      if (timingCount === timings[curMeasure.length].length) timingCount = 0;

      const timing = timings[curMeasure.length][timingCount];
      const endChar = [32, 192].includes(timing) ? 'nd' : 'th';
      const depth = line;
      let modstring = false;

      for (let char = 0; char < curLine.length; char++) {
        // Look every char from the line
        const noteType = curLine[char];
        const noteX = 44 + NoteSkin.styleconfig.modeSpacing[curLane];
        let noteY = calculateNoteY(curMode, curStyle, measure, timing, endChar, depth, line, curMeasure, curLane);

        if (noteType === '}' || noteType === ']') modstring = false; // note attack declaration ended, OPEN THE DOORS.

        if (modstring) continue; // We're inside a note attack declaration, ignore everything while this is true.

        if (curMode === 'gdgf' && curLane === NoteSkin.styleconfig.modeSpacing.length - 1) noteY -= 32;

        switch (noteType) {
          case '1': // TapNote
            {
              const note = await NoteSkin.collectAsset('tapNote', timing, endChar, noteType, curLane);

              background.blit(note, noteX, noteY);
            }
            break;
          case '2': // HoldTop
            {
              const holdTop = await NoteSkin.collectAsset('holdTop', timing, endChar, noteType, curLane);

              if (reverse) {
                holdTop.flip(false, true);
              }
              background.blit(holdTop, noteX, reverse ? noteY + 32 : noteY);

              if (willHeadEnd(curLane, line + 1, measure)) {
                // In case you're asking where is the note rendering, it is only rendered on the 3 noteType.

                lastNoteByLane[curLane] = ['hold', noteX, noteY + 32, timing + endChar]; // Hold Hook
              } else { // FIXME: This will totally break for non-dance modes as it hasn't been updated. The impact hasn't been tested.
                // If there is not head found in the given 2 measures, then draw a hold till either top of bottom of the canvas.
                const body = await NoteSkin.collectAsset(`holdBody`, timing, endChar, noteType, curLane);
                const note = await NoteSkin.collectAsset(`tapNote`, timing, endChar, noteType, curLane);
                const measureNote = await NoteSkin.collectMeasure('tapNote', timing, endChar, noteType, curLane);

                body.resize(measureNote.width, reverse ? noteY : canvasHeight);
                background.blit(body, noteX, reverse ? 0 : noteY + 32);
                background.blit(note, noteX, noteY);
              }
            }
            break;
          case '4': // Roll
            {
              const rollTop = await NoteSkin.collectAsset('rollTop', timing, endChar, noteType, curLane);

              if (reverse) {
                rollTop.flip(false, true);
              }

              background.blit(rollTop, noteX, reverse ? noteY + 32 : noteY);

              const measureNote = await NoteSkin.collectMeasure('tapNote', timing, endChar, noteType, curLane);

              if (willHeadEnd(curLane, line + 1, measure)) {
                if (curMode === 'pnm') {
                  lastNoteByLane[curLane] = ['roll', noteX, noteY + measureNote.height / 2 + 24, timing + endChar]; // Roll Hook
                } else {
                  lastNoteByLane[curLane] = ['roll', noteX, noteY + measureNote.height / 2, timing + endChar]; // Roll Hook
                }
              } else {
                const body = await NoteSkin.collectAsset(`rollBody`, timing, endChar, noteType, curLane);
                const note = await NoteSkin.collectAsset(`tapNote`, timing, endChar, noteType, curLane);
                const measureNote = await NoteSkin.collectMeasure('tapNote', timing, endChar, noteType, curLane);

                body.resize(measureNote.width, reverse ? noteY : canvasHeight);
                background.blit(body, noteX, reverse ? 0 : noteY + 32);
                background.blit(note, noteX, noteY);
              }
            }
            break;
          case '3': // Roll/Hold Bottom
            {
              if (!lastNoteByLane[curLane]) continue;

              /*
              WON'T FIX: When a note head is found, we lookup to if there will be a end to it,
              if not then we draw the body till the canvas top of bottom. This can't be done with ends.
              Note heads have exclusive type, saying if they're a hold/roll/lift...etc, note ends do not have this info.
              */

              const [bodyName, bodyX, bodyY, noteTiming] = lastNoteByLane[curLane];
              const body = await NoteSkin.collectAsset(`${bodyName}Body`, timing, endChar, noteType, curLane);

              const measureNote = await NoteSkin.collectMeasure('tapNote', timing, endChar, noteType, curLane);
              const bodyMeasure = await NoteSkin.collectMeasure(`${bodyName}Body`, timing, endChar, noteType, curLane);

              body.resize(bodyMeasure.width, reverse ? bodyY - noteY - 32 : bodyY + 96 - noteY);

              switch (curMode) {
                case 'pnm':
                  background.blit(body, bodyX, reverse ? bodyY - 92 : bodyY - 24);
                  break;
                case 'gdgf':
                case 'bm':
                  background.blit(body, bodyX, reverse ? bodyY - 96 : bodyY - 32);
                  break;
                case 'gh':
                  background.blit(body, bodyX + (curLane === 5 ? 80 : 19), reverse ? bodyY - (curLane === 5 ? 32 : 64) : bodyY - (curLane === 5 ? 35 : 0));
                break;
                default:
                  background.blit(body, bodyX, reverse ? bodyY - 64 : bodyY - 0);
              }

              const measureBottom = await NoteSkin.collectMeasure(
                `${bodyName}Bottom`,
                timing,
                endChar,
                noteType,
                curLane
              );

              const bottom = await NoteSkin.collectAsset(`${bodyName}Bottom`, timing, endChar, noteType, curLane);

              if (reverse) {
                bottom.flip(false, true);
              }

              if (curMode === 'pump' && bodyName === 'mine' && reverse) {
                background.blit(bottom, noteX, noteY + measureBottom.height - 32);
              } else {
                background.blit(
                  bottom,
                  noteX,
                  noteY + measureBottom.height + (reverse ? (curMode === 'pump' ? -64 : -32) : 0)
                );
              }

              if (bodyName !== 'mine') {
                const note = await NoteSkin.collectAsset(
                  `tapNote`,
                  noteTiming.replace(/\D/g, ''),
                  noteTiming.replace(/\d+/g, ''),
                  noteType,
                  curLane
                );

                if (curMode === 'pnm') {
                  background.blit(note, bodyX, bodyY - measureNote.height / 2 - 24);
                } else {
                  let cursedNoteY = bodyY - measureNote.height / 2 - (['bm', 'gdgf'].includes(curMode) ? 26 : 0)
                  if (curMode === 'gh' && curLane === 5) cursedNoteY = reverse ? cursedNoteY + 32 : cursedNoteY - 32 // HACK: This is for strum holds. (Reverse false)
                  background.blit(
                    note,
                    bodyX,
                    cursedNoteY
                  );
                }

                if (['bm', 'pnm', 'para'].includes(curMode)) {
                  background.blit(note, noteX, noteY);
                }
              }

              delete lastNoteByLane[curLane]; // Lucky we don't check lastNoteByLane.length anywhere :)
            }
            break;
          case 'M': // Mine
            {
              const mine = await NoteSkin.collectAsset(`mine`, timing, endChar, noteType, curLane);

              background.blit(mine, noteX, noteY);
            }
            break;
          case 'D': // MineField End/Lift Hold End/ Lift Roll End
            {
              if (!(curLine[char + 1] === 'L' || curLine[char + 1] === 'M')) continue;
              // This is either a lift hold/roll, or a minefield

              // Supposedly this could also be a hold? But all the holds I've seen end with 3.

              if (curLine[char + 1] === 'M') {
                const mineTop = await NoteSkin.collectAsset(`mineTop`, timing, endChar, noteType + 'M', curLane);

                if (reverse) {
                  mineTop.flip(false, true);
                }

                background.blit(mineTop, noteX, reverse ? noteY + 32 : noteY);

                const measureMineTop = await NoteSkin.collectMeasure('mineTop', timing, endChar, noteType, curLane);

                if (willHeadEnd(char, line + 1, measure)) {
                  lastNoteByLane[curLane] = ['mine', noteX, noteY + measureMineTop.height]; // Minefield Hook
                } else {
                  const measureNote = await NoteSkin.collectMeasure('tapNote', timing, endChar, noteType, curLane);
                  const body = await NoteSkin.collectAsset(`mineBody`, timing, endChar, noteType, curLane);

                  body.resize(measureNote.width, reverse ? noteY : canvasHeight);
                  background.blit(body, noteX, reverse ? 0 : noteY + 32);
                }
              } else {
                // Now it can only be lift roll/hold

                if (!lastNoteByLane[curLane]) continue;

                const [type, bodyX, bodyY, timingLane] = lastNoteByLane[curLane];

                const body = await NoteSkin.collectAsset(
                  `${type}Body`,
                  timingLane.replace(/\D/g, ''),
                  endChar,
                  noteType + 'L',
                  curLane
                );

                const measureNote = await NoteSkin.collectMeasure('tapNote', timing, endChar, noteType, curLane);
                const measureBody = await NoteSkin.collectMeasure(`${type}Body`, timing, endChar, noteType, curLane);

                body.resize(measureBody.width, reverse ? bodyY - noteY - 32 : bodyY + 96 - noteY);

                switch (curMode) {
                  case 'bm':
                    background.blit(body, bodyX, bodyY - 96);
                  break
                  case 'gh':
                    background.blit(body, bodyX + (curLane === 5 ? 80 : 19), bodyY - (curLane === 5 ? 32 : 0));
                  break
                  default:
                    background.blit(body, bodyX, bodyY);
                  break
                }
                // background.blit(body, bodyX + (curMode === 'gh' ? (curLane === 5 ? 80 : 19) : 0), bodyY - (curMode === 'bm' ? 96 : 0));

                const measureMineBottom = await NoteSkin.collectMeasure(
                  'mineBottom',
                  timing,
                  endChar,
                  noteType,
                  curLane
                );
                const bottom = await NoteSkin.collectAsset(
                  `${type}Bottom`,
                  timingLane.replace(/\D/g, ''),
                  endChar,
                  noteType + 'L',
                  curLane
                );

                if (reverse) bottom.flip(false, true);

                background.blit(bottom, noteX, noteY + measureMineBottom.height + (reverse ? -32 : 0));

                const note = await NoteSkin.collectAsset(`tapNote`, timing, endChar, noteType + 'L', curLane);

                switch (curMode) {
                  case 'gh':
                    background.blit(note, bodyX, bodyY - (curLane === 5 ? (reverse ? -32 : 32) : (measureNote.height / 2)));
                  break
                  default:
                    background.blit(note, bodyX, bodyY - measureNote.height / 2);
                  break
                }

                if (curMode === 'gh') {
                  const hopo = await NoteSkin.collectAsset(`lift`, timing, endChar, noteType + 'L', curLane);
                  background.blit(hopo, bodyX, bodyY + (reverse && curLane === 5 ? -32 : 32));
                }

                const capitalizeType = type[0].toUpperCase() + type.slice(1);
                const measureLift = await NoteSkin.collectMeasure(
                  `lift${capitalizeType}`,
                  timing,
                  endChar,
                  noteType,
                  curLane
                );
                const lift = await NoteSkin.collectAsset(
                  `lift${capitalizeType}`,
                  timing,
                  endChar,
                  noteType + 'L',
                  curLane
                );
                background.blit(
                  lift,
                  curMode === 'smx' ? bodyX + 16 : bodyX,
                  noteY + measureLift.height / 2 - (curMode === 'smx' ? 8 : 32)
                );

                delete lastNoteByLane[curLane];
              }

              char++; // Jump the "L" or "M" after D.
            }
            break;
          case 'L': // Lift
            {
              const lift = await NoteSkin.collectAsset(`lift`, timing, endChar, noteType, curLane);

              background.blit(lift, noteX, noteY);
            }
            break;
          case 'F': // Fake
            {
              const note = await NoteSkin.collectAsset(`fake`, timing, endChar, noteType, curLane);

              background.blit(note, noteX, noteY);
            }
            break;
          case '{': // note attack start
            {
              modstring = true;
            }
            break;
          case '[':
            {
              modstring = true; // It's actually a keysound but I won't create another var for it
            }
            break;
          default: // bad file
            // It's either a 0 or a note attack argument.
            break;
        }
        curLane++;
      }

      timingCount++;
    }
  }

  // Write the result.
  background.write('result.jpg');
};

main();
