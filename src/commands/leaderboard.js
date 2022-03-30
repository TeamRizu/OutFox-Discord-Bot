const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js')
const { SlashCommand, ComponentContext } = require('slash-create');
const { LeaderboardFile } = require('../utils/bhleaderboard.js')
const LeaderboardSheetInstance = new LeaderboardFile()

module.exports = class LeaderboardCommand extends SlashCommand {
  constructor(creator) {
    super(creator, {
      name: 'leaderboard',
      description: 'See the leaderboard for OutFox Bug Hunter'
    });
  }

  /**
   *
   * @param {ComponentContext} ctx
   */
  async run(ctx) {
    await LeaderboardSheetInstance.init();
    await this.update(ctx, 0, true)
  }

  /**
   *
   * @param {ComponentContext} ctx
   * @param {number} pageIndex
   * @param {boolean} [firstSend]
   */
  async update(ctx, pageIndex, firstSend) {
    if (!LeaderboardSheetInstance.pages) {
      return;
    }
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
        .setCustomId(`1-${ctx.interactionID}-${leastPageNum}`)
        .setLabel("Back")
        .setStyle('PRIMARY'),
      new MessageButton()
        .setCustomId(`1-${ctx.interactionID}-${maxPageNum}`)
        .setLabel('Next')
        .setStyle('PRIMARY')
    )

    const msgData = {
      embeds: [embed],
      components: [buttons]
    }

    if (firstSend) {
      await ctx.send(msgData)
    } else {
      await ctx.editParent(msgData)
    }
  }
}
