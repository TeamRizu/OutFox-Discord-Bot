require('dotenv').config();
const { SlashCreator, FastifyServer } = require('slash-create');
const path = require('path');
const CatLoggr = require('cat-loggr');
//const NodeCache = require('node-cache');
const { DatabaseFile } = require('./utils/databaseSpreadsheet.js');

const start = async () => {
  const logger = new CatLoggr().setLevel(process.env.COMMANDS_DEBUG === 'true' ? 'debug' : 'info');
  // const interactionCache = new NodeCache({ stdTTL: 100, checkperiod: 120 });
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

  /*
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
    'mybuild',
    'term'
  ];*/

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

  console.log(`Starting server at "localhost:${creator.options.serverPort}/interactions"`);
};

start();
