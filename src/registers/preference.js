// eslint-disable-next-line no-unused-vars
const { SlashCommand, CommandContext } = require('slash-create')
const preferenceCommand = require('../commands/preference/main.js').main

module.exports = class PreferenceCommand extends SlashCommand {
  constructor (creator) {
    super(creator, {
      name: 'preference',
      description: 'Get documentation from requested preference.'
    })
  }

  /**
   * @param {CommandContext} ctx
   */
  async run (ctx) {
    preferenceCommand(ctx)
  }
}
