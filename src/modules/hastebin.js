const snekfetch = require('snekfetch')

/**
 * Send given text to hastebin.
 * @param {any} client The Commando client.
 * @param {any} text The text to send to hastebin.
 * @param {string} syntax The text syntax. (Default is none.)
 * @param {boolean} secure Whether to return the URL as secured or not. (Defaults to true.)
 */
module.exports = async function hastebin (client, text, syntax = '', secure = true) {
  let haste = await snekfetch
    .post('https://hastebin.com/documents')
    .send(text)
  if (secure === true) {
    return `https://hastebin.com/${haste.body.key}${syntax ? `.${syntax}` : ``}`
  } else {
    return `http://hastebin.com/${haste.body.key}${syntax ? `.${syntax}` : ``}`
  }
}
