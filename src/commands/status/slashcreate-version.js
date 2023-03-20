const pjson = require('../../../package.json')

exports.main = () => {
  const slashcreateVersion = pjson?.dependencies['slash-create']

  return slashcreateVersion || 'Unknown'
}
