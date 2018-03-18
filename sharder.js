const log = require(`${process.cwd}/package.json`)
const fs = require('fs')
const yaml = require('js-yaml')
const clientConfig = yaml.safeLoad(fs.readFileSync('./config/client.yml', 'utf8'))
const shardConfig = yaml.safeLoad(fs.readFileSync('./config/shard.yml', 'utf8'))
const { ShardingManager } = require('discord.js')
const Manager = new ShardingManager('./index.js', {
  totalShards: shardConfig.totalShards,
  respawn: shardConfig.respawn,
  token: clientConfig.token
})

Manager.spawn().then(log.debug('Spawning shard 0...', 'SHARD MANAGER')).catch(error => log.error(error.stack, 'SHARD MANAGER'))
Manager.on('launch', shard => log.debug(`Spawning shard ${shard.id}...`, 'SHARD MANAGER'))
