// eslint-disable-next-line no-unused-vars
const { Message, CommandContext } = require('slash-create')

/**
 *
 * @async
 * @param {CommandContext} ctx
 * @returns {void}
 */
exports.main = async (ctx) => {
  await ctx.defer()

  const { announcerAuthorsEmbed, announcerListEmbed, announcerViewEmbed, authorsSelectMenu } = require('./functions.js')
  const TextSelectMenuBuilder = require('../../utils/text-select-menu-builder-class.js').TextSelectMenuBuilder
  const TextSelectMenuBuilderClass = new TextSelectMenuBuilder()
  const ArchiveAnnouncers = require('../../utils/archive-announcers-class.js').ArchiveAnnouncersClass
  const ArchiveAnnouncersClass = new ArchiveAnnouncers()

  await ArchiveAnnouncersClass.setup()
  const authors = Object.keys(ArchiveAnnouncersClass.announcersFromAuthors)
  const authorsAnnouncerCount = {}

  authors.forEach((author) => {
    authorsAnnouncerCount[author] = ArchiveAnnouncersClass.announcersByAuthor(author).length
  })

  /**
   * @type {Message}
   */
  const message = await ctx.send({
    embeds: [announcerAuthorsEmbed({ authorsAnnouncerCount })],
    components: [authorsSelectMenu({ authors })]
  })

  ctx.registerWildcardComponent(message.id, async (cCtx) => {
    await cCtx.acknowledge()
    const customID = cCtx.customID

    if (customID === 'authorselect') {
      const selectedAuthor = cCtx.values[0].split('+')[1]

      TextSelectMenuBuilderClass.elements = []
      TextSelectMenuBuilderClass.menuSelectPlaceholder = 'Select Announcer'
      TextSelectMenuBuilderClass.supportLookUp = true
      TextSelectMenuBuilderClass.separator = '+'

      const announcers = ArchiveAnnouncersClass.announcersByAuthor(selectedAuthor)

      announcers.forEach((announcer, i) => {
        TextSelectMenuBuilderClass.addElement({
          description: announcer.name,
          value: `${i}+${selectedAuthor}`
        })
      })

      await message.edit({
        embeds: [announcerListEmbed({ announcerList: TextSelectMenuBuilderClass.pages.pageList[TextSelectMenuBuilderClass.page] })],
        components: TextSelectMenuBuilderClass.pageComponents
      })
    }

    if (customID === 'anotherauthor') {
      TextSelectMenuBuilderClass.lookingUp = false

      await message.edit({
        embeds: [announcerAuthorsEmbed({ authorsAnnouncerCount })],
        components: [authorsSelectMenu({ authors })]
      })
    }

    if (customID.startsWith('next') || customID.startsWith('back') || customID.startsWith('stoplookup')) {
      const newPage = Number(customID.split('+')[1])

      TextSelectMenuBuilderClass.page = newPage

      await message.edit({
        embeds: [announcerListEmbed({ announcerList: TextSelectMenuBuilderClass.pages.pageList[TextSelectMenuBuilderClass.page] })],
        components: TextSelectMenuBuilderClass.pageComponents
      })
    }

    if (customID.startsWith('updatepage')) {
      const announcerIndex = Number(cCtx.values[0].split('+')[0])
      const author = cCtx.values[0].split('+')[1]
      const announcer = ArchiveAnnouncersClass.announcersByAuthor(author).at(announcerIndex)
      TextSelectMenuBuilderClass.lookingUp = true

      await message.edit({
        embeds: [announcerViewEmbed({ announcerName: announcer.name })],
        components: TextSelectMenuBuilderClass.pageComponents
      })
    }
  })
}
