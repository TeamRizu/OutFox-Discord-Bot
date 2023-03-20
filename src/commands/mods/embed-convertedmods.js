exports.main = ({ modsList, curPageNum, pageNum } = { modsList: 'Failed to get mod list.', curPageNum: 0, pageNum: 0 }) => {
  const { EmbedBuilder } = require('discord.js')
  const embed = new EmbedBuilder()
    .setTitle('Converted Mods')
    .setURL('https://docs.google.com/spreadsheets/d/1P892pQEcfzP59NeSm2aHIKNB1Rv4DqIXtELkcIvJNbM/edit?usp=sharing')
    .setColor('#9f245c')
    .setDescription(modsList)
    .setFooter({ text: 'Page ' + (curPageNum + 1) + '/' + pageNum })

  return embed
}
