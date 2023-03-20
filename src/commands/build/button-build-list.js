exports.main = () => {
  const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js')
  return new ActionRowBuilder().addComponents(
    new ButtonBuilder().setLabel('Another Build List').setStyle(ButtonStyle.Primary).setCustomId('startagain')
  )
}
