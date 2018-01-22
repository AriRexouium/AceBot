const { Command } = require('discord.js-commando')
const { escapeMarkdown } = require('discord.js')
const moment = require('moment')
require('moment-duration-format')

module.exports = class UserInfoCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'userinfo',
      memberName: 'userinfo',
      group: 'information',
      description: 'Displays info about a user.',
      aliases: ['memberinfo'],
      clientPermissions: ['EMBED_LINKS'],
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
    var timeZone = new Date().toString().match(/\(([A-Za-z\s].*)\)/)[1]

    message.embed({
      author: { name: this.client.user.tag, icon_url: this.client.user.displayAvatarURL() },
      footer: { text: message.author.tag, icon_url: message.author.displayAvatarURL() },
      timestamp: new Date(),
      title: `Information for ${escapeMarkdown(user.tag)}${user.bot === true ? ' **[BOT]**' : ''}`,
      description: user.presence.activity !== null ? `Playing **${escapeMarkdown(user.presence.activity.name)}**` : String.fromCharCode(8203),
      thumbnail: { url: user.avatarURL() !== null ? user.avatarURL() : 'http://cdn.discordapp.com/embed/avatars/0.png' },
      fields: [
        {
          'name': '📇 Tag',
          'value': escapeMarkdown(user.tag),
          'inline': true
        },
        {
          'name': '🌐 ID',
          'value': user.id,
          'inline': true
        },
        {
          'name': '🔗 Nickname',
          'value': typeof args.user.nickname === 'string' ? escapeMarkdown(args.user.nickname) : 'N/A',
          'inline': true
        },
        {
          'name': '📱 Status',
          'value': user.presence.status,
          'inline': true
        },
        {
          'name': '🤖 Bot',
          'value': user.bot,
          'inline': false
        },
        {
          'name': '🔧 Account Created',
          'value': `${moment(user.createdAt).format('llll')} ${timeZone} (${moment(user.createdAt).fromNow()})`,
          'inline': false
        },
        {
          'name': '📥 Joined Guild',
          'value': `${moment(args.user.joinedAt).format('llll')} ${timeZone} (${moment(args.user.joinedAt).fromNow()})`,
          'inline': false
        }
      ],
      color: 0x7289DA
    })
  }
}
