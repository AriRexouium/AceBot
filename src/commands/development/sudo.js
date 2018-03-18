// TODO: Upload text over 2000(?) characters to hastebin.

const { Command } = require('discord.js-commando')
const Discord = require('discord.js')
const sudoClient = new Discord.Client()
const util = require('util')

module.exports = class SudoCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'sudo',
      memberName: 'sudo',
      group: 'development',
      description: 'Executes code on a bot or user account.',
      details: 'Allows the bot owners(s) to execute code on a different account via token.',
      clientPermissions: [
        'EMBED_LINKS'
      ],
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
      guarded: true
    })
  }
  hasPermission (message) {
    if (
      this.client.provider.get('global', 'developer', []).includes(message.author.id) ||
      this.client.isOwner(message.author.id)
    ) {
      return true
    } else {
      return 'only bot developers can run this command.'
    }
  }

  async run (message, args) {
    var code = args.code; var evaledLatency

    if (code.split(' ')[0] === '--silent' || code.split(' ')[0] === '-s') {
      try {
        eval(code.split(/ (.+)/)[1]) // eslint-disable-line no-eval
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

      /* Start Eval Block */
      var hrStart = await process.hrtime(this.hrStart)
      var result = await eval(code) // eslint-disable-line no-eval
      evaledLatency = await process.hrtime(hrStart)
      /* End Eval Block */

      var type = typeof (result) === 'object' ? 'object - ' + result.constructor.name : typeof (result)
      if (typeof (result) !== 'string') { result = util.inspect(result, { depth: 0 }) }

      this.lastResult = result

      // Evaluation Success
      message.embed({
        author: { name: this.client.user.tag, icon_url: this.client.user.displayAvatarURL() },
        footer: { text: message.author.tag, icon_url: message.author.displayAvatarURL() },
        timestamp: new Date(),
        description: `*Evaluated in ${evaledLatency[0] > 0 ? `${evaledLatency[0]}s ` : ''}${evaledLatency[1] / 1000000}ms.*`,
        fields: [
          {
            'name': 'Evaluated',
            'value': '```js\n' + clean(code) + '\n```',
            'inline': false
          },
          {
            'name': 'Result',
            'value': ('```js\n' + clean(result.toString()) + '\n```'),
            'inline': false
          },
          {
            'name': 'Type',
            'value': '```js\n' + clean(type) + '\n```',
            'inline': false
          }
        ],
        color: 0x00AA00
      }).catch(error => { message.reply(`there was an error when sending a message:\n\`${clean(error)}\``) })
      await sudoClient.destroy()
    } catch (error) {
      evaledLatency = await process.hrtime(hrStart)

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
              'value': '```js\n' + clean(code) + '\n```',
              'inline': false
            },
            {
              'name': 'Exception',
              'value': `[\`\`\`js\n${clean(error.name)}: ${clean(error.message)}\n\`\`\`](${link})`,
              'inline': false
            }
          ],
          color: 0xAA0000
        }).catch(error => { message.reply(`there was an error when sending a message:\n\`${clean(error)}\``) })
      })
      await sudoClient.destroy()
    }
  }
}

/**
 * Adds a nospace character to embed breaking text.
 * @param {string} text The text to clean.
 * @return {string} The text after it was cleaned.
 */
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
