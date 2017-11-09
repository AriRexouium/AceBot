/*
  This command is broken at the moment, if you care to try and fix it feel free.
*/

const util = require('util')
const { Command } = require('discord.js-commando')

module.exports = class EvalCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'eval',
      group: 'bot-staff',
      memberName: 'eval',
      description: 'Executes JavaScript code.',
      aliases: ['evaluate'],
      details: 'Only the bot owner(s) may use this command.',
      clientPermissions: ['EMBED_LINKS'],
      args: [
        {
          key: 'code',
          prompt: 'What code would you like to evaluate?',
          type: 'string'
        }
      ],
      guarded: true
    })
    this.lastResult = null
  }

  hasPermission (message) {
    return this.client.isOwner(message.author)
  }

  run (message, args) {
    /* eslint-disable no-unused-vars */
    const client = message.client
    const channel = message.channel
    const guild = message.guild
    const objects = client.registry.evalObjects
    const lastResult = this.lastResult
    /* eslint-enable no-unused-vars */

    var code = args.code; var evaledLatency
    try {
      var hrStart = process.hrtime(this.hrStart)
      var result = eval(code) // eslint-disable-line no-eval
      evaledLatency = process.hrtime(hrStart)
      var type = typeof evaled
      var inspect = util.inspect(result, { depth: 0 })
      this.lastResult = result
      /* Fixing Stuff... Not sure what to call it really. */
      code = fix(code)
      result = fix(result)

      var sortName; var sortValue
      if (result instanceof Object) {
        sortName = 'Inspect'

        inspect = inspect.toString()
        if (inspect.length > 2000) { sortValue = 'Error: Cannot exceed 2000 characters.' }

        sortValue = ('```js\n' + inspect.toString() + '\n```').replace(client.token, '[TOKEN]')
      } else {
        sortName = 'Type'
        sortValue = '```js\n' + type + '\n```'
      }

      // Evaluation Success
      message.embed({
        author: { name: this.client.user.tag, icon_url: this.client.user.displayAvatarURL() },
        footer: { text: message.author.tag, icon_url: message.author.displayAvatarURL() },
        timestamp: new Date(),
        title: 'Javascript Evaluation Complete!',
        description: `***Executed in ${evaledLatency[0] > 0 ? `${evaledLatency[0]}s ` : ''}${evaledLatency[1] / 1000000}ms.***`,
        fields: [
          {
            'name': 'Code',
            'value': '```js\n' + code + '\n```',
            'inline': false
          },
          {
            'name': 'Result',
            'value': ('```js\n' + result.toString() + '\n```').replace(client.token, '[TOKEN]'),
            'inline': false
          },
          {
            'name': sortName,
            'value': sortValue,
            'inline': false
          }
        ],
        color: 0x00AA00
      })
    } catch (error) {
      evaledLatency = process.hrtime(hrStart)
      // Evaluation Error
      client.hastebin(error.stack, 'js').then(link => {
        message.embed({
          author: { name: this.client.user.tag, icon_url: this.client.user.displayAvatarURL() },
          footer: { text: message.author.tag, icon_url: message.author.displayAvatarURL() },
          timestamp: new Date(),
          title: 'Error in Javascript Evaluation!',
          description: `***Executed in ${evaledLatency[0] > 0 ? `${evaledLatency[0]}s ` : ''}${evaledLatency[1] / 1000000}ms***`,
          fields: [
            {
              'name': 'Code',
              'value': '```js\n' + code + '\n```',
              'inline': false
            },
            {
              'name': 'Error',
              'value': '[```LDIF\n' + error.message + '\n```](' + link + ')',
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
