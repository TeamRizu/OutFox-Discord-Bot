const { EmbedBuilder } = require('discord.js');
const { SlashCommand, ComponentContext } = require('slash-create');
const { LanguagestatusFile } = require('../utils/languagestatusSpreadsheet.js');
const LanguagestatusInstance = new LanguagestatusFile();

module.exports = class LanguageStatusCommand extends SlashCommand {
  constructor(creator) {
    super(creator, {
      name: 'languagestatus',
      description: 'See the status of Project OutFox translation.'
    });
  }

  /**
   *
   * @param {ComponentContext} ctx
   */
  async run(ctx) {
    await LanguagestatusInstance.init();
    await ctx.defer();

    const versionsLanguage = [];
    const embed = new EmbedBuilder()
      .setTitle(`Language status of Project OutFox Alpha ${LanguagestatusInstance.versions[0]} (latest)`)
      .setColor('#ADBAC7')
      .setThumbnail('https://avatars.githubusercontent.com/u/66173034?s=200&v=4')
      .setURL('https://github.com/Tiny-Foxes/OutFox-Translations');

    for (let i = 0; i < LanguagestatusInstance.languages.length; i++) {
      versionsLanguage.push(`${LanguagestatusInstance.languages[i]} - ${LanguagestatusInstance.status[0][i]}`);
    }

    embed.setDescription(versionsLanguage.join('\n'));

    await ctx.send({
      embeds: [embed]
    });
  }
};
