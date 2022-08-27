const fs = require('fs')
const path = require('path')
const stringSimilarity = require("string-similarity");
const { SlashCommand, ComponentContext, CommandOptionType, ComponentType, TextInputStyle } = require('slash-create');
// const { ChartHeaderFile } = require('../utils/chartHeader.js')
const styledata = JSON.parse( fs.readFileSync(path.join(__dirname, '../measure/styledata.json')) );
const { generateChart } = require('../measure/index.js')
const { defaultstyle } = require('../measure/defaultstyle.js')
const tidyUpInput = (input) => {
  if (!input) {
    return null;
  }

  const measureData = []
  const measures = input.split(",")
  const allowedNumberOfLines = [4, 8, 12, 16, 24, 32, 48, 64, 192]

  for (let measure = 0; measure < 2; measure++) {
    const currentMeasure = measures[measure]
    measureData.push([])

    const lines = currentMeasure ? currentMeasure.split('\n') : []

    if (lines.length > 192) {
      console.warn('Measure has more than 192 lines.')
      return null
    }

    for (let line = 0; line < lines.length; line++) {
      measureData[measure].push(lines[line])
    }

    if (!allowedNumberOfLines.includes(lines.length)) {
      const closestTimingIndex = allowedNumberOfLines.findIndex((v) => v > lines.length)
      const closestTiming = allowedNumberOfLines[closestTimingIndex]

      if (closestTiming === -1) {
        console.warn('Failed to find closest timing to ', lines.length)
        return null
      }

      const linesToAdd = closestTiming - lines.length

      for (let i = 0; i < linesToAdd; i++) {
        measureData[measure].push('')
      }
    }
  }

  return measureData
}

module.exports = class SMReaderCommand extends SlashCommand {
  constructor(creator) {
    super(creator, {
      name: 'measure',
      description: 'Preview a measure.',
      options: [
        {
          type: CommandOptionType.STRING,
          name: 'gamemode',
          description: "Select Gamemode",
          required: true,
          autocomplete: true
        },
        {
          type: CommandOptionType.STRING,
          name: 'style',
          description: "Select Style",
          autocomplete: true
        },
        {
          type: CommandOptionType.BOOLEAN,
          name: 'reverse',
          description: 'Enable Reverse Scroll?',
          required: false
        },
        {
          type: CommandOptionType.BOOLEAN,
          name: 'lines',
          description: 'Show Measure Lines?',
          required: false
        }
      ]
    });
  }

  async autocomplete(ctx) {
    if (!ctx.focused) return [{ name : 'Dance', value: 'dance' }]

    const input = ctx.options[ctx.focused]
    let matches
    let result
    switch (ctx.focused) {
      case 'style':
        if (!Object.keys(defaultstyle).includes(ctx.options.gamemode)) {
          matches = '' // Mode is not supported so blank style.
        } else {
          const supportedStyles = Object.keys(styledata[ctx.options.gamemode])
          matches = input === '' ? defaultstyle[ctx.options.gamemode] : stringSimilarity.findBestMatch(input, supportedStyles)
        }
      break
      default: // gamemode
        matches = stringSimilarity.findBestMatch(input, Object.keys(defaultstyle))
      break
    }

    if (matches) {
      result = typeof matches === 'object' ? matches.bestMatch.target : matches
    } else {
      result = input
    }

    return [{
      name: result,
      value: result
    }]
  }
  /**
   *
   * @param {ComponentContext} ctx
   */
  async run(ctx) {
    const gamemode = ctx.options.gamemode
    let style = ctx.options.style

    if (!Object.keys(defaultstyle).includes(gamemode)) {
      ctx.send('That gamemode doesn\'t look like a gamemode I support.')
      return
    }

    if (!Object.keys(styledata[gamemode]).includes(style)) {
      ctx.options.style = defaultstyle[gamemode]
    }

    ctx.sendModal(
      {
        title: 'Measure Preview',
        components: [
          {
            type: ComponentType.ACTION_ROW,
            components: [
              {
                type: ComponentType.TEXT_INPUT,
                label: 'Measure Data',
                style: TextInputStyle.PARAGRAPH,
                custom_id: 'measure_data',
                placeholder: '0100\n0010\n0001\n1000'
              }
            ]
          }
        ]
      },
      async (iCtx) => {
        console.log(ctx)
        const input = iCtx.values.measure_data
        const measureData = tidyUpInput(input)
        const curMode = ctx.options.gamemode
        const curStyle = ctx.options.style
        const reverse = !!ctx.options.reverse // reverse might not be present at all
        const showMeasureLines = Object.keys(ctx.options).includes('lines') ? ctx.options.lines : true

        if (!measureData) {
          iCtx.send('Unable to process given measureData, did you type something funny?')
          return
        }

        const image = await generateChart({
          reverse,
          showMeasureLines,
          curMode,
          style: curStyle,
          measureData
        }).catch((r) => console.error(r))

        if (!image) {
          iCtx.send('Failed to generate image...')
          return
        }

        // console.log(image.getBufferAsync("image/png"))
        iCtx.send({
          file: {
            file: await image.getBufferAsync("image/png"),
            name: `${curMode}_${curStyle}.png`
          }
        })
      }
    )
  }
}
