exports.main = (listID) => {
  const archiveBuildEngineIconData = require('./build-engine-icon.js').main()
  const { name = 'shit', id = '564474372962779137' } = archiveBuildEngineIconData[listID]

  return `<:${name}:${id}>`
}
