const snekfetch = require('snekfetch')

/**
 * Send given text to hastebin.
 * @param {any} client The CommandoClient.
 * @param {any} text The text to send to hastebin.
 * @param {string} syntax The text syntax. (Default is none.)
 * @param {boolean} secure Whether to return the URL as secured or not. (Defaults to true.)
 * @return {Promise<string>}
 */
module.exports = function hastebin (client, text, syntax = '', secure = true) {
  return new Promise((resolve, reject) => {
    snekfetch
      .post('https://hastebin.com/documents')
      .send(text)
      .then((data, error) => {
        if (error) {
          return reject(error)
        } else {
          return resolve(secure === true ? `https://hastebin.com/${data.body.key}${syntax ? `.${syntax}` : ''}` : `https://hastebin.com/${data.body.key}${syntax ? `.${syntax}` : ''}`)
        }
      })
  })
}
