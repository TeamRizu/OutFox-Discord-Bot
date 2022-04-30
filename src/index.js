require('dotenv').config();
const { SlashCreator, FastifyServer } = require('slash-create');
const path = require('path');
const CatLoggr = require('cat-loggr');
const NodeCache = require('node-cache');
const { DatabaseFile } = require('./utils/databaseSpreadsheet.js');

const start = async () => {
  const logger = new CatLoggr().setLevel(process.env.COMMANDS_DEBUG === 'true' ? 'debug' : 'info');
  const interactionCache = new NodeCache({ stdTTL: 100, checkperiod: 120 });
  const DatabaseSpreadsheetInstance = new DatabaseFile(process.env.SHEET_ID);
  const ModsSpreadsheetInstance = new DatabaseFile(process.env.MODS_ID);

  await DatabaseSpreadsheetInstance.initDocument();
  await ModsSpreadsheetInstance.initDocument();

  const databaseDoc = DatabaseSpreadsheetInstance.doc;
  const modsDoc = ModsSpreadsheetInstance.doc;
  global.OutFoxGlobal = {};
  OutFoxGlobal.databaseDoc = databaseDoc;
  OutFoxGlobal.modsDoc = modsDoc;

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
    'languagestatus',
    'themes',
    'announcers',
    'credits',
    'preference',
    'builds',
    'mybuild'
  ];

  creator.on('debug', (message) => logger.log(message));
  creator.on('warn', (message) => logger.warn(message));
  creator.on('error', (error) => logger.error(error));
  creator.on('synced', () => logger.info('Commands synced!'));
  creator.on('commandRun', (command, _, ctx) =>
    logger.info(`${ctx.user.username}#${ctx.user.discriminator} (${ctx.user.id}) ran command ${command.commandName}`)
  );
  creator.on('commandRegister', (command) => logger.info(`Registered command ${command.commandName}`));
  creator.on('commandError', (command, error) => logger.error(`Command ${command.commandName}:`, error));

  creator.withServer(new FastifyServer()).registerCommandsIn(path.join(__dirname, 'commands')).startServer();

  creator.on('componentInteraction', async (ctx) => {

    const IDSplit = ctx.customID.split('-');
    const commandID = IDSplit[0];
    const version = IDSplit[1];
    const action = IDSplit[2];
    const arguments = IDSplit.slice(3);

    // CommandID verification
    if (IDSplit.length <= 1 || isNaN(commandID) || !commands[Number(commandID)]) return;

    // TODO: version verification TBC

    // Action verification
    if (!['lookUp', 'update', 'leaderboard', 'run'].includes(action)) return;

    // Argument verification
    if (arguments.length < 1) return;

    const primalArgument = arguments[0];
    switch (action) {
      case 'leaderboard':
        if (typeof primalArgument !== 'string' || arguments.length < 2 || isNaN(arguments[1] )) return;
      break
      case 'lookUp':
        if (isNaN(primalArgument)) return;
      break;
      case 'update':
        if (typeof primalArgument !== 'string') return;
      break;
      default:
      break;
    }

    const CommandFile = require(`./commands/${commands[commandID]}.js`);
    const CommandInstance = new CommandFile(creator);
    const commandArguments = {
      primalArgument,
      arguments,
      version,
      firstSend: false,
      commandID
    };
    const interaction = {
      ctx,
      values: ctx.values
    };

    switch (action) {
      case 'lookUp':
        await CommandInstance.lookUp({ interaction, commandArguments, interactionCache });
      break
      case 'update':
        await CommandInstance.update({ interaction, commandArguments, interactionCache });
      break
      case 'leaderboard':
        await CommandInstance.leaderboard({ interaction, commandArguments, interactionCache });
      break
      default:
        await CommandInstance.run(ctx, { interaction, commandArguments, interactionCache });
      break
    }
  });

  console.log(`Starting server at "localhost:${creator.options.serverPort}/interactions"`);
}

start()
