const snekfetch = require('snekfetch')

module.exports = async function (text, syntax = '', client) {
  if (text !== undefined) {
    let haste = await snekfetch
    .post('https://hastebin.com/documents')
    .send(text)
    .catch(error => {
      client.log.error(error, 'Hastebin')
    })
    let url = `https://hastebin.com/${haste.body.key}${syntax ? `.${syntax}` : ``}`
    return url
  } else {
    throw new Error('HastebinError: text cannot be undefined.')
  }
}
