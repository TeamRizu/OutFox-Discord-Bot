const { LanguagestatusFile } = require('../utils/languagestatus.js')
const { SlashCommand } = require('slash-create');
const LanguageStatusSheetInstance = new LanguagestatusFile()

module.exports = class LanguagestatusCommand extends SlashCommand {
  constructor(creator) {
    super(creator, {
      name: 'languagestatus',
      description: 'See the status of OutFox localization.'
    });
  }

  /**
   *
   * @param {ComponentContext} ctx
   */
  async run(ctx) {
    LanguageStatusSheetInstance.init()

    return 'check it out'
  }
}
