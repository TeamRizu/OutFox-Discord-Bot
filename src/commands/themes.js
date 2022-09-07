const { SlashCommand, ComponentContext, Message } = require('slash-create');
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, SelectMenuBuilder } = require('discord.js');
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
    this.commandVersion = '0.0.3';
  }

  /**
   *
   * @param {ComponentContext} ctx
   */
  async run(ctx) {
    await ArchiveThemesInstance.setup();
    await ctx.defer();

    /**
     *
     * @param {string} engine
     * @returns {string}
     */
    const engineThemeCountString = (engine) => {
      const themeCount = ArchiveThemesInstance.themesForVersion(engine).length;
      return `${archiveEngineName[engine]}: **${themeCount} ${1 >= themeCount ? 'Theme' : 'Themes'}**`;
    };

    const themesInfoEmbed = new EmbedBuilder()
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
      tempObj.value = currentEngine;
      tempObj.emoji = archiveEngineEmoteData[currentEngine];

      smOptions.push(tempObj);
    }

    const smSelectMenu = new ActionRowBuilder().addComponents(
      new SelectMenuBuilder().setCustomId(`smselected`).setPlaceholder('Select StepMania Engine').addOptions(smOptions)
    );

    /**
     * @type {Message}
     */
    const message = await ctx.send({
      embeds: [themesInfoEmbed],
      components: [smSelectMenu]
    });

    const buildPageThemesForEngine = (engine, page, LeaderboardInstance) => {
      const pageEmbed = new EmbedBuilder()
        .setTitle('Select Theme')
        .setColor(archiveEngineColors[engine])
        .setURL('https://josevarela.xyz/SMArchive/Themes/index.html')
        .setThumbnail('https://cdn.discordapp.com/icons/514194672441229323/2ceada703d6a65b57eb3e072ed741185.webp')
        .setDescription(LeaderboardInstance.pages.pageList[page]);

      return pageEmbed;
    };

    const buildComponentsThemesForEngine = (LeaderboardInstance) => {
      const buttons = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setLabel('Select Another Engine').setStyle(ButtonStyle.Primary).setCustomId(`startagain`)
      );

      const components = LeaderboardInstance.pageComponents;

      components.push(buttons);

      return components;
    };

    const LeaderboardMessageInstance = new LeaderboardMessageFile();

    ctx.registerComponent('startagain', async (cCtx) => {
      await cCtx.acknowledge();
      await message.edit({
        embeds: [themesInfoEmbed],
        components: [smSelectMenu]
      });
    });

    ctx.registerComponent('smselected', async (cCtx) => {
      await cCtx.acknowledge();
      const engine = cCtx.values[0];
      const themesForFork = ArchiveThemesInstance.themesForVersion(engine);

      LeaderboardMessageInstance.supportLookUp = true;
      LeaderboardMessageInstance.menuSelectPlaceholder = 'Select Theme to Look Up';
      LeaderboardMessageInstance.separator = '+';
      LeaderboardMessageInstance.pageSwitchArgument = engine;

      for (let i = 0; i < themesForFork.length; i++) {
        const themeData = ArchiveThemesInstance.themeFromVersion(engine, themesForFork[i]);
        LeaderboardMessageInstance.addElement({
          description: themeData.Name,
          value: `${engine}+${i}`
        });
      }

      const newEmbed = buildPageThemesForEngine(engine, 0, LeaderboardMessageInstance);
      const newComponents = buildComponentsThemesForEngine(LeaderboardMessageInstance);

      await message.edit({
        embeds: [newEmbed],
        components: newComponents
      });
    });

    ctx.registerWildcardComponent(message.id, async (wCtx) => {
      const component = wCtx.customID;

      if (component === 'themechange') {
        await wCtx.acknowledge();
        const engine = LeaderboardMessageInstance.pageSwitchArgument;
        const newEmbed = buildPageThemesForEngine(engine, LeaderboardMessageInstance.page, LeaderboardMessageInstance);
        const newComponents = buildComponentsThemesForEngine(LeaderboardMessageInstance);

        await message.edit({
          embeds: [newEmbed],
          components: newComponents
        });
      }

      if (component.startsWith('back') || component.startsWith('next')) {
        await wCtx.acknowledge();
        const newPage = Number(component.split('+')[1]);
        const engine = component.split('+')[2];

        LeaderboardMessageInstance.page = newPage;

        const newEmbed = buildPageThemesForEngine(engine, LeaderboardMessageInstance.page, LeaderboardMessageInstance);
        const newComponents = buildComponentsThemesForEngine(LeaderboardMessageInstance);

        await message.edit({
          embeds: [newEmbed],
          components: newComponents
        });
      }

      if (component.startsWith('updatepage')) {
        await wCtx.acknowledge();
        const engine = wCtx.values[0].split('+')[0];
        const themeIndex = wCtx.values[0].split('+')[1];
        const themeID = ArchiveThemesInstance.themesForVersion(engine)[themeIndex];
        const themeData = ArchiveThemesInstance.themeFromVersion(engine, themeID);
        const themeEmbed = new EmbedBuilder()
          .setTitle(`Summary of ${themeData.Name}`)
          .setDescription(archiveThemeDescription[engine] ? archiveThemeDescription[engine][themeID] : themeData.Name)
          .addFields({ name: 'Engine', value: archiveEngineName[engine], inline: true })
          .setColor(archiveEngineColors[engine])
          .setThumbnail(`https://cdn.discordapp.com/emojis/${archiveEngineEmoteData[engine].id}.webp?quality=lossless`)
          .setURL(
            `https://josevarela.xyz/SMArchive/Themes/ThemePreview.html?Category=${engine.replace(
              ' ',
              '%20'
            )}&ID=${themeID}`
          );

        if (themeData.HasImages) {
          const engineThemesImg = archiveThemesMusicWheelImage[engine];

          if (engineThemesImg[themeID]) {
            themeEmbed.setImage(engineThemesImg[themeID]);
          }
        }

        const buttons = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setURL(
              `https://josevarela.xyz/SMArchive/Themes/ThemePreview.html?Category=${engine.replace(
                ' ',
                '%20'
              )}&ID=${themeID}`
            )
            .setLabel('Theme Page')
            .setStyle(ButtonStyle.Link),
          new ButtonBuilder().setURL(archiveEngineLink[engine]).setLabel('Engine Page').setStyle(ButtonStyle.Link),
          new ButtonBuilder().setLabel('Another Theme').setStyle(ButtonStyle.Primary).setCustomId(`themechange`)
        );

        if (themeData.Date) themeEmbed.addFields({ name: 'Creation Date', value: themeData.Date, inline: true });
        if (themeData.Author) themeEmbed.addFields({ name: 'Theme Author', value: themeData.Author, inline: true });
        if (themeData.Version) themeEmbed.addFields({ name: 'Theme Version', value: themeData.Version, inline: true });

        await message.edit({
          embeds: [themeEmbed],
          components: [buttons]
        });
      }
    });
  }
};
