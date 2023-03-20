// eslint-disable-next-line no-unused-vars
const { SlashCommand, CommandContext } = require('slash-create')
const buildsCommand = require('../commands/build/main.js').main

module.exports = class BuildCommand extends SlashCommand {
  constructor (creator) {
    super(creator, {
      name: 'build',
      description: 'See documented builds of stepmania.'
    })
  }

  /**
   * @param {CommandContext} ctx
   */
  async run (ctx) {
    buildsCommand(ctx)
  }
}
