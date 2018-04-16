// TODO: Upload text over 2000(?) characters to hastebin.

const { Command } = require('discord.js-commando')
const exec = require('child_process').execSync
const os = require('os')

module.exports = class ExecCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'exec',
      memberName: 'exec',
      group: 'development',
      description: 'Execute commands on the host.',
      details: 'Execute commands on the host system.',
      aliases: [
        'execute'
      ],
      clientPermissions: [
        'EMBED_LINKS'
      ],
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
    var client = this.client; var code = args.code
    var platform = os.platform(); var syntax; var prefix
    if (platform === 'win32') { syntax = 'bat'; prefix = `${__dirname}>` } else
    if (platform === 'linux') { syntax = 'bash'; prefix = `${os.userInfo().username}@${os.hostname()}:~$ ` } else
    if (platform === 'freebsd') { syntax = 'bash'; prefix = `${os.hostname()}:~ ${os.userInfo().username}$ ` } else { syntax = 'ldif'; prefix = '$ ' }

    if (code.split(' ')[0] === '--silent' || code.split(' ')[0] === '-s') {
      try {
        exec(code.substr(code.indexOf(' ') + 1))
      } catch (error) {
        message.say({
          content: `${error.name}: ${error.message}`,
          code: 'js'
        })
      }
      return
    }

    var execTime
    try {
      var hrStart = await process.hrtime(this.hrStart)
      var result = await exec(code)
      var hrEnd = await process.hrtime(hrStart)
      execTime = hrEnd

      // Evaluation Success
      message.embed({
        author: { name: this.client.user.tag, icon_url: this.client.user.displayAvatarURL() },
        footer: { text: message.author.tag, icon_url: message.author.displayAvatarURL() },
        timestamp: new Date(),
        description: `*Executed in ${execTime[0] > 0 ? `${execTime[0]}s ` : ''}${execTime[1] / 1000000}ms.*`,
        fields: [
          {
            'name': 'Executed',
            'value': `\`\`\`${client.cleanText(syntax)}\n${client.cleanText(prefix)}${client.cleanText(code)}\n\`\`\``,
            'inline': false
          },
          {
            'name': 'Result',
            'value': ('```' + client.cleanText(syntax) + '\n' + client.cleanText(result.toString()) + '\n```'),
            'inline': false
          }
        ],
        color: 0x00AA00
      }).catch(error => { message.reply(`there was an error when sending a message:\n\`${client.cleanText(error)}\``) })
    } catch (error) {
      execTime = await process.hrtime(hrStart)

      // Evaluation Error
      this.client.hastebin(error.stack).then(link => {
        message.embed({
          author: { name: this.client.user.tag, icon_url: this.client.user.displayAvatarURL() },
          footer: { text: message.author.tag, icon_url: message.author.displayAvatarURL() },
          timestamp: new Date(),
          description: `*Executed in ${execTime[0] > 0 ? `${execTime[0]}s ` : ''}${execTime[1] / 1000000}ms*`,
          fields: [
            {
              'name': 'Executed',
              'value': `\`\`\`${client.cleanText(syntax)}\n${client.cleanText(prefix)}${client.cleanText(code)}\n\`\`\``,
              'inline': false
            },
            {
              'name': 'Exception',
              'value': '[```' + syntax + '\n' + client.cleanText(error.message) + '\n```](' + link + ')',
              'inline': false
            }
          ],
          color: 0xAA0000
        }).catch(error => { message.reply(`there was an error when sending a message:\n\`${client.cleanText(error)}\``) })
      })
    }
  }
}
