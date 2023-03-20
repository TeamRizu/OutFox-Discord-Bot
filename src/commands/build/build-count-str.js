exports.main = (ArchiveBuildsClass, listID) => {
  const archiveListIDToNames = {
    DDRPC: 'DDR PC Edition ',
    SM095: 'StepMania 0.9x',
    SM164: 'StepMania 1.64',
    SM30: 'StepMania 3.0',
    SM39: 'StepMania 3.9',
    SM395: 'StepMania 3.95 (Main and Based builds)',
    OITG: 'OpenITG based builds',
    NOTITG: 'NotITG based builds',
    SM4: 'StepMania 4.0 Normal/CVS Builds',
    SMSSC: 'SM-SSC - StepMania 5.0 Alpha/Beta Builds',
    SMSSCCUSTOM: 'SM-SSC - StepMania 5.0 Custom Builds',
    SM5: 'StepMania 5',
    ETT: 'Etterna',
    OUTFOX: 'Project OutFox',
    ITGM: 'ITGmania'
  }
  const buildListCount = ArchiveBuildsClass.buildListObjectFromID(listID).Listing.length

  return `${archiveListIDToNames[listID]}: **${buildListCount} ${buildListCount <= 1 ? 'Build' : 'Builds'}**`
}
