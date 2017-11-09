const oneLine = require('common-tags').oneLine

module.exports = (client, message, group, enabled) => {
  client.log.info(oneLine`
    Group ${group.id}
    ${enabled ? 'enabled' : 'disabled'}
    ${message.guild ? `in guild ${message.guild.name} (${message.guild.id})` : 'globally'}.
    ${client.shard ? `\nShard ID: ${client.shard.id}` : ''}    
  `)
}
