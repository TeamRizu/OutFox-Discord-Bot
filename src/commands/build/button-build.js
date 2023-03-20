const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js')

exports.main = (buildObject = {}, listID = 'OUTFOX') => {
  const listPageButton = new ButtonBuilder()
    .setURL(`https://josevarela.net/SMArchive/Builds/index.php#div${listID.toLowerCase()}`)
    .setLabel('List Page')
    .setStyle(ButtonStyle.Link)

  const anotherBuildButton = new ButtonBuilder()
    .setLabel('Another Build')
    .setCustomId(`buildselecteddeep+${listID.toLowerCase()}`)
    .setStyle(ButtonStyle.Primary)

  const buttons = [listPageButton, anotherBuildButton]

  if (buildObject.ID) {
    const buildChangelogButton = new ButtonBuilder()
      .setURL(`https://josevarela.net/SMArchive/Builds/BuildChangeLogs.php?Version=${buildObject.ID}`)
      .setLabel('Build Changelog')
      .setStyle(ButtonStyle.Link)

    buttons.push(buildChangelogButton)
  }

  return new ActionRowBuilder().addComponents(
    buttons
  )
}
