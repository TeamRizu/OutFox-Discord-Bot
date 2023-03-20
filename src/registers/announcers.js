const { SlashCommand } = require('slash-create')
const announcersCommand = require('../commands/announcers/main.js').main

module.exports = class AnnouncersCommand extends SlashCommand {
  constructor (creator) {
    super(creator, {
      name: 'announcers',
      description: 'StepMania Archive list of announcers and their authors.'
    })
    this.filePath = __filename
  }

  async run (ctx) {
    announcersCommand(ctx)
  }
}
