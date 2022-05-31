const jimp = require('jimp');
const NoteSkinFile = require('./noteskin.js');

const main = async () => {
  // Selected mode/style input
  const curMode = 'dance';
  const curStyle = 'single' || 'single';

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
  const cutLines = curMode === 'bm' ? [3, 7] : [0, 4];
  for (let i = 0; i < 8; i++) {
    if (cutLines.includes(i)) {
      background.scan(44, 30 + 64 * i, measureWidth, 3, makeIteratorThatFillsWithColor(0xffffffff));
      background.scan(44, 31 + 64 * i, measureWidth, 3, makeIteratorThatFillsWithColor(0xffffffff));
      continue;
    }

    background.scan(44, 31 + 64 * i, measureWidth, 2, makeIteratorThatFillsWithColor(0xffffffff));
  }

  const perStyleTestData = {
    'dance-single': [
      ['DM424', '03DLDL', '0M00', '00L1'],
      ['0111', '0111', '0111', '0111']
    ],
    'dance-double': [
      ['124L24MDM', '0330DLDL03', '00000000', '00000000'],
      ['00000000', '00000000', '00000000', '00000000']
    ],
    'dance-couple': [
      ['124L24MDM', '0330DLDL03', '00000000', '00000000'],
      ['00000000', '00000000', '00000000', '00000000']
    ],
    'dance-solo': [
      ['124L24', '0330DLDL', 'DMM0000', '300000'],
      ['000000', '000000', '000000', '000000']
    ],
    'dance-solodouble': [
      ['124L24MDM1111', '0330DLDL030000', '000000000000', '000000000000'],
      ['000000000000', '000000000000', '000000000000', '000000000000']
    ],
    'dance-3panel': [
      ['242', '33DL', 'DMM4', '30DL'],
      ['000', '000', '000', '000']
    ],
    'pump-single': [
      ['24242', '33333', 'DMM000', '30000'],
      ['00000', '00000', '00000', '00000']
    ],
    'pump-halfdouble': [
      ['LLLLLL', '000000', '000000', '000000'],
      ['000000', '000000', '000000', '000000']
    ],
    'pump-double': [
      ['2222222222', '3333333333', '0000000000', '0000000000'],
      ['0000000000', '0000000000', '0000000000', '0000000000']
    ],
    'smx-single': [
      ['41111', '31111', '11111', '11111'],
      ['11111', '11111', '11111', '11111']
    ],
    'smx-double6': [
      ['241241', '33MDLDL1', '00DM001', '003001'],
      ['000001', '000001', '000001', '000001']
    ],
    'smx-double10': [
      ['1111111111', '1111111111', '1111111111', '1111111111'],
      ['1111111111', '1111111111', '1111111111', '1111111111']
    ],
    'techno-single4': [
      ['2244', '3333', 'MDM24', '03DLDL'],
      ['FFFF', '0000', '0000', '0000']
    ],
    'techno-single5': [
      ['24242', '33333', '24DM00', 'DLDL300'],
      ['LLLLL', '00000', '00000', '00000']
    ],
    'techno-single8': [
      ['11111111', 'LLLLLLLL', '22442244', 'DLDLDLDL3333'],
      ['MLDM00000', '00300000', '00000000', '00000000']
    ],
    'techno-single9': [
      ['111111111', '111111111', '111111111', '111111111'],
      ['111111111', '111111111', '111111111', '111111111']
    ],
    'techno-double4': [
      ['11111111', '11111111', '11111111', '11111111'],
      ['11111111', '11111111', '11111111', '11111111']
    ],
    'techno-double5': [
      ['1111111111', '1111111111', '1111111111', '1111111111'],
      ['1111111111', '1111111111', '1111111111', '1111111111']
    ],
    'techno-double8': [
      ['1111111111111111', '1111111111111111', '1111111111111111', '1111111111111111'],
      ['1111111111111111', '1111111111111111', '1111111111111111', '1111111111111111']
    ],
    'techno-double9': [
      ['111111111111111111', '111111111111111111', '111111111111111111', '111111111111111111'],
      ['111111111111111111', '111111111111111111', '111111111111111111', '111111111111111111']
    ],
    'bm-single5': [
      ['111111', 'MMMMMM', '221002', '331003'],
      ['000000', '100000', '100000', '100000']
    ],
    'bm-double5': [
      ['111111111111', 'MMMMMM000000', '221002000000', '331003000000'],
      ['000000000000', '100000000000', '100000000000', '100000000000']
    ],
    'bm-single7': [
      ['11111111', 'MMMMMM00', '22100200', '33100300'],
      ['00000000', '10000000', '10000000', '10000000']
    ],
    'bm-double7': [
      ['1111111111111111', 'MMMMMM0011111111', '2210020011111111', '0310030011111111'],
      ['0000000011111111', '1000000011111111', '1000000011111111', '1000000011111111']
    ]
  };

  if (!perStyleTestData[curMode + '-' + curStyle]) {
    console.warn('No steps for that style!');
    return;
  }

  // Measure Data Input
  const measureData = perStyleTestData[curMode + '-' + curStyle];

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

    for (let measureI = measure; measureI < 2; measureI++) {
      const curMeasure = measureData[measureI];

      for (let lineI = line; lineI < curMeasure.length; lineI++) {
        const curLine = curMeasure[lineI];
        let curChar = curLine[lane];

        if (curChar === '2' || curChar === '4') return false; // Found another head.

        if (curChar === 'L' && curLine[lane - 1] === 'D') curChar = curLine[lane + 1];

        if (curChar === 'D') {
          if (curLine[lane + 1] === 'M') {
            return false; // Found another mine head.
          }

          curChar = 'DL';
          lineI++;
        }

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

  const calculateNoteY = (mode, style, measure, timing, endChar, depth, line, curMeasure) => {
    switch (mode) {
      case 'bm': {
        return (
          [476, 220][measure] -
          (timing === 4
            ? noteSpacing[timing + endChar] * (line / timings[curMeasure.length].length)
            : noteSpacing[timing + endChar] * depth)
        );
      }
      default:
        return (
          [0, 256][measure] +
          (timing === 4
            ? noteSpacing[timing + endChar] * (line / timings[curMeasure.length].length)
            : noteSpacing[timing + endChar] * depth)
        );
    }
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
        let noteY = calculateNoteY(curMode, curStyle, measure, timing, endChar, depth, line, curMeasure);

        if (noteType === '}' || noteType === ']') modstring = false; // note attack declaration ended, OPEN THE DOORS.

        if (modstring) continue; // We're inside a note attack declaration, ignore everything while this is true.

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
              background.blit(holdTop, noteX, noteY);

              if (willHeadEnd(curLane, line + 1, measure)) {
                // In case you're asking where is the note rendering, it is only rendered on the 3 noteType.

                lastNoteByLane[curLane] = ['hold', noteX, noteY + 32, timing + endChar]; // Hold Hook
              } else {
                // If there is not head found in the given 2 measures, then draw a hold till either top of bottom of the canvas.
                const body = await NoteSkin.collectAsset(`holdBody`, timing, endChar, noteType, curLane);
                const note = await NoteSkin.collectAsset(`tapNote`, timing, endChar, noteType, curLane);
                const measureNote = await NoteSkin.collectMeasure('tapNote', timing, endChar, noteType, curLane);

                body.resize(measureNote.width, curMode === 'bm' ? noteY : canvasHeight);
                background.blit(body, noteX, curMode === 'bm' ? 0 : noteY + 32);
                background.blit(note, noteX, noteY);
              }
            }
            break;
          case '4': // Roll
            {
              const rollTop = await NoteSkin.collectAsset('rollTop', timing, endChar, noteType, curLane);
              background.blit(rollTop, noteX, noteY);

              // const note = await NoteSkin.collectAsset(
              //   "tapNote",
              //   timing,
              //   endChar,
              //   noteType,
              //   curLane
              // );
              // background.blit(note, noteX, noteY);

              const measureNote = await NoteSkin.collectMeasure('tapNote', timing, endChar, noteType, curLane);

              if (willHeadEnd(curLane, line + 1, measure)) {
                lastNoteByLane[curLane] = ['roll', noteX, noteY + measureNote.height / 2, timing + endChar]; // Roll Hook
              } else {
                console.log('will not end');
                const body = await NoteSkin.collectAsset(`rollBody`, timing, endChar, noteType, curLane);
                const note = await NoteSkin.collectAsset(`tapNote`, timing, endChar, noteType, curLane);
                const measureNote = await NoteSkin.collectMeasure('tapNote', timing, endChar, noteType, curLane);

                body.resize(measureNote.width, curMode === 'bm' ? noteY : canvasHeight);
                background.blit(body, noteX, curMode === 'bm' ? 0 : noteY + 32);
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

              body.resize(measureNote.width, curMode === 'bm' ? bodyY - noteY - 32 : noteY + 32 - bodyY);
              background.blit(body, bodyX, curMode === 'bm' ? bodyY - 96 : bodyY);

              const measureBottom = await NoteSkin.collectMeasure(
                `${bodyName}Bottom`,
                timing,
                endChar,
                noteType,
                curLane
              );

              const bottom = await NoteSkin.collectAsset(`${bodyName}Bottom`, timing, endChar, noteType, curLane);
              background.blit(bottom, noteX, noteY + measureBottom.height);

              if (bodyName !== 'mine') {
                const note = await NoteSkin.collectAsset(
                  `tapNote`,
                  noteTiming.replace(/\D/g, ''),
                  noteTiming.replace(/\d+/g, ''),
                  noteType,
                  curLane
                );
                background.blit(note, bodyX, bodyY - measureNote.height / 2 - (curMode === 'bm' ? 26 : 0));

                if (curMode === 'bm') {
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
                background.blit(mineTop, noteX, noteY);

                const measureMineTop = await NoteSkin.collectMeasure('mineTop', timing, endChar, noteType, curLane);

                if (willHeadEnd(curLane, line + 1, measure)) {
                  lastNoteByLane[curLane] = ['mine', noteX, noteY + measureMineTop.height]; // Minefield Hook
                } else {
                  const measureNote = await NoteSkin.collectMeasure('tapNote', timing, endChar, noteType, curLane);
                  const body = await NoteSkin.collectAsset(`mineBody`, timing, endChar, noteType, curLane);

                  body.resize(measureNote.width, curMode === 'bm' ? noteY : canvasHeight);
                  background.blit(body, noteX, curMode === 'bm' ? 0 : noteY + 32);
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

                body.resize(measureNote.width, noteY + 32 - bodyY);
                background.blit(body, bodyX, bodyY);

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
                background.blit(bottom, noteX, noteY + measureMineBottom.height);

                const note = await NoteSkin.collectAsset(`tapNote`, timing, endChar, noteType + 'L', curLane);
                background.blit(note, bodyX, bodyY - measureNote.height / 2);

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
