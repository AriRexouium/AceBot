const { Command } = require('discord.js-commando')
const moment = require('moment-timezone')

module.exports = class SetTimeZoneCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'settimezone',
      memberName: 'settimezone',
      group: 'profile',
      description: 'Set your time zone on your profile.',
      aliases: [
        'settz'
      ],
      throttling: {
        usages: 2,
        duration: 10
      },
      args: [
        {
          key: 'timezone',
          prompt: 'Please choose a time zone.\n*Here is a list of valid time zones -> <http://en.wikipedia.org/wiki/List_of_tz_database_time_zones>*',
          type: 'string',
          validate: value => {
            if (moment.tz.names().includes(value)) {
              return true
            } else {
              return 'that is not a valid time zone.\n*Here is a list of valid time zones -> <http://en.wikipedia.org/wiki/List_of_tz_database_time_zones>*'
            }
          }
        }
      ]
    })
  }

  run (message, args) {
    this.client.provider.set(message.author.id, 'timezone', args.timezone)
    message.reply(`successfully set your timezone to \`${args.timezone}\`!`)
  }
}
