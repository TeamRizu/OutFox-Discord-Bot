const { SlashCommand, ComponentContext } = require('slash-create');

module.exports = class PingCommand extends SlashCommand {
  constructor(creator) {
    super(creator, {
      name: 'ping',
      description: 'Test the reponse time.'
    });
  }

  /**
   *
   * @param {ComponentContext} ctx
   */
  async run(ctx) {
    const before = Date.now()
    await ctx.defer()
    const now = Date.now()
    const difference = now - before
    await ctx.send(`${difference}ms`)
  }
}
