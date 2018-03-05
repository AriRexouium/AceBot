const { Command } = require('discord.js-commando')
const { escapeMarkdown } = require('discord.js')

module.exports = class SetAboutCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'setabout',
      memberName: 'setabout',
      group: 'profile',
      description: 'Set your about me field on your profile.',
      throttling: {
        usages: 2,
        duration: 10
      },
      args: [
        {
          key: 'about',
          prompt: 'Please enter some information about yourself.',
          type: 'string',
          validate: value => {
            if (value.length > 512) {
              return 'Please keep the length below or exactly 512 characters.'
            } else {
              return true
            }
          }
        }
      ]
    })
  }

  run (message, args) {
    this.client.provider.set(message.author.id, 'about', args.about)
    message.reply(`successfully set your about to:\n\`\`\`\n${escapeMarkdown(args.about)}\n\`\`\``)
  }
}
