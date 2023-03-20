const { buildTermButtons } = require('./functions.js')

/**
 * @param {import("../../utils/term-class").TermObject} term
 */
exports.main = (term) => {
  const [termButtons, addedButtons] = buildTermButtons(term)

  return addedButtons ? [termButtons] : []
}
