const { version } = require('process')

exports.main = () => {
  const node = version

  return node || 'Unknown'
}
