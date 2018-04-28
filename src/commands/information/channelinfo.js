const { Command } = require('discord.js-commando')
const { oneLineCommaListsAnd } = require('common-tags')
const moment = require('moment')

module.exports = class ChannelInfoCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'channelinfo',
      memberName: 'channelinfo',
      group: 'information',
      description: 'Displays information about a channel.',
      aliases: [
        'cinfo'
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
          key: 'channel',
          label: 'voice channel/text channel',
          prompt: 'What channel would you like to lookup?',
          type: 'channel'
        }
      ],
      guildOnly: true
    })
  }

  run (message, args) {
    var channel = args.channel
    if (channel.type === 'voice') {
      var channelUsers
      if (channel.members.size > 1) {
        channelUsers = oneLineCommaListsAnd`${channel.members.array()}`
      } else {
        channelUsers = 'None'
      }
      message.embed({
        author: { name: this.client.user.tag, icon_url: this.client.user.displayAvatarURL() },
        footer: { text: message.author.tag, icon_url: message.author.displayAvatarURL() },
        timestamp: new Date(),
        title: channel.name,
        description: `Since ${moment(channel.createdAt).format('llll')} ${moment.tz(moment.tz.guess()).format('z')})`,
        fields: [
          {
            'name': 'Type',
            'value': channel.type,
            'inline': true
          },
          {
            'name': 'ID',
            'value': channel.id,
            'inline': true
          },
          {
            'name': 'Position',
            'value': channel.rawPosition,
            'inline': true
          },
          {
            'name': 'Bitrate',
            'value': `${channel.bitrate}kbps`,
            'inline': true
          },
          {
            'name': 'User Count',
            'value': `${channel.members.size.toLocaleString()}/${channel.userLimit === 0 ? 'Infinity' : channel.userLimit}`,
            'inline': true
          },
          {
            'name': 'Users',
            'value': channelUsers,
            'inline': true
          }
        ],
        color: this.client.getClientColor(message)
      })
    } else if (channel.type === 'voice') {
      message.embed({
        author: { name: this.client.user.tag, icon_url: this.client.user.displayAvatarURL() },
        footer: { text: message.author.tag, icon_url: message.author.displayAvatarURL() },
        timestamp: new Date(),
        title: channel.name,
        description: `Since ${moment(channel.createdAt).format('llll')} ${moment.tz(moment.tz.guess()).format('z')})`,
        fields: [
          {
            'name': 'Type',
            'value': channel.type,
            'inline': true
          },
          {
            'name': 'ID',
            'value': channel.id,
            'inline': true
          },
          {
            'name': 'Position',
            'value': channel.rawPosition,
            'inline': true
          }
        ],
        color: this.client.getClientColor(message)
      })
    } else {
      return message.reply('please choose a valid voice or text channel.')
    }
  }
}
