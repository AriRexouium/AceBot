// TODO: Upload text over 2000(?) characters to hastebin.

const { Command } = require('discord.js-commando')
const { escapeMarkdown } = require('discord.js')
const { oneLine } = require('common-tags')
const util = require('util')

module.exports = class EvalCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'eval',
      memberName: 'eval',
      group: 'development',
      description: 'Evaluates JavaScript.',
      details: 'Allows the bot owners to eval arbitrary JavaScript without restrictions.',
      aliases: [
        'evaluate'
      ],
      examples: [
        'eval client',
        'eval guild',
        'eval channel',
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
      ],
      guarded: true,
      argsSingleQuotes: false
    })
    this.lastResult = null
  }

  async run (message, args) {
    /* eslint-disable no-unused-vars */
    const msg = message
    const channel = message.channel
    const guild = message.guild
    const client = message.client
    const objects = client.registry.evalObjects
    const lastResult = this.lastResult
    /* eslint-enable no-unused-vars */

    // Silent Eval
    var code = args.code
    if (code.split(' ')[0] === '--silent' || code.split(' ')[0] === '-s') {
      try {
        await eval(code.substr(code.indexOf(' ') + 1)) // eslint-disable-line no-eval
      } catch (error) {
        await message.say({
          content: `${error.name}: ${error.message}`,
          code: 'js'
        })
      }
      return
    }

    // Normal Eval
    var evalTime; var hrEnd
    try {
      /* Start Eval Block */
      var hrStart = await process.hrtime(this.hrStart)
      var result = await eval(code) // eslint-disable-line no-eval
      hrEnd = await process.hrtime(hrStart)
      evalTime = hrEnd
      /* End Eval Block */

      var type
      if (typeof result === 'object') {
        type = `object - ${result.constructor.name}`
      } else if (typeof result === 'function') {
        type = oneLine`
          function
          ${result.name || result.length ? '-' : ''}
          ${result.name ? `Name: ${result.name}` : ''}
          ${result.name && result.length ? `|` : ''}
          ${result.length ? `#Args: ${result.length}` : ''}
        `
        result = result.toString()
      } else {
        type = typeof result
      }
      if (typeof (result) !== 'string') {
        result = util.inspect(result, {
          showHidden: true,
          compact: false,
          depth: 0
        })
      }

      this.lastResult = result

      // Evaluation Success
      message.embed({
        author: { name: this.client.user.tag, icon_url: this.client.user.displayAvatarURL() },
        footer: { text: message.author.tag, icon_url: message.author.displayAvatarURL() },
        timestamp: new Date(),
        description: `*Evaluated in ${evalTime[0] > 0 ? `${evalTime[0]}s ` : ''}${evalTime[1] / 1000000}ms.*`,
        fields: [
          {
            'name': 'Evaluated',
            'value': '```js\n' + escapeMarkdown(code, true) + '\n```',
            'inline': false
          },
          {
            'name': 'Result',
            'value': ('```js\n' + escapeMarkdown(result.toString(), true) + '\n```').replace(client.token, '[TOKEN]'),
            'inline': false
          },
          {
            'name': 'Type',
            'value': '```js\n' + escapeMarkdown(type, true) + '\n```',
            'inline': false
          }
        ],
        color: 0x00AA00
      }).catch(error => { message.reply(`there was an error when sending a message:\n\`${escapeMarkdown(error.toString(), true)}\``) })
    } catch (error) {
      hrEnd = await process.hrtime(hrStart)
      evalTime = hrEnd

      // Evaluation Error
      message.embed({
        author: { name: this.client.user.tag, icon_url: this.client.user.displayAvatarURL() },
        footer: { text: message.author.tag, icon_url: message.author.displayAvatarURL() },
        timestamp: new Date(),
        description: `*Evaluated in ${evalTime[0] > 0 ? `${evalTime[0]}s ` : ''}${evalTime[1] / 1000000}ms.*`,
        fields: [
          {
            'name': 'Evaluated',
            'value': '```js\n' + escapeMarkdown(code, true) + '\n```',
            'inline': false
          },
          {
            'name': 'Exception',
            'value': `[\`\`\`js\n${escapeMarkdown(`${error.name}: ${error.message}`, true)}\n\`\`\`](${await client.hastebin(error.stack, 'js')})`,
            'inline': false
          }
        ],
        color: 0xAA0000
      }).catch(error => { message.reply(`there was an error when sending a message:\n\`${escapeMarkdown(error.toString(), true)}\``) })
    }
  }
}
