exports.main = (TextSelectMenuBuilderClass = { pageComponents: [] }) => {
  const button = require('./button-another-engine.js').main()
  const components = TextSelectMenuBuilderClass.pageComponents

  components.push(button)
  return components
}
