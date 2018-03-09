const { Command } = require('discord.js-commando')
const { escapeMarkdown } = require('discord.js')
const moment = require('moment')
require('moment-duration-format')

module.exports = class SeenCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'seen',
      memberName: 'seen',
      group: 'information',
      description: 'Show when the last message a user sent.',
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
    var userColor = (args.user).displayHexColor
    if (userColor === '#000000') { userColor = 0x7289DA } else { userColor = Number(userColor.replace('#', '0x')) }

    var user = args.user.user
    try {
      var messageTime = new Date() - user.lastMessage.createdTimestamp
      message.embed({
        author: {
          name: `${user.tag} was seen ${moment.duration(messageTime).format('y [yr,] M [mo,] w [wk,] d [day,] h [hr,] m [min,] s [sec, and] S [ms]')} ago.`,
          icon_url: user.avatarURL() !== null ? user.avatarURL() : 'http://cdn.discordapp.com/embed/avatars/0.png'
        },
        color: userColor
      })
    } catch (error) {
      message.reply(`I have not seen **${escapeMarkdown(user.tag)}**.`)
    }
  }
}
