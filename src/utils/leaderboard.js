const cheerio = require('cheerio')
const request = require('request-promise')

exports.leaderboard = async () => {
  const finalArr = new Map()
  let done = false
  const body = await request(
    'https://github.com/TeamRizu/OutFox/blob/master/leaderboard.md'
  )

  const $ = cheerio.load(body)
      const tableChilds = $('article').children()
      const leaderboard = tableChilds['1']
      const thread = leaderboard.children[1]
      const tr = thread.children[1]
      const ld = [
        []
      ]

      for (let i = 0; i < tr.children.length; i++) {
        const current = tr.children[i]

        if (current.name !== 'th') continue

        ld[0].push(current.children[0].data)
      }

      const tbody = leaderboard.children[3]

      for (let i = 0; i < tbody.children.length; i++) {
        const current = tbody.children[i]

        if (current.name !== 'tr') continue

        const oldLength = ld.length
        ld.push([])

        for (let c = 0; c < current.children.length; c++) {
          const td = current.children[c]

          if (td.name !== 'td') continue

          if (td.children[0].name === 'a') {
            ld[oldLength].push(td.children[0].children[0].data)
          } else {
            ld[oldLength].push(td.children[0].data)
          }
        }
      }

      finalArr.set('obj', ld)
      done = true

  if (done) {
    return finalArr.get('obj')
  }
}
