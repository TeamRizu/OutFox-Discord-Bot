const fakeClass = {
  buildListObjectFromID: () => {
    return {
      Listing: []
    }
  }
}

exports.main = (ArchiveBuildsClass = fakeClass) => {
  const { EmbedBuilder } = require('discord.js')
  const buildEmote = require('./build-emote-str.js').main
  const buildCount = require('./build-count-str.js').main
  const embed = new EmbedBuilder()
    .setTitle('StepMania Archive Builds')
    .setDescription(
      `
    Builds are the core code that powers the engine, different builds will behave differently and have
    StepMania Archive cames to archive all that work in one place, going beyond builds.
    ${buildEmote('DDRPC') + ' - ' + buildCount(ArchiveBuildsClass, 'DDRPC')}
    ${buildEmote('SM095') + ' - ' + buildCount(ArchiveBuildsClass, 'SM095')}
    ${buildEmote('SM164') + ' - ' + buildCount(ArchiveBuildsClass, 'SM164')}
    ${buildEmote('SM30') + ' - ' + buildCount(ArchiveBuildsClass, 'SM30')}
    ${buildEmote('SM39') + ' - ' + buildCount(ArchiveBuildsClass, 'SM39')}
    ${buildEmote('SM395') + ' - ' + buildCount(ArchiveBuildsClass, 'SM395')}
    ${buildEmote('OITG') + ' - ' + buildCount(ArchiveBuildsClass, 'OITG')}
    ${buildEmote('NOTITG') + ' - ' + buildCount(ArchiveBuildsClass, 'NOTITG')}
    ${buildEmote('SM4') + ' - ' + buildCount(ArchiveBuildsClass, 'SM4')}
    ${buildEmote('SMSSC') + ' - ' + buildCount(ArchiveBuildsClass, 'SMSSC')}
    ${buildEmote('SMSSCCUSTOM') + ' - ' + buildCount(ArchiveBuildsClass, 'SMSSCCUSTOM')}
    ${buildEmote('SM5') + ' - ' + buildCount(ArchiveBuildsClass, 'SM5')}
    ${buildEmote('ETT') + ' - ' + buildCount(ArchiveBuildsClass, 'ETT')}
    ${buildEmote('OUTFOX') + ' - ' + buildCount(ArchiveBuildsClass, 'OUTFOX')}
    ${buildEmote('ITGM') + ' - ' + buildCount(ArchiveBuildsClass, 'ITGM')}
    `
    )
    .setThumbnail(
      'https://cdn.discordapp.com/icons/514194672441229323/2ceada703d6a65b57eb3e072ed741185.webp'
    )
    .setURL('https://josevarela.net/SMArchive/Builds/index.php')
    .setColor('#30c3c4')

  return embed
}
