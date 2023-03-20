const { EmbedBuilder } = require('discord.js')

exports.main = ({ page, pageContent, preferenceCount, pageCount } = { page: 0, pageContent: '', preferenceCount: 1, pageCount: 1 }) => {
  return new EmbedBuilder()
    .setTitle('OutFox Wiki - Preferences')
    .setImage('https://outfox.wiki/logo.png')
    .setURL('https://outfox.wiki/user-guide/config/preferences/')
    .setColor('#002c73')
    .setFooter({
      text: `Page ${page + 1}/${pageCount}`
    })
    .setDescription(
      'Preferences.ini is a file that contains many of the system preferences. Some of them are accessible within Project OutFox’s settings menu, but some of them are only accessible by editing the file. Manual edits to Preferences.ini must be performed when the game is closed, or else they may be automatically overwritten.\n' +
      'It is located in the Save [folder](https://outfox.wiki/user-guide/config/folders).\n' +
      'There is over' + preferenceCount + 'preferences documented.\n' + pageContent
    )
}
