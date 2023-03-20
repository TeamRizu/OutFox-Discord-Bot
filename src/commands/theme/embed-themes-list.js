const fakeClass = {
  themesForVersion: () => {
    return []
  }
}
exports.main = (ArchiveThemesClass = fakeClass) => {
  const { EmbedBuilder } = require('discord.js')
  const engineThemeCountString = require('./engine-theme-count-str.js').main
  const buildEmote = require('./build-emote-str.js').main
  return new EmbedBuilder()
    .setTitle('StepMania Archive Themes')
    .setDescription(
      `
      Themes are the frontend of any StepMania Engine, defining how users interact with all menus, the text shown and even the gameplay itself.
      \nHowever, each fork version played by the community today expects something different from the scripts that makes up the themes, past work can be lost as time advances and API changes.\n
      ${buildEmote('SM39') + ' - ' + engineThemeCountString(ArchiveThemesClass, 'SM3.9')}
      ${buildEmote('SM39') + ' - ' + engineThemeCountString(ArchiveThemesClass, 'SM3.9_Plus')}
      ${buildEmote('SM395') + ' - ' + engineThemeCountString(ArchiveThemesClass, 'SM3.95')}
      ${buildEmote('SM4') + ' - ' + engineThemeCountString(ArchiveThemesClass, 'SM4')}
      ${buildEmote('OITG') + ' - ' + engineThemeCountString(ArchiveThemesClass, 'OITG')}
      ${buildEmote('NOTITG') + ' - ' + engineThemeCountString(ArchiveThemesClass, 'NITG')}
      ${buildEmote('SMSSC') + ' - ' + engineThemeCountString(ArchiveThemesClass, 'SM-SSC')}
      ${buildEmote('SM5') + ' - ' + engineThemeCountString(ArchiveThemesClass, 'StepMania 5')}
      ${buildEmote('OUTFOX') + ' - ' + engineThemeCountString(ArchiveThemesClass, 'OutFox')}
      `
    )
    .setThumbnail('https://cdn.discordapp.com/icons/514194672441229323/2ceada703d6a65b57eb3e072ed741185.webp')
    .setURL('https://josevarela.net/SMArchive/Themes/')
    .setColor('#30c3c4')
}
