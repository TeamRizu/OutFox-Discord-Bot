const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js')
const { SlashCommand, ComponentContext } = require('slash-create');
const { LeaderboardFile } = require('../utils/bhleaderboard.js')
const LeaderboardSheetInstance = new LeaderboardFile()

module.exports = class LeaderboardCommand extends SlashCommand {
  constructor(creator) {
    super(creator, {
      name: 'leaderboard',
      description: 'See the leaderboard for OutFox Bug Hunter.'
    });
    this.commandVersion = '0.0.1'
  }

  /**
   *
   * @param {ComponentContext} ctx
   */
  async run(ctx) {
    await LeaderboardSheetInstance.init();
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

  /**
   *
   * @param {ComponentContext} ctx
   * @param {number} pageIndex
   * @param {boolean} [firstSend]
   */
  async update({interaction, commandArguments}) {
    if (!LeaderboardSheetInstance.pages) {
      return;
    }
    let pageIndex = commandArguments.primalArgument
    pageIndex = Number(pageIndex)
    const pagesNum = LeaderboardSheetInstance.pages.length
    const builtPage = await LeaderboardSheetInstance.buildPage(pageIndex)
    const embed = new MessageEmbed()
    .setTitle('Project OutFox Bug Hunter Leaderboard')
    .setDescription(builtPage)

    const leastPageNum = 0 > (pageIndex - 1) ? 0 : pageIndex - 1
    const maxPageNum = (pageIndex + 1) > (pagesNum - 1) ? pagesNum - 1 : pageIndex + 1

    const buttons = new MessageActionRow()
    .addComponents(
      new MessageButton()
        .setCustomId(`1━${this.commandVersion}━update━${leastPageNum}`)
        .setLabel("Back")
        .setStyle('PRIMARY'),
      new MessageButton()
        .setCustomId(`1━${this.commandVersion}━update━${maxPageNum}`)
        .setLabel('Next')
        .setStyle('PRIMARY')
    )

    const msgData = {
      embeds: [embed],
      components: [buttons]
    }

    if (commandArguments.firstSend) {
      await interaction.ctx.send(msgData)
    } else {
      await interaction.ctx.editParent(msgData)
    }
  }
}
