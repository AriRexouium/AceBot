const { Command } = require('discord.js-commando')
const childProcess = require('child_process')
const os = require('os')

module.exports = class UpdateCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'exec',
      group: 'bot-staff',
      memberName: 'exec',
      description: 'Updates the bot.',
      aliases: ['execute'],
      details: 'Only the bot owner(s) may use this command.',
      args: [
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
    return this.client.isOwner(message.author)
  }

  async run (message, args) {
    var code = args.code; var execLatency
    try {
      var hrStart = await process.hrtime(this.hrStart)
      var result = await childProcess.execSync(code)
      execLatency = await process.hrtime(hrStart)
      /* Fixing Stuff... Not sure what to call it really. */
      code = fix(code); result = fix(result)

      var platform = os.platform(); var syntax
      if (platform === 'linux') { syntax = 'bash' } else
      if (platform === 'win32') { syntax = 'bat' } else { syntax = 'ldif' }

      // Evaluation Success
      message.embed({
        author: { name: this.client.user.tag, icon_url: this.client.user.displayAvatarURL() },
        footer: { text: message.author.tag, icon_url: message.author.displayAvatarURL() },
        timestamp: new Date(),
        title: 'Execution Complete!',
        description: `***Executed in ${execLatency[0] > 0 ? `${execLatency[0]}s ` : ''}${execLatency[1] / 1000000}ms.***`,
        fields: [
          {
            'name': 'Code',
            'value': '```' + syntax + '\n' + code + '\n```',
            'inline': false
          },
          {
            'name': 'Result',
            'value': ('```' + syntax + '\n' + result.toString() + '\n```'),
            'inline': false
          }
        ],
        color: 0x00AA00
      })
    } catch (error) {
      execLatency = await process.hrtime(hrStart)
      code = fix(code)
      // Evaluation Error
      this.client.hastebin(error.stack).then(link => {
        message.embed({
          author: { name: this.client.user.tag, icon_url: this.client.user.displayAvatarURL() },
          footer: { text: message.author.tag, icon_url: message.author.displayAvatarURL() },
          timestamp: new Date(),
          title: 'Error in Evaluation!',
          description: `***Executed in ${execLatency[0] > 0 ? `${execLatency[0]}s ` : ''}${execLatency[1] / 1000000}ms***`,
          fields: [
            {
              'name': 'Code',
              'value': '```' + syntax + '\n' + code + '\n```',
              'inline': false
            },
            {
              'name': 'Error',
              'value': '[```' + syntax + '\n' + fix(error.message) + '\n```](' + link + ')',
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
