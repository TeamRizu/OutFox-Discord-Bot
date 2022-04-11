const { SlashCommand } = require('slash-create');
const { LeaderboardMessageFile } = require('../utils/leaderboardMessage.js');
const { MessageEmbed, MessageActionRow, MessageButton, MessageSelectMenu } = require('discord.js');
const { WikiPreferencesFile } = require('../utils/wikiPreferences.js');
const { archiveGenericEmbedFields } = require('../utils/constants.js')
const PreferencesInstance = new WikiPreferencesFile();

module.exports = class PreferenceCommand extends SlashCommand {
  constructor(creator) {
    super(creator, {
      name: 'preference',
      description: 'Get documentation from any preference.'
    });
    this.commandVersion = '0.0.1';
  }

  /**
   *
   * @param {ComponentContext} ctx
   */
  async run(ctx) {
    await PreferencesInstance.setup();
    console.log(PreferencesInstance.preferences)
    ctx.send('fine')
  }
};
