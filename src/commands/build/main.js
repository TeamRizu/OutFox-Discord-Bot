// eslint-disable-next-line no-unused-vars
const { Message, CommandContext } = require('slash-create')
/* eslint indent: ["error", 2, { "SwitchCase": 1 }] */

/**
 *
 * @async
 * @param {CommandContext} ctx
 * @returns {void}
 */
exports.main = async (ctx) => {
  await ctx.defer()

  const { embedLists, selectMenuLists, buildEngineIcon, buildNameToEmoteName, buttonBuildList, embedSelectBuild, embedBuild, buttonBuild } = require('./functions.js')
  const TextSelectMenuBuilder = require('../../utils/text-select-menu-builder-class.js').TextSelectMenuBuilder
  const ArchiveBuilds =
    require('../../utils/archive-builds-class.js').ArchiveAnnouncersClass
  const ArchiveBuildsClass = new ArchiveBuilds()

  await ArchiveBuildsClass.setup()

  const message = await ctx.send({
    embeds: [embedLists(ArchiveBuildsClass)],
    components: [selectMenuLists()]
  })

  ctx.registerWildcardComponent(message.id, async (cCtx) => {
    await cCtx.acknowledge()
    /**
     * @type {'startagain' | 'buildselected' | 'buildselecteddeep+0' | 'next+0+listID' | 'back+0+listID'}
     */
    const component = cCtx.customID

    if (component === 'startagain') {
      await cCtx.acknowledge()
      await message.edit({
        embeds: [embedLists(ArchiveBuildsClass)],
        components: [selectMenuLists()]
      })
    }

    const isPageSwitch =
      component.startsWith('next') || component.startsWith('back')
    const isBackFromLoopUp = component.startsWith('buildselecteddeep')

    if (component === 'buildselected' || isBackFromLoopUp || isPageSwitch) {
      let listID = ''

      if (isPageSwitch) listID = component.split('+')[2]
      if (isBackFromLoopUp) listID = component.split('+')[1]
      if (!isBackFromLoopUp && !isPageSwitch) listID = cCtx.values[0]
      // Number casting is used here otherwise when we overwrite the page property of the class it will mess up with the next page switch.
      const page = isPageSwitch ? Number(component.split('+')[1]) : 0
      const listingForBuild = ArchiveBuildsClass.listingNamesFromID(listID)
      const TextSelectMenuBuilderClass = new TextSelectMenuBuilder()

      TextSelectMenuBuilderClass.supportLookUp = true
      TextSelectMenuBuilderClass.menuSelectPlaceholder =
        'Select Build to Look Up'
      TextSelectMenuBuilderClass.separator = '+'
      TextSelectMenuBuilderClass.pageSwitchArgument = listID

      TextSelectMenuBuilderClass.formatElement = (e) => {
        return `<:${e.emoji.name}:${e.emoji.id}> ${e.description}`
      }

      for (let i = 0; i < listingForBuild.length; i++) {
        TextSelectMenuBuilderClass.addElement({
          value: `${listingForBuild[i]}+${i}+${listID}`,
          description: listingForBuild[i],
          emoji:
            buildEngineIcon()[
              buildNameToEmoteName(listID, listingForBuild[i])
            ]
        })
      }

      const selectBuildEmbed = embedSelectBuild(TextSelectMenuBuilderClass.pages.pageList[page], listID)
      const buttons = buttonBuildList()

      TextSelectMenuBuilderClass.page = page

      const components = TextSelectMenuBuilderClass.pageComponents

      components.push(buttons)

      await message.edit({
        embeds: [selectBuildEmbed],
        components
      })
    }

    if (component.startsWith('updatepage')) {
      // const listName = cCtx.values[0].split('+')[0]
      const page = cCtx.values[0].split('+')[1]
      const listID = cCtx.values[0].split('+')[2]
      const listObject = ArchiveBuildsClass.buildListObjectFromID(listID)
      const buildObject = listObject.Listing[page]
      const buildEmbed = embedBuild(buildObject, listID, listObject)
      const buttons = buttonBuild(buildObject, listID)

      await message.edit({
        embeds: [buildEmbed],
        components: [buttons]
      })
    }
  })
}
