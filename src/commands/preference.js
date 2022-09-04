const { SlashCommand, ComponentContext, Message } = require('slash-create');
const { LeaderboardMessageFile } = require('../utils/leaderboardMessage.js');
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { WikiPreferencesFile } = require('../utils/wikiPreferences.js');
const PreferencesInstance = new WikiPreferencesFile();

module.exports = class PreferenceCommand extends SlashCommand {
  constructor(creator) {
    super(creator, {
      name: 'preference',
      description: 'Get documentation from any preference.'
    });
    this.commandVersion = '0.0.2';
  }

  /**
   *
   * @param {ComponentContext} ctx
   */
  async run(ctx) {
    await ctx.defer();
    const LeaderboardMessageInstance = new LeaderboardMessageFile();

    LeaderboardMessageInstance.supportLookUp = true;
    LeaderboardMessageInstance.menuSelectPlaceholder = 'Select Preference to Look Up';
    LeaderboardMessageInstance.separator = '+';

    for (let i = 0; i < PreferencesInstance.preferences.length; i++) {
      LeaderboardMessageInstance.addElement({
        description: PreferencesInstance.preferences[i],
        value: `${i}`
      });
    }

    const buildEmbed = (page, LeaderboardInstance) => {
      const preferencesEmbed = new EmbedBuilder()
        .setTitle('OutFox Wiki - Preferences')
        .setImage('https://outfox.wiki/logo.png')
        .setURL('https://outfox.wiki/user-guide/config/preferences/')
        .setColor('#002c73')
        .setFooter({ text: `Page ${page + 1}/${LeaderboardInstance.pages.pageList.length}` })
        .setDescription(
          `
          Preferences.ini is a file that contains many of the system preferences. Some of them are accessible within Project OutFox’s settings menu, but some of them are only accessible by editing the file. Manual edits to Preferences.ini must be performed when the game is closed, or else they may be automatically overwritten.

          It is located in the Save [folder](https://outfox.wiki/user-guide/config/folders).

          There is over **${PreferencesInstance.preferences.length}** preferences documented.

          ${LeaderboardInstance.pages.pageList[page]}
          `
        );

      return preferencesEmbed;
    };

    const embed = buildEmbed(0, LeaderboardMessageInstance);

    /**
     * @type {Message}
     */
    const message = await ctx.send({
      embeds: [embed],
      components: LeaderboardMessageInstance.pageComponents
    });

    ctx.registerWildcardComponent(message.id, async (cCtx) => {
      const component = cCtx.customID;

      if (component === 'startagain') {
        const newEmbed = buildEmbed(LeaderboardMessageInstance.page, LeaderboardMessageInstance)
        await cCtx.acknowledge();
        await message.edit({
          embeds: [newEmbed],
          components: LeaderboardMessageInstance.pageComponents
        });
      }

      if (component.startsWith('next') || component.startsWith('back')) {
        const newPage = Number(component.split('+')[1]);

        LeaderboardMessageInstance.page = newPage;

        const newEmbed = buildEmbed(newPage, LeaderboardMessageInstance);

        await cCtx.acknowledge();
        await message.edit({
          embeds: [newEmbed],
          components: LeaderboardMessageInstance.pageComponents
        });
      }

      if (component.startsWith('updatepage')) {
        const preferenceIndex = Number(cCtx.values[0]);
        const preferenceName = PreferencesInstance.preferences[preferenceIndex];
        const documentation = PreferencesInstance.mainObject[preferenceName];
        const preferenceEmbed = new EmbedBuilder()
          .setTitle(preferenceName)
          .setColor('#002c73')
          .setDescription(documentation);
        const buttons = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setURL(
              `https://outfox.wiki/user-guide/config/preferences/#${preferenceName}`
            )
            .setLabel('See on Page')
            .setStyle(ButtonStyle.Link),
          new ButtonBuilder().setLabel('Another Preference').setStyle(ButtonStyle.Primary).setCustomId('startagain')
        );

        await cCtx.acknowledge();
        await message.edit({
          embeds: [preferenceEmbed],
          components: [buttons]
        });
      }
    });
  }
};
