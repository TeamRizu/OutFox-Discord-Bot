// eslint-disable-next-line no-unused-vars
const { Message, CommandContext } = require('slash-create')

/**
 *
 * @param {CommandContext} ctx
 */
exports.main = async (ctx) => {
  const { convertedModsEmbed, modfileEmbed } = require('./functions.js')
  const TextSelectMenuBuilder = require('../../utils/text-select-menu-builder-class.js').TextSelectMenuBuilder
  const ModsSheet = require('../../utils/mods-sheet.js').ModsSheetClass
  const ModsSheetClass = new ModsSheet()
  const TextSelectMenuBuilderClass = new TextSelectMenuBuilder()

  await ctx.defer()
  await ModsSheetClass.loadSpreadSheet()

  TextSelectMenuBuilderClass.supportLookUp = true
  TextSelectMenuBuilderClass.menuSelectPlaceholder = 'Select Modfile'
  TextSelectMenuBuilderClass.separator = '+'

  const charts = await ModsSheetClass.charts()
  const convertedMods = charts.converted

  for (let i = 0; i < convertedMods.length; i++) {
    const modfile = convertedMods[i]
    const modfileAuthor = modfile.author ?? 'Unknown Author'
    let modfileEngineEmoji = '<SM5:959944386567897138>'

    if (['outfox', '5.3', '5.3+'].includes(modfile.support.toLowerCase())) {
      modfileEngineEmoji = '<OUTFOX:959944386609840148>'
    }

    if (['5.1', '5.1+'].includes(modfile.support)) {
      modfileEngineEmoji = '<SM5NEW:961263777427382322>'
    }

    TextSelectMenuBuilderClass.addElement({
      emoji: modfileEngineEmoji,
      value: 'modfile+' + i,
      description: modfile.name + ' (' + modfileAuthor + ')'
    })

    // TODO: Make a test file to test each embed result
  }

  const modPages = TextSelectMenuBuilderClass.pages
  /**
   * @type {Message}
   */
  const message = await ctx.send({
    embeds: [convertedModsEmbed({ modsList: modPages.pageList[0], curPageNum: 0, pageNum: modPages.pageList.length })],
    components: TextSelectMenuBuilderClass.pageComponents
  })

  ctx.registerWildcardComponent(message.id, async (cCtx) => {
    await cCtx.acknowledge()
    const customID = cCtx.customID

    if (customID.startsWith('next') || customID.startsWith('back') || customID.startsWith('stoplookup')) {
      TextSelectMenuBuilderClass.lookingUp = false
      const newPage = Number(customID.split('+')[1])

      TextSelectMenuBuilderClass.page = newPage

      const component = TextSelectMenuBuilderClass.pageComponents
      const newList = modPages.pageList[newPage]

      await message.edit({
        embeds: [convertedModsEmbed({ modsList: newList, curPageNum: newPage, pageNum: modPages.pageList.length })],
        components: component
      })
    }

    if (customID.startsWith('updatepage')) {
      TextSelectMenuBuilderClass.lookingUp = true
      const modfileIndex = Number(cCtx.values[0].split('+')[1])
      const modfile = convertedMods[modfileIndex]

      await message.edit({
        embeds: [await modfileEmbed({ modfile })],
        components: TextSelectMenuBuilderClass.pageComponents
      })
    }
  })
}
