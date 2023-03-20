const { EmbedBuilder } = require('discord.js')

exports.main = ({ announcerList } = { announcerList: 'Placeholder List' }) => {
  return new EmbedBuilder()
    .setTitle('StepMania Archive - Announcers')
    .setThumbnail('https://cdn.discordapp.com/icons/514194672441229323/2ceada703d6a65b57eb3e072ed741185.webp')
    .setURL('https://josevarela.xyz/SMArchive/Announcers/index.html')
    .setColor('#30c3c4')
    .setFooter({
      text: 'StepMania Archive made by Jose_Varela',
      iconURL: 'https://josevarela.net/SMArchive/Builds/VersionIcon/SM40.png'
    })
    .setDescription(
      `
      ${announcerList}
      `
    )
}
