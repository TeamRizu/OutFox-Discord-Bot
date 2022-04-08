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

exports.archiveThemesMusicWheelImage = {
  OITG: {
    'DECO': 'https://objects-us-east-1.dream.io/smthemes/OITG/Screenshots/Deco/screen3.png',
    'Empress': 'https://objects-us-east-1.dream.io/smthemes/OITG/Screenshots/Empress/screen4.png',
    'Retro': 'https://objects-us-east-1.dream.io/smthemes/OITG/Screenshots/Retro/screen3.png',
    'Meat': 'https://objects-us-east-1.dream.io/smthemes/OITG/Screenshots/Meat/screen3.png',
    'Mlp': 'https://objects-us-east-1.dream.io/smthemes/OITG/Screenshots/Mlp/screen4.png',
    'Obscurity': 'https://objects-us-east-1.dream.io/smthemes/OITG/Screenshots/Obscurity/screen3.png',
    'SLGJUVM': 'https://objects-us-east-1.dream.io/smthemes/OITG/Screenshots/SLGJUVM/screen3.png',
    'Tactics': 'https://objects-us-east-1.dream.io/smthemes/OITG/Screenshots/Tactics/screen4.png',
  },
  'NITG': {
    'SLOat': 'https://objects-us-east-1.dream.io/smthemes/NITG/Screenshots/SLOat/screen2.png'
  },
  'StepMania 5': {
    'Barebone': 'https://objects-us-east-1.dream.io/smthemes/StepMania%205/Screenshots/Barebone/screen3.png',
    'CS8S': 'https://objects-us-east-1.dream.io/smthemes/StepMania%205/Screenshots/CS8S/screen2.png',
    'CS8LA': 'https://objects-us-east-1.dream.io/smthemes/StepMania%205/Screenshots/CS8LA/screen2.png',
    'DDR5th': 'https://objects-us-east-1.dream.io/smthemes/StepMania%205/Screenshots/DDR5th/screen3.png',
    'Lazarus': 'https://objects-us-east-1.dream.io/smthemes/StepMania%205/Screenshots/Lazarus/screen2.png',
    'StRev': 'https://objects-us-east-1.dream.io/smthemes/StepMania%205/Screenshots/StRev/screen2.png',
    'starlight': 'https://objects-us-east-1.dream.io/smthemes/StepMania%205/Screenshots/starlight/screen3.png',
    'ultralight': 'https://objects-us-east-1.dream.io/smthemes/StepMania%205/Screenshots/ultralight/screen2.png',
    'UPSRT': 'https://objects-us-east-1.dream.io/smthemes/StepMania%205/Screenshots/UPSRT/screen4.png',
    'XIX.SUPER': 'https://objects-us-east-1.dream.io/smthemes/StepMania%205/Screenshots/XIX.SUPER/screen2.png'
  }
}

exports.archiveThemeDescription = {
  'StepMania 5': {
    'UPSRT': 'This theme is a "Story" theme, you need the UPSRT pack to experience the whole story.',
    'starlight': 'Do not confuse this version with the latest Starlight 2.0 version.'
  }
}

exports.conversionsGenericEmbedFields = {
  footer: {
    text: 'StepMania Conversions by MrThatKid4',
    icon_url: 'https://media.discordapp.net/attachments/953800884549189662/960303427710230670/unknown.png'
  }
}

exports.conversionsVersionToEngineID = {
  '5.0+': 'StepMania 5',
  '5.1+': 'StepMania 5',
  '5.3': 'OutFox',
  'OutFox': 'OutFox'
}

exports.range = (size, startAt = 0) => { // https://stackoverflow.com/a/10050831
  return [...Array(size).keys()].map(i => i + startAt);
}

/*
exports.volumesAdditionalFields = {
  chartInfo: {
    'volume 1': {
      name: 'Volume 1 Winter Update Chart Count',
      value: `
      | Mode   | Charts |
      |--------|--------|
      | dance  | 112    |
      | pump   | 63     |
      | be-mu  | 37     |
      | gh     | 31     |
      | po-mu  | 28     |
      | gddm   | 18     |
      | smx    | 16     |
      | techno | 10     |
      | gdgf   | 8      |
      | maniax | 2      |
      | ez2    | 1      |
      `
    }
  }
}
*/
