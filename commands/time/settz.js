const { Command } = require('discord.js-commando')
const moment = require('moment-timezone')

module.exports = class EmojiCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'settz',
      memberName: 'settz',
      group: 'time',
      description: 'Set your timezone.',
      aliases: [
        'settimezone',
        'settimeoffset'
      ],
      throttling: {
        usages: 2,
        duration: 10
      },
      args: [
        {
          key: 'timezone',
          prompt: 'Choose a time offset.',
          type: 'string'
        }
      ]
    })
  }

  run (message, args) {
    if (moment.tz.names().includes(args.timezone)) {
      this.client.provider.set(message.author.id, 'timezone', args.timezone)
      message.reply(`successfully set your timezone to \`${args.timezone}\`!`)
    } else {
      message.reply('that is not a valid timezone.')
    }
  }
}
