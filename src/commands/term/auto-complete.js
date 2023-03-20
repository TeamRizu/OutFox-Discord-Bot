// eslint-disable-next-line no-unused-vars
const { AutocompleteContext } = require('slash-create')
const stringSimilarity = require('string-similarity')
const { TermClass } = require('../../utils/term-class')
const Term = new TermClass()
/**
 * @param {AutocompleteContext} ctx
 */
exports.main = async (ctx) => {
  const text = ctx.options[ctx.focused]
  const matches = stringSimilarity.findBestMatch(text, Term.terms)

  return [{ name: matches.bestMatch.target || text, value: matches.bestMatch.target || text }]
}
