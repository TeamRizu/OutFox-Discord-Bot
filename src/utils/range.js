/**
 * Generates a array with given start value and size.
 * @function
 * @param {number} size - How long the array should be.
 * @param {number} startAt - The starting value.
 * @returns {Array<Number>} - The generated array.
 */
exports.range = (size, startAt = 0) => {
  // https://stackoverflow.com/a/10050831
  return [...Array(size).keys()].map((i) => i + startAt)
}
