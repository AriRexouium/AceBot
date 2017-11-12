const log = require('./modules/log.js')
const config = require('./config/config.json')
const { ShardingManager } = require('discord.js')
const Manager = new ShardingManager('./index.js', {
  totalShards: config.shardSettings.totalShards,
  respawn: config.shardSettings.respawn,
  token: config.loginConfig.token
})

Manager.spawn().then(log.debug('Spawning shard 0...', 'SHARD MANAGER'))
Manager.on('launch', shard => log.debug(`Spawning shard ${shard.id}...`, 'SHARD MANAGER'))
