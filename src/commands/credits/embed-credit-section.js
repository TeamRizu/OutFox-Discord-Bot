const { EmbedBuilder } = require('discord.js')
const { creditsEngineID } = require('./variables.js')

exports.main = ({ engine, sectionTitle, sectionMembers } = { engine: 'Stepmania', sectionTitle: 'FALLBACK_SECTION_TITLE', sectionMembers: 'FALLBACK_SECTION_MEMBERS' }) => {
  return new EmbedBuilder()
    .setTitle(`StepMania Archive - Credits - **${sectionTitle}**`)
    .setThumbnail('https://cdn.discordapp.com/icons/514194672441229323/2ceada703d6a65b57eb3e072ed741185.webp')
    .setURL(`https://josevarela.net/SMArchive/Builds/Credits.html#${encodeURIComponent(creditsEngineID[engine])}`)
    .setColor('#30c3c4')
    .setFooter({
      text: 'StepMania Archive made by Jose_Varela',
      iconURL: 'https://josevarela.net/SMArchive/Builds/VersionIcon/SM40.png'
    })
    .setDescription(
      `
        ${sectionMembers}
      `
    )
}
