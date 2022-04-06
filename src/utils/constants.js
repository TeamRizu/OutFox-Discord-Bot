/**
 * Discord IDs for bug hunter roles
 */
exports.bugRole = {
  'Bug Reporter': '687824517422383282',
  'Bug Catcher': '736367693443235841',
  'Bug Maniac': '736367704402821242',
  'Bug Nightmare': '736367711994642542',
  'Bug Reaper': '736367719447789588',
  'Bug Banned': '707360111076835369'
};


/**
 * Engine ID accepted by StepMania Archive.
 */
exports.archiveEngineID = [
  'OutFox', // Project OutFox
  'StepMania 5', // StepMania 5
  'SM4', // StepMania 4
  'NITG', // NotITG
  'OITG', // OpenITG
  'SM3.95', // StepMania 3.95
  'SM3.9_Plus', // StepMania 3.9+
  'SM3.9' // StepMania 3.9
];

/**
 * Engine names based on Engine ID accepted by StepMania Archive.
 */
exports.archiveEngineName = {
  OutFox: 'Project OutFox',
  'StepMania 5': 'StepMania 5',
  SM4: 'StepMania 4',
  NITG: 'NotITG',
  OITG: 'OpenITG',
  'SM3.95': 'StepMania 3.95',
  'SM3.9_Plus': 'StepMania 3.9+',
  'SM3.9': 'StepMania 3.9'
};

/**
 * Discord Emote Data based on Engine ID accepted by StepMania Archive.
 */
exports.archiveEngineEmoteData = {
  OutFox: {
    name: 'OUTFOX',
    id: '959944386609840148'
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
};

/**
 * Engine Vibrant Colors Hex format based on Engine ID accepted by StepMania Archive
 */
exports.archiveEngineColors = {
  OutFox: '#bad0ff',
  NITG: '#e2e5e0',
  OITG: '#e00207',
  'StepMania 5': '#fc9768',
  SM4: '#cc0000',
  'SM3.95': '#b9b423',
  'SM3.9': '#b9b423',
  'SM3.9_Plus': '#b9b423'
};

exports.archiveEngineLink = {
  OutFox: 'https://josevarela.xyz/SMArchive/Builds/#OUTFOX',
  'StepMania 5': 'https://josevarela.xyz/SMArchive/Builds/#SM5',
  NITG: 'https://josevarela.xyz/SMArchive/Builds/#OITG',
  SM4: 'https://josevarela.xyz/SMArchive/Builds/#SM4',
  OITG: 'https://josevarela.xyz/SMArchive/Builds/#OITG',
  'SM3.95': 'https://josevarela.xyz/SMArchive/Builds/#SM395',
  'SM3.9_Plus': 'https://josevarela.xyz/SMArchive/Builds/#SM39',
  'SM3.9': 'https://josevarela.xyz/SMArchive/Builds/#SM39'
}

/**
 * Embed fields that should be included on any embed with data from StepMania Archive
 */
exports.archiveGenericEmbedFields = {
  footer: {
    text: 'StepMania Archive made by Jose_Varela',
    icon_url: 'https://josevarela.xyz/SMArchive/Builds/VersionIcon/SM40.png'
  }
}
