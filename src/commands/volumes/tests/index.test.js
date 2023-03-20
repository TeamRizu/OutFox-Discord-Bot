const { main } = require('../main.js')
const commandContextMock = {
  deffered: false,
  defer: async () => {
    this.deffered = true
    return new Promise((resolve) => { resolve('Done') })
  },
  send: async () => {
    return this.deffered ? { id: 1234567890123456, author: 'Mock Author', guild: 'Mock Guild' } : true
  },
  // eslint-disable-next-line no-unused-vars
  registerWildcardComponent: (id, cb) => {

  }
}

describe('Volumes Command Tests', () => {
  test('Should register WildCardComponent with messageID', async () => {
    const wildcardSpy = jest.spyOn(commandContextMock, 'registerWildcardComponent')
    await main(commandContextMock)

    commandContextMock.deffered = true
    const mockMessage = await commandContextMock.send()

    expect(wildcardSpy).toHaveBeenCalledWith(mockMessage.id, expect.anything())
  })
})
