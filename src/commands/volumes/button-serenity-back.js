const { ButtonBuilder, ActionRowBuilder, ButtonStyle } = require('discord.js')

exports.main = () => {
  return new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId('back')
      .setLabel('Back to Serenity')
      .setStyle(ButtonStyle.Primary)
  )
}
