const { Command } = require('discord.js-commando')
const { stripIndents } = require('common-tags')
const moment = require('moment')
require('moment-duration-format')
const pluralize = require('pluralize')

module.exports = class RestartCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'restart',
      memberName: 'restart',
      group: 'development',
      description: 'Restarts the bot.',
      details: 'Only the bot owner(s) can restart the bot or current shard.',
      clientPermissions: [
        'EMBED_LINKS'
      ],
      guarded: true
    })
  }

  async run (message) {
    if (this.client.shard) {
      await message.reply(`restarting ${pluralize('shard', this.client.shard.count, true)}, please wait.`)
      await this.client.shard.broadcastEval(`process.emit('message', 'shutdown')`)
    } else {
      await message.embed({
        author: { name: this.client.user.tag, icon_url: this.client.user.displayAvatarURL() },
        footer: { text: message.author.tag, icon_url: message.author.displayAvatarURL() },
        timestamp: new Date(),
        title: 'Restart requested, please wait.',
        description: (stripIndents`
          **Uptime:** ${moment.duration(this.client.uptime).format('y [yr,] M [mo,] w [wk,] d [day,] h [hr,] m [min,] s [sec, and] S [ms]')}
          **Since**: ${moment().subtract(this.client.uptime, 'ms').format('L LTS')} ${moment.tz(moment.tz.guess()).format('z')}
        `),
        color: this.client.getClientColor(message)
      })
      await process.emit('message', 'shutdown')
    }
  }
}
