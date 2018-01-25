const log = require('./modules/log.js')
const fs = require('fs')
const yaml = require('js-yaml')
const config = yaml.safeLoad(fs.readFileSync('./config/config.yaml', 'utf8'))
const { ShardingManager } = require('discord.js')
const Manager = new ShardingManager('./index.js', {
  totalShards: config.shardConfig.totalShards,
  respawn: config.shardConfig.respawn,
  token: config.loginConfig.token
})

Manager.spawn().then(log.debug('Spawning shard 0...', 'SHARD MANAGER')).catch(error => log.error(error.stack, 'SHARD MANAGER'))
Manager.on('launch', shard => log.debug(`Spawning shard ${shard.id}...`, 'SHARD MANAGER'))
