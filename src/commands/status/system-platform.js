const os = require('os')

exports.main = () => {
  return os.platform() || 'Unknown'
}
