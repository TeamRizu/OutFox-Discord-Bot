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
  const { buildPreferenceButtons, buildPreferenceEmbed, buildPreferenceListEmbed } = require('./functions.js')
  const TextSelectMenuBuilderClass =
    require('../../utils/text-select-menu-builder-class.js').TextSelectMenuBuilder
  const PreferencesClass =
    require('../../utils/preferences-class.js').PreferencesClass
  const TextSelectMenuBuilder = new TextSelectMenuBuilderClass()
  const Preferences = new PreferencesClass()

  TextSelectMenuBuilder.supportLookUp = true
  TextSelectMenuBuilder.menuSelectPlaceholder = 'Select Preference to Look Up'
  TextSelectMenuBuilder.separator = '+'

  for (let i = 0; i < Preferences.preferences.length; i++) {
    TextSelectMenuBuilder.addElement({
      description: Preferences.preferences[i],
      value: `${i}`
    })
  }

  const embed = buildPreferenceListEmbed({
    page: 0,
    pageContent: TextSelectMenuBuilder.pages.pageList[0],
    pageCount: TextSelectMenuBuilder.pages.pageList.length,
    prefenceCount: Preferences.preferences.length
  })

  /**
   * @type {Message}
   */
  const message = await ctx.send({
    embeds: [embed],
    components: TextSelectMenuBuilder.pageComponents
  })

  ctx.registerWildcardComponent(message.id, async (cCtx) => {
    const component = cCtx.customID

    await cCtx.acknowledge()

    if (component === 'startagain') {
      TextSelectMenuBuilder.lookingUp = false
      const newEmbed = buildPreferenceListEmbed({
        page: TextSelectMenuBuilder.page,
        pageContent:
          TextSelectMenuBuilder.pages.pageList[TextSelectMenuBuilder.page],
        pageCount: TextSelectMenuBuilder.pages.pageList.length,
        prefenceCount: Preferences.preferences.length
      })

      await message.edit({
        embeds: [newEmbed],
        components: TextSelectMenuBuilder.pageComponents
      })
    }

    if (component.startsWith('next') || component.startsWith('back')) {
      const newPage = Number(component.split('+')[1])

      TextSelectMenuBuilder.page = newPage

      const newEmbed = buildPreferenceListEmbed({
        page: newPage,
        pageContent:
          TextSelectMenuBuilder.pages.pageList[newPage],
        pageCount: TextSelectMenuBuilder.pages.pageList.length,
        prefenceCount: Preferences.preferences.length
      })

      await message.edit({
        embeds: [newEmbed],
        components: TextSelectMenuBuilder.pageComponents
      })
    }

    if (component.startsWith('updatepage')) {
      const preferenceIndex = Number(cCtx.values[0])
      const preferenceName = Preferences.preferences[preferenceIndex]
      const documentation = Preferences.mainObject[preferenceName]
      const preferenceEmbed = buildPreferenceEmbed({ preferenceName, documentation })
      const prefecenreButtons = buildPreferenceButtons(preferenceName)

      await message.edit({
        embeds: [preferenceEmbed],
        components: [prefecenreButtons]
      })
    }
  })
}
