/**
 *
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
function random(min = 0, max = 9) {
  return Math.floor(Math.random() * (max + 1 - min)) + min;
}

module.exports = random;
