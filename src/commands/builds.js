const { SlashCommand } = require('slash-create');
const { MessageEmbed, MessageActionRow, MessageButton, MessageSelectMenu } = require('discord.js');
const { ArchiveBuildsFile } = require('../utils/archivalBuilds.js');
const { LeaderboardMessageFile } = require('../utils/leaderboardMessage.js');
const {
  archiveListIDs,
  archiveListNames,
  archiveListIDToNames,
  archiveListIDToEngineName,
  archiveGenericEmbedFields,
  archiveBuildEngineIconData,
  buildNameToEmoteKey,
  archiveBuildEngineColor,
  archiveIconLinkFormat
} = require('../utils/constants.js')
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
    await this.update({
      interaction: {
        ctx,
        values: []
      },
      commandArguments: {
        primalArgument: 0,
        arguments: [0],
        version: this.commandVersion,
        firstSend: true,
        commandID: '9'
      }
    });
  }

  async update({ interaction, commandArguments }) {
    if (!ArchivaBuildsInstance.mainObject) {
      return;
    }

    if (commandArguments.primalArgument === 'buildSelected') {
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

    if (archiveListIDs.includes(commandArguments.primalArgument)) {
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

    const archivebuildCountString = (listID) => {
      const buildListCount = ArchivaBuildsInstance.buildListObjectFromID(listID).Listing.length

      return `${archiveListIDToNames[listID]}: **${buildListCount} ${1 >= buildListCount ? 'Build' : 'Builds'}**`
    }

    const buildEmote = (listID) => {
      const { name, id } = archiveBuildEngineIconData[listID]

      return `<:${name}:${id}>`
    }

    const buildListsEmbed = new MessageEmbed()
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
        `
      )
      .setThumbnail('https://cdn.discordapp.com/icons/514194672441229323/2ceada703d6a65b57eb3e072ed741185.webp')
      .setURL('https://josevarela.xyz/SMArchive/Builds/index.html')
      .setColor('#30c3c4');

    const listOptions = []

    for (let i = 0; i < archiveListIDs.length; i++) {
      const currentEngine = archiveListIDs[i]
      const tempObj = {}

      tempObj.label = archiveListNames[i]
      tempObj.value = `9-${this.commandVersion}-leaderboard-${currentEngine}-0`
      tempObj.emoji = archiveBuildEngineIconData[currentEngine]

      listOptions.push(tempObj)
    }

    const smSelectMenu = new MessageActionRow().addComponents(
      new MessageSelectMenu()
        .setCustomId(`9-${this.commandVersion}-update-buildSelected`)
        .setPlaceholder('Select Build List')
        .addOptions(listOptions)
    );

    const msgData = {
      embeds: [
        {
          ...buildListsEmbed,
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

    if (!ArchivaBuildsInstance.mainObject) {
      return;
    }

    const listID = commandArguments.primalArgument;
    const page = Number(commandArguments.arguments[1]);
    const listingForBuild = ArchivaBuildsInstance.listingNamesFromID(listID);
    const LeaderboardMessageInstance = new LeaderboardMessageFile({ interaction, commandArguments });

    LeaderboardMessageInstance.supportLookUp = true;
    LeaderboardMessageInstance.menuSelectPlaceholder = 'Select Build to Look Up';
    LeaderboardMessageInstance.formatElement = (e, i) => {
      return `<:${e.emoji.name}:${e.emoji.id}> ${e.description}`
    }

    for (let i = 0; i < listingForBuild.length; i++) {
      LeaderboardMessageInstance.addElement({
        description: listingForBuild[i],
        emoji: archiveBuildEngineIconData[buildNameToEmoteKey(listID, listingForBuild[i])]
      });
    }

    const pageEmbed = new MessageEmbed()
    .setTitle('Select Build')
    .setColor(archiveBuildEngineColor[listID])
    .setURL(`https://josevarela.xyz/SMArchive/Builds/index.html#${listID}`)
    .setThumbnail('https://cdn.discordapp.com/icons/514194672441229323/2ceada703d6a65b57eb3e072ed741185.webp')
    .setDescription(LeaderboardMessageInstance.pages.pageList[page]);

    const buttons = new MessageActionRow().addComponents(
      new MessageButton()
        .setLabel('Another Build List')
        .setStyle('PRIMARY')
        .setCustomId(`9-${this.commandVersion}-update-0`)
    );

    LeaderboardMessageInstance.page = page;

    const components = LeaderboardMessageInstance.pageComponents

    components.push(buttons)

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

    if (!ArchivaBuildsInstance.mainObject) {
      return;
    }

    const interactionSplit = interaction.values[0].split('-');
    const page = Number(interactionSplit[3]);
    const listName = commandArguments.primalArgument;
    const listObject = ArchivaBuildsInstance.buildListObjectFromID(listName)
    const buildObject = listObject.Listing[page]
    const buildEmbed = new MessageEmbed()
      .setTitle(`Summary of ${buildObject.Name}`)
      .addField('Engine', archiveListIDToEngineName[listName], true)
      .addField('Date', buildObject.Date || '????-??-??', true)
      .setDescription(listObject.Description || 'No description.')
      .setColor(archiveBuildEngineColor[buildNameToEmoteKey(listName, buildObject.Name)])
      .setThumbnail(`https://josevarela.xyz/SMArchive/Builds/VersionIcon/${buildNameToEmoteKey(listName, buildObject.Name)}${archiveIconLinkFormat(buildObject.Name)}`)

    const buttons = new MessageActionRow().addComponents(
      new MessageButton()
        .setURL(`https://josevarela.xyz/SMArchive/Builds/index.html#${listName}`)
        .setLabel('List Page')
        .setStyle('LINK'),
      new MessageButton()
        .setLabel('Another Build')
        .setCustomId(`9-${this.commandVersion}-leaderboard-${listName}-0`)
        .setStyle('PRIMARY')
    );

    if (buildObject.ID) {
      buttons.addComponents(
        new MessageButton()
          .setURL(`https://josevarela.xyz/SMArchive/Builds/BuildChangeLogs.html?Version=${buildObject.ID}`)
          .setLabel('Build Changelog')
          .setStyle('LINK')
      )
    }

    const { Windows, Mac, Linux, Src } = buildObject
    const sources = [Windows, Mac, Linux, Src]
    const sourcesStr = ['Windows', 'Mac', 'Linux', 'Source Code']
    let availableSources = ''

    if (sources.every(e => !e)) {
      availableSources = 'No soures available for this build.'
    } else {
      for (let i = 0; i < sources.length; i++) {
        if (sources[i]) {
          availableSources += `${sourcesStr[i]} - ✅\n`
          continue
        }

        availableSources += `${sourcesStr[i]} - ❌\n`
      }
    }

    buildEmbed.addField('Available Sources', availableSources, false)

    const msgData = {
      embeds: [
        {
          ...buildEmbed,
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
