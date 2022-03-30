const { GoogleSpreadsheet } = require('google-spreadsheet');

exports.ModsSheetFile = class {
  constructor() {
    this.doc = new GoogleSpreadsheet(process.env.MODS_ID);
    this.convertedMods = null;
    this.requestsMods = null;
    this.impossibleMods = null;
    this.packMods = null;
    this.forbiddenMods = null;
    this.elementsPerPage = 25
  }

  async init() {
    await this.doc.useServiceAccountAuth({
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_APP_KEY
    });
    await this.doc.loadInfo();
    this.convertedMods = this.doc.sheetsByTitle['Converted to SM5'];
    this.requestsMods = this.doc.sheetsByTitle['Requests'];
    this.impossibleMods = this.doc.sheetsByTitle['Impossible Requests'];
    this.packMods = this.doc.sheetsByTitle['Whole Pack Requests :('];
    this.forbiddenMods = this.doc.sheetsByTitle['Forbidden'];

    return this.doc
  }

  /**
   *
   * @param {string} name
   * @returns
   */
  async chartInfo(name) {
    if (!this.convertedMods) {
      console.warn('Class has not been initialized, please run init() first.');
      return null;
    }

    const askForRows = [this.convertedMods, this.requestsMods, this.impossibleMods, this.forbiddenMods];
    const tableName = ['converted', 'requested', 'impossible', 'forbidden'];
    const askForProperties = {
      converted: {
        placeAs: ['name', 'pack', 'author', 'version', 'video'],
        getAs: ['File Name', 'Pack', 'Author', 'SM Version', 'YT-Link']
      },
      requested: {
        placeAs: ['name', 'pack', 'author', 'video', 'requestedBy', 'status'],
        getAs: ['File Name', 'Pack', 'Author', 'URL of original video/pack release', 'Requested by', 'Status']
      },
      impossible: {
        placeAs: ['name', 'author', 'video', 'pack', 'requestedBy', 'status'],
        getAs: [
          'File Name',
          'Author',
          'URL of original video/pack release',
          'Pack',
          'Requested by',
          'Status / Things Needed'
        ]
      },
      forbidden: {
        placeAs: ['name', 'author', 'video', 'pack', 'type', 'reason'],
        getAs: ['File Name', 'Author', 'URL of original video/pack release', 'Pack', 'Type', 'Reason']
      }
    };

    let fileFound;
    let foundIn;
    let tableFound;
    for (let i = 0; i < askForRows.length; i++) {
      const row = await askForRows[i].getRows();
      row.find((file) => {
        if (file['File Name']?.toLowerCase() === name.toLowerCase()) {
          foundIn = 'exact';
          tableFound = i;
          fileFound = file;
        }

        if (file['File Name']?.toLowerCase().includes(name.toLowerCase())) {
          foundIn = 'include';
          tableFound = i;
          fileFound = file;
        }
      });

      if (foundIn === 'exact') i = askForRows.length;
    }

    if (!fileFound) return null;

    const objToReturn = {};
    for (let j = 0; j < askForProperties[tableName[tableFound]].placeAs.length; j++) {
      objToReturn[askForProperties[tableName[tableFound]].placeAs[j]] =
        fileFound[askForProperties[tableName[tableFound]].getAs[j]];
    }
    objToReturn.foundIn = tableName[tableFound];
    console.table(objToReturn);
    return objToReturn;
  }

  /**
   *
   * @param {any} rows
   * @param {number} pageIndex
   * @returns {string}
   */
  chartsFromPage(rows, pageIndex) {
    const maxIndex = (this.elementsPerPage * (pageIndex + 1)) // 200
    const minIndex = (this.elementsPerPage * (pageIndex + 1)) - this.elementsPerPage // 175
    const range = (size, startAt = 0) => { // https://stackoverflow.com/a/10050831
      return [...Array(size).keys()].map(i => i + startAt);
    }
    let finalString = ''

    for (let i = 0; i < this.elementsPerPage; i++) {
      const currentIndex = range(maxIndex, minIndex)[i]
      const file = rows[currentIndex]

      if (!file) { // This page might not have 25 elements
        i = this.elementsPerPage
        continue
      }

      finalString = finalString + `**${currentIndex + 1}°** - [${file.name}](${file.youtube}) (${file.author || 'Unknown Author'})\n`
    }

    return finalString
  }

  chartsSelectMenuFromPage(rows, pageIndex, ctx) {
    const maxIndex = (this.elementsPerPage * (pageIndex + 1)) // 200
    const minIndex = (this.elementsPerPage * (pageIndex + 1)) - this.elementsPerPage // 175
    const range = (size, startAt = 0) => { // https://stackoverflow.com/a/10050831
      return [...Array(size).keys()].map(i => i + startAt);
    }
    const formatAuthorPack = (author, pack) => {
      /*
      Thanks "We are the Loss" for having a 66 char long author field
      if (author && pack) {
        return `By ${author}, released under ${pack} pack`
      }
      */

      if (author) {
        return `By ${author}`
      }

      return `Released under ${pack} pack`
    }
    let finalArray = []

    for (let i = 0; i < this.elementsPerPage; i++) {
      const currentIndex = range(maxIndex, minIndex)[i]
      const file = rows[currentIndex]

      if (!file) { // This page might not have 25 elements
        i = this.elementsPerPage
        continue
      }

      finalArray.push({
        label: `${currentIndex + 1}° - ${file.name}`,
        description: `${!file.author && !file.pack ? 'Unknown Author & Pack' : formatAuthorPack(file.author, file.pack)}`,
        value: `2-${ctx.interactionID}-${file.portID}-select`
      })
    }

    return finalArray
  }

  async chartsToArrayObjectRows() {
    const convertedRows = await this.convertedMods.getRows();
    const rows = [];

    for (let i = 0; i < convertedRows.length; i++) {
      const row = convertedRows[i];

      if (!row['File Name']) continue;

      rows.push({
        portID: row['#'],
        name: row['File Name'],
        author: row.Author || undefined,
        pack: row.Pack || undefined,
        youtube: row['YT-Link'],
        status: row['Fix-up Status']
      });
    }
    console.log(rows.length)
    return rows
  }
};
