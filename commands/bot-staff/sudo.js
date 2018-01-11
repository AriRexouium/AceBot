// NOTE: This command doesn't support message limits yet, so it will fail if it exceeds an X amount of characters. (I can't confirm the max amount for embeds.)

const { Command } = require('discord.js-commando')
const Discord = require('discord.js')
const sudoClient = new Discord.Client()
const util = require('util')

module.exports = class SudoCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'sudo',
      memberName: 'sudo',
      group: 'bot-staff',
      description: 'Executes code on a bot or user account.',
      details: 'Only the bot owner(s) may use this command.',
      clientPermissions: ['EMBED_LINKS'],
      args: [
        {
          key: 'token',
          prompt: 'You must enter a token.\n*(Once the token has been sent via message, it will be compromised.)*',
          type: 'string'
        },
        {
          key: 'code',
          prompt: 'What code would you like to execute?',
          type: 'string'
        }
      ],
      ownerOnly: true,
      guarded: true
    })
  }
  async run (message, args) {
    var code = args.code; var evaledLatency

    if (code.split(' ')[0] === '--silent' || code.split(' ')[0] === '-s') {
      try {
        await sudoClient.login(args.token)
        eval(code.split(' ')[1]) // eslint-disable-line no-eval
      } catch (error) {
        message.say({
          content: `${error.name}: ${error.message}`,
          code: 'js'
        })
      }
      return
    }

    try {
      await sudoClient.login(args.token)
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
        description: `*Evaluated in ${evaledLatency[0] > 0 ? `${evaledLatency[0]}s ` : ''}${evaledLatency[1] / 1000000}ms.*`,
        fields: [
          {
            'name': 'Evaluated',
            'value': '```js\n' + code + '\n```',
            'inline': false
          },
          {
            'name': 'Result',
            'value': ('```js\n' + result.toString() + '\n```'),
            'inline': false
          },
          {
            'name': 'Inspect',
            'value': ('```js\n' + inspect.toString() + '\n```'),
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
      await sudoClient.destroy()
    } catch (error) {
      evaledLatency = await process.hrtime(hrStart)
      code = fix(code)
      // Evaluation Error
      this.client.hastebin(error.stack, 'js').then(link => {
        message.embed({
          author: { name: this.client.user.tag, icon_url: this.client.user.displayAvatarURL() },
          footer: { text: message.author.tag, icon_url: message.author.displayAvatarURL() },
          timestamp: new Date(),
          description: `*Evaluated in ${evaledLatency[0] > 0 ? `${evaledLatency[0]}s ` : ''}${evaledLatency[1] / 1000000}ms.*`,
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
      await sudoClient.destroy()
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
