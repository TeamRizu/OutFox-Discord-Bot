/**
 * Returns the given string but capitalized.
 * @param {string} str 
 * @returns {string}
 */
const capitalize = (str) => {
  if (!str) return ''

  return str[0].toUpperCase() + str.substring(1, str.length)
}

/**
 * Checks if a array of a string, or a string, includes a string.
 * @param {string | Array<string>} comparingValues 
 * @param {string} toCompare 
 * @param {boolean} strictCompare 
 * @returns {boolean}
 */
const stringIncluded = (comparingValues, toCompare, strictCompare = true) => {
  if (Array.isArray(comparingValues)) {
    return comparingValues.includes(toCompare)
  }

  return strictCompare ? comparingValues === toCompare : comparingValues?.toLowerCase() === toCompare?.toLowerCase()
}

const discordMessageLink = (guildID, channelID, messageID) => {
  // https://canary.discord.com/channels/490329576300609536/953800884549189662/1160982851752300574
  return `https://discord.com/channels/${guildID}/${channelID}/${messageID}`
}

exports.capitalize = capitalize
exports.stringIncluded = stringIncluded
exports.discordMessageLink = discordMessageLink