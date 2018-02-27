const { Command } = require('discord.js-commando')
const { escapeMarkdown } = require('discord.js')

module.exports = class SetAgeCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'setabout',
      memberName: 'setabout',
      group: 'profile',
      description: 'Set your about field.',
      details: 'Set your about me field on your profile.',
      aliases: [
        'setinfo'
      ],
      throttling: {
        usages: 2,
        duration: 10
      },
      args: [
        {
          key: 'about',
          prompt: 'Please enter the year you were born. (Type "none" to leave blank.)',
          type: 'string',
          validate: value => {
            if (value.length > 256) {
              return 'Please keep the length below or exactly 256 characters (Type "none" to leave blank.)'
            } else {
              return true
            }
          }
        }
      ]
    })
  }

  run (message, args) {
    this.client.provider.set(message.author.id, 'about', args.about === 'none' ? '' : args.about)
    message.reply(`successfully set your about to:\n\`\`\`\n${escapeMarkdown(args.about)}\n\`\`\``)
  }
}
