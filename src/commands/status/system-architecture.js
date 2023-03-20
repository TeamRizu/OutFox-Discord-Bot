const os = require('os')

exports.main = () => {
  return os.arch() || 'Unknown'
}
