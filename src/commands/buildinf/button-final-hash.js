const { ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js')

exports.main = ({ finalHash } = { finalHash: 'unknown' }) => {
  const button = new ButtonBuilder()
    .setCustomId('finalrelease+' + finalHash)
    .setLabel('Final Build')
    .setStyle(ButtonStyle.Primary)

  return new ActionRowBuilder().addComponents(button)
}
