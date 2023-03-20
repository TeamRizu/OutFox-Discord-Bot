// eslint-disable-next-line no-unused-vars
const { CommandContext, Message } = require('slash-create')

/**
 *
 * @async
 * @param {CommandContext} ctx
 * @returns {void}
 */
exports.main = async (ctx) => {
  const { buildHashComponents, buildHashEmbed } = require('./index.js')
  const HashBuildClass = require('../../utils/hash-build-class.js').HashBuildClass
  const HashBuild = new HashBuildClass()
  await ctx.defer()

  /**
   * @type {string}
   */
  const hash = ctx.options.hash

  const buildData = HashBuild.buildByHash(hash)

  if (!buildData) {
    ctx.send('Could not find build.')
    return
  }

  const embed = buildHashEmbed({ build: buildData, hash })
  const components = buildHashComponents(buildData)

  /**
   * @type {Message}
   */
  const message = await ctx.send({
    embeds: [embed],
    components
  })

  ctx.registerWildcardComponent(message.id, async (cCtx) => {
    await cCtx.acknowledge()

    const component = cCtx.customID
    const newHash = component.split('+')[1]
    const newBuildData = HashBuild.buildByHash(newHash)
    const newEmbed = buildHashEmbed({ build: newBuildData, hash: newHash })
    const newComponents = buildHashComponents(newBuildData)

    await message.edit({
      embeds: [newEmbed],
      components: newComponents
    })
  })
}
