const pjson = require('../../../package.json')

exports.main = () => {
  const discordJSVersion = pjson?.dependencies['discord.js']

  return discordJSVersion || 'Unknown'
}
