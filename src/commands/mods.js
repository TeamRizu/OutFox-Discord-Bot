const { MessageEmbed, MessageActionRow, MessageButton, MessageSelectMenu } = require('discord.js');
const { SlashCommand } = require('slash-create');
const { ModsSheetFile } = require('../utils/mods.js');
const { conversionsGenericEmbedFields } = require('../utils/constants.js')
const nodeuri = require('node-uri');
const Vibrant = require('node-vibrant');
const ModsSheetInstance = new ModsSheetFile();

module.exports = class ModsCommand extends SlashCommand {
  constructor(creator) {
    super(creator, {
      name: 'mods',
      description: 'See information about MrThatKid4 porting progress.'
    });
    this.commandVersion = '0.0.2';
  }

  /**
   *
   * @param {ComponentContext} ctx
   */
  async run(ctx) {
    await ModsSheetInstance.init();
    await this.update({
      interaction: {
        ctx,
        values: []
      },
      commandArguments: {
        primalArgument: '0',
        arguments: ['0'],
        version: this.commandVersion,
        firstSend: true
      }
    });
  }

  async update({ interaction, commandArguments }) {
    if (!ModsSheetInstance.convertedMods) {
      return;
    }
    let pageIndex = commandArguments.primalArgument;
    pageIndex = Number(pageIndex);
    const rows = await ModsSheetInstance.chartsToArrayObjectRows();
    const pagesNum = Math.round(rows.length / ModsSheetInstance.elementsPerPage);
    const embed = new MessageEmbed()
      .setTitle('Converted Mods')
      .setURL('https://docs.google.com/spreadsheets/d/1P892pQEcfzP59NeSm2aHIKNB1Rv4DqIXtELkcIvJNbM/edit?usp=sharing')
      .setColor('#9f245c')
      .setDescription(ModsSheetInstance.chartsFromPage(rows, pageIndex));

    const leastPageNum = 0 > pageIndex - 1 ? 0 : pageIndex - 1;
    const maxPageNum = pageIndex + 1 > pagesNum - 1 ? pagesNum - 1 : pageIndex + 1;

    const buttons = new MessageActionRow().addComponents(
      new MessageButton()
        .setCustomId(`2-${this.commandVersion}-update-${leastPageNum}`)
        .setLabel('Back')
        .setStyle('PRIMARY'),
      new MessageButton()
        .setCustomId(`2-${this.commandVersion}-update-${maxPageNum}`)
        .setLabel('Next')
        .setStyle('PRIMARY')
    );

    const selectMenu = new MessageActionRow().addComponents(
      new MessageSelectMenu()
        .setCustomId(`2-${this.commandVersion}-lookUp-${pageIndex}`)
        .setPlaceholder('Select file')
        .addOptions(ModsSheetInstance.chartsSelectMenuFromPage(rows, pageIndex, interaction.ctx))
    );

    const msgData = {
      embeds: [
        {
          ...embed,
          ...conversionsGenericEmbedFields
        }
      ],
      components: [buttons, selectMenu]
    };

    if (commandArguments.firstSend) {
      interaction.ctx.send(msgData);
    } else {
      interaction.ctx.editParent(msgData);
    }
  }

  async lookUp({ interaction, commandArguments }) {
    if (!ModsSheetInstance.convertedMods) {
      return;
    }
    const portID = interaction.values[0].split('-')[2]; // commandID-interactionID-fileID-select
    const rows = await ModsSheetInstance.chartsToArrayObjectRows();
    const file = rows.find((element) => element.portID === portID);

    if (!file) {
      await interaction.ctx.send('Failed to get file.');
      return;
    }

    const buttons = new MessageActionRow().addComponents(
      new MessageButton()
        .setCustomId(`2-${this.commandVersion}-update-${commandArguments.primalArgument}`)
        .setLabel('Back to Select')
        .setStyle('PRIMARY'),
      new MessageButton().setLabel('Watch Video').setStyle('LINK').setURL(file.youtube)
    );

    const embed = new MessageEmbed()
      .setTitle(file.name)
      .addField('Fix-up Status', file.status, true)
      .addField('StepMania Engine', file.version, true)
      .setURL(file.youtube);

    if (['youtube', 'youtu.be'].some((e) => file.youtube.includes(e)) && nodeuri.checkHttpsURL(file.youtube)) {
      embed.setURL(file.youtube);

      const results = file.youtube.match('[\\?&]v=([^&#]*)');
      const secondResult = file.youtube.substring(file.youtube.length - 11);
      let videoID = results === null ? file.youtube : results[1];
      // This solves this type of link https://youtu.be/oMa-fqnCVzY
      if (videoID === file.youtube && secondResult.length === 11) videoID = secondResult;

      if (videoID && videoID.length === 11 && nodeuri.checkHttpsURL(`https://img.youtube.com/vi/${videoID}/0.jpg`)) {
        embed.setImage(`https://img.youtube.com/vi/${videoID}/0.jpg`);

        const vibrantColor = new Map();
        const colorObj = await Vibrant.from(`https://img.youtube.com/vi/${videoID}/0.jpg`).getPalette(
          (err, palette) => {
            if (err) {
              console.warn(err);
              return false;
            }

            const rgb = palette.Vibrant._rgb;
            const componentToHex = (c) => {
              // Credits: https://stackoverflow.com/a/5624139
              let hex = c.toString(16);
              return hex.length == 1 ? '0' + hex : hex;
            };

            vibrantColor.set('value', `#${componentToHex(rgb[0]) + componentToHex(rgb[1]) + componentToHex(rgb[2])}`);
            return true;
          }
        );

        if (colorObj) embed.setColor(vibrantColor.get('value'));
      }
    }

    if (file.author) embed.addField('Author', file.author, true);
    if (file.pack) embed.addField('Pack', file.pack, true);

    const msgData = {
      embeds: [
        {
          ...embed,
          ...conversionsGenericEmbedFields
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
