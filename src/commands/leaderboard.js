const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { SlashCommand, ComponentContext, Message } = require('slash-create');
const { LeaderboardFile } = require('../utils/bhleaderboard.js');
const LeaderboardSheetInstance = new LeaderboardFile();

module.exports = class LeaderboardCommand extends SlashCommand {
  constructor(creator) {
    super(creator, {
      name: 'leaderboard',
      description: 'See the leaderboard for OutFox Bug Hunter.'
    });
    this.commandVersion = '0.0.2';
  }

  /**
   *
   * @param {ComponentContext} ctx
   */
  async run(ctx) {
    await LeaderboardSheetInstance.init();
    await ctx.defer();
    const pagesNum = LeaderboardSheetInstance.pages.length;
    const buildEmbed = async (pageIndex) => {
      const builtPage = await LeaderboardSheetInstance.buildPage(pageIndex);
      const embed = new EmbedBuilder().setTitle('Project OutFox Bug Hunter Leaderboard').setDescription(builtPage);

      return embed;
    };

    const buildComponents = (pageIndex) => {
      const leastPageNum = 0 > pageIndex - 1 ? 0 : pageIndex - 1;
      const maxPageNum = pageIndex + 1 > pagesNum - 1 ? pagesNum - 1 : pageIndex + 1;
      const buttons = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId(`back+${leastPageNum}`).setLabel('Back').setStyle(ButtonStyle.Primary),
        new ButtonBuilder().setCustomId(`next+${maxPageNum}`).setLabel('Next').setStyle(ButtonStyle.Primary)
      );

      return [buttons];
    };

    const embed = await buildEmbed(0);
    const components = buildComponents(0);

    /**
     * @type {Message}
     */
    const message = await ctx.send({
      embeds: [embed],
      components
    });

    ctx.registerWildcardComponent(message.id, async (cCtx) => {
      const component = cCtx.customID;

      if (!component.startsWith('next') && !component.startsWith('back')) return;

      // Cast to number because buildComponents will try to concat strings otherwise.
      const page = Number(component.split('+')[1]);

      const newEmbed = await buildEmbed(page);
      const newComponents = buildComponents(page);
      await cCtx.acknowledge();
      await message.edit({
        embeds: [newEmbed],
        components: newComponents
      });
    });
  }
};
