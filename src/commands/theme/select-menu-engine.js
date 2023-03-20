exports.main = () => {
  const { ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js')
  const smOptions = []
  const archiveEngineID = [
    'OutFox', // Project OutFox
    'StepMania 5', // StepMania 5
    'SM-SSC',
    'SM4', // StepMania 4
    'NITG', // NotITG
    'OITG', // OpenITG
    'SM3.95', // StepMania 3.95
    'SM3.9_Plus', // StepMania 3.9+
    'SM3.9' // StepMania 3.9
  ]
  const archiveEngineName = require('./engine-name.js').main()
  const archiveEngineEmoteData = {
    OutFox: {
      name: 'OUTFOX',
      id: '959944386609840148'
    },
    'SM-SSC': {
      name: 'SM5',
      id: '959944386567897138'
    },
    'StepMania 5': {
      name: 'SM5',
      id: '959944386567897138'
    },
    SM4: {
      name: 'SM40',
      id: '959944386572091432'
    },
    NITG: {
      name: 'NITG4',
      id: '959945091324190791'
    },
    OITG: {
      name: 'OITG',
      id: '959944386588840076'
    },
    'SM3.95': {
      name: 'SM39',
      id: '959944386186190870'
    },
    'SM3.9_Plus': {
      name: 'SM39',
      id: '959944386186190870'
    },
    'SM3.9': {
      name: 'SM39',
      id: '959944386186190870'
    }
  }

  for (let i = 0; i < archiveEngineID.length; i++) {
    const currentEngine = archiveEngineID[i]
    const tempObj = {}

    tempObj.label = archiveEngineName[currentEngine]
    tempObj.value = currentEngine
    tempObj.emoji = archiveEngineEmoteData[currentEngine]

    smOptions.push(tempObj)
  }

  return new ActionRowBuilder().addComponents(
    new StringSelectMenuBuilder()
      .setCustomId('smselected')
      .setPlaceholder('Select StepMania Engine')
      .addOptions(smOptions)
  )
}
