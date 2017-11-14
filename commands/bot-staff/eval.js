/*
  This command is broken at the moment, if you care to try and fix it feel free.
*/

const { Command } = require('discord.js-commando')
const util = require('util')

module.exports = class EvalCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'eval',
      memberName: 'eval',
      group: 'bot-staff',
      description: 'Evaluates JavaScript.',
      details: 'Only the bot owner(s) may use this command.',
      aliases: ['evaluate'],
      clientPermissions: ['EMBED_LINKS'],
      examples: [
        'eval client',
        'eval guild',
        'eval channel',
        'eval new Date()'
      ],
      args: [
        {
          key: 'code',
          prompt: 'What code would you like to evaluate?',
          type: 'string'
        }
      ],
      ownerOnly: true,
      guarded: true
    })
    this.lastResult = null
  }

  async run (message, args) {
    /* eslint-disable no-unused-vars */
    const client = message.client
    const channel = message.channel
    const guild = message.guild
    const objects = client.registry.evalObjects
    const lastResult = this.lastResult
    /* eslint-enable no-unused-vars */

    var code = args.code; var evaledLatency
    try {
      var hrStart = await process.hrtime(this.hrStart)
      var result = await eval(code) // eslint-disable-line no-eval
      evaledLatency = await process.hrtime(hrStart)
      var inspect = util.inspect(result, { depth: 0 })
      this.lastResult = result
      /* Fixing Stuff... Not sure what to call it really. */
      code = fix(code); result = fix(result)

      // Evaluation Success
      message.embed({
        author: { name: this.client.user.tag, icon_url: this.client.user.displayAvatarURL() },
        footer: { text: message.author.tag, icon_url: message.author.displayAvatarURL() },
        timestamp: new Date(),
        description: `Evaluated in ${evaledLatency[0] > 0 ? `${evaledLatency[0]}s ` : ''}${evaledLatency[1] / 1000000}ms.`,
        fields: [
          {
            'name': 'Evaluated',
            'value': '```js\n' + code + '\n```',
            'inline': false
          },
          {
            'name': 'Result',
            'value': ('```js\n' + result.toString() + '\n```').replace(client.token, '[TOKEN]'),
            'inline': false
          },
          {
            'name': 'Inspect',
            'value': ('```js\n' + inspect.toString() + '\n```').replace(client.token, '[TOKEN]'),
            'inline': false
          },
          {
            'name': 'Type',
            'value': '```js\n' + typeof result + '\n```',
            'inline': false
          }
        ],
        color: 0x00AA00
      })
    } catch (error) {
      evaledLatency = await process.hrtime(hrStart)
      code = fix(code)
      // Evaluation Error
      client.hastebin(error.stack, 'js').then(link => {
        message.embed({
          author: { name: this.client.user.tag, icon_url: this.client.user.displayAvatarURL() },
          footer: { text: message.author.tag, icon_url: message.author.displayAvatarURL() },
          timestamp: new Date(),
          description: `Evaluated in ${evaledLatency[0] > 0 ? `${evaledLatency[0]}s ` : ''}${evaledLatency[1] / 1000000}ms`,
          fields: [
            {
              'name': 'Evaluated',
              'value': '```js\n' + code + '\n```',
              'inline': false
            },
            {
              'name': 'Exception',
              'value': '[```js\n' + fix(error.message) + '\n```](' + link + ')',
              'inline': false
            },
            {
              'name': 'Type',
              'value': '```js\n' + error.name + '\n```',
              'inline': false
            }
          ],
          color: 0xAA0000
        })
      })
    }
  }
}
var fix = (text) => {
  if (typeof (text) === 'string') {
    return text
    .replace(/`/g, '`' + String.fromCharCode(8203))
    .replace(/@/g, '@' + String.fromCharCode(8203))
    .replace(/#/g, '#' + String.fromCharCode(8203))
  } else {
    return text
  }
}
