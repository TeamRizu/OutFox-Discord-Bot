const { SlashCommand } = require('slash-create');
const { LeaderboardMessageFile } = require('../utils/leaderboardMessage.js');
const { MessageEmbed, MessageActionRow, MessageButton, MessageSelectMenu } = require('discord.js');
const { ArchiveAnnouncersFile } = require('../utils/archivalAnnouncers.js');
const { archiveGenericEmbedFields } = require('../utils/constants.js')
const ArchiveAnnouncersInstance = new ArchiveAnnouncersFile();

module.exports = class AnnouncersCommand extends SlashCommand {
  constructor(creator) {
    super(creator, {
      name: 'announcers',
      description: 'Get a list of announcers with info and more.'
    });
    this.commandVersion = '0.0.1';
  }

  /**
   *
   * @param {ComponentContext} ctx
   */
  async run(ctx) {
    await ArchiveAnnouncersInstance.setup();
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
    if (!ArchiveAnnouncersInstance.mainObject) {
      return;
    }

    if (commandArguments.primalArgument === 'authorSelected') {
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

    if (['KU+002FStep', 'MadkaT', 'Hooky', 'Schizkitty', 'Unlisted'].includes(commandArguments.primalArgument)) {
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

    const announcersCountString = (author) => {
      const announcersCount = ArchiveAnnouncersInstance.announcersFromAuthors[author].length

      return `${author}: **${announcersCount} ${1 >= announcersCount ? 'Announcer' : 'Announcers'}**`
    }

    const announcersEmbed = new MessageEmbed()
      .setTitle('StepMania Archive Announcers')
      .setDescription(
        `
        Announcers help cheer up the player during gameplay and to say out loud their earned score.

        StepMania Archive cames to archive all that work in one place, going beyond Announcers.

        ${announcersCountString('MadkaT')}
        ${announcersCountString('Hooky')}
        ${announcersCountString('K-Step')}
        ${announcersCountString('Schizkitty')}
        ${announcersCountString('Unlisted')}
        `
      )
      .setThumbnail('https://cdn.discordapp.com/icons/514194672441229323/2ceada703d6a65b57eb3e072ed741185.webp')
      .setURL('https://josevarela.xyz/SMArchive/Announcers/index.html')
      .setColor('#30c3c4');

    const authorOptions = []

    const announcersAuthors = Object.keys(ArchiveAnnouncersInstance.announcersFromAuthors)
    for (let i = 0; i < announcersAuthors.length; i++) {
      const currentAuthor = announcersAuthors[i]
      const tempObj = {}

      tempObj.label = currentAuthor
      tempObj.value = `6-${this.commandVersion}-leaderboard-${currentAuthor.replace('-', 'U+002F')}-0`

      authorOptions.push(tempObj)
    }

    const smSelectMenu = new MessageActionRow().addComponents(
      new MessageSelectMenu()
        .setCustomId(`6-${this.commandVersion}-update-authorSelected`)
        .setPlaceholder('Select Author')
        .addOptions(authorOptions)
    ); // FIXME: There's more than 25 values

    const msgData = {
      embeds: [
        {
          ...announcersEmbed,
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
    if (!ArchiveAnnouncersInstance.mainObject) {
      return;
    }

    const author = commandArguments.primalArgument.replace('U+002F', '-');
    const page = Number(commandArguments.arguments[1]);
    const announcersForAuthor = ArchiveAnnouncersInstance.announcersByAuthor(author)
    const LeaderboardMessageInstance = new LeaderboardMessageFile({ interaction, commandArguments });

    LeaderboardMessageInstance.supportLookUp = true;
    LeaderboardMessageInstance.menuSelectPlaceholder = 'Select Announcer to Look Up';

    for (let i = 0; i < announcersForAuthor.length; i++) {
      LeaderboardMessageInstance.addElement(announcersForAuthor[i].name);
    }

    const pageEmbed = new MessageEmbed()
    .setTitle('Select Announcer')
    .setURL('https://josevarela.xyz/SMArchive/Announcers/index.html')
    .setThumbnail('https://cdn.discordapp.com/icons/514194672441229323/2ceada703d6a65b57eb3e072ed741185.webp')
    .setDescription(LeaderboardMessageInstance.pages.pageList[page]);

    const buttons = new MessageActionRow().addComponents(
      new MessageButton()
        .setLabel('Another Announcer')
        .setStyle('PRIMARY')
        .setCustomId(`6-${this.commandVersion}-update-0`)
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
    if (!ArchiveAnnouncersInstance.mainObject) {
      return;
    }

    const interactionSplit = interaction.values[0].split('-');
    const page = Number(interactionSplit[3]);
    const author = commandArguments.primalArgument.replace('U+002F', '-')
    const announcer = ArchiveAnnouncersInstance.announcersByAuthor(author)[page]

    const announcerEmbed = new MessageEmbed()
      .setTitle(`${announcer.name}`)
      .setURL(`https://josevarela.xyz/SMArchive/Announcers/index.html`);

    const buttons = new MessageActionRow().addComponents(
      new MessageButton()
        .setURL(`https://josevarela.xyz/SMArchive/Announcers/index.html`)
        .setLabel('Find on Page')
        .setStyle('LINK'),
      new MessageButton()
        .setLabel('Another Announcer')
        .setStyle('PRIMARY')
        .setCustomId(`6-${this.commandVersion}-leaderboard-${author.replace('-', 'U+002F')}-0`)
    );

    if (author !== 'Unlisted') announcerEmbed.addField('Author', author, true);

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
