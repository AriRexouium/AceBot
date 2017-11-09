const oneLine = require('common-tags').oneLine

module.exports = (client) => {
  client.log.warn(oneLine`
    Reconnecting...
    ${client.shard ? ` | Shard ID: ${client.shard.id}` : ''}    
  `, 'Client')
}
