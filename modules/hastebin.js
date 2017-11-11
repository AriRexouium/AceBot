const snekfetch = require('snekfetch')

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
    throw new Error('HastebinError: text cannot be undefined.')
  }
}
