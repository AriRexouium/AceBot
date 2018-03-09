const { Command } = require('discord.js-commando')
const { stripIndents } = require('common-tags')
const si = require('systeminformation')
const os = require('os-utils')
const moment = require('moment')
require('moment-duration-format')

module.exports = class StatsCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'stats',
      memberName: 'stats',
      group: 'information',
      description: 'Displays live statistics about the bot.',
      aliases: [
        'statistics'
      ],
      clientPermissions: [
        'EMBED_LINKS'
      ],
      throttling: {
        usages: 2,
        duration: 10
      }
    })
  }

  run (message) {
    var clientColor
    if (message.guild) {
      clientColor = message.guild.members.get(this.client.user.id).displayHexColor
      if (clientColor === '#000000') { clientColor = 0x7289DA } else { clientColor = Number(clientColor.replace('#', '0x')) }
    } else {
      clientColor = 0x7289DA
    }

    if (this.client.shard) {
      var data = [
        { name: 'totalMessagesSent', code: 'botStats.messagesSent' },
        { name: 'totalMessagesReceived', code: 'botStats.messagesReceived' },
        { name: 'totalClientMentions', code: 'botStats.clientMentions' },
        { name: 'totalCommandsUsed', code: 'botStats.commandsUsed' },
        { name: 'totalGuilds', code: 'guilds.size' },
        { name: 'totalChannels', code: 'channels.size' },
        { name: 'totalUsers', code: 'users.size' },
        { name: 'totalEmojis', code: 'emojis.size' }
      ]
      var stats = {}
      data.forEach(element => {
        this.client.shard.fetchClientValues(element.code).then(async results => {
          stats[element.name] = await results.reduce((prev, val) => prev + val, 0)
        })
      })
    }
    os.cpuUsage(cpuUsage => {
      message.embed({
        author: { name: this.client.user.tag, icon_url: this.client.user.displayAvatarURL() },
        footer: { text: message.author.tag, icon_url: message.author.displayAvatarURL() },
        timestamp: new Date(),
        title: 'Client Stats',
        thumbnail: { url: this.client.user.avatarURL() },
        fields: [
          {
            'name': '🕑 Uptime',
            'value': stripIndents`
            ${moment.duration(this.client.uptime).format('y [yr,] M [mo,] w [wk,] d [day,] h [hr,] m [min,] s [sec, and] S [ms]')}
            *(since ${moment().subtract(this.client.uptime, 'ms').format('L LTS')} ${si.time().timezone})*
            `,
            'inline': false
          },
          {
            'name': '✉ Messages',
            'value': !this.client.shard
              ? stripIndents`
              Sent: **${this.client.botStats.messagesSent}**
              Received: **${this.client.botStats.messagesReceived}**
              Commands: **${this.client.botStats.commandsUsed}**
              Bot Mentions: **${this.client.botStats.clientMentions}**
              `
              : stripIndents`
              Sent: **${this.client.botStats.messagesSent}** [${stats.totalMessagesSent}]
              Received: **${this.client.botStats.messagesReceived}** [${stats.totalMessagesReceived}]
              Commands: **${this.client.botStats.commandsUsed}** [${stats.totalCommandsUsed}]
              Bot Mentions: **${this.client.botStats.clientMentions}** [${stats.totalClientMentions}]
              `,
            'inline': true
          },
          {
            'name': '🌐 Global Stats',
            'value': !this.client.shard
              ? stripIndents`
              Guilds: **${this.client.guilds.size}**
              Channels: **${this.client.channels.size}**
              Users: **${this.client.users.size}**
              Emojis: **${this.client.emojis.size}**
              `
              : stripIndents`
              Shards: **${this.client.shard.id + 1} / ${this.client.shard.count}** [${this.client.shard.id}]
              Guilds: **${this.client.guilds.size}** [${stats.totalGuilds}]
              Channels: **${this.client.channels.size}** [${stats.totalChannels}]
              Users: **${this.client.users.size}** [${stats.totalUsers}]
              Emojis: **${this.client.emojis.size}** [${stats.totalEmojis}]
              `,
            'inline': true
          },
          {
            'name': '💾 System',
            'value': stripIndents`
              OS: **${os.platform()}** (${process.arch})
              CPU Usage (%): **${cpuUsage.toFixed(2).replace('.', '')}**
              Node Version: **${process.version}**
            `,
            'inline': true
          },
          {
            'name': '💾 Memory (MB)',
            'value': stripIndents`
              Used: **${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}**
              Available: **${os.freemem().toFixed(2)}**
              Total: **${os.totalmem().toFixed(2)}**
            `,
            'inline': true
          }
        ],
        color: clientColor
      })
    })
  }
}
