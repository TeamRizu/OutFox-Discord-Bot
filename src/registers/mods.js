// eslint-disable-next-line no-unused-vars
const { SlashCommand, CommandContext } = require('slash-create')
const modsCommand = require('../commands/mods/main.js').main

module.exports = class ModsCommand extends SlashCommand {
  constructor (creator) {
    super(creator, {
      name: 'mods',
      description: 'View converted modfiles.'
    })
  }

  /**
   * @param {CommandContext} ctx
   */
  async run (ctx) {
    modsCommand(ctx)
  }
}
