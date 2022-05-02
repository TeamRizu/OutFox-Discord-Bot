const { MessageEmbed } = require('discord.js');
const { SlashCommand, ComponentContext } = require('slash-create');
const { LanguagestatusFile } = require('../utils/languagestatusSpreadsheet.js')
const LanguagestatusInstance = new LanguagestatusFile()

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
    await LanguagestatusInstance.init()
    await this.update({
      interaction: {
        ctx,
        values: []
      },
      commandArguments: {
        primalArgument: '0',
        arguments: ['0'],
        version: this.commandVersion,
        firstSend: true
      }
    })
  }

  async update({interaction, commandArguments}) {
    const versionsLanguage = []
    const embed = new MessageEmbed()
      .setTitle(`Language status of Project OutFox Alpha ${LanguagestatusInstance.versions[0]} (latest)`)
      .setColor('#ADBAC7')
      .setThumbnail('https://avatars.githubusercontent.com/u/66173034?s=200&v=4')
      .setURL('https://github.com/Tiny-Foxes/OutFox-Translations')

    for (let i = 0; i < LanguagestatusInstance.languages.length; i++) {
      versionsLanguage.push(`${LanguagestatusInstance.languages[i]} - ${LanguagestatusInstance.status[0][i]}`)
    }

    embed.setDescription(versionsLanguage.join('\n'))
    interaction.ctx.send({
      embeds: [embed]
    })
  }
}
