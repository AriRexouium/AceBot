const { Command } = require('discord.js-commando')
const moment = require('moment-timezone')

module.exports = class EmojiCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'time',
      memberName: 'time',
      group: 'time',
      description: 'Get the time of a user.',
      details: 'View another user\'s time and timezone.',
      aliases: [
        'getusertime'
      ],
      throttling: {
        usages: 2,
        duration: 10
      },
      args: [
        {
          key: 'user',
          prompt: 'What user would you like to lookup?',
          type: 'member'
        }
      ],
      guildOnly: true
    })
  }

  run (message, args) {
    let user = args.user.user
    var userTimezone = this.client.provider.get(user.id, 'timezone', false)
    if (userTimezone === false) {
      message.reply(`${user.tag} hasn't setup their timezone yet.`)
    } else {
      message.say(`${userTimezone}; where ${user.username} is, it's ${moment.tz(userTimezone).format('llll')}.`)
    }
  }
}
