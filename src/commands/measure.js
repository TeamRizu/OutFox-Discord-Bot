const fs = require('fs');
const path = require('path');
const { ButtonBuilder, ButtonStyle, ActionRowBuilder, SelectMenuBuilder } = require('discord.js');
const stringSimilarity = require('string-similarity');
const {
  SlashCommand,
  ComponentContext,
  CommandOptionType,
  ComponentType,
  TextInputStyle
} = require('slash-create');
// const { ChartHeaderFile } = require('../utils/chartHeader.js')
const styledata = JSON.parse(fs.readFileSync(path.join(__dirname, '../measure/styledata.json')));
const modeskins = JSON.parse(fs.readFileSync(path.join(__dirname, '../measure/modeskins.json')));
const styleconfig = JSON.parse(fs.readFileSync(path.join(__dirname, '../measure/styledata.json')));
const { generateChart } = require('../measure/index.js');
const { defaultstyle } = require('../measure/defaultstyle.js');
const tidyUpInput = (input) => {
  if (!input) {
    return null;
  }

  const measureData = [];
  const measures = input.split(',');
  const allowedNumberOfLines = [4, 8, 12, 16, 24, 32, 48, 64, 192];

  for (let measure = 0; measure < 2; measure++) {
    const currentMeasure = measures[measure];
    measureData.push([]);

    const lines = currentMeasure ? currentMeasure.split('\n') : [];

    if (lines.length > 192) {
      console.warn('Measure has more than 192 lines.');
      return null;
    }

    for (let line = 0; line < lines.length; line++) {
      measureData[measure].push(lines[line]);
    }

    if (!allowedNumberOfLines.includes(lines.length)) {
      const closestTimingIndex = allowedNumberOfLines.findIndex((v) => v > lines.length);
      const closestTiming = allowedNumberOfLines[closestTimingIndex];

      if (closestTiming === -1) {
        console.warn('Failed to find closest timing to ', lines.length);
        return null;
      }

      const linesToAdd = closestTiming - lines.length;

      for (let i = 0; i < linesToAdd; i++) {
        measureData[measure].push('');
      }
    }
  }

  return measureData;
};

module.exports = class SMReaderCommand extends SlashCommand {
  constructor(creator) {
    super(creator, {
      name: 'measure',
      description: 'Preview a measure.',
      options: [
        {
          type: CommandOptionType.STRING,
          name: 'gamemode',
          description: 'Select Gamemode',
          required: true,
          autocomplete: true
        },
        {
          type: CommandOptionType.STRING,
          name: 'style',
          description: 'Select Style',
          autocomplete: true
        },
        {
          type: CommandOptionType.BOOLEAN,
          name: 'reverse',
          description: 'Enable Reverse Scroll?',
          required: false
        },
        {
          type: CommandOptionType.BOOLEAN,
          name: 'lines',
          description: 'Show Measure Lines?',
          required: false
        }
      ]
    });
    this.mode = 'dance'
    this.reverse = false;
    this.showlines = false;
    this.noteskin = 'default'
  }

  async autocomplete(ctx) {
    if (!ctx.focused) return [{ name: 'Dance', value: 'dance' }];

    const input = ctx.options[ctx.focused];
    let matches;
    let result;
    switch (ctx.focused) {
      case 'style':
        if (!Object.keys(defaultstyle).includes(ctx.options.gamemode)) {
          matches = ''; // Mode is not supported so blank style.
        } else {
          const supportedStyles = Object.keys(styledata[ctx.options.gamemode]);

          if (input) {
            const similar = stringSimilarity.findBestMatch(input, supportedStyles);
            const sortedSimilar = similar.ratings.sort((a, b) => { return b.rating - a.rating })
            const limitedSimilar = sortedSimilar.splice(0, 4);
            const similarToChoiceArr = []

            for (let i = 0; i < limitedSimilar.length; i++) {
              const mode = limitedSimilar[i].target;
              similarToChoiceArr.push({
                name: mode,
                value: mode
              });
            }

            return similarToChoiceArr;
          }

          const styles = []

          for (let i = 0; i < supportedStyles.length; i++) {
            const style = supportedStyles[i]

            styles.push({
              name: style,
              value: style
            })
          }

          return styles.splice(0, 4)
        }
        break;
      default: // gamemode
        const similar = stringSimilarity.findBestMatch(input, Object.keys(defaultstyle));
        const sortedSimilar = similar.ratings.sort((a, b) => { return b.rating - a.rating })
        const limitedSimilar = sortedSimilar.splice(0, 4);

        if (limitedSimilar) {
          const similarToChoiceArr = [];

          for (let i = 0; i < limitedSimilar.length; i++) {
            const mode = limitedSimilar[i].target;
            similarToChoiceArr.push({
              name: mode,
              value: mode
            });
          }

          return similarToChoiceArr;
        }

        matches = input;
    }

    if (matches) {
      result = typeof matches === 'object' ? matches.bestMatch.target : matches;
    } else {
      result = input;
    }

    return [
      {
        name: result,
        value: result
      }
    ];
  }

  /**
   *
   * @param {ComponentContext} ctx
   */
  async run(ctx) {
    const gamemode = ctx.options.gamemode;
    let style = ctx.options.style;

    if (!Object.keys(defaultstyle).includes(gamemode)) {
      ctx.send("That gamemode doesn't look like a gamemode I support.");
      return;
    }

    if (!Object.keys(styledata[gamemode]).includes(style)) {
      ctx.options.style = defaultstyle[gamemode];
    }

    ctx.sendModal(
      {
        title: 'Measure Preview',
        components: [
          {
            type: ComponentType.ACTION_ROW,
            components: [
              {
                type: ComponentType.TEXT_INPUT,
                label: 'Measure Data',
                style: TextInputStyle.PARAGRAPH,
                custom_id: 'measure_data',
                placeholder: '0100\n0010\n0001\n1000'
              }
            ]
          }
        ]
      },
      async (iCtx) => {
        const input = iCtx.values.measure_data;
        const measureData = tidyUpInput(input);
        const curMode = ctx.options.gamemode;
        const curStyle = ctx.options.style;
        const reverse = ctx.options.reverse ?? false; // reverse might not be present at all
        const showMeasureLines = ctx.options.lines ?? true;
        const config = styleconfig[curMode][curStyle]

        this.reverse = reverse;
        this.showlines = showMeasureLines;
        this.mode = curMode
        this.noteskin = config.defaultNoteskin || 'default'

        if (!measureData) {
          iCtx.send('Unable to process given measureData, did you type something funny?');
          return;
        }

        const image = await generateChart({
          reverse,
          showMeasureLines,
          curMode,
          style: curStyle,
          measureData,
          skin: this.noteskin
        }).catch((r) => console.error(r));

        if (!image) {
          iCtx.send('Failed to generate image...');
          return;
        }

        const updateComponents = () => {
          const reverseNewLabel = this.reverse ? 'Disable' : 'Enable';
          const linewNewLabel = this.showLines ? 'Hide' : 'Show';
          const buttonsRow = new ActionRowBuilder()
          const selectRow = new ActionRowBuilder()
          const modeNoteskins = modeskins[this.mode]
          let isThereSkins = false

          if (modeNoteskins.length > 1) {
            isThereSkins = true
            const menuOptions = []

            for (let i = 0; i < modeNoteskins.length; i++) {
              menuOptions.push({
                label: modeNoteskins[i],
                value: `${i}`
              })
            }

            const menu = new SelectMenuBuilder()
              .setCustomId('noteskinupdate')
              .setPlaceholder('Choose Noteskin')
              .addOptions(menuOptions)

            selectRow.addComponents(menu)
          }

          buttonsRow.addComponents(
            new ButtonBuilder()
              .setCustomId(`reverse+toggle`)
              .setLabel(`${reverseNewLabel} Reverse`)
              .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
              .setCustomId(`lines+toggle`)
              .setLabel(`${linewNewLabel} Lines`)
              .setStyle(ButtonStyle.Primary)
          );

          return isThereSkins ? [buttonsRow, selectRow] : [buttonsRow]
        };

        const updateImage = async () => {
          const updatedImage = await generateChart({
            reverse: this.reverse,
            showMeasureLines: this.showlines,
            curMode,
            style: curStyle,
            measureData,
            skin: this.noteskin
          }).catch((r) => console.error(r));

          if (!updatedImage) return null;

          return updatedImage;
        };

        const updatedMessageObject = (image) => {
          return {
            content: `Viewing ${curMode}-${curStyle}, reverse ${this.reverse ? 'ON' : 'OFF'}.`,
            file: {
              file: image,
              name: `${curMode}_${curStyle}.png`
            }
          };
        };

        await iCtx.defer();
        const message = await iCtx.send({
          content: `Viewing ${curMode}-${curStyle}, reverse ${this.reverse ? 'ON' : 'OFF'}.`,
          file: {
            file: await image.getBufferAsync('image/png'),
            name: `${curMode}_${curStyle}.png`
          },
          components: updateComponents()
        });

        iCtx.registerWildcardComponent(message.id, async (cCtx) => {
          const componentData = cCtx.customID.split('+');
          const componentToUpdate = componentData[0];

          switch (componentToUpdate) {
            case 'reverse': {
              this.reverse = !this.reverse;
              break;
            }
            case 'lines': {
              this.showlines = !this.showlines;
              break;
            }
            case 'noteskinupdate': {
              const noteskinIndex = Number(cCtx.values[0])
              const noteskin = modeskins[this.mode][noteskinIndex]

              this.noteskin = noteskin
            }
          }

          const regenImage = await updateImage();

          if (!regenImage) {
            return;
          }

          const messageObject = updatedMessageObject(await regenImage.getBufferAsync('image/png'));
          messageObject.components = updateComponents();

          await cCtx.acknowledge();
          await message.edit(messageObject);
        });
      }
    );
  }
};
