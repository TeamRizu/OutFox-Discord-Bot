const { SlashCommand, ComponentContext, Message } = require('slash-create');
const { LeaderboardMessageFile } = require('../utils/leaderboardMessage.js');
const { EmbedBuilder, ActionRowBuilder, ButtonStyle, SelectMenuBuilder, ButtonBuilder } = require('discord.js');
const { ArchiveCreditsFile } = require('../utils/archivalCredits.js');
const { archiveGenericEmbedFields, creditsEngineID, creditsEngineIDToEngineTag } = require('../utils/constants.js');
const ArchiveCreditsInstance = new ArchiveCreditsFile();

module.exports = class CreditsCommand extends SlashCommand {
  constructor(creator) {
    super(creator, {
      name: 'credits',
      description: 'Get a list of credits with info and more.'
    });
    this.commandVersion = '0.0.2';
  }

  /**
   *
   * @param {ComponentContext} ctx
   */
  async run(ctx) {
    await ArchiveCreditsInstance.setup();
    await ctx.defer();

    const engineEmbed = new EmbedBuilder()
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

    const engineOptions = [];

    const engines = ArchiveCreditsInstance.engines;
    for (let i = 0; i < engines.length; i++) {
      const currentEngine = engines[i];
      const tempObj = {};

      tempObj.label = currentEngine;
      tempObj.value = currentEngine;

      engineOptions.push(tempObj);
    }

    const smSelectMenu = new ActionRowBuilder().addComponents(
      new SelectMenuBuilder().setCustomId('engineselected').setPlaceholder('Select Engine').addOptions(engineOptions)
    );

    /**
     * @type {Message}
     */
    const message = await ctx.send({
      embeds: [engineEmbed],
      components: [smSelectMenu]
    });

    ctx.registerWildcardComponent(message.id, async (cCtx) => {
      const component = cCtx.customID;

      if (component === 'startagain') {
        await message.edit({
          embeds: [engineEmbed],
          components: [smSelectMenu]
        });
      }

      if (component === 'engineselected' || component.startsWith('anothersection')) {
        const engine = component.startsWith('anothersection') ? component.split('+')[1] : cCtx.values[0];
        const page = 0;
        const titlesByEngine = ArchiveCreditsInstance.creditsTitleByEngine(engine);
        const LeaderboardMessageInstance = new LeaderboardMessageFile();

        LeaderboardMessageInstance.supportLookUp = true;
        LeaderboardMessageInstance.menuSelectPlaceholder = 'Select Section to Look Up';
        LeaderboardMessageInstance.separator = '+';

        for (let i = 0; i < titlesByEngine.length; i++) {
          LeaderboardMessageInstance.addElement({
            description: titlesByEngine[i],
            value: `${engine}+${i}`
          });
        }

        const pageEmbed = new EmbedBuilder()
          .setTitle('Select Section')
          .setURL('https://josevarela.xyz/SMArchive/Builds/Credits.html')
          .setThumbnail('https://cdn.discordapp.com/icons/514194672441229323/2ceada703d6a65b57eb3e072ed741185.webp')
          .setDescription(LeaderboardMessageInstance.pages.pageList[page]);

        const buttons = new ActionRowBuilder().addComponents(
          new ButtonBuilder().setLabel('Another Engine').setStyle(ButtonStyle.Primary).setCustomId('startagain')
        );

        LeaderboardMessageInstance.page = page;

        const components = LeaderboardMessageInstance.pageComponents;

        components.push(buttons);

        await message.edit({
          embeds: [pageEmbed],
          components
        });
      }

      if (component.startsWith('updatepage')) {
        const engine = cCtx.values[0].split('+')[0];
        const sectionIndex = cCtx.values[0].split('+')[1];
        const section = ArchiveCreditsInstance.mainObject[engine][sectionIndex];
        let sectionMembers = '';

        for (let i = 0; i < section.members.length; i++) {
          let currentMember = section.members[i];

          if (currentMember.includes('strong>')) {
            currentMember = currentMember.replace('<strong>', '**');
            currentMember = currentMember.replace('</strong>', '**');
          }

          if (currentMember.includes('i>')) {
            currentMember = currentMember.replace('<i>', '_');
            currentMember = currentMember.replace('</i>', '_');
          }

          if ('small>') {
            currentMember = currentMember.replace('<small>', '');
            currentMember = currentMember.replace('</small>', '');
          }

          sectionMembers = sectionMembers + currentMember + '\n';
        }
        const announcerEmbed = new EmbedBuilder()
          .setTitle(`${section.title}`)
          .setURL(`https://josevarela.xyz/SMArchive/Builds/Credits.html#${creditsEngineIDToEngineTag[engine]}`)
          .setDescription(sectionMembers);

        const buttons = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setURL(`https://josevarela.xyz/SMArchive/Builds/Credits.html#${creditsEngineIDToEngineTag[engine]}`)
            .setLabel('Read on Page')
            .setStyle(ButtonStyle.Link),
          new ButtonBuilder()
            .setLabel('Another Section')
            .setStyle(ButtonStyle.Primary)
            .setCustomId(`anothersection+${engine}`)
        );

        await message.edit({
          embeds: [announcerEmbed],
          components: [buttons]
        })
      }
    });
  }
};
