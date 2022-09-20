const { EmbedBuilder } = require('discord.js');
const { SlashCommand, CommandOptionType, CommandContext } = require('slash-create');
const { ChartHeaderFile } = require('../utils/chartHeader')
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

    const embed = new EmbedBuilder()
    embed.setTitle(header.title?.slice(0, 256) || 'Title not defined.')
    embed.setAuthor({
      name: header.artist ? `Song by ${header.artist.slice(0, 256)}` : 'Unknown Song Artist',
    })

    ctx.send({
      embeds: [embed]
    })
    console.log(chartHeader.headerData.notes[0].stepData)

    return 'console';
  }
}
