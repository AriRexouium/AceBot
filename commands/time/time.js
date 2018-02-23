const { Command } = require('discord.js-commando')
const { oneLine } = require('common-tags')
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
    if (user.bot === true) return message.reply('bots can\'t have a timezone.')
    var userTimezone = this.client.provider.get(user.id, 'timezone', false)
    if (userTimezone === false) {
      message.reply(oneLine`
        ${user.tag} hasn't setup their timezone yet.
        They can use the \`settz\` command to change their timezone.
      `)
    } else {
      var userColor = (args.user).displayHexColor
      if (userColor === '#000000') { userColor = 0x7289DA } else { userColor = Number(userColor.replace('#', '0x')) }

      message.embed({
        author: { name: this.client.user.tag, icon_url: this.client.user.displayAvatarURL() },
        footer: { text: message.author.tag, icon_url: message.author.displayAvatarURL() },
        timestamp: new Date(),
        title: user.tag,
        thumbnail: { url: user.avatarURL() !== null ? user.avatarURL() : 'http://cdn.discordapp.com/embed/avatars/0.png' },
        fields: [
          {
            name: 'Time',
            value: moment.tz(userTimezone).format('llll')
          },
          {
            name: 'Timezone',
            value: userTimezone
          }
        ],
        color: userColor
      })
    }
  }
}
