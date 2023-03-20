// eslint-disable-next-line no-unused-vars
const { CommandContext, Message } = require('slash-create')
/* eslint indent: ["error", 2, { "SwitchCase": 1 }] */

/**
 *
 * @async
 * @param {CommandContext} ctx
 * @returns {void}
 */
exports.main = async (ctx) => {
  const { secondVolumeEmbed, firstVolumeEmbed, startEmbed, selectMenuVolume, serenityBackButton } = require('./index.js')
  await ctx.defer()

  const selectVolumeMenu = selectMenuVolume()
  const [start, firstVolume, secondVolume] = [
    startEmbed(),
    firstVolumeEmbed(),
    secondVolumeEmbed()
  ]
  const backButton = serenityBackButton()

  const msgData = {
    embeds: [start],
    components: [selectVolumeMenu]
  }

  /**
  * @type {Message}
  */
  const message = await ctx.send(msgData)

  ctx.registerWildcardComponent(message.id, async (cCtx) => {
    const selectedVolume = cCtx.values[0]

    await cCtx.acknowledge()
    switch (selectedVolume) {
      case 'v1':
        await message.edit({
          embeds: [firstVolume],
          components: [backButton]
        })
        break
      case 'v2':
        await message.edit({
          embeds: [secondVolume],
          components: [backButton]
        })
        break
      default:
        await message.edit({
          embeds: [start],
          components: [selectVolumeMenu]
        })
    }
  })
}
