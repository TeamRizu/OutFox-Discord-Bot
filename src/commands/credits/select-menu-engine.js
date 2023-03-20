const { ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js')

exports.main = ({ engines } = { engines: ['Unknown'] }) => {
  const engineOptions = []

  for (let i = 0; i < engines.length; i++) {
    const currentEngine = engines[i]
    const tempObj = {}

    tempObj.label = currentEngine
    tempObj.value = currentEngine

    engineOptions.push(tempObj)
  }

  const selectMenu = new StringSelectMenuBuilder()
    .setCustomId('engineselected')
    .setPlaceholder('Select Engine')
    .addOptions(engineOptions)

  const row = new ActionRowBuilder().addComponents(selectMenu)

  return row
}
