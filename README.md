# Project OutFox Discord Bot

Repository for Project OutFox Discord Bot.

Main Projects that are used for this bot:

- [Slash-Create](https://github.com/Snazzah/slash-create)
- [Discord.JS](https://discord.js.org/#/)
- [StepMania Archive](https://josevarela.net/SMArchive/)
- [MTK Mods Sheet](https://docs.google.com/spreadsheets/d/1P892pQEcfzP59NeSm2aHIKNB1Rv4DqIXtELkcIvJNbM/edit?usp=sharing)

## Installing and Running

### Setup Secrets

Create a `.env` file with the following keys:

```.env
DISCORD_APP_ID=The app id of your bot.
DISCORD_PUBLIC_KEY=The public key of your bot.
DISCORD_BOT_TOKEN=The token of your bot.
COMMANDS_DEBUG=true
DEVELOPMENT_GUILD_ID=The main development server of your bot.
PORT=8020
GOOGLE_PRIVATE_KEY=Private key of a google service account, used for the mods command.
MODS_ID=1P892pQEcfzP59NeSm2aHIKNB1Rv4DqIXtELkcIvJNbM
GOOGLE_SERVICE_ACCOUNT_EMAIL=The email of the google service account.
OUTFOX_SERVER_INTEGRATIONS=false
SERENITY_DB_URL=https://wiki.projectoutfox.com/en/user-guide/meta/serenity_db.json
DEV_DISCORD_ACCOUNT_ID=Your Discord Account ID
```

If you don't want to setup Google secrets then you'll need to remove the mods command and src/utils/mods-sheet.js

### Privileged Gateway Intents

The integration of Serenity Leaderboard, SM-SSC Parsing makes use of message content, this means you'll need to enable `MESSAGE CONTENT INTENT` and `SERVER MEMBERS INTENT` before trying to run the bot. If you don't want to do that, then remove those gateway requirements on `src/index` and any code which makes use of `message.content` and `guild.members`.

### Run App

- Install the packages with `npm i`.
- Invite the bot to your server and give the `applications.command` scope. (Use [Discord Permissions Calculator](https://discordapi.com/permissions.html) to generate invite.)
- You should now be able to execute `node src/index.js` which will start a server, you need to expose your app by using a hoster or something like ngrok if you want to test commands, go into the discord developer platform and enter your application, and add the exposed URL with the `/interactions` endpoint at the end. Discord will usually test the URL with 2 requests, one is usually meant to pass while the other is meant to be rejected.

### Sync Commands

If you're creating a new command you will need to sync its creation, at least with your development server, there's a script for that already which requires you only to execute `npm run sync:dev`. This will work as long as you have set up the DEVELOPMENT_GUILD_ID secret.

Have in mind that with this app structure, you need to create a register file at `src/registers`, and place the actual code at `src/commands` like the other commands do.

### Tests

Some tests are included which expect a specific struture of commands, embeds and components, if any of them fail then it's better to check things, if a embed/component file expects additional arguments then give a default value that won't make them crash.

## License

This repository is licensed under Apache License 2.0, for me information see the `package.json` file or `LICENSE`.