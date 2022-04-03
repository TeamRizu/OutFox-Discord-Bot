# Interaction-OutFox

"Interaction-OutFox" is the internal name for this project, taken from the major feature the whole structure is based upon, component interactions.

The goals of this project is to:

- Provide easy access to official OutFox Information.
	- OutFox Wiki
	- OutFox Serenity
	- OutFox Website
	- OutFox Discord
- Provide interaction with popular partner community projects
	- StepMania Archival
	- MrThatKid4 Conversions
	- Future Pads/Controllers SpreadSheet
	- Tiny-Foxes/OutFox-Translations
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



## TODO for Beta

### Commands

- [ ] getrole
- [ ] languagestatus
- [x] leaderboard
- [x] mods
- [x] ping
- [x] themes

### Classes

- [x] languageStatus
- [x] languageSheet
- [x] leaderboard
- [x] modsSheet
- [x] archival
- [x] leaderboardMessage

## Installation

```sh
npx slash-up init js slash-commands
cd slash-commands
# this edit variables in the ".env" file!
# Create and edit commands in the `commands` folder
npx slash-up sync
yarn start
```
