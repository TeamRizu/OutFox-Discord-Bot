const { ActionRowBuilder } = require('discord.js')

exports.main = (build) => {
  const { hotfixButton, finalHashButton } = require('./functions.js')
  const buttons = new ActionRowBuilder()
  let addedButtons = false

  if (!build.notes) return []

  for (let i = 0; i < build.notes.length; i++) {
    const currentNote = build.notes[i]

    if (currentNote.type === 'hotfix_notice') {
      addedButtons = true
      buttons.addComponents(hotfixButton({ hotfixHash: currentNote.hotfix_hash }).components[0])
    }

    if (currentNote.type === 'release_candidate' && currentNote.final_hash) {
      addedButtons = true
      buttons.addComponents(finalHashButton({ finalHash: currentNote.final_hash }).components[0])
    }
  }

  return addedButtons ? [buttons] : []
}
