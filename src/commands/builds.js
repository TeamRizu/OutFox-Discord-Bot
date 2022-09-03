const { SlashCommand, ComponentContext, Message } = require('slash-create');
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, SelectMenuBuilder } = require('discord.js');
const { ArchiveBuildsFile } = require('../utils/archivalBuilds.js');
const { LeaderboardMessageFile } = require('../utils/leaderboardMessage.js');
const {
  archiveListIDs,
  archiveListNames,
  archiveListIDToNames,
  archiveListIDToEngineName,
  archiveBuildEngineIconData,
  buildNameToEmoteKey,
  archiveBuildEngineColor,
  archiveIconLinkFormat
} = require('../utils/constants.js');
const ArchivaBuildsInstance = new ArchiveBuildsFile();

module.exports = class BuildsCommand extends SlashCommand {
  constructor(creator) {
    super(creator, {
      name: 'builds',
      description: 'Get a list of builds with info and more.'
    });
    this.commandVersion = '0.0.1';
  }

  /**
   *
   * @param {ComponentContext} ctx
   */
  async run(ctx) {
    await ArchivaBuildsInstance.setup();
    await ctx.defer();

    /**
     *
     * @param {string} listID
     * @returns {string}
     */
    const archivebuildCountString = (listID) => {
      const buildListCount = ArchivaBuildsInstance.buildListObjectFromID(listID).Listing.length;

      return `${archiveListIDToNames[listID]}: **${buildListCount} ${1 >= buildListCount ? 'Build' : 'Builds'}**`;
    };

    /**
     *
     * @param {string} listID
     * @returns {string}
     */
    const buildEmote = (listID) => {
      const { name, id } = archiveBuildEngineIconData[listID];

      return `<:${name}:${id}>`;
    };

    const buildListsEmbed = new EmbedBuilder()
      .setTitle('StepMania Archive Builds')
      .setDescription(
        `
        Builds are the core code that powers the engine, different builds will behave differently and have

        StepMania Archive cames to archive all that work in one place, going beyond builds.

        ${buildEmote('DDRPC') + ' - ' + archivebuildCountString('DDRPC')}
        ${buildEmote('SM095') + ' - ' + archivebuildCountString('SM095')}
        ${buildEmote('SM164') + ' - ' + archivebuildCountString('SM164')}
        ${buildEmote('SM30') + ' - ' + archivebuildCountString('SM30')}
        ${buildEmote('SM39') + ' - ' + archivebuildCountString('SM39')}
        ${buildEmote('SM395') + ' - ' + archivebuildCountString('SM395')}
        ${buildEmote('OITG') + ' - ' + archivebuildCountString('OITG')}
        ${buildEmote('NOTITG') + ' - ' + archivebuildCountString('NOTITG')}
        ${buildEmote('SM4') + ' - ' + archivebuildCountString('SM4')}
        ${buildEmote('SMSSC') + ' - ' + archivebuildCountString('SMSSC')}
        ${buildEmote('SMSSCCUSTOM') + ' - ' + archivebuildCountString('SMSSCCUSTOM')}
        ${buildEmote('SM5') + ' - ' + archivebuildCountString('SM5')}
        ${buildEmote('ETT') + ' - ' + archivebuildCountString('ETT')}
        ${buildEmote('OUTFOX') + ' - ' + archivebuildCountString('OUTFOX')}
        ${buildEmote('ITGM') + ' - ' + archivebuildCountString('ITGM')}
        `
      )
      .setThumbnail('https://cdn.discordapp.com/icons/514194672441229323/2ceada703d6a65b57eb3e072ed741185.webp')
      .setURL('https://josevarela.xyz/SMArchive/Builds/index.html')
      .setColor('#30c3c4');

    const listOptions = [];

    for (let i = 0; i < archiveListIDs.length; i++) {
      const currentEngine = archiveListIDs[i];
      const tempObj = {};

      tempObj.label = archiveListNames[i];
      tempObj.value = currentEngine;
      tempObj.emoji = archiveBuildEngineIconData[currentEngine];

      listOptions.push(tempObj);
    }

    const smSelectMenu = new ActionRowBuilder().addComponents(
      new SelectMenuBuilder().setCustomId(`buildselected`).setPlaceholder('Select Build List').addOptions(listOptions)
    );

    /**
     * @type {Message}
     */
    const message = await ctx.send({
      embeds: [buildListsEmbed],
      components: [smSelectMenu]
    });

    ctx.registerWildcardComponent(message.id, async (cCtx) => {
      /**
       * @type {'startagain' | 'buildselected' | 'buildselecteddeep+0' | 'next+0+listID' | 'back+0+listID'}
       */
      const component = cCtx.customID;

      if (component === 'startagain') {
        await message.edit({
          embeds: [buildListsEmbed],
          components: [smSelectMenu]
        });
        await cCtx.acknowledge();
      }

      const isPageSwitch = (component.startsWith('next') || component.startsWith('back'))
      const isBackFromLoopUp = component.startsWith('buildselecteddeep')
      if (component === 'buildselected' || isBackFromLoopUp || isPageSwitch) {
        let listID = ''

        if (isPageSwitch) listID = component.split('+')[2]
        if (isBackFromLoopUp) listID = component.split('+')[1]
        if (!isBackFromLoopUp && !isPageSwitch) listID = cCtx.values[0]

        // Number casting is used here otherwise when we overwrite the page property of the class it will mess up with the next page switch.
        const page = isPageSwitch ? Number(component.split('+')[1]) : 0
        const listingForBuild = ArchivaBuildsInstance.listingNamesFromID(listID);
        const LeaderboardMessageInstance = new LeaderboardMessageFile();

        LeaderboardMessageInstance.supportLookUp = true;
        LeaderboardMessageInstance.menuSelectPlaceholder = 'Select Build to Look Up';
        LeaderboardMessageInstance.separator = '+';
        LeaderboardMessageInstance.pageSwitchArgument = listID

        /**
         *
         * @param {import('../types/tsTypes/common.js').LeaderboardElementObject} e
         * @param {number} i
         * @returns {string}
         */
        LeaderboardMessageInstance.formatElement = (e, i) => {
          return `<:${e.emoji.name}:${e.emoji.id}> ${e.description}`;
        };

        for (let i = 0; i < listingForBuild.length; i++) {
          LeaderboardMessageInstance.addElement({
            value: `${listingForBuild[i]}+${i}+${listID}`,
            description: listingForBuild[i],
            emoji: archiveBuildEngineIconData[buildNameToEmoteKey(listID, listingForBuild[i])]
          });
        }

        const pageEmbed = new EmbedBuilder()
          .setTitle('Select Build')
          .setColor(archiveBuildEngineColor[listID])
          .setURL(`https://josevarela.xyz/SMArchive/Builds/index.html#${listID}`)
          .setThumbnail('https://cdn.discordapp.com/icons/514194672441229323/2ceada703d6a65b57eb3e072ed741185.webp')
          .setDescription(LeaderboardMessageInstance.pages.pageList[page]);

        const buttons = new ActionRowBuilder().addComponents(
          new ButtonBuilder().setLabel('Another Build List').setStyle(ButtonStyle.Primary).setCustomId(`startagain`)
        );

        LeaderboardMessageInstance.page = page;

        const components = LeaderboardMessageInstance.pageComponents;

        components.push(buttons);

        await message.edit({
          embeds: [pageEmbed],
          components: components
        });
        await cCtx.acknowledge()
      }

      if (component.startsWith('updatepage')) {
        const listName = cCtx.values[0].split('+')[0];
        const page = cCtx.values[0].split('+')[1];
        const listID = cCtx.values[0].split('+')[2];
        const listObject = ArchivaBuildsInstance.buildListObjectFromID(listID);
        const buildObject = listObject.Listing[page];
        const buildEmbed = new EmbedBuilder()
          .setTitle(`Summary of ${buildObject.Name}`)
          .addFields(
            {
              name: 'Engine',
              value: archiveListIDToEngineName[listID],
              inline: true
            }, {
              name: 'Date',
              value: buildObject.Date || '????-??-??',
              inline: true
            }
          )
          .setDescription(listObject.Description || 'No description.')
          .setColor(archiveBuildEngineColor[buildNameToEmoteKey(listID, buildObject.Name)])
          .setThumbnail(
            `https://josevarela.xyz/SMArchive/Builds/VersionIcon/${buildNameToEmoteKey(
              listID,
              buildObject.Name
            )}${archiveIconLinkFormat(buildObject.Name)}`
          );

        const buttons = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setURL(`https://josevarela.xyz/SMArchive/Builds/index.html#${listID}`)
            .setLabel('List Page')
            .setStyle(ButtonStyle.Link),
          new ButtonBuilder()
            .setLabel('Another Build')
            .setCustomId(`buildselecteddeep+${listID}`)
            .setStyle(ButtonStyle.Primary)
        );

        if (buildObject.ID) {
          buttons.addComponents(
            new ButtonBuilder()
              .setURL(`https://josevarela.xyz/SMArchive/Builds/BuildChangeLogs.html?Version=${buildObject.ID}`)
              .setLabel('Build Changelog')
              .setStyle(ButtonStyle.Link)
          );
        }

        const { Windows, Mac, Linux, Src } = buildObject;
        const sources = [Windows, Mac, Linux, Src];
        const sourcesStr = ['Windows', 'Mac', 'Linux', 'Source Code'];
        let availableSources = '';

        if (sources.every((e) => !e)) {
          availableSources = 'No sources available for this build.';
        } else {
          for (let i = 0; i < sources.length; i++) {
            if (sources[i]) {
              availableSources += `${sourcesStr[i]} - ✅\n`;
              continue;
            }

            availableSources += `${sourcesStr[i]} - ❌\n`;
          }
        }

        buildEmbed.addFields(
          {
            name: 'Available Sources',
            value: availableSources,
            inline: false
          }
        )

        await message.edit({
          embeds: [buildEmbed],
          components: [buttons]
        })
        await cCtx.acknowledge()
      }
    });
  }
};
