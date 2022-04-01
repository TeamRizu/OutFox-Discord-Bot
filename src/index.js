require('dotenv').config();
const { SlashCreator, FastifyServer } = require('slash-create');
const { DatabaseFile } = require('./utils/databaseSpreadsheet.js');
const path = require('path');
const CatLoggr = require('cat-loggr');
const NodeCache = require( "node-cache" );
(async () => {
  const logger = new CatLoggr().setLevel(process.env.COMMANDS_DEBUG === 'true' ? 'debug' : 'info');
  const interactionCache = new NodeCache({ stdTTL: 100, checkperiod: 120 });
  const DatabaseSpreadsheetInstance = new DatabaseFile(process.env.SHEET_ID)
  
  await DatabaseSpreadsheetInstance.initDocument()
  
  const databaseDoc = DatabaseSpreadsheetInstance.doc
  global.OutFoxGlobal = {}
  OutFoxGlobal.databaseDoc = databaseDoc

  const creator = new SlashCreator({
    applicationID: process.env.DISCORD_APP_ID,
    publicKey: process.env.DISCORD_PUBLIC_KEY,
    token: process.env.DISCORD_BOT_TOKEN,
    serverPort: parseInt(process.env.PORT, 10) || 8020,
    serverHost: '0.0.0.0'
  });
  
  const commands = [
    'volumes',
    'leaderboard',
    'mods',
    'ping',
    'languagestatus' // TBD
  ]
  
  creator.on('debug', (message) => logger.log(message));
  creator.on('warn', (message) => logger.warn(message));
  creator.on('error', (error) => logger.error(error));
  creator.on('synced', () => logger.info('Commands synced!'));
  creator.on('commandRun', (command, _, ctx) =>
    logger.info(`${ctx.user.username}#${ctx.user.discriminator} (${ctx.user.id}) ran command ${command.commandName}`));
  creator.on('commandRegister', (command) =>
    logger.info(`Registered command ${command.commandName}`));
  creator.on('commandError', (command, error) => logger.error(`Command ${command.commandName}:`, error));
  
  creator
    .withServer(new FastifyServer())
    .registerCommandsIn(path.join(__dirname, 'commands'))
    .startServer()
  
  creator.on('componentInteraction', async ctx => {
    /**
     * This context object is similar to command context as it will
     * still automatically acknowledge the interaction.
     *
     * You can still use `ctx.send` and `ctx.defer` however, there are
     * new functions like `ctx.acknowledge` and `ctx.editParent`.
     */
  
    const IDSplit = ctx.customID.split('-')
    const commandID = IDSplit[0]
    const argument = IDSplit[2]
    const selectInteraction = IDSplit[3] || undefined
  
    if (IDSplit.length <= 1 || isNaN(commandID) || !commands[Number(commandID)]) return;
  
    const CommandFile = require(`./commands/${commands[commandID]}.js`)
    const CommandInstance = new CommandFile(creator)
  
    if (selectInteraction) {
      await CommandInstance.lookUp(ctx, argument, false, ctx.values, interactionCache)
    } else {
      await CommandInstance.update(ctx, argument, false, interactionCache)
    }
    /*
    if (ctx.customID.startsWith('1')) {
      const LeaderboardFile = require('./commands/leaderboard.js')
      const LeaderboardCommand = new LeaderboardFile(creator)
  
      LeaderboardCommand.update(ctx, ctx.customID.split('-')[2], false)
    }
    */
  
    // Note: You MUST use `ctx.send` and must not return regular send options.
  })
  
  console.log(`Starting server at "localhost:${creator.options.serverPort}/interactions"`);
})();