exports.main = (engine = 'OutFox', themeID = 'Superuser') => {
  const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js')
  const archiveEngineLink = {
    OutFox: 'https://josevarela.xyz/SMArchive/Builds/#OUTFOX',
    'StepMania 5': 'https://josevarela.xyz/SMArchive/Builds/#SM5',
    'SM-SSC': 'https://josevarela.xyz/SMArchive/Builds/index.html#SMSSCCUSTOM',
    NITG: 'https://josevarela.xyz/SMArchive/Builds/#OITG',
    SM4: 'https://josevarela.xyz/SMArchive/Builds/#SM4',
    OITG: 'https://josevarela.xyz/SMArchive/Builds/#OITG',
    'SM3.95': 'https://josevarela.xyz/SMArchive/Builds/#SM395',
    'SM3.9_Plus': 'https://josevarela.xyz/SMArchive/Builds/#SM39',
    'SM3.9': 'https://josevarela.xyz/SMArchive/Builds/#SM39'
  }

  return new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setURL(
        `https://josevarela.xyz/SMArchive/Themes/ThemePreview.html?Category=${engine.replace(
          ' ',
          '%20'
        )}&ID=${themeID}`
      )
      .setLabel('Theme Page')
      .setStyle(ButtonStyle.Link),
    new ButtonBuilder().setURL(archiveEngineLink[engine]).setLabel('Engine Page').setStyle(ButtonStyle.Link),
    new ButtonBuilder().setLabel('Another Theme').setStyle(ButtonStyle.Primary).setCustomId('themechange')
  )
}
