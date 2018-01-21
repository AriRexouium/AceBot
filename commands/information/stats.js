const { Command } = require('discord.js-commando')
const { stripIndents } = require('common-tags')
const os = require('os-utils')
const moment = require('moment')
require('moment-duration-format')

module.exports = class StatsCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'stats',
      memberName: 'stats',
      group: 'information',
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
    if (this.client.shard) {
      // Messages Sent
      var totalMessagesSentData = await this.client.shard.fetchClientValues('botStats.messagesSent')
      var totalMessagesSent = await totalMessagesSentData.reduce((prev, val) => prev + val, 0)
      // Total Messages Recieved
      var totalMessagesRecievedData = await this.client.shard.fetchClientValues('botStats.messagesRecieved')
      var totalMessagesRecieved = await totalMessagesRecievedData.reduce((prev, val) => prev + val, 0)
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
    }

    os.cpuUsage((cpuUsage) => {
      message.embed({
        author: { name: this.client.user.tag, icon_url: this.client.user.displayAvatarURL() },
        footer: { text: message.author.tag, icon_url: message.author.displayAvatarURL() },
        timestamp: new Date(),
        title: `Client Stats${this.client.shard ? ` for Shard ${this.client.shard.id}` : ''}`,
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
          {
            'name': '📤 Messages Sent',
            'value': !this.client.shard
              ? this.client.botStats.messagesSent
              : `**Current Shard:** ${this.client.botStats.messagesSent}\n**All Shards:** ${totalMessagesSent}`,
            'inline': true
          },
          {
            'name': '📥 Messages Recieved',
            'value': !this.client.shard
              ? this.client.botStats.messagesRecieved
              : `**Current Shard:** ${this.client.botStats.messagesRecieved}\n**All Shards:** ${totalMessagesRecieved}`,
            'inline': true
          },
          {
            'name': '❗ Mentions',
            'value': !this.client.shard
              ? this.client.botStats.clientMentions
              : `**Current Shard:** ${this.client.botStats.clientMentions}\n**All Shards:** ${totalMentions}`,
            'inline': true
          },
          {
            'name': '✏ Commands Used',
            'value': !this.client.shard
              ? this.client.botStats.commandsUsed
              : `**Current Shard:** ${this.client.botStats.commandsUsed}\n**All Shards:** ${totalCommandsUsed}`,
            'inline': true
          },
          {
            'name': '⚔ Guilds',
            'value': !this.client.shard
              ? this.client.guilds.size
              : `**Current Shard:** ${this.client.guilds.size}\n**All Shards:** ${totalGuilds}`,
            'inline': true
          },
          {
            'name': '📂 Channels',
            'value': !this.client.shard
              ? this.client.channels.size
              : `**Current Shard:** ${this.client.channels.size}\n**All Shards:** ${totalChannels}`,
            'inline': true
          },
          {
            'name': '💻 Users',
            'value': !this.client.shard
              ? this.client.users.size
              : `**Current Shard:** ${this.client.users.size}\n**All Shards:** ${totalUsers}`,
            'inline': true
          },
          {
            'name': '📦 Shards',
            'value': !this.client.shard
              ? '*(No Active Shards)*'
              : `**Current Shard:** ${this.client.shard.id}\n**All Shards:** ${this.client.shard.count}`,
            'inline': true
          },
          {
            'name': '💾 System Stats',
            'value': stripIndents`
              **System OS:** ${os.platform()}
              **CPU Usage (%):** ${cpuUsage.toFixed(2)}
              **Memory Used:** ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB Used **/** ${os.totalmem().toFixed(2)} Total MB
            `,
            'inline': true
          }
        ],
        color: 0x7289DA
      })
    })
  }
}
