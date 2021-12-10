const { Command } = require('discord.js-commando')
const columnify = require('columnify')
const moment = require('moment')
require('moment-duration-format')

module.exports = class ShardStatsCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'shardstats',
      memberName: 'shardstats',
      group: 'information',
      description: 'Display some brief information on each shard.',
      aliases: [
        'shardinfo'
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

  async run (message) {
    // Check if bot is sharded or not.
    if (!this.client.shard) {
      return message.reply('the bot is currently not sharded.')
    }
    // Get values from all shard.
    var shardInfo = await this.client.shard.broadcastEval(`[
      this.shard.id,
      this.guilds.size,
      this.channels.size,
      this.users.size,
      (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2),
      this.uptime
    ]`)
    // Create array of information of each shard.
    var shardInfoArray = []
    shardInfo.forEach(i => {
      shardInfoArray.push({
        id: i[0],
        guilds: i[1],
        channels: i[2],
        users: i[3],
        mem: i[4],
        uptime: moment.duration(i[5]).format('y [yr,] M [mo,] w [wk,] d [day,] h [hr,] m [min,] s [sec, and] S [ms]')
      })
    })
    // Send message with shard information using columns.
    message.say({
      content: columnify(shardInfoArray, {
        columnSplitter: ' │ '
      }),
      code: ''
    })
  }
}
