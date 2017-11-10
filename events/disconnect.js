const oneLine = require('common-tags').oneLine

module.exports = (client) => {
  client.log.warn(oneLine`
    Disconnected!
    ${client.shard ? ` | Shard ID: ${client.shard.id}` : ''}
  `, 'Client')
}
