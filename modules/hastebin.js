const snek = require('snekfetch')

module.exports = async function (text, language = '', client) {
  let haste = await snek.post('https://hastebin.com/documents')
  .send(text)
  .catch(error => { client.log.error(error, 'Hastebin') })
  let url = `https://hastebin.com/${haste.body.key}${language ? `.${language}` : ``}`
  return url
}
