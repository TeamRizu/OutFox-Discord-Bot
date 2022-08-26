const fs = require('fs')
const path = require('path')

exports.NoteSkinClass = class NoteSkin {
  constructor(mode, style = 'single', reverse) {
    this.mode = mode
    this.style = style
    this.reverse = reverse
    this.styledata = JSON.parse( fs.readFileSync(path.join(__dirname, './styledata.json'), { encoding: 'utf-8' }) )
    this.styleconfig = this.styledata[this.mode][style]
    this.noteskin = this.styleconfig.defaultNoteskin || 'default'
    this.noteskinPath = 'noteskins' + '/' + this.mode + '/' + this.noteskin
    this.noteskinConfig = require(`./noteskins/${this.mode.includes('kb') ? 'kbx' : this.mode}/${this.noteskin}/config.js`).config
    // this.lanes = this.styleconfig.noteRotation?.length
  }

  async collectAsset(asset, timing, endChar, notetype, lane) {
    const assetJimp = await this.noteskinConfig.collectAsset(asset, timing, endChar, notetype, lane, this.styleconfig, this.style, this.mode, this)

    return assetJimp
  }

  async collectMeasure(asset, timing, endChar, notetype, lane) {
    return this.noteskinConfig.measurements(asset, timing, endChar, notetype, lane, this.styleconfig, this.style, this.mode)
  }
};
