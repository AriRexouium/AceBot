process.chdir(__dirname)
const log = require('./src/modules/log.js')
const { stripIndents } = require('common-tags')

const fs = require('fs')
const yaml = require('js-yaml')
const clientConfig = yaml.safeLoad(fs.readFileSync('./src/config/client.yml', 'utf8'))
const shardConfig = yaml.safeLoad(fs.readFileSync('./src/config/shard.yml', 'utf8'))

const { ShardingManager } = require('discord.js')
const Manager = new ShardingManager('./index.js', {
  totalShards: shardConfig.totalShards,
  respawn: shardConfig.respawn,
  token: clientConfig.token
})

Manager
  .spawn()
  .on('launch', shard => {
    log('verbose', `Spawning shard ${shard.id}...`, '', 'Shard Manager')
  })

  .on('message', (shard, message) => {
    log('verbose', stripIndents`
    Eval: ${message._eval}
    ${message._error ? `Error: ${message._error}` : `Result: ${message._result}`}
    `, 'Shard Manager', `ID: ${shard.id}`)
  })
