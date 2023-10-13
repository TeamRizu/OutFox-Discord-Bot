const Vibrant = require('node-vibrant')

const componentToHex = (c) => {
  // Credits: https://stackoverflow.com/a/5624139
  const hex = c.toString(16)
  return hex.length === 1 ? '0' + hex : hex
}

const rgbFromImgURL = async (imgURL) => {
  const vibrantColor = new Map()
  const result = await Vibrant.from(imgURL).getPalette((err, palette) => {
    if (err) {
      console.warn(err)
      return false
    }

    const rgb = palette.Vibrant._rgb
    vibrantColor.set(
      'value',
      `#${
        componentToHex(rgb[0]) +
        componentToHex(rgb[1]) +
        componentToHex(rgb[2])
      }`
    )
    return true
  })

  return result ? vibrantColor.get('value') : ''
}

exports.rgbFromImgURL = rgbFromImgURL
exports.componentToHex = componentToHex