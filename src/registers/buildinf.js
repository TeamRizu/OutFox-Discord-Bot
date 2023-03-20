const { SlashCommand, CommandOptionType } = require('slash-create')
const buildinfCommand = require('../commands/buildinf/main.js').main

module.exports = class BuildInf extends SlashCommand {
  constructor (creator) {
    super(creator, {
      name: 'buildinf',
      description: 'Get details from build by hash',
      options: [
        {
          type: CommandOptionType.STRING,
          name: 'hash',
          description: 'Build hash',
          required: true
        }
      ]
    })
    this.filePath = __filename
  }

  async run (ctx) {
    buildinfCommand(ctx)
  }
}
