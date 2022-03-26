const { MessageEmbed, MessageActionRow, MessageButton, MessageSelectMenu } = require('discord.js')
const { SlashCommand } = require('slash-create');
const { ModsSheetFile } = require('../utils/mods.js');
const ModsSheetInstance = new ModsSheetFile();


module.exports = class ModsCommand extends SlashCommand {
  constructor(creator) {
    super(creator, {
      name: 'mods',
      description: 'See information about MrThatKid4 porting progress.'
    });
  }

  /**
   *
   * @param {ComponentContext} ctx
   */
  async run(ctx) {
    await ModsSheetInstance.init();
    await this.update(ctx, 6, true)
  }

  async update(ctx, pageIndex, firstSend) {
    pageIndex = Number(pageIndex)
    const rows = await ModsSheetInstance.chartsToArrayObjectRows()
    const pagesNum = Math.round(rows.length / ModsSheetInstance.elementsPerPage)
    const embed = new MessageEmbed()
    .setTitle('Converted Mods')
    .setDescription(ModsSheetInstance.chartsFromPage(rows, pageIndex))

    const leastPageNum = 0 > (pageIndex - 1) ? 0 : pageIndex - 1
    const maxPageNum = (pageIndex + 1) > (pagesNum - 1) ? pagesNum - 1 : pageIndex + 1

    console.log(`Current index: ${pageIndex}\nBack: ${leastPageNum}\nNext: ${maxPageNum}\nPagesNum: ${pagesNum}`)
    const buttons = new MessageActionRow()
    .addComponents(
      new MessageButton()
        .setCustomId(`2-${ctx.interactionID}-${leastPageNum}`)
        .setLabel("Back")
        .setStyle('PRIMARY'),
      new MessageButton()
        .setCustomId(`2-${ctx.interactionID}-${maxPageNum}`)
        .setLabel('Next')
        .setStyle('PRIMARY')
    )

    const selectMenu = new MessageActionRow()
    .addComponents(
      new MessageSelectMenu()
        .setCustomId(`2-${ctx.interactionID}-${pageIndex}-select`)
        .setPlaceholder('Select file')
        .addOptions(ModsSheetInstance.chartsSelectMenuFromPage(rows, pageIndex, ctx))
    )

    const msgData = {
      embeds: [embed],
      components: [buttons, selectMenu]
    }

    if (firstSend) {
      await ctx.send(msgData)
    } else {
      const r = await ctx.editParent(msgData)
      console.log(r)
    }
  }

  async lookUp(ctx, _, firstSend, values) {
    const portID = values[0].split('-')[2] // commandID-interactionID-fileID-select
    const rows = await ModsSheetInstance.chartsToArrayObjectRows()
    const file = rows.find(element => element.portID === portID)

    if (!file) {
      await ctx.send('Failed to get file.')
      return
    }

    const embed = new MessageEmbed()
      .setTitle(file.name)
      .addField('Fix-up Status', file.status, true)
      .addField('Youtube Video', file.youtube, true)

    if (file.author) embed.addField('Author', file.author, true)
    if (file.pack) embed.addField('Pack', file.pack, true)

    const msgData = {
      embeds: [embed],
      components: []
    }

    if (firstSend) {
      await ctx.send(msgData)
    } else {
      await ctx.editParent(msgData)
    }
  }
};
