const os = require('os')

exports.main = () => {
  return os.cpus()[0]?.model || 'Unknown'
}
