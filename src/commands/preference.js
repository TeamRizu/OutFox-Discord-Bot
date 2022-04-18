const { SlashCommand } = require('slash-create');
const { LeaderboardMessageFile } = require('../utils/leaderboardMessage.js');
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const { WikiPreferencesFile } = require('../utils/wikiPreferences.js');
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
    await this.update({
      interaction: {
        ctx,
        values: []
      },
      commandArguments: {
        primalArgument: 0,
        arguments: [0, 0],
        version: this.commandVersion,
        firstSend: true,
        commandID: '8'
      }
    });
  }

  async update({ interaction, commandArguments }) {

    if (interaction.values[0]) {
      await this.lookUp({
        interaction,
        commandArguments: {
          primalArgument: commandArguments.primalArgument,
          arguments: interaction.values[0].split('-').slice(3),
          version: interaction.values[0].split('-')[1],
          firstSend: false,
          commandID: interaction.values[0].split('-')[0]
        }
      });
      return;
    }

    await this.leaderboard({ interaction, commandArguments });
  }

  async leaderboard({ interaction, commandArguments }) {
    const page = Number(commandArguments.arguments[1]);
    const preferencesEmbed = new MessageEmbed()
      .setTitle('OutFox Wiki - Preferences')
      .setImage('https://outfox.wiki/logo.png')
      .setURL('https://outfox.wiki/user-guide/config/preferences/')
      .setColor('#002c73');

    const LeaderboardMessageInstance = new LeaderboardMessageFile({ interaction, commandArguments });

    LeaderboardMessageInstance.supportLookUp = true;
    LeaderboardMessageInstance.menuSelectPlaceholder = 'Select Preference to Look Up';

    for (let i = 0; i < PreferencesInstance.preferences.length; i++) {
      LeaderboardMessageInstance.addElement(PreferencesInstance.preferences[i]);
    }

    preferencesEmbed.setFooter({ text: `Page ${page + 1}/${LeaderboardMessageInstance.pages.pageList.length}` })
    preferencesEmbed.setDescription(
      `
      Preferences.ini is a file that contains many of the system preferences. Some of them are accessible within Project OutFox’s settings menu, but some of them are only accessible by editing the file. Manual edits to Preferences.ini must be performed when the game is closed, or else they may be automatically overwritten.

      It is located in the Save [folder](https://outfox.wiki/user-guide/config/folders).

      There is over **${PreferencesInstance.preferences.length}** preferences documented.

      ${LeaderboardMessageInstance.pages.pageList[page]}
      `
    )

    LeaderboardMessageInstance.page = page;

    const msgData = {
      embeds: [preferencesEmbed],
      components: LeaderboardMessageInstance.pageComponents
    };

    if (commandArguments.firstSend) {
      await interaction.ctx.send(msgData);
    } else {
      await interaction.ctx.editParent(msgData);
    }
  }

  async lookUp({ interaction, commandArguments }) {
    const interactionSplit = interaction.values[0].split('-');
    const page = Number(interactionSplit[3]);
    const preferenceName = PreferencesInstance.preferences[page]
    const documentation = PreferencesInstance.mainObject[PreferencesInstance.preferences[page]]
    const preferenceEmbed = new MessageEmbed()
      .setTitle(preferenceName)
      .setColor('#002c73')
      .setDescription(documentation)
      const buttons = new MessageActionRow().addComponents(
        new MessageButton()
          .setURL(`https://outfox.wiki/user-guide/config/preferences/#${preferenceName.toLowerCase().replace(' ', '-')}`)
          .setLabel('See on Page')
          .setStyle('LINK'),
        new MessageButton()
          .setLabel('Another Preference')
          .setStyle('PRIMARY')
          .setCustomId(`8-${this.commandVersion}-leaderboard-0-${commandArguments.arguments[1]}`)
    );

    const msgData = {
      embeds: [preferenceEmbed],
      components: [buttons]
    }

    if (commandArguments.firstSend) {
      interaction.ctx.send(msgData);
    } else {
      interaction.ctx.editParent(msgData);
    }
  }
};
