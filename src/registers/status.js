// eslint-disable-next-line no-unused-vars
const { SlashCommand, ComponentContext } = require('slash-create')
const statusCommand = require('../commands/status/main.js')

module.exports = class StatusCommand extends SlashCommand {
  constructor (creator) {
    super(creator, {
      name: 'status',
      description: 'See the bot technical status.'
    })
  }

  /**
   *
   * @param {ComponentContext} ctx
   */
  async run (ctx) {
    statusCommand.main(ctx)
  }
}
