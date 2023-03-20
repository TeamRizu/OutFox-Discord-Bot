const { EmbedBuilder } = require('discord.js')
const buildTypeDescription = {
  public:
    'This is a public build that is available to be downloaded by anyone either by using Project OutFox Website or Team Rizu\'s OutFox Repository.',
  testbuild:
    'This is a test build, it is not available to the public but you can get it by joining the Testing Program on Project OutFox Discord Server.',
  private:
    'This is a private build, it is only available to Project OutFox Team.'
}
const fallbackBuild = {
  name: 'Unknown',
  buildtype: 'private',
  notes: null,
  exclusive: null,
  date: '20030924'
}

exports.main = ({ build, hash } = { build: fallbackBuild, hash: 'Unknown' }) => {
  const { buildNotes, formatDate } = require('./functions.js')
  const embed = new EmbedBuilder()
    .setTitle('Build Matches ' + build.name)
    .setDescription(buildTypeDescription[build.buildtype])
    .setColor('#bad0ff')
    .setFooter({
      text: 'Hash: ' + hash
    })
    .addFields({
      name: 'Build Data (DD/MM/YYYY)',
      value: formatDate(build.date)
    })

  if (build.notes !== null) {
    embed.addFields({
      name: 'Notes',
      value: buildNotes(build)
    })
  }

  if (build.exclusive !== null) {
    embed.addFields({
      name: 'Exclusive Version',
      value: 'This build is exclusive to ' + build.exclusive
    })
  }

  return embed
}
