const os = require('os')

exports.main = () => {
  const totalMem = os.totalmem()
  const used = totalMem - os.freemem()

  return String(used).substring(0, 4) + '/' + String(totalMem).substring(0, 4) + ' (MB)'
}
