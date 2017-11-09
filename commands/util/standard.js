const { Command } = require('discord.js-commando')
const standard = require('standard')

module.exports = class StandardCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'standard',
      group: 'util',
      memberName: 'standard',
      description: 'Lints code in the Standardjs format. (Only use if you know what you\'re doing.)',
      aliases: ['lint'],
      clientPermissions: ['EMBED_LINKS'],
      throttling: {
        usages: 2,
        duration: 10
      },
      args: [
        {
          key: 'code',
          prompt: 'What code would you like to lint?',
          type: 'string'
        }
      ]
    })
  }

  run (message, args) {
    var code = args.code
    standard.lintText(code, { fix: true }, output => {
      message.say({
        content: '',
        embed: {
          author: { name: this.client.user.tag, icon_url: this.client.user.displayAvatarURL() },
          footer: { text: message.author.tag, icon_url: message.author.displayAvatarURL() },
          timestamp: new Date(),
          description: ('```js\n' + fix(output.results.output) + '\n```'),
          color: 0x7289DA
        }
      })
    })
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
