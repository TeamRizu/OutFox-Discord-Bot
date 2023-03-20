exports.main = (themeData = { Name: 'Superuser', HasImages: true }, engine = 'OutFox', themeID = 'Superuser') => {
  const { EmbedBuilder } = require('discord.js')
  const archiveThemeDescription = {
    'StepMania 5': {
      UPSRT: 'This theme is a "Story" theme, you need the UPSRT pack to experience the whole story.',
      starlight: 'Do not confuse this version with the latest Starlight 2.0 version.'
    }
  }
  const archiveEngineName = {
    OutFox: 'Project OutFox',
    'StepMania 5': 'StepMania 5',
    'SM-SSC': 'SM-SSC',
    SM4: 'StepMania 4',
    NITG: 'NotITG',
    OITG: 'OpenITG',
    'SM3.95': 'StepMania 3.95',
    'SM3.9_Plus': 'StepMania 3.9+',
    'SM3.9': 'StepMania 3.9'
  }
  const archiveThemesMusicWheelImage = {
    OITG: {
      DECO: 'https://objects-us-east-1.dream.io/smthemes/OITG/Screenshots/Deco/screen3.png',
      Empress: 'https://objects-us-east-1.dream.io/smthemes/OITG/Screenshots/Empress/screen4.png',
      Retro: 'https://objects-us-east-1.dream.io/smthemes/OITG/Screenshots/Retro/screen3.png',
      Meat: 'https://objects-us-east-1.dream.io/smthemes/OITG/Screenshots/Meat/screen3.png',
      Mlp: 'https://objects-us-east-1.dream.io/smthemes/OITG/Screenshots/Mlp/screen4.png',
      Obscurity: 'https://objects-us-east-1.dream.io/smthemes/OITG/Screenshots/Obscurity/screen3.png',
      SLGJUVM: 'https://objects-us-east-1.dream.io/smthemes/OITG/Screenshots/SLGJUVM/screen3.png',
      Tactics: 'https://objects-us-east-1.dream.io/smthemes/OITG/Screenshots/Tactics/screen4.png'
    },
    NITG: {
      SLOat: 'https://objects-us-east-1.dream.io/smthemes/NITG/Screenshots/SLOat/screen2.png'
    },
    'StepMania 5': {
      Barebone: 'https://objects-us-east-1.dream.io/smthemes/StepMania%205/Screenshots/Barebone/screen3.png',
      CS8S: 'https://objects-us-east-1.dream.io/smthemes/StepMania%205/Screenshots/CS8S/screen2.png',
      CS8LA: 'https://objects-us-east-1.dream.io/smthemes/StepMania%205/Screenshots/CS8LA/screen2.png',
      DDR5th: 'https://objects-us-east-1.dream.io/smthemes/StepMania%205/Screenshots/DDR5th/screen3.png',
      Lazarus: 'https://objects-us-east-1.dream.io/smthemes/StepMania%205/Screenshots/Lazarus/screen2.png',
      StRev: 'https://objects-us-east-1.dream.io/smthemes/StepMania%205/Screenshots/StRev/screen2.png',
      starlight: 'https://objects-us-east-1.dream.io/smthemes/StepMania%205/Screenshots/starlight/screen3.png',
      ultralight: 'https://objects-us-east-1.dream.io/smthemes/StepMania%205/Screenshots/ultralight/screen2.png',
      UPSRT: 'https://objects-us-east-1.dream.io/smthemes/StepMania%205/Screenshots/UPSRT/screen4.png',
      'XIX.SUPER': 'https://objects-us-east-1.dream.io/smthemes/StepMania%205/Screenshots/XIX.SUPER/screen2.png',
      SIGMA: 'https://objects-us-east-1.dream.io/smthemes/StepMania%205/Screenshots/SIGMA/screen2.png'
    },
    OUTFOX: {
      Superuser: 'https://objects-us-east-1.dream.io/smthemes/OutFox/Screenshots/Superuser/screen1.png'
    }
  }
  const archiveEngineColors = require('./build-engine-color.js').main()
  const archiveEngineEmoteData = require('./build-name-emote-name-str.js').main()

  const embed = new EmbedBuilder()
    .setTitle(`Summary of ${themeData.Name}`)
    .setDescription(
      archiveThemeDescription[engine]
        ? archiveThemeDescription[engine][themeID]
        : themeData.Name
    )
    .addFields({
      name: 'Engine',
      value: archiveEngineName[engine],
      inline: true
    })
    .setURL(
      `https://josevarela.net/SMArchive/Themes/ThemePreview.php?Category=${engine.replace(
        ' ',
        '%20'
      )}&ID=${themeID}`
    )

  if (archiveEngineEmoteData[engine.toUpperCase()]) {
    embed.setThumbnail(
      `https://cdn.discordapp.com/emojis/${archiveEngineEmoteData[engine.toUpperCase()].id}.webp?quality=lossless`
    )
  }

  if (archiveEngineColors[engine.toUpperCase()]) {
    embed.setColor(archiveEngineColors[engine.toUpperCase()])
  }

  if (themeData.HasImages) {
    const engineThemesImg = archiveThemesMusicWheelImage[engine.toUpperCase()]

    if (engineThemesImg[themeID]) {
      embed.setImage(engineThemesImg[themeID])
    }
  }

  if (themeData.Date) embed.addFields({ name: 'Creation Date', value: themeData.Date, inline: true })
  if (themeData.Author) embed.addFields({ name: 'Theme Author', value: themeData.Author, inline: true })
  if (themeData.Version) embed.addFields({ name: 'Theme Version', value: themeData.Version, inline: true })

  return embed
}
