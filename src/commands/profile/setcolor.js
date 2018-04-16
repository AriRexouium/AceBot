const { Command } = require('discord.js-commando')
const isHex = require('is-hex')

module.exports = class SetColorCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'setcolor',
      memberName: 'setcolor',
      group: 'profile',
      description: 'Sets your embed color on your profile.',
      throttling: {
        usages: 2,
        duration: 10
      },
      args: [
        {
          key: 'hex',
          prompt: 'Please enter a valid hex code. (Type "auto" to use your role color.)',
          type: 'string',
          validate: value => {
            if (value === 'auto' || isHex(value)) {
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
    } else {
      this.client.provider.set(message.author.id, 'color', args.hex)
    }
    message.reply(`successfully set your color to \`${args.hex}\`!`)
  }
}
