const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, SelectMenuBuilder } = require('discord.js');
const { SlashCommand, ComponentContext, Message } = require('slash-create');
const { ModsSheetFile } = require('../utils/mods.js');
const { conversionsGenericEmbedFields } = require('../utils/constants.js');
const nodeuri = require('node-uri');
const Vibrant = require('node-vibrant');
const ModsSheetInstance = new ModsSheetFile();

module.exports = class ModsCommand extends SlashCommand {
  constructor(creator) {
    super(creator, {
      name: 'mods',
      description: 'See information about MrThatKid4 porting progress.'
    });
    this.commandVersion = '0.0.3';
  }

  /**
   *
   * @param {ComponentContext} ctx
   */
  async run(ctx) {
    await ModsSheetInstance.init();
    await ctx.defer();

    const rows = await ModsSheetInstance.chartsToArrayObjectRows();
    const pagesNum = Math.round(rows.length / ModsSheetInstance.elementsPerPage);
    const buildMainEmbed = (pageIndex) => {
      const embed = new EmbedBuilder()
        .setTitle('Converted Mods')
        .setURL('https://docs.google.com/spreadsheets/d/1P892pQEcfzP59NeSm2aHIKNB1Rv4DqIXtELkcIvJNbM/edit?usp=sharing')
        .setColor('#9f245c')
        .setDescription(ModsSheetInstance.chartsFromPage(rows, pageIndex));

      return embed;
    };

    const buildMainComponents = (pageIndex) => {
      const leastPageNum = 0 > pageIndex - 1 ? 0 : pageIndex - 1;
      const maxPageNum = pageIndex + 1 > pagesNum - 1 ? pagesNum - 1 : pageIndex + 1;
      const buttons = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId(`back+${leastPageNum}`).setLabel('Back').setStyle(ButtonStyle.Primary),
        new ButtonBuilder().setCustomId(`next+${maxPageNum}`).setLabel('Next').setStyle(ButtonStyle.Primary)
      );
      const selectMenu = new ActionRowBuilder().addComponents(
        new SelectMenuBuilder()
          .setCustomId(`modselected`)
          .setPlaceholder('Select file')
          .addOptions(ModsSheetInstance.chartsSelectMenuFromPage(rows, pageIndex))
      );

      return [buttons, selectMenu];
    };

    const embed = buildMainEmbed(0);
    const components = buildMainComponents(0);

    /**
     * @type {Message}
     */
    const message = await ctx.send({
      embeds: [embed],
      components
    });

    ctx.registerWildcardComponent(message.id, async (cCtx) => {
      const component = cCtx.customID;

      if (component === 'startagain') {
        await cCtx.acknowledge();
        await message.edit({
          embeds: [embed],
          components
        });
      }

      if (component.startsWith('next') || component.startsWith('back')) {
        const page = Number(component.split('+')[1]);

        const newEmbed = buildMainEmbed(page);
        const newComponents = buildMainComponents(page);

        await cCtx.acknowledge();
        await message.edit({
          embeds: [newEmbed],
          components: newComponents
        });
      }

      if (component == 'modselected') {
        const portID = cCtx.values[0];
        const rows = await ModsSheetInstance.chartsToArrayObjectRows();
        const file = rows.find((element) => element.portID === portID);

        if (!file) {
          await interaction.ctx.send('Failed to get file.');
          return;
        }

        const buttons = new ActionRowBuilder().addComponents(
          new ButtonBuilder().setCustomId(`startagain`).setLabel('Back to Select').setStyle(ButtonStyle.Primary),
          new ButtonBuilder().setLabel('Watch Video').setStyle(ButtonStyle.Link).setURL(file.youtube)
        );

        const modEmbed = new EmbedBuilder()
          .setTitle(file.name)
          .addFields(
            {
              name: 'Fix-up Stats',
              value: file.status,
              inline: true
            },
            {
              name: 'StepMania Engine',
              value: file.version,
              inline: true
            }
          )
          .setURL(file.youtube);

        if (['youtube', 'youtu.be'].some((e) => file.youtube.includes(e)) && nodeuri.checkHttpsURL(file.youtube)) {
          modEmbed.setURL(file.youtube);

          const results = file.youtube.match('[\\?&]v=([^&#]*)');
          const secondResult = file.youtube.substring(file.youtube.length - 11);
          let videoID = results === null ? file.youtube : results[1];
          // This solves this type of link https://youtu.be/oMa-fqnCVzY
          if (videoID === file.youtube && secondResult.length === 11) videoID = secondResult;

          if (
            videoID &&
            videoID.length === 11 &&
            nodeuri.checkHttpsURL(`https://img.youtube.com/vi/${videoID}/0.jpg`)
          ) {
            modEmbed.setImage(`https://img.youtube.com/vi/${videoID}/0.jpg`);

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

                vibrantColor.set(
                  'value',
                  `#${componentToHex(rgb[0]) + componentToHex(rgb[1]) + componentToHex(rgb[2])}`
                );
                return true;
              }
            );

            if (colorObj) modEmbed.setColor(vibrantColor.get('value'));
          }
        }

        if (file.author) modEmbed.addFields({ name: 'Author', value: file.author, inline: true });
        if (file.pack) modEmbed.addFields({ name: 'Pack', value: file.pack, inline: true });

        await cCtx.acknowledge();
        await message.edit({
          embeds: [modEmbed],
          components: [buttons]
        });
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
    const embed = new EmbedBuilder()
      .setTitle('Converted Mods')
      .setURL('https://docs.google.com/spreadsheets/d/1P892pQEcfzP59NeSm2aHIKNB1Rv4DqIXtELkcIvJNbM/edit?usp=sharing')
      .setColor('#9f245c')
      .setDescription(ModsSheetInstance.chartsFromPage(rows, pageIndex));

    const leastPageNum = 0 > pageIndex - 1 ? 0 : pageIndex - 1;
    const maxPageNum = pageIndex + 1 > pagesNum - 1 ? pagesNum - 1 : pageIndex + 1;

    const buttons = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId(`back+${leastPageNum}`).setLabel('Back').setStyle(ButtonStyle.Primary),
      new ButtonBuilder().setCustomId(`next+${maxPageNum}`).setLabel('Next').setStyle(ButtonStyle.Primary)
    );

    const selectMenu = new ActionRowBuilder().addComponents(
      new SelectMenuBuilder()
        .setCustomId(`modselected`)
        .setPlaceholder('Select file')
        .addOptions(ModsSheetInstance.chartsSelectMenuFromPage(rows, pageIndex))
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
    const portID = interaction.values[0].split('━')[2]; // commandID-interactionID-fileID-select
    const rows = await ModsSheetInstance.chartsToArrayObjectRows();
    const file = rows.find((element) => element.portID === portID);

    if (!file) {
      await interaction.ctx.send('Failed to get file.');
      return;
    }

    const buttons = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId(`startagain`).setLabel('Back to Select').setStyle(ButtonStyle.Primary),
      new ButtonBuilder().setLabel('Watch Video').setStyle(ButtonStyle.Link).setURL(file.youtube)
    );

    const embed = new EmbedBuilder()
      .setTitle(file.name)
      .addFields(
        {
          name: 'Fix-up Stats',
          value: file.status,
          inline: true
        },
        {
          name: 'StepMania Engine',
          value: file.version,
          inline: true
        }
      )
      .setURL(file.youtube);

    if (['youtube', 'youtu.be'].some((e) => file.youtube.includes(e)) && nodeuri.checkHttpsURL(file.youtube)) {
      nembed.setURL(file.youtube);

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

    if (file.author) embed.addFields({ name: 'Author', value: file.author, inline: true });
    if (file.pack) embed.addFields({ name: 'Pack', value: file.pack, inline: true });

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
