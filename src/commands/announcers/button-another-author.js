const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js')

exports.main = () => {
  return new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setStyle(ButtonStyle.Primary)
      .setLabel('Another Author')
      .setCustomId('anotherauthor')
  )
}
