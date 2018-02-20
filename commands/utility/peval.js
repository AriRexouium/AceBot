// TODO: Upload text over 2000(?) characters to hastebin.

const { Command } = require('discord.js-commando')
const util = require('util')
const safeEval = require('safe-eval')

module.exports = class EvalCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'peval',
      memberName: 'peval',
      group: 'utility',
      description: 'Evaluates JavaScript.',
      details: 'Evalutate arbitrary JavaScript.',
      aliases: [
        'pevaluate'
      ],
      examples: [
        'eval typeof \'This is a string.\'',
        'eval Math.PI',
        'eval 5 / 4',
        'eval new Date()'
      ],
      clientPermissions: [
        'EMBED_LINKS'
      ],
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

  async run (message, args) {
    const client = message.client
    var context = {}

    // Silent Eval
    var code = args.code
    if (code.split(' ')[0] === '--silent' || code.split(' ')[0] === '-s') {
      try {
        safeEval(code.split(/ (.+)/)[1], context) // eslint-disable-line no-eval
      } catch (error) {
        message.say({
          content: `${error.name}: ${error.message}`,
          code: 'js'
        })
      }
      return
    }

    // Normal Eval
    var evaledLatency
    try {
      /* Start Eval Block */
      var hrStart = await process.hrtime(this.hrStart)
      var result = await safeEval(code, context) // eslint-disable-line no-eval
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
            'value': ('```js\n' + clean(result.toString()) + '\n```').replace(client.token, '[TOKEN]'),
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
    } catch (error) {
      evaledLatency = await process.hrtime(hrStart)

      // Evaluation Error
      client.hastebin(error.stack, 'js').then(link => {
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
