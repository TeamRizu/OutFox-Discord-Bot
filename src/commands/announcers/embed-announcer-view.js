const { EmbedBuilder } = require('discord.js')

exports.main = ({ announcerName } = { announcerName: 'Unknown' }) => {
  return new EmbedBuilder()
    .setTitle(announcerName)
    .setColor('#30c3c4')
    .setURL('https://josevarela.net/SMArchive/Announcers/index.html')
}
