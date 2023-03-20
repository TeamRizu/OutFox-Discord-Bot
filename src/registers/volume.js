// eslint-disable-next-line no-unused-vars
const { SlashCommand, ComponentContext } = require('slash-create')
const volumesCommand = require('../commands/volumes/main.js')

module.exports = class VolumeCommand extends SlashCommand {
  constructor (creator) {
    super(creator, {
      name: 'volume',
      description: 'Get information about Serenity Volumes.'
    })
  }

  /**
   *
   * @param {ComponentContext} ctx
   */
  async run (ctx) {
    volumesCommand.main(ctx)
  }
}
