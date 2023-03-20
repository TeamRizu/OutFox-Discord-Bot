const { EmbedBuilder } = require('discord.js')

exports.main = ({ authorsAnnouncerCount } = { authorsAnnouncerCount: { Unknown: 1, Mock: 2 } }) => {
  let authorsCountSection = ''

  const authors = Object.keys(authorsAnnouncerCount)

  authors.forEach((author) => {
    const announcersByAuthor = authorsAnnouncerCount[author]
    authorsCountSection += author + ': **' + announcersByAuthor + (announcersByAuthor > 1 ? ' Announcers' : ' Announcer') + '**\n'
    // MadkaT: 6 Announcers
  })

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
      Announcers help cheer up the player during gameplay and to say out loud their earned score.

      StepMania Archive came to archive all that work in one place.

      ${authorsCountSection}
      `
    )
}
