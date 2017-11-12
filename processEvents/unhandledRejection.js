const { stripIndents } = require('common-tags')

module.exports = (client, error) => {
  client.log.error(stripIndents`\n
    ${client.shard ? `Shard ID: ${client.shard.id}\n` : ''}
    ${error.stack}
  `, 'unhandledRejection')
}
