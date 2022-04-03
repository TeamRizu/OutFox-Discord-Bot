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
      });
      return;
    }

    const acceptedScreens = ['OutFox', 'StepMania 5', 'SM4', 'NITG', 'OITG', 'SM3.95', 'SM3.9_Plus', 'SM3.9'];
    if (acceptedScreens.includes(commandArguments.primalArgument)) {
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
    const engineColors = {
      OutFox: '#bad0ff',
      NITG: '#e2e5e0',
      OITG: '#e00207',
      'StepMania 5': '#fc9768',
      SM4: '#cc0000',
      'SM3.95': '#b9b423',
      'SM3.9': '#b9b423',
      'SM3.9_Plus': '#b9b423'
    }
    const page = Number(commandArguments.arguments[1]);
    const themesForFork = ArchiveThemesInstance.themesForVersion(fork);
    const LeaderboardMessageInstance = new LeaderboardMessageFile({ interaction, commandArguments });
    LeaderboardMessageInstance.supportLookUp = true;
    LeaderboardMessageInstance.menuSelectPlaceholder = 'Select Theme to LookUp';
    for (let i = 0; i < themesForFork.length; i++) {
      LeaderboardMessageInstance.addElement(themesForFork[i]);
    }

    const pageEmbed = new MessageEmbed()
    .setTitle('Select Theme')
    .setColor(engineColors[fork])
    .setFooter({
      text: 'StepMania Archive made by Jose_Varela',
      iconURL: 'https://josevarela.xyz/SMArchive/Builds/VersionIcon/SM40.png'
    })
    .setURL('https://josevarela.xyz/SMArchive/Themes/index.html')
    .setThumbnail('https://cdn.discordapp.com/icons/514194672441229323/2ceada703d6a65b57eb3e072ed741185.webp')
    .setDescription(LeaderboardMessageInstance.pages.pageList[page]);

    const buttons = new MessageActionRow().addComponents(
      new MessageButton()
        .setLabel('Select Another Engine')
        .setStyle('PRIMARY')
        .setCustomId(`5-${this.commandVersion}-update-0`)
    );

    LeaderboardMessageInstance.page = page;
    const components = LeaderboardMessageInstance.pageComponents
    components.push(buttons)
    const msgData = {
      embeds: [pageEmbed],
      components: components
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
    // const LeaderboardMessageInstance = new LeaderboardMessageFile(interaction, commandArguments);
    const engine = commandArguments.primalArgument;
    const themeID = ArchiveThemesInstance.themesForVersion(engine)[page];
    const themeData = ArchiveThemesInstance.themeFromVersion(engine, themeID);
    const engineNames = {
      OutFox: 'Project OutFox',
      NITG: 'NotITG',
      OITG: 'OpenITG',
      'StepMania 5': 'StepMania 5',
      SM4: 'StepMania 4',
      'SM3.95': 'Stepmania 3.95',
      'SM3.9': 'StepMania 3.9',
      'SM3.9_Plus': 'StepMania 3.9+'
    };
    const engineColors = {
      OutFox: '#bad0ff',
      NITG: '#e2e5e0',
      OITG: '#e00207',
      'StepMania 5': '#fc9768',
      SM4: '#cc0000',
      'SM3.95': '#b9b423',
      'SM3.9': '#b9b423',
      'SM3.9_Plus': '#b9b423'
    }
    const engineIcon = {
      OutFox: '959944386609840148',
      NITG: '959945091324190791',
      OITG: '959944386588840076',
      'StepMania 5': '959944386567897138',
      SM4: '959944386572091432',
      'SM3.95': '959944386186190870',
      'SM3.9': '959944386186190870',
      'SM3.9_Plus': '959944386186190870'
    }
    const themeEmbed = new MessageEmbed()
      .setTitle(`Summary of ${themeData.Name}`)
      .setDescription(themeData.Name)
      .addField('Theme Version', engineNames[engine], true)
      .setColor(engineColors[engine])
      .setThumbnail(`https://cdn.discordapp.com/emojis/${engineIcon[engine]}.webp?quality=lossless`)
      .setURL(`https://josevarela.xyz/SMArchive/Themes/ThemePreview.html?Category=${engine.replace(' ', '%20')}&ID=${themeID}`)
      .setFooter({
        text: 'StepMania Archive made by Jose_Varela',
        iconURL: 'https://josevarela.xyz/SMArchive/Builds/VersionIcon/SM40.png'
      });
    const buttons = new MessageActionRow().addComponents(
      new MessageButton()
        .setURL(`https://josevarela.xyz/SMArchive/Themes/ThemePreview.html?Category=${engine.replace(' ', '%20')}&ID=${themeID}`)
        .setLabel('See Theme Page')
        .setStyle('LINK'),
      new MessageButton()
        .setLabel('Select Another Theme')
        .setStyle('PRIMARY')
        .setCustomId(`5-${this.commandVersion}-leaderboard-${engine}-0`)
    );

    if (themeData.Date) themeEmbed.addField('Creation Date', themeData.Date, true);
    if (themeData.Author) themeEmbed.addField('Theme Author', themeData.Author, true);
    if (themeData.Version) themeEmbed.addField('Theme Version', themeData.Version, true);

    const msgData = {
      embeds: [themeEmbed],
      components: [buttons]
    };

    if (commandArguments.firstSend) {
      interaction.ctx.send(msgData);
    } else {
      interaction.ctx.editParent(msgData);
    }
  }
};
