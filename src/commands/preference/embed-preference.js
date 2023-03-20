const { EmbedBuilder } = require('discord.js')

exports.main = ({ preferenceName, documentation } = { preferenceName: 'Unknown Preference Name', documentation: 'Unknown Documentation' }) => {
  return new EmbedBuilder()
    .setTitle(preferenceName)
    .setColor('#002c73')
    .setDescription(documentation)
}
