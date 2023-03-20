const { EmbedBuilder } = require('discord.js')
const { buildAliases } = require('./functions.js')
/**
 *
 * @param {import('../../utils/term-class').TermObject} term
 */
exports.main = (term) => {
  const embed = new EmbedBuilder()
    .setTitle(term.properName)
    .setDescription(term.explanation)

  if (term.decorations) {
    if (term.decorations.thumbnail) embed.setThumbnail(term.decorations.thumbnail)
    if (term.decorations.image) embed.setImage(term.decorations.image)
    if (term.decorations.color) embed.setColor(term.decorations.color)
  }

  if (term.aliases) {
    embed.addFields({
      name: 'Also known as',
      value: buildAliases(term)
    })
  }

  return embed
}
