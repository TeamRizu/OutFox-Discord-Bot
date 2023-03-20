// eslint-disable-next-line no-unused-vars
const { SlashCommand, CommandOptionType, AutocompleteContext } = require('slash-create')
const { autoComplete } = require('../commands/term')
const main = require('../commands/term/main.js').main

module.exports = class TermCommand extends SlashCommand {
  constructor (creator) {
    super(creator, {
      name: 'term',
      description: 'What does this term mean?',
      options: [
        {
          type: CommandOptionType.STRING,
          name: 'name',
          description: 'Term name',
          required: true,
          autocomplete: true
        }
      ]
    })

    this.filePath = __filename
  }

  /**
   * @async
   * @param {AutocompleteContext} ctx
   */
  async autocomplete (ctx) {
    return await autoComplete(ctx)
  }

  async run (ctx) {
    main(ctx)
  }
}
