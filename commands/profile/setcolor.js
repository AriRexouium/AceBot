const { Command } = require('discord.js-commando')

module.exports = class SetAboutCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'setcolor',
      memberName: 'setcolor',
      group: 'profile',
      description: 'Set your about field.',
      details: 'Set your about me field on your profile.',
      aliases: [
        'setc'
      ],
      throttling: {
        usages: 2,
        duration: 10
      },
      args: [
        {
          key: 'hex',
          prompt: 'Please enter a valid hex code. (Type "auto" to choose your role color.)',
          type: 'string',
          validate: value => {
            if (value === 'auto' || value === 'none' || isHex(value)) {
              return true
            } else {
              return 'That is not a valid hex code.'
            }
          }
        }
      ]
    })
  }

  run (message, args) {
    if (args.hex === 'auto') {
      this.client.provider.set(message.author.id, 'color', 'auto')
    } else if (args.hex === 'none') {
      this.client.provider.set(message.author.id, 'color', '')
    } else {
      this.client.provider.set(message.author.id, 'color', args.hex)
    }
    message.reply(`successfully set your color to \`${args.hex}\`!`)
  }
}

function isHex (input) {
  return typeof input === 'string' &&
    (input.match(/([0-9]|[a-f])/gim) || []).length === input.length
}
