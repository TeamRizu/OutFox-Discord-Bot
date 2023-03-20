/* eslint indent: ["error", 2, { "SwitchCase": 1 }] */
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js')
const { TermClass } = require('../../utils/term-class')

/**
 * @param {import("../../utils/term-class").TermObject} term
 */
exports.main = (term) => {
  const buttons = new ActionRowBuilder()
  let addedButtons = false

  if (!term.references) return [buttons, addedButtons]

  for (let i = 0; i < term.references.length; i++) {
    const currentReference = term.references[i]
    const button = new ButtonBuilder()

    switch (currentReference.type) {
      case 'url':
        button.setStyle(ButtonStyle.Link)
        button.setURL(currentReference.url)
        button.setLabel(currentReference.label)
        break
      case 'term': {
        const Term = new TermClass()
        const referenceTerm = Term.termObjectByName(currentReference.term)

        button.setStyle(ButtonStyle.Primary)
        button.setLabel(currentReference.label || 'See ' + referenceTerm.properName)
        button.setCustomId(currentReference.term)
        break
      }
    }

    buttons.addComponents(button)
    addedButtons = true
  }

  return [buttons, addedButtons]
}
