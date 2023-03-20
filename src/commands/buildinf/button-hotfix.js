const { ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js')

exports.main = ({ hotfixHash } = { hotfixHash: 'unknown' }) => {
  const button = new ButtonBuilder()
    .setCustomId('hotfix+' + hotfixHash)
    .setLabel('Hotfix Build')
    .setStyle(ButtonStyle.Primary)

  return new ActionRowBuilder().addComponents(button)
}
