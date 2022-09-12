const jimp = require('jimp');
const path = require('path');
const NoteSkinFile = require('./noteskin.js');
// const stylechart = require('./stylechart.js');
const defaultstyle = require('./defaultstyle.js');

const main = async ({ reverse = false, curMode = 'dance', style, showMeasureLines = true, measureData, skin }) => {
  const curStyle = style || defaultstyle.defaultstyle[curMode];

  if (!curStyle) {
    console.error('No default style set for that mode!');
    return;
  }

  if (!measureData) {
    console.error('no measureData has been given!');
  }

  const curModeOFStyle = (curMode) => {
    if (curMode.includes('kb')) return 'kbx';

    return curMode;
  };

  // Noteskin
  const NoteSkin = new NoteSkinFile.NoteSkinClass(curMode, curStyle, reverse, skin);

  // Measure Width
  const measureWidth = NoteSkin.styleconfig.measureWidth || 254;

  // Draw background
  const background = await jimp.read(path.join(__dirname, './bg.png'));
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

  /*
  const perStyleTestData = stylechart.stylechart;

  if (!perStyleTestData[curMode + '-' + curStyle]) {
    console.error('No steps for that style!');
    return;
  }

  // Measure Data Input
  const measureData = perStyleTestData[curMode + '-' + curStyle];
  */

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

  /**
   * Gets the value from noteSpacing without having to add 'nd' or 'th'
   * @param {number} timing
   * @returns {number}
   */
  const getNoteSpacingByNumberTiming = (timing) => {
    const timingString = [64, 192].includes(timing) ? `${timing}nd` : `${timing}th`;

    return noteSpacing[timingString];
  };

  const closest = (arr, goal) => {
    const found = arr.reduce((prev, curr) => {
      return (Math.abs(curr - goal) < Math.abs(prev - goal) ? curr : prev);
    });

    return found
  }

  const getAllIndexes = (arr, val) => {
    var indexes = [], i = -1;
    while ((i = arr.indexOf(val, i+1)) != -1){
        indexes.push(i);
    }
    return indexes;
  }

  const base = (baseN, numberToBase) => {
    for (let i = 1;; i++) {
      if ((numberToBase - (baseN * i)) > baseN) continue

      return numberToBase - (baseN * i)
    }
  }

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

        if (curMode.includes('kb')) return [464, 208][measure];

        if (curMode === 'gh' && curLane === 5) return [476, 220][measure];

        return [448, 192][measure];
      }

      if (curMode === 'pnm') return [24, 280][measure];

      if (['bm', 'gdgf'].includes(curMode)) return [28, 284][measure];

      if (curMode === 'gddm') {
        const bigLanes = style === 'old' ? [0, 2, 5] : [1, 2, 5, 8];

        return bigLanes.includes(curLane) ? [0, 256][measure] : [28, 284][measure];
      }

      if (curMode.includes('kb')) return [16, 272][measure];

      if (curMode === 'gh' && curLane === 5) return [28, 286][measure];

      return [0, 256][measure];
    };

    const depth4th = noteSpacing[timing + endChar] * (line / timings[curMeasure.length].length)

    const measureTiming = curMeasure.length
    const measureTimings = timings[measureTiming]
    const allIndexOfTiming = getAllIndexes(measureTimings, timing)
    const iTimingInMeasureTimings = closest(allIndexOfTiming, base(measureTiming, depth))
    console.log(`
    The closest index of ${timing} in
    [${measureTimings.join(', ')}]
    is ${iTimingInMeasureTimings} at depth of ${depth}
    `)
    const timingDepth = timing === measureTiming ? depth : Number.parseInt(depth / iTimingInMeasureTimings)

    if (reverse) {
      return (
        baseY() -
        (timing === 4
          ? depth4th
          : noteSpacing[timing + endChar] * (Math.max(1, timingDepth)))
      );
    }

    return (
      baseY() +
      (timing === 4
        ? depth4th
        : noteSpacing[timing + endChar] * (Math.max(1, timingDepth)))
    );
  };

  /**
   * Returns how long per px a hold should be.
   * @param {number} timingStart - The timing of the measure.
   * @param {number} depth - The depth diference between the head and the bottom note.
   * @returns {number}
   */
  const calculateHoldY = (timingStart, depth) => {
    const timingSpacing = getNoteSpacingByNumberTiming(timingStart);

    return timingSpacing * depth;
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
        // let noteY = calculateNoteY(curMode, curStyle, measure, timing, endChar, depth, line, curMeasure, curLane);

        if (noteType === '}' || noteType === ']') modstring = false; // note attack declaration ended, OPEN THE DOORS.

        if (modstring) continue; // We're inside a note attack declaration, ignore everything while this is true.

        //if (curMode === 'gdgf' && curLane === NoteSkin.styleconfig.modeSpacing.length - 1) noteY -= 32;

        switch (noteType) {
          case '1': // TapNote
            {
              const note = await NoteSkin.collectAsset('tapNote', timing, endChar, noteType, curLane);
              let noteY = calculateNoteY(curMode, curStyle, measure, timing, endChar, depth, line, curMeasure, curLane);
              background.blit(note, noteX, noteY);
            }
            break;
          case '2': // HoldTop
            {
              const holdTop = await NoteSkin.collectAsset('holdTop', timing, endChar, noteType, curLane);

              if (reverse) {
                holdTop.flip(false, true);
              }

              switch (curMode) {
                case 'ds3ddx':
                  background.blit(holdTop, noteX, reverse ? noteY + 20 : noteY - 20);
                  break;
                default:
                  background.blit(holdTop, noteX, reverse ? noteY + 32 : noteY);
              }

              if (willHeadEnd(curLane, line + 1, measure)) {
                // In case you're asking where is the note rendering, it is only rendered on the 3 noteType.

                lastNoteByLane[curLane] = ['hold', noteX, noteY + 32, timing + endChar, depth, timing]; // Hold Hook
              } else {
                // FIXME: This will totally break for non-dance modes as it hasn't been updated. The impact hasn't been tested.
                // If there is not head found in the given 2 measures, then draw a hold till either top of bottom of the canvas.
                const body = await NoteSkin.collectAsset(`holdBody`, timing, endChar, noteType, curLane);
                const note = await NoteSkin.collectAsset(`tapNote`, timing, endChar, noteType, curLane);
                const measureNote = await NoteSkin.collectMeasure('tapNote', timing, endChar, noteType, curLane);

                body.resize(measureNote.width, reverse ? noteY : canvasHeight);
                background.blit(body, noteX, reverse ? 0 : noteY + 32); // TODO: use correct holdY
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

              switch (curMode) {
                case 'ds3ddx':
                  background.blit(rollTop, noteX, reverse ? noteY + 20 : noteY - 20);
                  break;
                default:
                  background.blit(rollTop, noteX, reverse ? noteY + 32 : noteY);
              }

              const measureNote = await NoteSkin.collectMeasure('tapNote', timing, endChar, noteType, curLane);

              if (willHeadEnd(curLane, line + 1, measure)) {
                switch (curModeOFStyle(curMode)) {
                  case 'pnm':
                    lastNoteByLane[curLane] = [
                      'roll',
                      noteX,
                      noteY + measureNote.height / 2 + 24,
                      timing + endChar,
                      depth,
                      timing
                    ];
                    break;
                  case 'kbx':
                    lastNoteByLane[curLane] = [
                      'roll',
                      noteX,
                      noteY + 16 + measureNote.height / 2,
                      timing + endChar,
                      depth,
                      timing
                    ];
                    break;
                  default:
                    lastNoteByLane[curLane] = [
                      'roll',
                      noteX,
                      noteY + measureNote.height / 2,
                      timing + endChar,
                      depth,
                      timing
                    ];
                }
              } else {
                const body = await NoteSkin.collectAsset(`rollBody`, timing, endChar, noteType, curLane);
                const note = await NoteSkin.collectAsset(`tapNote`, timing, endChar, noteType, curLane);
                const measureNote = await NoteSkin.collectMeasure('tapNote', timing, endChar, noteType, curLane);

                body.resize(measureNote.width, reverse ? noteY : canvasHeight);
                background.blit(body, noteX, reverse ? 0 : noteY + 32); // TODO: use correct hold Y
                background.blit(note, noteX, noteY);
              }
            }
            break;
          case '3': // Roll/Hold/Minefield Bottom
            {
              if (!lastNoteByLane[curLane]) continue;

              /*
              WON'T FIX: When a note head is found, we lookup to if there will be a end to it,
              if not then we draw the body till the canvas top of bottom. This can't be done with ends.
              Note heads have exclusive type, saying if they're a hold/roll/lift...etc, note ends do not have this info.
              */

              const [bodyName, bodyX, bodyY, noteTiming, lastDepth, lastTiming] = lastNoteByLane[curLane];
              const body = await NoteSkin.collectAsset(`${bodyName}Body`, timing, endChar, noteType, curLane);

              const measureNote = await NoteSkin.collectMeasure('tapNote', timing, endChar, noteType, curLane);
              const bodyMeasure = await NoteSkin.collectMeasure(`${bodyName}Body`, timing, endChar, noteType, curLane);
              const holdY = calculateHoldY(curMeasure.length, depth - lastDepth);
              const measureBottom = await NoteSkin.collectMeasure(
                `${bodyName}Bottom`,
                timing,
                endChar,
                noteType,
                curLane
              );

              switch (curModeOFStyle(curMode)) {
                case 'ds3ddx':
                  body.resize(bodyMeasure.width, reverse ? holdY : holdY - 10);
                  break;
                default:
                  body.resize(bodyMeasure.width - 64, holdY);
              }

              switch (curMode) {
                case 'pnm':
                  background.blit(body, bodyX, reverse ? noteY + 6 : bodyY - 24);
                  break;
                case 'kbx':
                  background.blit(body, bodyX, reverse ? bodyY - 92 : bodyY - 16);
                  break;
                case 'gdgf':
                case 'bm':
                  background.blit(body, bodyX, reverse ? noteY + 6 : bodyY - 32);
                  break;
                case 'gh':
                  background.blit(
                    body,
                    bodyX + (curLane === 5 ? 80 : 19),
                    reverse ? bodyY - (curLane === 5 ? 32 : 64) : bodyY - (curLane === 5 ? 35 : 0)
                  );
                  break;
                case 'ds3ddx':
                  background.blit(body, bodyX, reverse ? noteY + 32 : bodyY + 10);
                  break;
                case 'gddm':
                  background.blit(body, bodyX, reverse ? noteY : bodyY - 32);
                  break;
                default:
                  background.blit(body, bodyX, reverse ? noteY + 32 : bodyY - 0);
              }

              const bottom = await NoteSkin.collectAsset(`${bodyName}Bottom`, timing, endChar, noteType, curLane);

              if (reverse) {
                bottom.flip(false, true);
              }

              const bottomY = bodyY + holdY;
              const bottomYReverse = bodyY - holdY;
              switch (curModeOFStyle(curMode)) {
                case 'pump':
                  if (bodyName === 'mine' && reverse) {
                    background.blit(bottom, noteX, noteY + measureBottom.height - 32);
                  } else {
                    background.blit(bottom, noteX, reverse ? bottomYReverse - 64 : bottomY);
                  }
                  break;
                case 'kbx':
                  background.blit(bottom, noteX, reverse ? bottomYReverse - 32 : holdY + 16);
                  break;
                case 'ds3ddx':
                  background.blit(bottom, noteX, reverse ? bottomYReverse - 48 : bottomY - 32);
                  break;
                case 'bm':
                  const toFixBMMineFieldY = curMode === 'bm' && bodyName === 'mine';
                  background.blit(
                    bottom,
                    noteX,
                    noteY + measureBottom.height + (reverse ? -32 : 0) - (toFixBMMineFieldY ? 32 : 0)
                  );
                  break;
                default:
                  background.blit(bottom, noteX, bodyY + holdY);
              }

              if (bodyName !== 'mine') {
                const note = await NoteSkin.collectAsset(
                  `tapNote`,
                  noteTiming.replace(/\D/g, ''),
                  noteTiming.replace(/\d+/g, ''),
                  noteType,
                  curLane
                );

                switch (curModeOFStyle(curMode)) {
                  case 'pnm':
                    background.blit(note, bodyX, bodyY - measureNote.height / 2 - 24);
                    break;
                  case 'kbx':
                    background.blit(note, bodyX, bodyY - measureNote.height / 2 - 16);
                    break;
                  case 'bm':
                  case 'gdgf':
                    const fixedBodyY = bodyY - measureNote.height / 2 - 26;
                    background.blit(note, bodyX, fixedBodyY);
                    break;
                  case 'gh':
                    let ghFixedBodyY = bodyY - measureNote.height / 2;

                    if (curLane === 5) ghFixedBodyY = reverse ? ghFixedNoteY + 32 : ghFixedNoteY - 32; // HACK: This is for strum holds. (Reverse false)

                    background.blit(note, bodyX, ghFixedBodyY);
                    break;
                  case 'gddm':
                    let gddmNoteY = bodyY - measureNote.height / 2;
                    background.blit(note, bodyX, gddmNoteY - 32);
                    break;
                  default:
                    let cursedNoteY = bodyY - measureNote.height / 2;
                    background.blit(note, bodyX, cursedNoteY);
                    break;
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

              switch (curModeOFStyle(curMode)) {
                case 'kbx':
                  background.blit(mine, noteX, noteY - 16);
                  break;
                default:
                  background.blit(mine, noteX, noteY);
              }
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

                switch (curMode) {
                  case 'bm':
                    background.blit(mineTop, noteX, reverse ? noteY : noteY - 32);
                    break;
                  default:
                    background.blit(mineTop, noteX, reverse ? noteY + 32 : noteY);
                }

                const measureMineTop = await NoteSkin.collectMeasure('mineTop', timing, endChar, noteType, curLane);

                if (willHeadEnd(char, line + 1, measure)) {
                  lastNoteByLane[curLane] = ['mine', noteX, noteY + measureMineTop.height, depth, timing]; // Minefield Hook
                } else {
                  const measureNote = await NoteSkin.collectMeasure('tapNote', timing, endChar, noteType, curLane);
                  const body = await NoteSkin.collectAsset(`mineBody`, timing, endChar, noteType, curLane);

                  body.resize(measureNote.width, reverse ? noteY : canvasHeight);
                  background.blit(body, noteX, reverse ? 0 : noteY + 32);
                }
              } else {
                // Now it can only be lift roll/hold

                if (!lastNoteByLane[curLane]) continue;

                const [type, bodyX, bodyY, timingLane, lastDepth, lastTIming] = lastNoteByLane[curLane];

                const body = await NoteSkin.collectAsset(
                  `${type}Body`,
                  timingLane.replace(/\D/g, ''),
                  endChar,
                  noteType + 'L',
                  curLane
                );

                const holdY = calculateHoldY(curMeasure.length, depth - lastDepth);
                const measureNote = await NoteSkin.collectMeasure('tapNote', timing, endChar, noteType, curLane);
                const measureBody = await NoteSkin.collectMeasure(`${type}Body`, timing, endChar, noteType, curLane);

                body.resize(measureBody.width - 64, holdY);

                switch (curMode) {
                  case 'bm':
                    background.blit(body, bodyX, reverse ? bodyY - 64 : bodyY - 32);
                    break;
                  case 'gh':
                    background.blit(body, bodyX + (curLane === 5 ? 80 : 19), bodyY - (curLane === 5 ? 32 : 0));
                    break;
                  default:
                    background.blit(body, bodyX, reverse ? bodyY - 64 : bodyY);
                    break;
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

                switch (curModeOFStyle(curMode)) {
                  case 'kbx':
                    background.blit(bottom, noteX, noteY + measureMineBottom.height - 32);
                    break;
                  case 'bm':
                    background.blit(bottom, noteX, noteY + measureMineBottom.height + (reverse ? -64 : -32));
                    break;
                  default:
                    background.blit(bottom, noteX, noteY + measureMineBottom.height + (reverse ? -32 : 0));
                }

                const note = await NoteSkin.collectAsset(`tapNote`, timing, endChar, noteType + 'L', curLane);

                switch (curModeOFStyle(curMode)) {
                  case 'gh':
                    background.blit(
                      note,
                      bodyX,
                      bodyY - (curLane === 5 ? (reverse ? -32 : 32) : measureNote.height / 2)
                    );
                    break;
                  case 'kbx':
                    background.blit(note, bodyX, bodyY - measureNote.height / 2 - 16);
                    break;
                  case 'bm':
                    background.blit(note, bodyX, bodyY - measureNote.height / 2 + (reverse ? 0 : -32));
                    break;
                  default:
                    background.blit(note, bodyX, bodyY - measureNote.height / 2);
                    break;
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
                  noteY + measureLift.height / 2 - (curMode === 'smx' ? 0 : 32)
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
          default: // Unknown char
            // It's either a 0 or a note attack argument.
            break;
        }

        // We have reached the max supported lanes, ignore everything else.
        if (curLane === NoteSkin.styleconfig.modeSpacing.length - 1) {
          char = curLine.length;
          continue;
        }

        curLane++;
      }

      timingCount++;
    }
  }

  // Write the result.
  // background.write(path.join(__dirname, './result.jpg'));

  return background;
};

// main();

exports.generateChart = main;
