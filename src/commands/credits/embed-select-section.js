const { EmbedBuilder } = require('discord.js')

exports.main = ({ section } = { section: 'FALLBACK_SECTION' }) => {
  return new EmbedBuilder()
    .setTitle('StepMania Archive - Credits')
    .setThumbnail('https://cdn.discordapp.com/icons/514194672441229323/2ceada703d6a65b57eb3e072ed741185.webp')
    .setURL('https://josevarela.net/SMArchive/Builds/Credits.php')
    .setColor('#30c3c4')
    .setFooter({
      text: 'StepMania Archive made by Jose_Varela',
      iconURL: 'https://josevarela.net/SMArchive/VersionIcon/SM40.png'
    })
    .setDescription(
      `
        **Use the dropdown to select a section.**

        ${section}
      `
    )
}
