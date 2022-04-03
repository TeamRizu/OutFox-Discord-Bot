const { SlashCommand } = require('slash-create');
const { MessageEmbed, MessageActionRow, MessageButton, MessageSelectMenu } = require('discord.js');
const { ArchiveThemesFile } = require('../utils/archivalThemes.js');
const { LeaderboardMessageFile } = require('../utils/leaderboardMessage.js');
const ArchiveThemesInstance = new ArchiveThemesFile();

module.exports = class ThemesCommand extends SlashCommand {
  constructor(creator) {
    super(creator, {
      name: 'themes',
      description: 'Get a list of themes with info and more.'
    });
    this.commandVersion = '0.0.1';
  }

  /**
   *
   * @param {ComponentContext} ctx
   */
  async run(ctx) {
    await ArchiveThemesInstance.setup();
    await this.update({
      interaction: {
        ctx,
        values: []
      },
      commandArguments: {
        primalArgument: 0,
        arguments: [0],
        version: this.commandVersion,
        firstSend: true
      }
    });
  }

  async update({ interaction, commandArguments }) {

    if (commandArguments.primalArgument === 'smSelected') {
      await this.leaderboard({
        interaction,
        commandArguments: {
          primalArgument: interaction.values[0].split('-')[3],
          arguments: interaction.values[0].split('-').slice(3),
          version: interaction.values[0].split('-')[1],
          firstSend: false,
          commandID: interaction.values[0].split('-')[0]
        }
      })
      return
    }

    const themesInfoEmbed = new MessageEmbed()
      .setTitle('StepMania Archive Themes')
      .setDescription(
        `
        Themes are the frontend of any StepMania Engine, defining how users interact with all menus, the text shown and even the gameplay itself.
        However, each fork version played by the community today expects something different from the scripts that makes up the themes, past work can be lost as time advances and API changes.

        StepMania Archive cames to archive all that work in one place, going beyond themes.

        StepMania 3.9: **${ArchiveThemesInstance.themesForVersion('SM3.9').length} Themes**
        StepMania 3.9+: **${ArchiveThemesInstance.themesForVersion('SM3.9_Plus').length} Themes**
        StepMania 3.95: **${ArchiveThemesInstance.themesForVersion('SM3.95').length} Themes**
        StepMania 4: **${ArchiveThemesInstance.themesForVersion('SM4').length} Themes**
        OpenITG: **${ArchiveThemesInstance.themesForVersion('OITG').length} Themes**
        NotITG: **${ArchiveThemesInstance.themesForVersion('NITG').length} Theme**
        StepMania 5: **${ArchiveThemesInstance.themesForVersion('StepMania 5').length} Themes**
        Project OutFox: **${ArchiveThemesInstance.themesForVersion('OutFox').length} Themes**
        `
      )
      .setThumbnail('https://cdn.discordapp.com/icons/514194672441229323/2ceada703d6a65b57eb3e072ed741185.webp')
      .setURL('https://josevarela.xyz/SMArchive/Themes/index.html')
      .setColor('#30c3c4')
      .setFooter({
        text: 'StepMania Archive made by Jose_Varela',
        iconURL: 'https://josevarela.xyz/SMArchive/Builds/VersionIcon/SM40.png'
      });

    const smSelectMenu = new MessageActionRow().addComponents(
      new MessageSelectMenu()
        .setCustomId(`5-${this.commandVersion}-update-smSelected`)
        .setPlaceholder('Select StepMania Engine')
        .addOptions([
          {
            label: 'StepMania 3.9',
            value: `5-${this.commandVersion}-leaderboard-SM3.9-0`,
            emoji: {
              name: 'SM39',
              id: '959944386186190870'
            }
          },
          {
            label: 'StepMania 3.9+',
            value: `5-${this.commandVersion}-leaderboard-SM3.9_Plus-0`,
            emoji: {
              name: 'SM39',
              id: '959944386186190870'
            }
          },
          {
            label: 'StepMania 3.95',
            value: `5-${this.commandVersion}-leaderboard-SM3.95-0`,
            emoji: {
              name: 'SM39',
              id: '959944386186190870'
            }
          },
          {
            label: 'StepMania 4',
            value: `5-${this.commandVersion}-leaderboard-SM4-0`,
            emoji: {
              name: 'SM40',
              id: '959944386572091432'
            }
          },
          {
            label: 'OpenITG',
            value: `5-${this.commandVersion}-leaderboard-OITG-0`,
            emoji: {
              name: 'OITG',
              id: '959944386588840076'
            }
          },
          {
            label: 'NotITG',
            value: `5-${this.commandVersion}-leaderboard-NITG-0`,
            emoji: {
              name: 'NITG4',
              id: '959945091324190791'
            }
          },
          {
            label: 'StepMania 5',
            value: `5-${this.commandVersion}-leaderboard-StepMania 5-0`,
            emoji: {
              name: 'SM5',
              id: '959944386567897138'
            }
          },
          {
            label: 'Project OutFox',
            value: `5-${this.commandVersion}-leaderboard-OutFox-0`,
            emoji: {
              name: 'OUTFOX',
              id: '959944386609840148'
            }
          }
        ])
    );

    const msgData = {
      embeds: [themesInfoEmbed],
      components: [smSelectMenu]
    };

    if (commandArguments.firstSend) {
      interaction.ctx.send(msgData);
    } else {
      interaction.ctx.editParent(msgData);
    }
  }

  async leaderboard({ interaction, commandArguments }) {
    const fork = commandArguments.primalArgument;
    const page = Number(commandArguments.arguments[1]);
    const themesForFork = ArchiveThemesInstance.themesForVersion(fork);
    const LeaderboardMessageInstance = new LeaderboardMessageFile({interaction, commandArguments});

    for (let i = 0; i < themesForFork.length; i++) {
      LeaderboardMessageInstance.addElement(themesForFork[i]);
    }

    console.log(`
    fork: ${fork}
    page: ${page}
    themesForFork: ${themesForFork.join(', ')}
    `)
    const pageEmbed = new MessageEmbed().setDescription(LeaderboardMessageInstance.pages.pageList[page]);

    const msgData = {
      embeds: [pageEmbed],
      components: [] // pageComponents customID are going too far, or idk
    };

    if (commandArguments.firstSend) {
      interaction.ctx.send(msgData);
    } else {
      interaction.ctx.editParent(msgData);
    }
  }

  async lookUp({ interaction, commandArguments }) {
    const page = Number(interaction.values.split('-')[3]);
    // const LeaderboardMessageInstance = new LeaderboardMessageFile(interaction, commandArguments);
    const themeData = ArchiveThemesInstance.themeFromVersion(
      commandArguments.primalArgument,
      ArchiveThemesInstance.themesForVersion(commandArguments.primalArgument)[page]
    );
    const themeEmbed = new MessageEmbed().setTitle(themeData.Name);

    const msgData = {
      embeds: [themeEmbed],
      components: []
    };
    if (commandArguments.firstSend) {
      interaction.ctx.send(msgData);
    } else {
      interaction.ctx.editParent(msgData);
    }
  }
};
