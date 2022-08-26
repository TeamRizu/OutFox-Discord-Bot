const { SlashCommand, ComponentContext, CommandOptionType, ComponentType, TextInputStyle } = require('slash-create');
// const { ChartHeaderFile } = require('../utils/chartHeader.js')
const { generateChart } = require('../measure/index.js')
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
      options: [{
        type: CommandOptionType.STRING,
        name: 'gamemode',
        description: "Enter the gamemode name.",
        required: true
      }]
    });
  }

  /**
   *
   * @param {ComponentContext} ctx
   */
  async run(ctx) {
    ctx.sendModal(
      {
        title: 'Measure Preview',
        components: [
          {
            type: ComponentType.ACTION_ROW,
            components: [
              {
                type: ComponentType.TEXT_INPUT,
                label: 'measureData',
                style: TextInputStyle.PARAGRAPH,
                custom_id: 'measure_data',
                placeholder: 'Hello'
              }
            ]
          }
        ]
      },
      async (iCtx) => {
        const input = iCtx.values.measure_data
        const measureData = tidyUpInput(input)
        const image = await generateChart({
          reverse: false,
          curMode: 'dance',
          style: 'single',
          measureData
        })

        // console.log(image.getBufferAsync("image/png"))
        iCtx.send({
          file: {
            file: await image.getBufferAsync("image/png"),
            name: 'something.png'
          }
        })
      }
    )
  }
}
