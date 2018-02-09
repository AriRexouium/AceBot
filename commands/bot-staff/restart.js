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
      group: 'bot-staff',
      description: 'Restarts the bot.',
      details: 'Only the bot owner(s) can restart the bot or current shard.',
      clientPermissions: ['EMBED_LINKS'],
      ownerOnly: true,
      guarded: true
    })
  }

  async run (message) {
    /**
     * TODO: Add support for restarting all shards.
     * NOTE: This might not be possible because `process.exit()` can't be called with `broadcastEval()`.
     */
    if (this.client.shard) {
      await message.reply(`restarting ${pluralize('shard', this.client.shard.count, true)}!`)
      await this.client.log.info(`Restarting ${pluralize('shard', this.client.shard.count, true)}!`, 'Restart')
      await this.client.shard.broadcastEval('process.exit(0)')
    } else {
      await message.say({
        content: '',
        embed: {
          author: { name: this.client.user.tag, icon_url: this.client.user.displayAvatarURL() },
          footer: { text: message.author.tag, icon_url: message.author.displayAvatarURL() },
          timestamp: new Date(),
          title: 'Restart requested, please wait.',
          description: (stripIndents`
            **Uptime:** ${moment.duration(this.client.uptime).format('y [yr,] M [mo,] w [wk,] d [day,] h [hr,] m [min,] s [sec, and] S [ms]')}
            **Since**: ${moment().subtract(this.client.uptime, 'ms').format('L LTS')} ${new Date().toString().match(/\(([A-Za-z\s].*)\)/)[1]}
          `),
          color: 0x7289DA
        }
      })
      await this.client.log.info('Restarting!', 'Restart')
      await this.client.destroy()
      await process.exit(0)
    }
  }
}
