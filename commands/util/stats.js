const { Command } = require('discord.js-commando')
const { stripIndents } = require('common-tags')
const os = require('os-utils')
const moment = require('moment')
require('moment-duration-format')

module.exports = class StatsCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'stats',
      group: 'util',
      memberName: 'stats',
      description: 'Displays live satistics about the bot.',
      aliases: ['statistics'],
      clientPermissions: ['EMBED_LINKS'],
      throttling: {
        usages: 2,
        duration: 10
      }
    })
  }

  async run (message) {
    var totalMessagesSent; var totalMessagesRecieved; var totalMentions
    var totalCommandsUsed; var totalGuilds; var totalChannels
    var totalUsers; var isSharded

    if (!this.client.shard) {
      totalMessagesSent = await this.client.botStats.messagesSent
      totalMessagesRecieved = await this.client.botStats.messagesRecieved
      totalMentions = await this.client.botStats.clientMentions
      totalCommandsUsed = await this.client.botStats.commandsUsed
      totalGuilds = await this.client.guilds.size
      totalChannels = await this.client.channels.size
      totalUsers = await this.client.users.size
      isSharded = 'Master'
    } else {
      // Messages Sent
      var totalMessagesSentData = await this.client.shard.fetchClientValues('botStats.messagesSent')
      totalMessagesSent = await totalMessagesSentData.reduce((prev, val) => prev + val, 0)
      // Total Messages Recieved
      var totalMessagesRecievedData = await this.client.shard.fetchClientValues('botStats.messagesRecieved')
      totalMessagesRecieved = await totalMessagesRecievedData.reduce((prev, val) => prev + val, 0)
      // Total Mentions
      var totalMentionsData = await this.client.shard.fetchClientValues('botStats.clientMentions')
      totalMentions = await totalMentionsData.reduce((prev, val) => prev + val, 0)
      // Total Commands Used
      var totalCommandsUsedData = await this.client.shard.fetchClientValues('botStats.commandsUsed')
      totalCommandsUsed = await totalCommandsUsedData.reduce((prev, val) => prev + val, 0)
      // Total Guilds
      var totalGuildsData = await this.client.shard.fetchClientValues('guilds.size')
      totalGuilds = await totalGuildsData.reduce((prev, val) => prev + val, 0)
      // Total Channels
      var totalChannelsData = await this.client.shard.fetchClientValues('channels.size')
      totalChannels = await totalChannelsData.reduce((prev, val) => prev + val, 0)
      // Total Users
      var totalUsersData = await this.client.shard.fetchClientValues('users.size')
      totalUsers = await totalUsersData.reduce((prev, val) => prev + val, 0)
      // Shard Count
      isSharded = this.client.shard.count
    }
    os.cpuUsage((cpuUsage) => {
      message.embed({
        author: { name: this.client.user.tag, icon_url: this.client.user.displayAvatarURL() },
        footer: { text: message.author.tag, icon_url: message.author.displayAvatarURL() },
        timestamp: new Date(),
        title: `Client Stats${this.client.shard ? ` | Shard ID: ${this.client.shard.id}` : ''}`,
        thumbnail: { url: this.client.user.avatarURL() },
        fields: [
          {
            'name': '🕑 Uptime',
            'value': stripIndents`
            ${moment.duration(this.client.uptime).format('y [yr,] M [mo,] w [wk,] d [day,] h [hr,] m [min,] s [sec, and] S [ms]')}
            *(since ${moment().subtract(this.client.uptime, 'ms').format('L LTS')} ${new Date().toString().match(/\(([A-Za-z\s].*)\)/)[1]})*
            `,
            'inline': false
          },
          { 'name': '📤 Messages Sent', 'value': totalMessagesSent, 'inline': true },
          { 'name': '📥 Messages Recieved', 'value': totalMessagesRecieved, 'inline': true },
          { 'name': '❗ Mentions', 'value': totalMentions, 'inline': true },
          { 'name': '✏ Commands Used', 'value': totalCommandsUsed, 'inline': true },
          { 'name': '⚔ Guilds', 'value': totalGuilds, 'inline': true },
          { 'name': '📂 Channels', 'value': totalChannels, 'inline': true },
          { 'name': '💻 Users', 'value': totalUsers, 'inline': true },
          { 'name': '📦 Shards', 'value': isSharded, 'inline': true },
          {
            'name': '💾 System Stats',
            'value': stripIndents`
              **CPU Usage (%):** ${cpuUsage.toFixed(2)}
              **Memory Used:** ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB
            `,
            'inline': true
          }
        ],
        color: 0x7289DA
      })
    })
  }
}
