const oneLine = require('common-tags').oneLine

module.exports = (client) => {
  client.log.warn(oneLine`
    You are being rate limited!
    ${client.shard ? ` | Shard ID: ${client.shard.id}` : ''}
  `)
}
