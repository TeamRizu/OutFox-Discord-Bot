// eslint-disable-next-line no-unused-vars
const { CommandContext, Message } = require('slash-create')
const { buildTermComponents, buildTermEmbed } = require('./index.js')

/**
 *
 * @async
 * @param {CommandContext} ctx
 * @returns {void}
 */
exports.main = async (ctx) => {
  const Terms = require('../../utils/term-class.js').TermClass
  const TermsClass = new Terms()
  const requestedTermName = ctx.options.name?.toLowerCase()

  await ctx.defer()

  if (!TermsClass.terms.includes(requestedTermName)) {
    await ctx.send('Unknown term.')
    return
  }

  const term = TermsClass.termObjectByName(requestedTermName)

  if (!term) {
    await ctx.send('Failed to get term data.')
    return
  }

  const embed = buildTermEmbed(term)
  const components = buildTermComponents(term)
  /**
   * @type {Message}
   */
  const message = await ctx.send({
    embeds: [embed],
    components
  })

  ctx.registerWildcardComponent(message.id, async (cCtx) => {
    const component = cCtx.customID

    if (!component.startsWith('term')) return

    const termName = component

    await cCtx.acknowledge()

    if (!TermsClass.terms.includes(termName)) {
      message.edit({
        content: 'Something went wrong, please report to OutFox Community Moderator with any details.'
      })
      return
    }

    const referenceTerm = TermsClass.termObjectByName(termName)

    if (!referenceTerm) {
      message.edit({
        content: 'Something went wrong, please report to OutFox Community Moderator with any details.'
      })
      return
    }

    const referenceTermEmbed = buildTermEmbed(referenceTerm)
    const referenceTermComponents = buildTermComponents(referenceTerm)

    message.edit({
      embeds: [referenceTermEmbed],
      components: referenceTermComponents
    })
  })
}
