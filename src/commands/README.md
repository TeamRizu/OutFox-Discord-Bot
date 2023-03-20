## Important

Commands have a structure to follow when creating embeds and/or any component.

### Command Main File

All commands need to have a `main.js` file inside of the command folder, it needs to export a `main` async function which accepts a Command Context argument, you are expected to defer that context with `await ctx.defer()`.

You also need to create a file at `src/registers` to register data of your command and sync later, you can create a copy of the other registers and change to fit your new command. (Don't forget to change the class name inside the register file!)

### Embeds

Do no create embeds in the main file or inside other files, create a new file inside the command folder that starts with `embed-`, the rest of the name can be anything you think fits.

That file should export a `main` function that returns a EmbedBuilder Class Instance, check the other commands for example.

The tests will check if the content inside the embed is correct, so if the `main` function requires any argument then give it a default value. (Example: `exports.main = (content = 'test') => {}`)

The test that should fail about embed can be found at `src/tests/main.test.js` and should be inside the `All command folders with embed file must return an embed and it should have valid properties.` test, check where it failed and see what you did wrong.

### Components

Only 2 components have support in the tests currently: button and select-menu.

- For button, create a new file that starts with `button-`.
- For Select Menu, create a new file that starts with `select-menu-`

The tests will look at your components just like it looks at embeds, those components files must either return an ActionRowBuilder or an array where the first element is an ActionRowBuilder and the second element is a boolean.

The tests currently do not cover if you give select menus a emoji value with incorrect data and also do no cover if a button has invalid link, you'll have to check those manually.