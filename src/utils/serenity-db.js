const axios = require('axios')

class SerenityDB {
  constructor (options = {}) {
    this.serenityDBURL = options.forcedDBURL || process.env.SERENITY_DB_URL
    this.updated = options.considerUpdated || false
    /**
     * @type {import('./types').SerenityDB || null}
     */
    this.data = options.predata || null
  }

  async updateDB () {
    const serenityDBRequest = await axios.get(this.serenityDBURL).catch((e) => {
      console.error(`Failed to get Serenity DB.\n\n${e}`)
      return false
    })

    if (!serenityDBRequest || serenityDBRequest?.status !== 200) {
      return false
    }

    const serenityDB = serenityDBRequest.data

    if (!serenityDB) {
      console.error('Malformed response, missing data attribute.')
      return false
    }

    const expectedKeys = ['version', 'volumes', 'user_hall', 'honor_tags']

    if (!Object.keys(serenityDB).every((element) => expectedKeys.includes(element))) {
      console.error("Response doesn't include expected data structure.")
      return false
    }

    this.data = serenityDB
    this.updated = true

    return true
  }

  async updateIfRequired() {
    if (this.updated) return true

    const updateStatus = await this.updateDB()

    return updateStatus
  }

  async volumes() {
    if (!this.updateIfRequired()) return null

    return this.data.volumes
  }

  async getVolume(volumeAbrev) {
    if (!this.updateIfRequired) return null

    const knownVolumes = await this.volumes()
    const foundVolume = knownVolumes.find((volume) => volume.abrev === volumeAbrev)

    if (!foundVolume) return null

    return foundVolume
  }
}

exports.SerenityDB = SerenityDB