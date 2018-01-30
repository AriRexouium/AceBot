// TODO: Upload text over 2000(?) characters to hastebin.

const { Command } = require('discord.js-commando')
const childProcess = require('child_process')
const os = require('os')

module.exports = class ExecCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'exec',
      memberName: 'exec',
      group: 'bot-staff',
      description: 'Executes a new process.',
      details: 'Only the bot owner(s) may use this command.',
      aliases: ['execute'],
      clientPermissions: ['EMBED_LINKS'],
      args: [
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
    var code = args.code; var execLatency
    var platform = os.platform(); var syntax; var prefix
    if (platform === 'win32') { syntax = 'bat'; prefix = `${__dirname}>` } else
    if (platform === 'linux') { syntax = 'bash'; prefix = `${os.userInfo().username}@${os.hostname()}:~$ ` } else
    if (platform === 'freebsd') { syntax = 'bash'; prefix = `${os.hostname()}:~ ${os.userInfo().username}$ ` } else { syntax = 'ldif'; prefix = '$ ' }

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
      var hrStart = await process.hrtime(this.hrStart)
      var result = await childProcess.execSync(code)
      execLatency = await process.hrtime(hrStart)

      // Evaluation Success
      message.embed({
        author: { name: this.client.user.tag, icon_url: this.client.user.displayAvatarURL() },
        footer: { text: message.author.tag, icon_url: message.author.displayAvatarURL() },
        timestamp: new Date(),
        description: `*Executed in ${execLatency[0] > 0 ? `${execLatency[0]}s ` : ''}${execLatency[1] / 1000000}ms.*`,
        fields: [
          {
            'name': 'Executed',
            'value': `\`\`\`${clean(syntax)}\n${clean(prefix)}${clean(code)}\n\`\`\``,
            'inline': false
          },
          {
            'name': 'Result',
            'value': ('```' + clean(syntax) + '\n' + clean(result.toString()) + '\n```'),
            'inline': false
          }
        ],
        color: 0x00AA00
      }).catch(error => { message.reply(`there was an error when sending a message:\n\`${clean(error)}\``) })
    } catch (error) {
      execLatency = await process.hrtime(hrStart)

      // Evaluation Error
      this.client.hastebin(error.stack).then(link => {
        message.embed({
          author: { name: this.client.user.tag, icon_url: this.client.user.displayAvatarURL() },
          footer: { text: message.author.tag, icon_url: message.author.displayAvatarURL() },
          timestamp: new Date(),
          description: `*Executed in ${execLatency[0] > 0 ? `${execLatency[0]}s ` : ''}${execLatency[1] / 1000000}ms*`,
          fields: [
            {
              'name': 'Executed',
              'value': `\`\`\`${clean(syntax)}\n${clean(prefix)}${clean(code)}\n\`\`\``,
              'inline': false
            },
            {
              'name': 'Exception',
              'value': '[```' + syntax + '\n' + clean(error.message) + '\n```](' + link + ')',
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
