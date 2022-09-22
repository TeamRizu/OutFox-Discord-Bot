const { EmbedBuilder, SelectMenuBuilder } = require('discord.js');
const { SlashCommand, CommandOptionType, CommandContext, Message } = require('slash-create');
const { ChartHeaderFile } = require('../utils/chartHeader')
const path = require('path')
const fs = require('fs')
const styledata = JSON.parse(fs.readFileSync(path.join(__dirname, '../measure/styledata.json')));
const { defaultstyle } = require('../measure/defaultstyle.js');
const supportedModes = Object.keys(defaultstyle)
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
  }

  /**
   *
   * @param {CommandContext} ctx
   * @returns
   */
  async run(ctx) {
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

    //if (!charts[0] || !charts[0].stepData.meter || !charts[0].stepData.stepstype || !charts[0].stepData.difficulty) return 'This chart does not have the minimun information to be shown.'

    /**
     * @type {import('discord.js').APISelectMenuOption[]}
     */
    const chartOptions = []
    let addedAnyNotes = false

    // FIXME: This cannot go past 25, I'm not sure I want to support more than 25 files.
    for (let i = 0; i < charts.length; i++) {
      const chart = charts[i]
      const chartMeter = chart.meter?.slice(0, 5) || '?'
      const chartDifficulty = chart.difficulty?.slice(0, 30) || '?'
      const chartCredit = chart.credit?.slice(0, 60)
      const chartStepsType = chart.stepstype?.slice(0, 30)
      const chartMode = chartStepsType?.split('-')[0]
      const chartStyle = chartStepsType?.split('-')[1]

      /*
      To make the life of everyone easier, some chart labels can be inside of the notes
      label, it seems this comes most from arrowvortex users, I wish I didn't have to
      support this but too many charts are like this so we need to look this up.
      */

      if (!supportedModes.includes(chartMode)) continue

      const supportedStyles = Object.keys(styledata[chartMode]);

      if (!supportedStyles.includes(chartStyle)) continue

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

    const embed = new EmbedBuilder()
    embed.setTitle(header.title?.slice(0, 256) || 'Title not defined.')
    embed.setDescription(`
    Name: ${header.title || 'Unknown'}
    Author: ${header.artist || 'Unknown'}
    Credit: ${header.credit || 'Unknown'}
    `)

    const select = new SelectMenuBuilder()
    .setCustomId('chartselect')
    .addOptions(chartOptions)

    /**
     * @type {Message}
     */
    const message = await ctx.send({
      embeds: [embed],
      components: addedAnyNotes ? [select] : []
    })
    console.log(chartHeader.headerData.notes[0].stepData)

    // return 'console';

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
  }
}
