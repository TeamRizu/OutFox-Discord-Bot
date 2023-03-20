// eslint-disable-next-line no-unused-vars
const { SlashCommand, CommandContext } = require('slash-create')
const themeCommand = require('../commands/theme/main.js').main

module.exports = class ThemeCommand extends SlashCommand {
  constructor (creator) {
    super(creator, {
      name: 'theme',
      description: 'Get a list of themes with info and more.'
    })
  }

  /**
   * @param {CommandContext} ctx
   */
  async run (ctx) {
    themeCommand(ctx)
  }
}
