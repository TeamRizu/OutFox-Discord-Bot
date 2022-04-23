# Interaction-OutFox

"Interaction-OutFox" is the internal name for this project, taken from the major feature the whole structure is based upon, component interactions.

The goals of this project is to:

- Provide easy access to official OutFox Information.
	- OutFox Wiki (preferences command)
	- OutFox Serenity (volumes command)
	- OutFox Website
	- OutFox Discord
- Provide interaction with popular partner community projects
	- StepMania Archival (builds, announcers, themes, credits commands)
	- MrThatKid4 Conversions (mods command)
	- Future Pads/Controllers SpreadSheet
	- Tiny-Foxes/OutFox-Translations (language status command)
- Ease OutFox Developers interaction with the Community
	- Github Issues
	- Ticket System (TBC)
- Create tools for OutFox Community Team moderation
	- Render Messages
	- Move Messages
	- Profile User (TBC)
- Better community experience
	- Introduction set-up roles
	- Role Cookies shared between OutFox Servers (TBC)

## Use Intent

Given the scope of the project, Interaction-OutFox official instance is not meant to be public for invitation, it will be design only for use on OutFox-Approved Servers (Official OutFox Server, OutFox Serenity Server)

## Self-Host

### Setup ENV

Create a .env on the root folder with the following content:

```.env
DISCORD_APP_ID=Application ID
DISCORD_PUBLIC_KEY=Application Public Key
DISCORD_BOT_TOKEN=Application Bot Token
COMMANDS_DEBUG=true
DEVELOPMENT_GUILD_ID=Discord Dev Guild ID
PORT=8020
GOOGLE_PRIVATE_KEY=Google API Service Account Private Key
SHEET_ID=Database Sheet ID
MODS_ID=1P892pQEcfzP59NeSm2aHIKNB1Rv4DqIXtELkcIvJNbM
GOOGLE_SERVICE_ACCOUNT_EMAIL=Google API Service Account EMAIL
```

You can find those on:

- [Discord Developer Portal](https://discord.com/developers/docs/intro)
- [Google Developer Console](https://console.developers.google.com/)

SHEET_ID gets data from a private sheet, if you're part of OutFox Team you'll need to contact Moru.

### Running

After clonning the repository and setting up the secrets, install all packages using `npm i` on the root folder.

Add your application to your dev server using [Discord Permissions Calculator](https://discordapi.com/permissions.html) **giving the `applications.command`** scope.

After that's done, run `node src/index.js`, the default port that it will listen to is **8020**, which can be changed using the `PORT` ENV, you should then make your app available via URL to the public using something like [ngrok](https://ngrok.com/) if you're not using a server provider, copy your app url and paste it into your application `interactions endpoint url` field, adding `/interactions` to the end of the URL, then click save changes. Discord will usually make 2 requests, they're meant to check if your app is correctly dealing with requests, the platform will tell if everything went right or not.

It is recommended to remove the URL you have given if you were using ngrok and is not testing your app anymore.

### Sync Commands

By default the app will sync commands to the global app commands, which takes 1 hour to update, to solve this, change `DEVELOPMENT_GUILD_ID` ENV to the guild which you want the commands to update instantly and then run `npm run sync:dev`, then run `node src/index.js` and check the slash commands for the server you have given.
