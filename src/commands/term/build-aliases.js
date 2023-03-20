/**
 *
 * @param {import("../../utils/term-class").TermObject} term
 */
exports.main = (term) => {
  let notes = ''

  for (let i = 0; i < term.aliases.length; i++) {
    const currentAlias = term.aliases[i]
    const properAlias = term.properAlias[currentAlias]

    if (term.aliasesExplanation && term.aliasesExplanation[currentAlias]) {
      notes += `- ${properAlias}: ${term.aliasesExplanation[currentAlias]}\n`
      continue
    }

    notes += `- ${properAlias}\n`
  }

  return notes
}
