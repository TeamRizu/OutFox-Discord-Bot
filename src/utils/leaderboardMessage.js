const { ActionRowBuilder, ButtonBuilder, SelectMenuBuilder, ButtonStyle } = require('discord.js');
const { range } = require('./constants.js');
exports.LeaderboardMessageFile = class LeaderboardMessageInstance {
  constructor() {
    /**
     * A array of individual elements that makes the pages.
     * @type {Array<string> | Array<object>}
     */
    this.elements = [];
    /**
     * The separator used between components components customID
     * @type {string}
     */
    this.separator = '-'
    /**
     * Which page we're currently in.
     * @type {number}
     */
    this.page = 0;
    /**
     * How many elements should be displayed for each page.
     * @type {number}
     */
    this.elementsPerPage = 25;
    /**
     * How many characters should be displayed for each element.
     * @type {number}
     */
    this.charsPerElement = 80;
    /**
     * How many characters should be displayed for each page.
     * @type {number}
     */
    this.charsPerPage = 1024;
    /**
     * If enabled, the message author can type the number of the element to read more about it.
     * @type {boolean}
     */
    this.supportLookUp = false;
    /**
     * Should be set to true to give the option to leave the lookUp.
     * @type {boolean}
     */
    this.lookingUp = false;
    /**
     * Select Menu Placeholder Text.
     * @type {string}
     */
    this.menuSelectPlaceholder = 'Look up element';
    /**
     *
     * @param {string | import('../types/tsTypes/types').LeaderboardElementObject} e - The element string or object
     * @param {number} i - The element Index
     * @returns {string}
     */
    this.formatElement = (e, i) => {
      if (typeof e === 'object') {
        return i ? `${i}° ${e.description}` : e.description || 'UNKNOWN_OBJECT_ELEMENT_DESCRIPTION';
      }

      return i ? `${i}° ${e}` : e || 'UNKNOWN_ELEMENT';
    };
  }

  /**
   *
   * @param {string | import('../types/tsTypes/types').LeaderboardElementObject} element
   * @returns {boolean}
   */
  addElement(element) {
    if (typeof element === 'string' || typeof element === 'object') {
      if (this.elements.length !== 0 && !this.elements.every((e) => typeof e === typeof element)) {
        console.warn(`Trying to add different element type to an array already made out of `, typeof element);
        return false;
      }

      if (typeof element === 'string' && element.length > this.charsPerElement) {
        console.warn(
          'Element is longer than allowed character limit. Limit = ',
          this.charsPerElement,
          ', Given = ',
          element.length
        );
        return false;
      }

      this.elements.push(element);
      return true;
    }

    console.warn('Tried to add bad element to LeaderboardMessage, ', element);
    return false;
  }

  /**
   * @returns {import('../types/tsTypes/types').LeaderboardPagesObject}
   */
  get pages() {
    const pageList = [];
    const individualElements = [[]];
    let pageContent = '';

    for (let i = 0; i < this.elements.length; i++) {
      const currentElement = this.elements[i];
      const elementString = this.formatElement(currentElement, i + 1);
      let hasPushed = false;

      if (!elementString) {
        continue;
      }

      // If the addition of the element will make the page bigger than allowed, then create a new page.
      if (pageContent.length + elementString.length > this.charsPerPage) {
        pageList.push(pageContent);
        pageContent = '';
        hasPushed = true;
      }

      const individualPageIndex = pageList.length;

      // pageList.length > 0 ? pageList.length - 1 : pageList.length
      if (individualElements[individualPageIndex] === undefined) {
        individualElements[individualPageIndex] = [];
      }
      individualElements[individualPageIndex].push(typeof currentElement === 'object' ? currentElement : elementString);
      pageContent += `\n${elementString}`;

      // If we reach the limit of elements per page, add the current content to the page list.
      const curPageElements = individualElements[individualPageIndex].length + 1;
      if (!hasPushed && i !== 0 && curPageElements >= this.elementsPerPage) {
        pageList.push(pageContent);
        pageContent = '';
        hasPushed = true;
        continue; // We need this here so the condition bellow doesn't run if this runs, which would add 2 pages.
      }

      if (!hasPushed && i === this.elements.length - 1) {
        pageList.push(pageContent);
      }
    }

    return {
      pageList,
      individualElements
    };
  }

  /**
   * @returns {ActionRowBuilder[]}
   */
  get pageComponents() {

    if (this.lookingUp) {
      const stopLookingButton = new ButtonBuilder()
        .setLabel('Go Back')
        .setCustomId('stoplookup' + this.separator + this.page)
        .setStyle(ButtonStyle.Primary);

      return [new ActionRowBuilder().addComponents(stopLookingButton)];
    }

    const pageCount = this.pages.pageList.length;
    const leastPageNum = 0 > this.page - 1 ? 0 : this.page - 1;
    const maxPageNum = this.page + 1 > pageCount - 1 ? pageCount - 1 : this.page + 1;

    const backButton = new ButtonBuilder()
      .setLabel('Back')
      .setCustomId('back' + this.separator + leastPageNum)
      .setStyle(ButtonStyle.Primary);

    const nextButton = new ButtonBuilder()
      .setLabel('Next')
      .setCustomId('next' + this.separator + maxPageNum)
      .setStyle(ButtonStyle.Primary);

    if (this.page === maxPageNum) {
      nextButton.setDisabled(true);
    } else {
      nextButton.setDisabled(false);
    }

    if (this.page === leastPageNum) {
      backButton.setDisabled(true);
    } else {
      backButton.setDisabled(false);
    }

    const components = [];
    if (leastPageNum !== maxPageNum) {
      const buttonsComponents = new ActionRowBuilder().addComponents(backButton, nextButton);
      components.push(buttonsComponents);
    }

    if (this.supportLookUp) {
      const { individualElements } = this.pages;
      const currentPageElements = individualElements[this.page];
      const maxIndex = this.elementsPerPage * (this.page + 1);
      let minIndex = this.elementsPerPage * (this.page + 1) - this.elementsPerPage;
      if (this.page >= 1) {
        minIndex = minIndex - this.page;
      }

      const selectElement = [];

      for (let i = 0; i < currentPageElements.length; i++) {
        // This was currentPageElements, I'm not sure why, currentPageElements would always be object, so this condition would always run.
        // I changed it to lookup the type of the element which is what it should always have been, I'm not sure if this will break something, I hope not.
        if (typeof currentPageElements[i] === 'object') {
          const elementObject = individualElements[this.page][i]
          selectElement.push({
            value: elementObject.value || 'lookup' + this.separator + range(maxIndex, minIndex)[i] + this.separator + this.page,
            label: elementObject.description,
            emoji: elementObject.emoji
          });
          continue;
        }

        selectElement.push({
          value: 'lookup' + this.separator + range(maxIndex, minIndex)[i] + this.separator + this.page,
          label: individualElements[this.page][i]
        });
      }

      const elementSelector = new SelectMenuBuilder()
        .setCustomId('updatepage' + this.separator + this.page)
        .setPlaceholder(this.menuSelectPlaceholder)
        .addOptions(selectElement);

      const selectComponent = new ActionRowBuilder().addComponents(elementSelector);
      components.push(selectComponent);
    }

    return components;
  }
};
