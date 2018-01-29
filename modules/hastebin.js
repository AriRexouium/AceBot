const snekfetch = require('snekfetch')

/**
 * Send given text to hastebin.
 * @param {any} text
 * @param {string} syntax=''
 * @param {boolean} secure=true
 * @param {any} client
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
