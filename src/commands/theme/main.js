// eslint-disable-next-line no-unused-vars
const { CommandContext, Message } = require('slash-create')

/**
 *
 * @async
 * @param {CommandContext} ctx
 * @returns {void}
 */
exports.main = async (ctx) => {
  await ctx.defer()

  const { themeListEmbed, engineSelectMenu, engineThemesEmbed, themeListComponents, embedTheme, themeButton } = require('./functions.js')
  const ArchiveThemes = require('../../utils/archive-themes-class.js').ArchiveAnnouncersClass
  const TextSelectMenuBuilder = require('../../utils/text-select-menu-builder-class.js').TextSelectMenuBuilder
  const ArchiveThemesClass = new ArchiveThemes()

  await ArchiveThemesClass.setup()

  const themesEmbed = themeListEmbed(ArchiveThemesClass)
  const selectEngine = engineSelectMenu()

  const message = await ctx.send({
    embeds: [themesEmbed],
    components: [selectEngine]
  })

  const TextSelectMenuBuilderClass = new TextSelectMenuBuilder()

  ctx.registerComponent('startagain', async (cCtx) => {
    await cCtx.acknowledge()
    await message.edit({
      embeds: [themesEmbed],
      components: [selectEngine]
    })
  })

  ctx.registerComponent('smselected', async (cCtx) => {
    await cCtx.acknowledge()
    const engine = cCtx.values[0]
    const themesForFork = ArchiveThemesClass.themesForVersion(engine)

    TextSelectMenuBuilderClass.supportLookUp = true
    TextSelectMenuBuilderClass.menuSelectPlaceholder = 'Select Theme to Look Up'
    TextSelectMenuBuilderClass.separator = '+'
    TextSelectMenuBuilderClass.pageSwitchArgument = engine
    TextSelectMenuBuilderClass.elements = []
    TextSelectMenuBuilderClass.page = 0

    for (let i = 0; i < themesForFork.length; i++) {
      const themeData = ArchiveThemesClass.themeFromVersion(engine, themesForFork[i])
      TextSelectMenuBuilderClass.addElement({
        description: themeData.Name,
        value: `${engine}+${i}`
      })
    }

    const newEmbed = engineThemesEmbed(engine, TextSelectMenuBuilderClass.pages.pageList[0])
    const newComponents = themeListComponents(TextSelectMenuBuilderClass)

    await message.edit({
      embeds: [newEmbed],
      components: newComponents
    })
  })

  ctx.registerWildcardComponent(message.id, async (wCtx) => {
    await wCtx.acknowledge()
    const component = wCtx.customID

    if (component === 'themechange') {
      const engine = TextSelectMenuBuilderClass.pageSwitchArgument
      const newEmbed = engineThemesEmbed(engine, TextSelectMenuBuilderClass.pages.pageList[TextSelectMenuBuilderClass.page])
      const newComponents = themeListComponents(TextSelectMenuBuilderClass)

      await message.edit({
        embeds: [newEmbed],
        components: newComponents
      })
    }

    if (component.startsWith('back') || component.startsWith('next')) {
      const newPage = Number(component.split('+')[1])
      const engine = component.split('+')[2]

      TextSelectMenuBuilderClass.page = newPage

      const newEmbed = engineThemesEmbed(engine, TextSelectMenuBuilderClass.pages.pageList[TextSelectMenuBuilderClass.page])
      const newComponents = themeListComponents(TextSelectMenuBuilderClass)

      await message.edit({
        embeds: [newEmbed],
        components: newComponents
      })
    }

    if (component.startsWith('updatepage')) {
      const engine = wCtx.values[0].split('+')[0]
      const themeIndex = wCtx.values[0].split('+')[1]
      const themeID = ArchiveThemesClass.themesForVersion(engine)[themeIndex]
      const themeData = ArchiveThemesClass.themeFromVersion(engine, themeID)
      const themeEmbed = embedTheme(themeData, engine, themeID)

      const buttons = themeButton(engine, themeID)

      await message.edit({
        embeds: [themeEmbed],
        components: [buttons]
      })
    }
  })
}
