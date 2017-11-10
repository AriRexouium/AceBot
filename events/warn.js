const oneLine = require('common-tags').oneLine

module.exports = (client, warn) => {
  client.log.warn(oneLine`
    ${warn}
    ${client.shard ? ` | Shard ID: ${client.shard.id}` : ''}
  `)
}
