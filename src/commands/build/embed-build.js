/* eslint indent: ["error", 2, { "SwitchCase": 1 }] */
exports.main = (
  buildObject = { Name: 'Project OutFox' },
  listID = 'OUTFOX',
  listObject = { Description: 'FALLBACK' }
) => {
  const { EmbedBuilder } = require('discord.js')
  const archiveListIDToEngineName = require('./list-engine-name.js').main()
  const archiveBuildEngineColor = require('./build-engine-color.js').main()
  const buildNameToEmoteKey = require('./build-name-emote-name-str.js').main
  const archiveIconLinkFormat = (name) => {
    switch (name) {
      case 'NotITG Version 3.1':
      case 'NotITG Version 3':
      case 'do not':
        return '.ico'
      default:
        return '.png'
    }
  }

  const embed = new EmbedBuilder()
    .setTitle(`Summary of ${buildObject.Name}`)
    .addFields(
      {
        name: 'Engine',
        value: archiveListIDToEngineName[listID],
        inline: true
      },
      {
        name: 'Date',
        value: buildObject.Date || '????-??-??',
        inline: true
      }
    )
    .setDescription(listObject.Description || 'No description.')
    .setColor(
      archiveBuildEngineColor[buildNameToEmoteKey(listID, buildObject.Name)]
    )
    .setThumbnail(
      `https://josevarela.net/SMArchive/VersionIcon/${buildNameToEmoteKey(
        listID,
        buildObject.Name
      )}${archiveIconLinkFormat(buildObject.Name)}`
    )

  const { Windows, Mac, Linux, Src } = buildObject
  const sources = [Windows, Mac, Linux, Src]
  const sourcesStr = ['Windows', 'Mac', 'Linux', 'Source Code']
  let availableSources = ''

  if (sources.every((e) => !e)) {
    availableSources = 'No sources available for this build.'
  } else {
    for (let i = 0; i < sources.length; i++) {
      if (sources[i]) {
        availableSources += `${sourcesStr[i]} - ✅\n`
        continue
      }

      availableSources += `${sourcesStr[i]} - ❌\n`
    }
  }

  embed.addFields({
    name: 'Available Sources',
    value: availableSources,
    inline: false
  })

  return embed
}
