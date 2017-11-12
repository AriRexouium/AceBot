const { stripIndents } = require('common-tags')

module.exports = (client, warning) => {
  client.log.error(stripIndents`\n
    ${client.shard ? `Shard ID: ${client.shard.id}\n` : ''}
    ${warning.stack}
  `, 'warning')
}
