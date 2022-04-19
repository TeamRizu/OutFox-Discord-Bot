const { SlashCommand } = require('slash-create');
const { LeaderboardMessageFile } = require('../utils/leaderboardMessage.js');
const { MessageEmbed, MessageActionRow, MessageButton, MessageSelectMenu } = require('discord.js');
const { ArchiveCreditsFile } = require('../utils/archivalCredits.js');
const { archiveGenericEmbedFields, creditsEngineID, creditsEngineIDToEngineTag } = require('../utils/constants.js')
const ArchiveCreditsInstance = new ArchiveCreditsFile();

module.exports = class CreditsCommand extends SlashCommand {
  constructor(creator) {
    super(creator, {
      name: 'credits',
      description: 'Get a list of credits with info and more.'
    });
    this.commandVersion = '0.0.1';
  }

  /**
   *
   * @param {ComponentContext} ctx
   */
  async run(ctx) {
    await ArchiveCreditsInstance.setup();
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
    if (!ArchiveCreditsInstance.mainObject) {
      return;
    }

    if (commandArguments.primalArgument === 'engineSelected') {
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

    if (creditsEngineID.includes(commandArguments.primalArgument)) {
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

    const engineEmbed = new MessageEmbed()
      .setTitle('StepMania Archive Credits')
      .setDescription(
        `
        The story of StepMania Engine is big, rich and long, however credits to the people who worked hard might be lost.

        StepMania Archive cames to archive all that work in one place, going beyond credits.

        See Credits For:

        - **StepMania**
        - **Pulsen**
        - **Mungyodance**
        - **Mungyodance 3**
        - **Keys 7**
        - **OpenITG**
        `
      )
      .setThumbnail('https://cdn.discordapp.com/icons/514194672441229323/2ceada703d6a65b57eb3e072ed741185.webp')
      .setURL('https://josevarela.xyz/SMArchive/Builds/Credits.html')
      .setColor('#30c3c4');

    const engineOptions = []

    const engines = ArchiveCreditsInstance.engines
    for (let i = 0; i < engines.length; i++) {
      const currentEngine = engines[i]
      const tempObj = {}

      tempObj.label = currentEngine
      tempObj.value = `7-${this.commandVersion}-leaderboard-${currentEngine}-0`

      engineOptions.push(tempObj)
    }

    const smSelectMenu = new MessageActionRow().addComponents(
      new MessageSelectMenu()
        .setCustomId(`7-${this.commandVersion}-update-engineSelected`)
        .setPlaceholder('Select Engine')
        .addOptions(engineOptions)
    );

    const msgData = {
      embeds: [
        {
          ...engineEmbed,
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
    if (!ArchiveCreditsInstance.mainObject) {
      return;
    }

    const engine = commandArguments.primalArgument
    const page = Number(commandArguments.arguments[1]);
    const titlesByEngine = ArchiveCreditsInstance.creditsTitleByEngine(engine)
    const LeaderboardMessageInstance = new LeaderboardMessageFile({ interaction, commandArguments });

    LeaderboardMessageInstance.supportLookUp = true;
    LeaderboardMessageInstance.menuSelectPlaceholder = 'Select Section to Look Up';

    for (let i = 0; i < titlesByEngine.length; i++) {
      LeaderboardMessageInstance.addElement(titlesByEngine[i]);
    }

    const pageEmbed = new MessageEmbed()
    .setTitle('Select Section')
    .setURL('https://josevarela.xyz/SMArchive/Builds/Credits.html')
    .setThumbnail('https://cdn.discordapp.com/icons/514194672441229323/2ceada703d6a65b57eb3e072ed741185.webp')
    .setDescription(LeaderboardMessageInstance.pages.pageList[page]);

    const buttons = new MessageActionRow().addComponents(
      new MessageButton()
        .setLabel('Another Engine')
        .setStyle('PRIMARY')
        .setCustomId(`7-${this.commandVersion}-update-0`)
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
    if (!ArchiveCreditsInstance.mainObject) {
      return;
    }

    const interactionSplit = interaction.values[0].split('-');
    const page = Number(interactionSplit[3]);
    const engine = commandArguments.primalArgument.replace('U+002F', '-')
    const section = ArchiveCreditsInstance.mainObject[engine][page]
    let sectionMembers = ''

    for (let i = 0; i < section.members.length; i++) {
      let currentMember = section.members[i]

      if (currentMember.includes('strong>')) {
        currentMember = currentMember.replace('<strong>', '**')
        currentMember = currentMember.replace('</strong>', '**')
      }

      if (currentMember.includes('i>')) {
        currentMember = currentMember.replace('<i>', '_')
        currentMember = currentMember.replace('</i>', '_')
      }

      if ('small>') {
        currentMember = currentMember.replace('<small>', '')
        currentMember = currentMember.replace('</small>', '')
      }

      sectionMembers = sectionMembers + currentMember + '\n'
    }
    const announcerEmbed = new MessageEmbed()
      .setTitle(`${section.title}`)
      .setURL(`https://josevarela.xyz/SMArchive/Builds/Credits.html#${creditsEngineIDToEngineTag[engine]}`)
      .setDescription(sectionMembers);

    const buttons = new MessageActionRow().addComponents(
      new MessageButton()
        .setURL(`https://josevarela.xyz/SMArchive/Builds/Credits.html#${creditsEngineIDToEngineTag[engine]}`)
        .setLabel('Read on Page')
        .setStyle('LINK'),
      new MessageButton()
        .setLabel('Another section')
        .setStyle('PRIMARY')
        .setCustomId(`7-${this.commandVersion}-leaderboard-${engine}-0`)
    );

    const msgData = {
      embeds: [
        {
          ...announcerEmbed,
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
