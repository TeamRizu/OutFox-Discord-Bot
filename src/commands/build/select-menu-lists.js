const { ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js')

exports.main = () => {
  const archiveListIDs = [
    'DDRPC',
    'SM095',
    'SM164',
    'SM30',
    'SM39',
    'SM395',
    'OITG',
    'NOTITG',
    'SM4',
    'SMSSC',
    'SMSSCCUSTOM',
    'SM5',
    'ETT',
    'OUTFOX',
    'ITGM'
  ]
  const archiveListNames = [
    'DDR PC Edition ',
    'StepMania 0.9x',
    'StepMania 1.64',
    'StepMania 3.0',
    'StepMania 3.9',
    'StepMania 3.95 (Main and Based builds)',
    'OpenITG based builds',
    'NotITG based builds',
    'StepMania 4.0 Normal/CVS Builds',
    'SM-SSC - StepMania 5.0 Alpha/Beta Builds',
    'SM-SSC - StepMania 5.0 Custom Builds',
    'StepMania 5',
    'Etterna',
    'Project OutFox',
    'ITGmania'
  ]
  const archiveBuildEngineIconData = require('./build-engine-icon.js').main()
  const listOptions = []

  for (let i = 0; i < archiveListIDs.length; i++) {
    const currentEngine = archiveListIDs[i]
    const tempObj = {}

    tempObj.label = archiveListNames[i]
    tempObj.value = currentEngine
    tempObj.emoji = archiveBuildEngineIconData[currentEngine]

    listOptions.push(tempObj)
  }

  const smSelectMenu = new ActionRowBuilder().addComponents(
    new StringSelectMenuBuilder()
      .setCustomId('buildselected')
      .setPlaceholder('Select Build List')
      .addOptions(listOptions)
  )

  return smSelectMenu
}
