const { Command } = require('discord.js-commando')
const { stripIndents } = require('common-tags')
const si = require('systeminformation')
const moment = require('moment')
require('moment-duration-format')
const pluralize = require('pluralize')

module.exports = class RestartCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'restart',
      memberName: 'restart',
      group: 'bot-staff',
      description: 'Restarts the bot.',
      details: 'Only the bot owner(s) can restart the bot or current shard.',
      clientPermissions: ['EMBED_LINKS'],
      ownerOnly: true,
      guarded: true
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
      await message.reply(`restarting ${pluralize('shard', this.client.shard.count, true)}!`)
      await this.client.log.info(`Restarting ${pluralize('shard', this.client.shard.count, true)}!`, 'Restart')
      await this.client.shard.broadcastEval('process.exit(0)')
    } else {
      await message.embed({
        author: { name: this.client.user.tag, icon_url: this.client.user.displayAvatarURL() },
        footer: { text: message.author.tag, icon_url: message.author.displayAvatarURL() },
        timestamp: new Date(),
        title: 'Restart requested, please wait.',
        description: (stripIndents`
          **Uptime:** ${moment.duration(this.client.uptime).format('y [yr,] M [mo,] w [wk,] d [day,] h [hr,] m [min,] s [sec, and] S [ms]')}
          **Since**: ${moment().subtract(this.client.uptime, 'ms').format('L LTS')} ${si.time().timezone}
        `),
        color: clientColor
      })
      await this.client.log.info('Restarting!', 'Restart')
      await this.client.destroy()
      await process.exit(0)
    }
  }
}
