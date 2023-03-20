// eslint-disable-next-line no-unused-vars
const { CommandContext } = require('slash-create')

/**
 *
 * @async
 * @param {CommandContext} ctx
 * @returns {void}
 */
exports.main = async (ctx) => {
  const { makeEmbed } = require('./index.js')

  await ctx.defer()
  ctx.send({
    embeds: [makeEmbed()]
  })
}
