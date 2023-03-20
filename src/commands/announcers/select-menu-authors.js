const { ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js')

exports.main = ({ authors } = { authors: ['Unknown', 'Mock'] }) => {
  const authorOptions = []

  authors.forEach((author) => {
    authorOptions.push({
      label: author,
      value: 'author+' + author
    })
  })

  const selectMenu = new StringSelectMenuBuilder()
    .setCustomId('authorselect')
    .setPlaceholder('Select Author')
    .addOptions(authorOptions)

  const row = new ActionRowBuilder().addComponents(selectMenu)

  return row
}
