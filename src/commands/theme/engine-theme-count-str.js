exports.main = (ArchiveThemesClass, engine) => {
  const archiveEngineName = require('./engine-name.js').main()
  const themeCount = ArchiveThemesClass.themesForVersion(engine).length

  return `${archiveEngineName[engine]}: **${themeCount} ${themeCount <= 1 ? 'Theme' : 'Themes'}**`
}
