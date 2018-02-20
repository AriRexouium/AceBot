const snekfetch = require('snekfetch')

/**
 * Send given text to hastebin.
 * @param {any} text The text to send to hastebin.
 * @param {string} syntax The text syntax. (Default is none.)
 * @param {boolean} secure Whether to return the URL as secured or not. (Defaults to true)
 */
module.exports = async function (text, syntax = '', secure = true, client) {
  if (text !== undefined) {
    let haste = await snekfetch
      .post('https://hastebin.com/documents')
      .send(text)
      .catch(error => {
        client.log.error(error, 'Hastebin')
      })
    if (secure === true) {
      return `https://hastebin.com/${haste.body.key}${syntax ? `.${syntax}` : ``}`
    } else {
      return `http://hastebin.com/${haste.body.key}${syntax ? `.${syntax}` : ``}`
    }
  } else {
    process.emitWarning('text cannot be undefined', 'HastebinError')
  }
}
