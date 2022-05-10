const { SlashCommand, ComponentContext, CommandOptionType } = require('slash-create');
const { ChartHeaderFile } = require('../utils/chartHeader.js')
const ChartHeaderInstance = new ChartHeaderFile()
const requestPromise = require('request-promise')
module.exports = class SMReaderCommand extends SlashCommand {
  constructor(creator) {
    super(creator, {
      name: 'smreader',
      description: 'Read sm files.',
      options: [{
        type: CommandOptionType.ATTACHMENT,
        name: 'smfile',
        description: 'The smfile to parse.',
        required: true
      }]
    });
  }

  /**
   *
   * @param {ComponentContext} ctx
   */
  async run(ctx) {
    const fileURL = Object.values(ctx.data.data.resolved.attachments)[0].url
    /*
    const file = ctx.attachments.entries().next().value
    const fileName = file[0].filename
    const fileURL = file[0].url
    */
    const fileBody = await requestPromise(fileURL)
    ChartHeaderInstance.parse(fileBody)
  }
}
