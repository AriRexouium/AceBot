const { Command } = require('discord.js-commando')
const { escapeMarkdown } = require('discord.js')
const { oneLineCommaListsAnd } = require('common-tags')
const si = require('systeminformation')
const moment = require('moment')
require('moment-duration-format')

module.exports = class UserInfoCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'userinfo',
      memberName: 'userinfo',
      group: 'information',
      description: 'Displays info about a user.',
      aliases: [
        'memberinfo'
      ],
      clientPermissions: [
        'EMBED_LINKS'
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

    var userColor = (args.user).displayHexColor
    if (userColor === '#000000') { userColor = 0x7289DA } else { userColor = Number(userColor.replace('#', '0x')) }

    var userStatus
    if (user.presence.activity !== null) {
      if (user.presence.activity.type === 'PLAYING') {
        userStatus = `Playing **${escapeMarkdown(user.presence.activity.name)}**`
      } else if (user.presence.activity.type === 'STREAMING') {
        userStatus = `Streaming **${escapeMarkdown(user.presence.activity.name)}**`
      } else if (user.presence.activity.type === 'LISTENING') {
        userStatus = `Listening to **${escapeMarkdown(user.presence.activity.name)}**`
      } else if (user.presence.activity.type === 'WATCHING') {
        userStatus = `Watching **${escapeMarkdown(user.presence.activity.name)}**`
      }
      if (user.presence.activity.url !== null) { userStatus = `[${userStatus}](${user.presence.activity.url})` }
    } else {
      userStatus = '*User is not doing anything at this time.*'
    }

    var userRoles
    if (args.user.roles.size > 1) {
      userRoles = oneLineCommaListsAnd`${args.user.roles.array().slice(1).sort((a, b) => a.comparePositionTo(b)).reverse().map(role => `**\`${role.name}\`**`)}`
    } else {
      userRoles = 'N/A'
    }

    message.embed({
      author: { name: this.client.user.tag, icon_url: this.client.user.displayAvatarURL() },
      footer: { text: message.author.tag, icon_url: message.author.displayAvatarURL() },
      timestamp: new Date(),
      title: `Information for ${escapeMarkdown(user.tag)}${user.bot === true ? ' **[BOT]**' : ''}`,
      description: userStatus,
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
          'name': '📱 Status',
          'value': user.presence.status,
          'inline': true
        },
        {
          'name': '🔎 Identity',
          'value': user.bot === true ? 'Bot' : 'User',
          'inline': true
        },
        {
          'name': `🔧 Account Created - (${moment(user.createdAt).fromNow()})`,
          'value': `${moment(user.createdAt).format('llll')} ${si.time().timezone}`,
          'inline': false
        },
        {
          'name': `📥 Joined Guild - (${moment(args.user.joinedAt).fromNow()})`,
          'value': `${moment(args.user.joinedAt).format('llll')} ${si.time().timezone}`,
          'inline': false
        },
        {
          'name': `🔖 Roles - (${args.user.roles.size - 1})`,
          'value': userRoles,
          'inline': false
        }
      ],
      color: userColor
    })
  }
}
