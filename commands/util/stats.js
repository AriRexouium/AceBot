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

  run (message) {
    os.cpuUsage((usage) => {
      message.embed({
        author: { name: this.client.user.tag, icon_url: this.client.user.displayAvatarURL() },
        footer: { text: message.author.tag, icon_url: message.author.displayAvatarURL() },
        timestamp: new Date(),
        title: `Client Stats${this.client.shard ? ` | Shard ID: ${this.client.shard.id}/${this.client.shard.count - 1}` : ''}`,
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
          { 'name': '📤 Messages Sent', 'value': this.client.botStats.messagesSent, 'inline': true },
          { 'name': '📥 Messages Recieved', 'value': this.client.botStats.messagesRecieved, 'inline': true },
          { 'name': '❗ Mentions', 'value': this.client.botStats.clientMentions, 'inline': true },
          { 'name': '✏ Commands Used', 'value': this.client.botStats.commandsUsed, 'inline': true },
          { 'name': '⚔ Guilds', 'value': this.client.guilds.size, 'inline': true },
          { 'name': '📂 Channels', 'value': this.client.channels.size, 'inline': true },
          { 'name': '💻 Users', 'value': this.client.users.size, 'inline': true },
          {
            'name': '💾 System Stats',
            'value': stripIndents`
              **Average CPU Usage (%):** ${usage.toFixed(2)}
              **Memory Used:** ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB
            `,
            'inline': true
          },
          {
            'name': '📊 Versions',
            'value': stripIndents`
            **AceBot:** ${require('../../package.json').version}
            **Node:** ${process.version}
            **Discord.js:** ${require('discord.js/package.json').version}
            **Discord.js-Commando:** ${require('discord.js-commando/package.json').version}`,
            'inline': true
          }
        ],
        color: 0x7289DA
      })
    })
  }
}
