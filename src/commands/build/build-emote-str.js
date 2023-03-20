exports.main = (listID) => {
  const archiveBuildEngineIconData = require('./build-engine-icon.js').main()
  const { name, id } = archiveBuildEngineIconData[listID]

  return `<:${name}:${id}>`
}
