// eslint-disable-next-line no-unused-vars
const { SlashCommand, CommandContext } = require('slash-create')
const creditsCommand = require('../commands/credits/main.js').main

module.exports = class CreditsCommand extends SlashCommand {
  constructor (creator) {
    super(creator, {
      name: 'credits',
      description: 'See documented credits of sm forks.'
    })
  }

  /**
   * @param {CommandContext} ctx
   */
  async run (ctx) {
    creditsCommand(ctx)
  }
}
