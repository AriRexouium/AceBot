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
      aliases: ['statistics'],
      clientPermissions: ['EMBED_LINKS'],
      throttling: {
        usages: 2,
        duration: 10
      }
    })
  }

  async run (message) {
    var clientColor
    if (message.guild) {
      clientColor = message.guild.members.get(this.client.user.id).displayHexColor
      if (clientColor === '#000000') { clientColor = 0x7289DA } else { clientColor = Number(clientColor.replace('#', '0x')) }
    } else {
      clientColor = 0x7289DA
    }

    if (this.client.shard) {
      // Messages Sent
      var totalMessagesSentData = await this.client.shard.fetchClientValues('botStats.messagesSent')
      var totalMessagesSent = await totalMessagesSentData.reduce((prev, val) => prev + val, 0)
      // Total Messages Received
      var totalMessagesReceivedData = await this.client.shard.fetchClientValues('botStats.messagesReceived')
      var totalMessagesReceived = await totalMessagesReceivedData.reduce((prev, val) => prev + val, 0)
      // Total Mentions
      var totalMentionsData = await this.client.shard.fetchClientValues('botStats.clientMentions')
      var totalMentions = await totalMentionsData.reduce((prev, val) => prev + val, 0)
      // Total Commands Used
      var totalCommandsUsedData = await this.client.shard.fetchClientValues('botStats.commandsUsed')
      var totalCommandsUsed = await totalCommandsUsedData.reduce((prev, val) => prev + val, 0)
      // Total Guilds
      var totalGuildsData = await this.client.shard.fetchClientValues('guilds.size')
      var totalGuilds = await totalGuildsData.reduce((prev, val) => prev + val, 0)
      // Total Channels
      var totalChannelsData = await this.client.shard.fetchClientValues('channels.size')
      var totalChannels = await totalChannelsData.reduce((prev, val) => prev + val, 0)
      // Total Users
      var totalUsersData = await this.client.shard.fetchClientValues('users.size')
      var totalUsers = await totalUsersData.reduce((prev, val) => prev + val, 0)
      // Total Emojis
      var totalEmojisData = await this.client.shard.fetchClientValues('emojis.size')
      var totalEmojis = await totalEmojisData.reduce((prev, val) => prev + val, 0)
    }

    os.cpuUsage(async (cpuUsage) => {
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
              Sent: **${this.client.botStats.messagesSent}** [${totalMessagesSent}]
              Received: **${this.client.botStats.messagesReceived}** [${totalMessagesReceived}]
              Commands: **${this.client.botStats.commandsUsed}** [${totalCommandsUsed}]
              Bot Mentions: **${this.client.botStats.clientMentions}** [${totalMentions}]
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
              Guilds: **${this.client.guilds.size}** [${totalGuilds}]
              Channels: **${this.client.channels.size}** [${totalChannels}]
              Users: **${this.client.users.size}** [${totalUsers}]
              Emojis: **${this.client.emojis.size}** [${totalEmojis}]
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
