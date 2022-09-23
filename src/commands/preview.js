const { EmbedBuilder, SelectMenuBuilder, ActionRowBuilder } = require('discord.js');
const { SlashCommand, CommandOptionType, CommandContext, Message } = require('slash-create');
const { ChartHeaderFile } = require('../utils/chartHeader')
const path = require('path')
const fs = require('fs')
const styledata = JSON.parse(fs.readFileSync(path.join(__dirname, '../measure/styledata.json')));
const modeskins = JSON.parse(fs.readFileSync(path.join(__dirname, '../measure/modeskins.json')));
const styleconfig = JSON.parse(fs.readFileSync(path.join(__dirname, '../measure/styledata.json')));
const { generateChart } = require('../measure/index.js');
const { defaultstyle } = require('../measure/defaultstyle.js');
/**
 *
 * @param {string} input
 * @returns {string[][]}
 */
const tidyUpInput = (input) => {
  if (!input) {
    return null;
  }

  const measureData = [];
  const measures = input.split(',');
  const allowedNumberOfLines = [4, 8, 12, 16, 24, 32, 48, 64, 192];

  for (let measure = 0; measure < 2; measure++) {
    const currentMeasure = measures[measure];
    measureData.push([]);

    const lines = currentMeasure ? currentMeasure.split('\n') : [];

    if (lines.length > 192) {
      console.warn('Measure has more than 192 lines.');
      return null;
    }

    for (let line = 0; line < lines.length; line++) {
      measureData[measure].push(lines[line]);
    }

    if (!allowedNumberOfLines.includes(lines.length)) {
      const closestTimingIndex = allowedNumberOfLines.findIndex((v) => v > lines.length);
      const closestTiming = allowedNumberOfLines[closestTimingIndex];

      if (closestTiming === -1) {
        console.warn('Failed to find closest timing to ', lines.length);
        return null;
      }

      const linesToAdd = closestTiming - lines.length;

      for (let i = 0; i < linesToAdd; i++) {
        measureData[measure].push('');
      }
    }
  }

  return measureData;
};
const supportedModes = Object.keys(defaultstyle)
const defaultNoteHeaderSpacing = '     '
exports.default = class PreviewCommand extends SlashCommand {
  constructor(creator) {
    super(creator, {
      name: 'preview',
      description: 'Preview charts from a file.',
      options: [{
        type: CommandOptionType.ATTACHMENT,
        name: 'file',
        description: 'The file to preview.',
        required: true
      }]
    });

    this.filePath = __filename;
    this.noteskin = 'default'
    this.showLines = true
    this.reverse = false
    this.mode = 'dance'
    this.style = 'single'
  }

  /**
   *
   * @param {CommandContext} ctx
   * @returns
   */
  async run(ctx) {
    await ctx.defer()
    if (0 > ctx.attachments.size) return 'Please attach a file.'
    const attachment = ctx.attachments.first()
    const res = await fetch(attachment.url).catch((e) => console.error(e))

    if (!res) return 'Could not get file data.'

    const file = await res.text().catch((e) => console.error(e))

    if (!file) return 'Could no get file text.'

    const chartHeader = new ChartHeaderFile()
    chartHeader.parse(file)
    const header = chartHeader.headerData

    const charts = chartHeader.headerData.notes
    let isSingleChart = false
    /**
     * @type {string[][]}
     */
    let firstChartNotes = charts[0].stepData.notes
    const singleChartHeader = {
      stepstype: undefined,
      credit: undefined,
      difficulty: undefined,
      meter: undefined
      // radarvalues: undefined
    }

    if (firstChartNotes) {
      const noteHeader = firstChartNotes[0]?.slice(0, 5)

      if (noteHeader && noteHeader.length === 5 && noteHeader.every((e) => e.startsWith(defaultNoteHeaderSpacing) && e.endsWith(':'))) {
        isSingleChart = true

        singleChartHeader.stepstype = noteHeader[0].slice(defaultNoteHeaderSpacing.length, noteHeader[0].length - 1).slice(0, 30)
        singleChartHeader.credit = noteHeader[1].slice(defaultNoteHeaderSpacing.length, noteHeader[1].length - 1).slice(0, 60)
        singleChartHeader.difficulty = noteHeader[2].slice(defaultNoteHeaderSpacing.length, noteHeader[2].length - 1).slice(0, 30)
        singleChartHeader.meter = noteHeader[3].slice(defaultNoteHeaderSpacing.length, noteHeader[3].length - 1).slice(0, 5)
        // singleChartHeader.radarvalues = noteHeader[0].slice(defaultNoteHeaderSpacing.length, noteHeader[0].length - 1)
      }
    }

    /**
     * @type {import('discord.js').APISelectMenuOption[]}
     */
    const chartOptions = []
    let addedAnyNotes = false
    let failedToParseSingle = false

    for (let i = 0; (isSingleChart ? i < 1 : i < Math.min(25, charts.length)); i++) {
      const chart = charts[i]
      const chartMeter = isSingleChart ? singleChartHeader.meter : chart.meter?.slice(0, 5) || '?'
      const chartDifficulty = isSingleChart ? singleChartHeader.difficulty : chart.difficulty?.slice(0, 30) || '?'
      const chartCredit = isSingleChart ? singleChartHeader.credit : chart.credit?.slice(0, 60)
      const chartStepsType = isSingleChart ? singleChartHeader.stepstype : chart.stepstype?.slice(0, 30)
      const chartMode = chartStepsType?.split('-')[0]
      const chartStyle = chartStepsType?.split('-')[1]

      if (!supportedModes.includes(chartMode)) {
        if (isSingleChart) failedToParseSingle = true
        continue
      }

      const supportedStyles = Object.keys(styledata[chartMode]);

      if (!supportedStyles.includes(chartStyle)) {
        failedToParseSingle = true
        continue
      }

      const toDescription = (chartCredit || chartStepsType) ?
      `${chartStepsType || ''}${chartCredit ? ' - ' + chartCredit: ''}` :
      'Unknown'

      chartOptions.push({
        label: `${chartMeter} - ${chartDifficulty}`,
        description: toDescription,
        value: `${i}`
      })
      addedAnyNotes = true
    }

    if (isSingleChart && failedToParseSingle) return 'There was a problem while parsing your chart.'

    const chartEmbedDescription = () => {
      let srt = `
      Name: ${header.title || 'Unknown'}
      Author: ${header.artist || 'Unknown'}
      Credit: ${ isSingleChart ? singleChartHeader.credit.slice(0, 60) : header.credit || 'Unknown'}
      `

      if (isSingleChart) {
        srt += `
        **--- Viewing Chart ---**
        Mode: ${this.mode}
        Meter: ${singleChartHeader.meter}
        Difficulty: ${singleChartHeader.difficulty}
        `
      }

      return srt
    }

    const embed = new EmbedBuilder()
    embed.setTitle(header.title?.slice(0, 256) || 'Title not defined.')
    embed.setDescription(chartEmbedDescription())

    const select = new SelectMenuBuilder()
    .setCustomId('chartselect')
    .addOptions(chartOptions)

    const components = new ActionRowBuilder()

    if (!isSingleChart) {
      select.addComponents(select)
    } else {
      addedAnyNotes = false
      // Don't give selection choice, we only have a single chart.
    }

    // FIRST CASE: Single chart file.

    if (isSingleChart) {
      this.mode = singleChartHeader.stepstype.split('-')[0]
      this.style = singleChartHeader.stepstype.split('-')[1]

      const config = styleconfig[this.mode][this.style]
      this.noteskin = config.defaultNoteskin || 'default'

      const measure0 = firstChartNotes[0].slice(5, 9).join('\n')
      const measure1 = firstChartNotes[1].join('\n')
      const unsafeMeasureData = measure0 + ',' + measure1
      const measureData = tidyUpInput(unsafeMeasureData)

      if (!measureData) return 'Could not parse the notes from your file.'

      const image = await generateChart({
        reverse: this.reverse,
        showMeasureLines: this.showLines,
        curMode: this.mode,
        style: this.style,
        measureData,
        skin: this.noteskin
      }).catch((r) => console.error(r));

      if (!image) return 'Failed to generate chart preview.'

      const imageBuffer = await image.getBufferAsync('image/png')
      /**
      * @type {Message}
      */
      const message = await ctx.send({
        embeds: [embed],
        file: {
          file: imageBuffer,
          name: 'preview.png'
        }
      })

      // TODO: To reduce code, measure date should not be a constant variable, each scope for
      // singleChart/selectChart should redefine measureData.
    }

    /**
     * @type {Message}
     */
    //  const message = await ctx.send({
    //   embeds: [embed],
    //   components: addedAnyNotes ? [components] : []
    // })
    // console.log(chartHeader.headerData.notes[0].stepData)

    // TODO: If single chart then we shouldn't even give option to select.
    /*
    ctx.registerWildcardComponent(message.id, async (cCtx) => {
      const component = cCtx.customID

      if (component === 'chartselect') {
        const chartIndex = Number(cCtx.values[0])

        if (Number.isNaN(chartIndex) || !charts[chartIndex]) {
          message.edit({
            content: 'Something happened and we were not able to get the selected chart.',
            embeds: [],
            components: []
          })
          return
        }

        const chart = charts[chartIndex]

        // TODO: measure command all over again.
      }
    })
    */
  }
}
