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

  const { clearMembers, embedSelectFork, embedSelectSection, embedCreditSection, selectEngineMenu } = require('./functions.js')
  const TextSelectMenuBuilder = require('../../utils/text-select-menu-builder-class.js').TextSelectMenuBuilder
  const TextSelectMenuBuilderClass = new TextSelectMenuBuilder()
  const ArchiveCredits = require('../../utils/archive-credits-class.js').ArchiveAnnouncersClass
  const ArchiveCreditsClass = new ArchiveCredits()

  await ArchiveCreditsClass.setup()

  /**
   * @type {Message}
   */
  const message = await ctx.send({
    embeds: [embedSelectFork()],
    components: [selectEngineMenu({ engines: ArchiveCreditsClass.engines })]
  })

  ctx.registerWildcardComponent(message.id, async (cCtx) => {
    await cCtx.acknowledge()
    const customID = cCtx.customID

    if (customID === 'engineselected') { // Once engine has been selected.
      const engine = cCtx.values[0]
      const titlesByEngine = ArchiveCreditsClass.creditsTitleByEngine(engine)

      TextSelectMenuBuilderClass.separator = '+'
      TextSelectMenuBuilderClass.supportLookUp = true
      TextSelectMenuBuilderClass.menuSelectPlaceholder = 'Select Section'
      TextSelectMenuBuilderClass.elements = []

      for (let i = 0; i < titlesByEngine.length; i++) {
        TextSelectMenuBuilderClass.addElement({
          description: titlesByEngine[i],
          value: `${engine}+${i}`
        })
      }

      TextSelectMenuBuilderClass.page = 0
      await message.edit({
        embeds: [embedSelectSection({ section: TextSelectMenuBuilderClass.pages.pageList[0] })],
        components: TextSelectMenuBuilderClass.pageComponents
      })
    }

    if (customID.startsWith('stoplookup')) { // "Go Back" after having selected a section.
      TextSelectMenuBuilderClass.lookingUp = false

      await message.edit({
        embeds: [embedSelectSection({ section: TextSelectMenuBuilderClass.pages.pageList[0] })],
        components: TextSelectMenuBuilderClass.pageComponents
      })
    }

    if (customID.startsWith('updatepage')) { // Switching section page.
      const engine = cCtx.values[0].split('+')[0]
      const sectionIndex = cCtx.values[0].split('+')[1]
      const section = ArchiveCreditsClass.mainObject[engine][sectionIndex]

      TextSelectMenuBuilderClass.lookingUp = true

      await message.edit({
        embeds: [embedCreditSection({ engine, sectionTitle: section.title, sectionMembers: clearMembers(section) })],
        components: TextSelectMenuBuilderClass.pageComponents
      })
    }
  })
}
