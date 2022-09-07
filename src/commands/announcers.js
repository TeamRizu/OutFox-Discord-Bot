const { SlashCommand, Message, ComponentContext } = require('slash-create');
const { LeaderboardMessageFile } = require('../utils/leaderboardMessage.js');
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, SelectMenuBuilder } = require('discord.js');
const { ArchiveAnnouncersFile } = require('../utils/archivalAnnouncers.js');
const ArchiveAnnouncersInstance = new ArchiveAnnouncersFile();

module.exports = class AnnouncersCommand extends SlashCommand {
  constructor(creator) {
    super(creator, {
      name: 'announcers',
      description: 'Get a list of announcers with info and more.'
    });
    this.commandVersion = '0.0.2';
  }

  /**
   *
   * @param {ComponentContext} ctx
   */
  async run(ctx) {
    await ArchiveAnnouncersInstance.setup();

    /**
     *
     * @param {string} author
     * @returns {string}
     */
    const announcersCountString = (author) => {
      const announcersCount = ArchiveAnnouncersInstance.announcersFromAuthors[author].length;

      return `${author}: **${announcersCount} ${1 >= announcersCount ? 'Announcer' : 'Announcers'}**`;
    };

    const announcersEmbed = new EmbedBuilder()
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
      .setFooter({
        text: 'StepMania Archive made by Jose_Varela',
        iconURL: 'https://josevarela.xyz/SMArchive/Builds/VersionIcon/SM40.png'
      })
      .setColor('#30c3c4');

    const authorOptions = [];
    const announcersAuthors = Object.keys(ArchiveAnnouncersInstance.announcersFromAuthors);

    for (let i = 0; i < announcersAuthors.length; i++) {
      /**
       * @type {string}
       */
      const currentAuthor = announcersAuthors[i];
      const tempObj = {};

      tempObj.label = currentAuthor;
      tempObj.value = `${currentAuthor}+0`;

      authorOptions.push(tempObj);
    }

    const smSelectMenu = new ActionRowBuilder().addComponents(
      new SelectMenuBuilder().setCustomId(`authorselected`).setPlaceholder('Select Author').addOptions(authorOptions)
    );

    await ctx.defer();

    const msgData = {
      embeds: [announcersEmbed],
      components: [smSelectMenu]
    };

    /**
     * @type {Message}
     */
    const message = await ctx.send(msgData);

    ctx.registerWildcardComponent(message.id, async (cCtx) => {
      const component = cCtx.customID; // cCtx.values[0];

      if (component === 'startagain') {
        await cCtx.acknowledge()
        await message.edit(msgData);
      }

      if (component.includes('updatepage')) {
        // const page = cCtx.values[0].split('+')[0]
        await cCtx.acknowledge()
        const announcerName = cCtx.values[0].split('+')[1];
        const author = cCtx.values[0].split('+')[2];

        const announcerEmbed = new EmbedBuilder()
          .setTitle(announcerName)
          .setURL(`https://josevarela.xyz/SMArchive/Announcers/index.html`);

        const buttons = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setURL(`https://josevarela.xyz/SMArchive/Announcers/index.html`)
            .setLabel('Find on Page')
            .setStyle(ButtonStyle.Link),
          new ButtonBuilder().setLabel('Another Announcer').setStyle(ButtonStyle.Primary).setCustomId('startagain')
        );

        if (author !== 'Unlisted')
          announcerEmbed.addFields({
            name: 'Author',
            value: author,
            inline: true
          });

        await message.edit({
          embeds: [announcerEmbed],
          components: [buttons]
        });
      }

      if (component === 'authorselected') {
        await ctx.acknowledge()
        const author = cCtx.values[0].split('+')[0];
        const page = cCtx.values[0].split('+')[1];
        const announcersForAuthor = ArchiveAnnouncersInstance.announcersByAuthor(author);
        const LeaderboardMessageInstance = new LeaderboardMessageFile();
        // TODO: Look at giving author and page to LeaderboardMessage, we prob need to give _some_ context to components besides page.

        LeaderboardMessageInstance.supportLookUp = true;
        LeaderboardMessageInstance.menuSelectPlaceholder = 'Select Announcer to Look Up';
        LeaderboardMessageInstance.separator = '+';

        for (let i = 0; i < announcersForAuthor.length; i++) {
          LeaderboardMessageInstance.addElement({
            description: announcersForAuthor[i].name,
            value: `${page}+${announcersForAuthor[i].name}+${author}`
          });
        }

        const pageEmbed = new EmbedBuilder()
          .setTitle('Select Announcer')
          .setURL('https://josevarela.xyz/SMArchive/Announcers/index.html')
          .setThumbnail('https://cdn.discordapp.com/icons/514194672441229323/2ceada703d6a65b57eb3e072ed741185.webp')
          .setDescription(LeaderboardMessageInstance.pages.pageList[page]);

        const buttons = new ActionRowBuilder().addComponents(
          new ButtonBuilder().setLabel('Another Announcer').setStyle(ButtonStyle.Primary).setCustomId(`startagain`)
        );

        LeaderboardMessageInstance.page = page;

        const components = LeaderboardMessageInstance.pageComponents;

        components.push(buttons);

        await message.edit({
          embeds: [pageEmbed],
          components
        });
      }
    });
  }
};
