const { SlashCommand, ComponentContext } = require('slash-create');
const { MessageEmbed, MessageActionRow, MessageButton, MessageSelectMenu } = require('discord.js');
const { ArchiveThemesFile } = require('../utils/archivalThemes.js');
const { LeaderboardMessageFile } = require('../utils/leaderboardMessage.js');
const {
  archiveThemeDescription,
  archiveThemesMusicWheelImage,
  archiveEngineID,
  archiveEngineName,
  archiveEngineEmoteData,
  archiveEngineColors,
  archiveGenericEmbedFields,
  archiveEngineLink
} = require('../utils/constants.js');
const ArchiveThemesInstance = new ArchiveThemesFile();

module.exports = class ThemesCommand extends SlashCommand {
  constructor(creator) {
    super(creator, {
      name: 'themes',
      description: 'Get a list of themes with info and more.'
    });
    this.commandVersion = '0.0.2';
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
    if (!ArchiveThemesInstance.mainObject) {
      return;
    }

    if (commandArguments.primalArgument === 'smSelected') {
      await this.leaderboard({
        interaction,
        commandArguments: {
          primalArgument: interaction.values[0].split('━')[3],
          arguments: interaction.values[0].split('━').slice(3),
          version: interaction.values[0].split('━')[1],
          firstSend: false,
          commandID: interaction.values[0].split('━')[0]
        }
      });
      return;
    }

    if (archiveEngineID.includes(commandArguments.primalArgument)) {
      await this.lookUp({
        interaction,
        commandArguments: {
          primalArgument: commandArguments.primalArgument,
          arguments: interaction.values[0].split('━').slice(3),
          version: interaction.values[0].split('━')[1],
          firstSend: false,
          commandID: interaction.values[0].split('━')[0]
        }
      });
      return;
    }

    /**
     *
     * @param {string} engine
     * @returns {string}
     */
    const engineThemeCountString = (engine) => {
      const themeCount = ArchiveThemesInstance.themesForVersion(engine).length;
      return `${archiveEngineName[engine]}: **${themeCount} ${1 >= themeCount ? 'Theme' : 'Themes'}**`;
    };

    const themesInfoEmbed = new MessageEmbed()
      .setTitle('StepMania Archive Themes')
      .setDescription(
        `
        Themes are the frontend of any StepMania Engine, defining how users interact with all menus, the text shown and even the gameplay itself.
        However, each fork version played by the community today expects something different from the scripts that makes up the themes, past work can be lost as time advances and API changes.

        StepMania Archive cames to archive all that work in one place, going beyond themes.

        ${engineThemeCountString('SM3.9')}
        ${engineThemeCountString('SM3.9_Plus')}
        ${engineThemeCountString('SM3.95')}
        ${engineThemeCountString('SM4')}
        ${engineThemeCountString('OITG')}
        ${engineThemeCountString('NITG')}
        ${engineThemeCountString('SM-SSC')}
        ${engineThemeCountString('StepMania 5')}
        ${engineThemeCountString('OutFox')}
        `
      )
      .setThumbnail('https://cdn.discordapp.com/icons/514194672441229323/2ceada703d6a65b57eb3e072ed741185.webp')
      .setURL('https://josevarela.xyz/SMArchive/Themes/index.html')
      .setColor('#30c3c4');

    const smOptions = [];

    for (let i = 0; i < archiveEngineID.length; i++) {
      const currentEngine = archiveEngineID[i];
      const tempObj = {};

      tempObj.label = archiveEngineName[currentEngine];
      tempObj.value = `5━${this.commandVersion}━leaderboard━${currentEngine}━0`;
      tempObj.emoji = archiveEngineEmoteData[currentEngine];

      smOptions.push(tempObj);
    }

    const smSelectMenu = new MessageActionRow().addComponents(
      new MessageSelectMenu()
        .setCustomId(`5━${this.commandVersion}━update━smSelected`)
        .setPlaceholder('Select StepMania Engine')
        .addOptions(smOptions)
    );

    const msgData = {
      embeds: [
        {
          ...themesInfoEmbed,
          ...archiveGenericEmbedFields
        }
      ],
      components: [smSelectMenu]
    };

    if (commandArguments.firstSend) {
      interaction.ctx.send(msgData);
    } else {
      interaction.ctx.editParent(msgData);
    }
  }

  async leaderboard({ interaction, commandArguments }) {
    if (!ArchiveThemesInstance.mainObject) {
      return;
    }

    /**
     * @type {string}
     */
    const fork = commandArguments.primalArgument;
    const page = Number(commandArguments.arguments[1]);
    const themesForFork = ArchiveThemesInstance.themesForVersion(fork);
    const LeaderboardMessageInstance = new LeaderboardMessageFile({ interaction, commandArguments });

    LeaderboardMessageInstance.supportLookUp = true;
    LeaderboardMessageInstance.menuSelectPlaceholder = 'Select Theme to Look Up';

    for (let i = 0; i < themesForFork.length; i++) {
      LeaderboardMessageInstance.addElement(themesForFork[i]);
    }

    const pageEmbed = new MessageEmbed()
      .setTitle('Select Theme')
      .setColor(archiveEngineColors[fork])
      .setURL('https://josevarela.xyz/SMArchive/Themes/index.html')
      .setThumbnail('https://cdn.discordapp.com/icons/514194672441229323/2ceada703d6a65b57eb3e072ed741185.webp')
      .setDescription(LeaderboardMessageInstance.pages.pageList[page]);

    const buttons = new MessageActionRow().addComponents(
      new MessageButton()
        .setLabel('Select Another Engine')
        .setStyle('PRIMARY')
        .setCustomId(`5━${this.commandVersion}━update━0`)
    );

    LeaderboardMessageInstance.page = page;
    const components = LeaderboardMessageInstance.pageComponents;

    components.push(buttons);

    const msgData = {
      embeds: [
        {
          ...pageEmbed,
          ...archiveGenericEmbedFields
        }
      ],
      components: components
    };

    if (commandArguments.firstSend) {
      await interaction.ctx.send(msgData);
    } else {
      await interaction.ctx.editParent(msgData);
    }
  }

  async lookUp({ interaction, commandArguments }) {
    if (!ArchiveThemesInstance.mainObject) {
      return;
    }

    const interactionSplit = interaction.values[0].split('━');
    const page = Number(interactionSplit[3]);
    /**
     * @type {string}
     */
    const engine = commandArguments.primalArgument;
    const themeID = ArchiveThemesInstance.themesForVersion(engine)[page];
    const themeData = ArchiveThemesInstance.themeFromVersion(engine, themeID);
    const themeEmbed = new MessageEmbed()
      .setTitle(`Summary of ${themeData.Name}`)
      .setDescription(archiveThemeDescription[engine] ? archiveThemeDescription[engine][themeID] : themeData.Name)
      .addField('Engine', archiveEngineName[engine], true)
      .setColor(archiveEngineColors[engine])
      .setThumbnail(`https://cdn.discordapp.com/emojis/${archiveEngineEmoteData[engine].id}.webp?quality=lossless`)
      .setURL(
        `https://josevarela.xyz/SMArchive/Themes/ThemePreview.html?Category=${engine.replace(' ', '%20')}&ID=${themeID}`
      );

    if (themeData.HasImages) {
      const engineThemesImg = archiveThemesMusicWheelImage[engine];

      if (engineThemesImg[themeID]) {
        themeEmbed.setImage(engineThemesImg[themeID]);
      }
    }

    const buttons = new MessageActionRow().addComponents(
      new MessageButton()
        .setURL(
          `https://josevarela.xyz/SMArchive/Themes/ThemePreview.html?Category=${engine.replace(
            ' ',
            '%20'
          )}&ID=${themeID}`
        )
        .setLabel('Theme Page')
        .setStyle('LINK'),
      new MessageButton().setURL(archiveEngineLink[engine]).setLabel('Engine Page').setStyle('LINK'),
      new MessageButton()
        .setLabel('Another Theme')
        .setStyle('PRIMARY')
        .setCustomId(`5━${this.commandVersion}━leaderboard━${engine}━0`)
    );

    if (themeData.Date) themeEmbed.addField('Creation Date', themeData.Date, true);
    if (themeData.Author) themeEmbed.addField('Theme Author', themeData.Author, true);
    if (themeData.Version) themeEmbed.addField('Theme Version', themeData.Version, true);

    const msgData = {
      embeds: [
        {
          ...themeEmbed,
          ...archiveGenericEmbedFields
        }
      ],
      components: [buttons]
    };

    if (commandArguments.firstSend) {
      interaction.ctx.send(msgData);
    } else {
      interaction.ctx.editParent(msgData);
    }
  }
};
