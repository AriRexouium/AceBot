/**
 * Adds a nospace character to embed breaking text.
 * @param {any} client The CommandoClient.
 * @param {string} text The text to clean.
 * @return {string} The text after it was cleaned.
 */
module.exports = function cleanText (client, text) {
  if (typeof text === 'string') {
    return text
      .replace(/```/g, `\`${String.fromCharCode(8203)}\`\``)
  } else {
    return text
  }
}
