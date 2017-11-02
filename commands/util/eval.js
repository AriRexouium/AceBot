/*
  This command is broken at the moment, if you care to try and fix it feel free.
*/

const util = require('util')
const { Command } = require('discord.js-commando')

module.exports = class EvalCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'eval',
      group: 'util',
      memberName: 'eval',
      description: 'Executes JavaScript code.',
      details: 'Only the bot owner(s) may use this command.',
      args: [
        {
          key: 'code',
          prompt: 'What code would you like to evaluate?',
          type: 'string'
        }
      ]
    })
    this.lastResult = null
  }

  hasPermission (message) {
    return this.client.isOwner(message.author)
  }

  run (message, args) {
    /* eslint-disable no-unused-vars */
    const client = message.client
    const stats = client.botStats
    const guild = message.guild
    const objects = client.registry.evalObjects
    const lastResult = this.lastResult
    /* eslint-enable no-unused-vars */

    var code = args.code
    var evaledLatency
    try {
      var hrStart = process.hrtime(this.hrStart)
      var evaled = eval(code) // eslint-disable-line no-eval
      evaledLatency = process.hrtime(hrStart)
      var type = typeof evaled
      var inspect = util.inspect(evaled, { depth: 0 })
      this.lastResult = evaled

      var sortName; var sortValue
      if (evaled instanceof Object) {
        sortName = 'Inspect'
        sortValue = '```js\n' + inspect.toString() + '\n```'
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
            'value': '```js\n' + clean(code) + '\n```',
            'inline': false
          },
          {
            'name': 'Result',
            'value': '```js\n' + clean(evaled.toString()) + '\n```',
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
              'value': '```js\n' + clean(code) + '\n```',
              'inline': false
            },
            {
              'name': 'Error',
              'value': '```LDIF\n' + clean(error.message) + '\n```\n' + `[Stack Error](${link})`,
              'inline': false
            }
          ],
          color: 0xAA0000
        })
      })
    }
  }
}
var clean = (text) => {
  if (typeof (text) === 'string') {
    return text
    .replace(/`/g, '`' + String.fromCharCode(8203))
    .replace(/@/g, '@' + String.fromCharCode(8203))
    .replace(/#/g, '#' + String.fromCharCode(8203))
  } else {
    return text
  }
}
