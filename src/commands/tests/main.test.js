/* eslint-disable no-unused-vars */
/* eslint indent: ["error", 2, { "SwitchCase": 1 }] */
const commandContextMock = {
  deffered: false,
  options: {
    name: 'hold' // For term command.
  },
  defer: async () => {
    this.deffered = true
    return new Promise((resolve) => {
      resolve('Done')
    })
  },
  send: async () => {
    return this.deffered
      ? {
        id: 1234567890123456,
        author: 'Mock Author',
        guild: 'Mock Guild',
        edit: () => {
          return true
        }
      }
      : true
  },
  registerWildcardComponent: (id, cb) => {},
  registerComponent: (id, cb) => {}
}

const {
  ActionRowBuilder,
  ButtonStyle,
  ButtonBuilder,
  StringSelectMenuBuilder,
  SelectMenuOptionBuilder,
  TextInputBuilder,
  TextInputStyle,
  EmbedBuilder
} = require('discord.js')
const fs = require('fs')
const path = require('path')
const commandsFolderPath = path.join(__dirname, '../')
const commands = fs.readdirSync(commandsFolderPath).filter((e) => e !== 'tests' && !e.includes('README'))
const componentFilesStart = ['button-', 'select-menu']

/**
 * @param {string} commandName
 */
const requiredParams = (commandName) => {
  switch (commandName) {
    case 'term': {
      return {
        name: 'noAAA',
        properName: 'NotITG',
        properAlias: {
          'not in the groove': 'Not In The Groove'
        },
        aliases: ['not in the groove'],
        explanation:
          'NotITG is a rhythm game with wacky visuals, designed to make it easier for **modfile** creators to implement their ideas. It aims to preserve compatibility with all existing **StepMania** 3.95 and **In The Groove** mod files, and be the definitive environment for creating and enjoying that content.',
        references: [
          {
            type: 'url',
            url: 'https://www.noti.tg/',
            label: 'NotITG Website'
          },
          {
            type: 'url',
            url: 'https://twitter.com/NotITG',
            label: 'NotITG Twitter'
          },
          {
            type: 'term',
            term: 'openitg'
          },
          {
            type: 'term',
            term: 'effect simfiles'
          },
          {
            type: 'term',
            term: 'stepmania'
          }
        ],
        decorations: {
          thumbnail:
            'https://cdn.discordapp.com/attachments/953800884549189662/971813056382402590/b1G2Hl2H_400x400.jpg',
          image:
            'https://pbs.twimg.com/profile_banners/1024444861934497793/1642216076/1500x500',
          color: '#395b84'
        }
      }
    }
    case 'buildinf': {
      return {
        build: {
          name: 'Unknown',
          buildtype: 'private',
          notes: null,
          exclusive: null,
          date: '20030924'
        },
        hash: '7d4c1691d5',
        options: {
          hash: '7d4c1691d5'
        }
      }
    }
  }
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

describe('General Test of Command Main function', () => {
  afterEach(async () => {
    await sleep(4500)
    /*
      Without this code, jest will throw a ReferenceError saying
      that we are trying to import a file after the jest
      environment has been torn down, I've tried many solutions
      to fix this already, but as I'm a novice with both tests
      and jest, I coudn't.
    */
  })

  test('All commands should have a main file.', () => {
    commands.forEach((command) => {
      const commandFolder = fs.readdirSync(
        path.join(commandsFolderPath, '/' + command + '/')
      )

      expect(commandFolder.includes('main.js')).toBe(true)
    })
  })

  test('All commands should defer the context', async () => {
    // NOTE: This test can also fail because of bad code, pay attention to the error message.
    commands.forEach(async (command) => {
      const commandMain = await require(path.join(
        commandsFolderPath,
        '/' + command + '/main.js'
      )).main
      const deferSpy = jest.spyOn(commandContextMock, 'defer')

      await commandMain(commandContextMock)

      expect(deferSpy).toHaveBeenCalled()
    })
  })

  test('All command folders with component files must return an ActionRow or a component itself and its components must have valid data.', async () => {
    commands.forEach((command) => {
      const commandFolder = fs.readdirSync(
        path.join(commandsFolderPath, '/' + command + '/')
      )
      const commandFolderComponentFiles = commandFolder.filter((file) =>
        componentFilesStart.some((elem) => file.startsWith(elem))
      )

      if (commandFolderComponentFiles.length > 0) {
        commandFolderComponentFiles.forEach(async (componentFileName) => {
          /**
           * @type {ActionRowBuilder | Array<ActionRowBuilder, boolean>}
           */
          const fileRequired = require(path.join(
            commandsFolderPath,
            '/' + command + '/' + componentFileName
          ))
          let componentFile = await fileRequired.main(requiredParams(command))

          if (Array.isArray(componentFile)) {
            expect(componentFile[0]).toBeInstanceOf(ActionRowBuilder)
            expect(typeof componentFile[1]).toBe('boolean')

            componentFile = componentFile[0]
          } else {
            expect(componentFile).toBeInstanceOf(ActionRowBuilder)
          }

          if (componentFile.components.length < 1) return

          const customIDFound = []
          componentFile.components.forEach((component) => {
            switch (component.data.type) {
              case 2:
                {
                  // Button
                  /**
                   * @type {ButtonBuilder}
                   */
                  const buttonComponent = component
                  const buttonStyles = [
                    ButtonStyle.Danger,
                    ButtonStyle.Link,
                    ButtonStyle.Primary,
                    ButtonStyle.Secondary,
                    ButtonStyle.Success
                  ]

                  expect(
                    buttonStyles.includes(buttonComponent.data.style)
                  ).toBe(true)

                  expect(buttonComponent.data.label).toBeTruthy() // All Buttons must have label.
                  expect(buttonComponent.data.label.length).toBeLessThanOrEqual(
                    80
                  ) // Label can't be longer than 80.

                  if (buttonComponent.data.emoji) {
                    expect(buttonComponent.data.emoji.name).toBeTruthy()
                    expect(buttonComponent.data.emoji.id).toBeTruthy()
                    expect(buttonComponent.data.emoji.animated).toEqual(
                      expect.anything()
                    )
                  }

                  if (buttonComponent.data.style === ButtonStyle.Link) {
                    expect(buttonComponent.data.url).toBeTruthy() // Link Buttons Must have URL.
                  } else {
                    expect(buttonComponent.data.url).toBeUndefined() // Only Link Buttons can have Custom ID
                    expect(buttonComponent.data.custom_id).toBeTruthy() // Custom ID must be defined.
                    expect(
                      buttonComponent.data.custom_id.length
                    ).toBeLessThanOrEqual(100) // Custom ID can't be longer than 100
                    expect(
                      buttonComponent.data.custom_id ===
                        buttonComponent.data.custom_id.toLowerCase()
                    ).toBe(true) // Custom ID must be lowercase.

                    customIDFound.push(buttonComponent.data.custom_id)
                  }
                }
                break
              case 3:
                {
                  // Select Menu Text
                  /**
                   * @type {StringSelectMenuBuilder}
                   */
                  const selectMenuComponent = component

                  expect(selectMenuComponent.data.custom_id).toBeTruthy() // Custom ID must be defined.
                  expect(
                    selectMenuComponent.data.custom_id.length
                  ).toBeLessThanOrEqual(100) // Custom ID can't be longer than 100
                  expect(
                    selectMenuComponent.data.custom_id ===
                      selectMenuComponent.data.custom_id.toLowerCase()
                  ).toBe(true) // Custom ID must be lowercase.
                  customIDFound.push(selectMenuComponent.data.custom_id)

                  if (selectMenuComponent.data.placeholder) {
                    expect(
                      selectMenuComponent.data.placeholder.length
                    ).toBeLessThanOrEqual(150)
                  }

                  if (selectMenuComponent.data.max_values) {
                    expect(
                      selectMenuComponent.data.max_values
                    ).toBeLessThanOrEqual(25)
                  }

                  if (selectMenuComponent.data.min_values) {
                    expect(
                      selectMenuComponent.data.min_values
                    ).toBeLessThanOrEqual(25)
                  }

                  expect(selectMenuComponent.data.channel_types).toBeFalsy() // Text Select Menus canno have channel types.
                  expect(selectMenuComponent.options).toBeTruthy() // Options field is required for text select menus.

                  selectMenuComponent.options.forEach((option) => {
                    /**
                     * @type {SelectMenuOptionBuilder}
                     */
                    const selectOption = option

                    expect(selectOption.data.label).toBeTruthy()
                    expect(selectOption.data.label.length).toBeLessThanOrEqual(
                      100
                    )

                    expect(selectOption.data.value).toBeTruthy()
                    expect(selectOption.data.value.length).toBeLessThanOrEqual(
                      100
                    )

                    if (selectOption.data.description) {
                      expect(
                        selectOption.data.description.length
                      ).toBeLessThanOrEqual(100)
                    }

                    if (selectOption.data.emoji) {
                      expect(selectOption.data.emoji.name).toBeTruthy()
                      expect(selectOption.data.emoji.id).toBeTruthy()

                      if (selectOption.data.emoji.animated) {
                        expect(typeof selectOption.data.emoji.animated).toBe(
                          'boolean'
                        )
                      }
                    }
                  })
                }
                break
              case 4: {
                // Text Input
                /**
                 * @type {TextInputBuilder}
                 */
                const textInput = component

                expect(textInput.data.custom_id).toBeTruthy() // Custom ID must be defined.
                expect(textInput.data.custom_id.length).toBeLessThanOrEqual(100) // Custom ID can't be longer than 100
                expect(
                  textInput.data.custom_id ===
                    textInput.data.custom_id.toLowerCase()
                ).toBe(true) // Custom ID must be lowercase.
                customIDFound.push(textInput.data.custom_id)

                const textStyles = [
                  TextInputStyle.Paragraph,
                  TextInputStyle.Short
                ]

                expect(textInput.data.style).toBeTruthy()
                expect(textStyles.includes(textInput.data.style)).toBe(true)

                expect(textInput.data.label).toBeTruthy()
                expect(textInput.data.label.length).toBeLessThanOrEqual(45)

                if (textInput.data.max_values) {
                  expect(textInput.data.max_values).toBeLessThanOrEqual(4000)
                }

                if (textInput.data.min_values) {
                  expect(textInput.data.min_values).toBeLessThanOrEqual(4000)
                }

                if (textInput.data.value) {
                  expect(textInput.data.value.length).toBeLessThanOrEqual(4000)
                }

                if (textInput.data.placeholder) {
                  expect(textInput.data.placeholder).toBeLessThanOrEqual(100)
                }
              }
            }
          })

          const hasDuplicateIDs = customIDFound.some(
            (e, i, arr) => arr.indexOf(e) !== i
          )

          expect(hasDuplicateIDs).toBe(false) // Components can't have the same ID.
        })
      }
    })
  })

  test('All command folders with embed file must return an embed and it should have valid properties.', async () => {
    commands.forEach((command) => {
      const commandFolder = fs.readdirSync(
        path.join(commandsFolderPath, '/' + command + '/')
      )
      const commandFolderEmbedFiles = commandFolder.filter((file) =>
        file.startsWith('embed-')
      )

      commandFolderEmbedFiles.forEach(async (embedFileName) => {
        /**
         * @type {Promise<EmbedBuilder>}
         */
        const requiredFile = require(path.join(
          commandsFolderPath,
          '/' + command + '/' + embedFileName
        ))
        /**
         * @type {EmbedBuilder}
         */
        try {
          const embed = await requiredFile.main(requiredParams(command))

          let characters = 0

          if (embed.data.title) {
            characters += embed.data.title.length
            expect(embed.data.title.length).toBeLessThanOrEqual(256)
          }

          if (embed.data.description) {
            characters += embed.data.description.length
            expect(embed.data.description.length).toBeLessThanOrEqual(4096)
          }

          if (embed.data.footer?.text) {
            characters += embed.data.footer.text.length
            expect(embed.data.footer.text.length).toBeLessThanOrEqual(2048)
          }

          if (embed.data.author?.name) {
            characters += embed.data.author.name.length
            expect(embed.data.author.name.length).toBeLessThanOrEqual(256)
          }

          if (embed.data.fields) {
            expect(embed.data.fields.length).toBeLessThanOrEqual(24) // Embeds cannot have more than 25 fields.
            embed.data.fields.forEach((field) => {
              expect(field.name).toBeTruthy() // Fields must have name.
              expect(field.name.length).toBeLessThanOrEqual(256)

              expect(field.value).toBeTruthy() // Fields must have value.
              expect(field.value.length).toBeLessThanOrEqual(1024)

              characters += field.name.length
              characters += field.value.length
            })
          }

          expect(characters).toBeLessThanOrEqual(6000) // Embed max character limit.
        } catch (e) {
          if (e) {
            console.debug(e)
            expect(e).toBe('test') // TODO: This whole test is larger than it should be, and this is terrible.
          }
        }
      })
    })
  })
})
