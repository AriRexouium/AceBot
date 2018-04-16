const { stripIndents } = require('common-tags')

module.exports = (client, error) => {
  var eventName = client.getFileName(__filename)
  client.temp.error = error
  client.log('error', stripIndents`
    ${client.shard ? `Shard ID: ${client.shard.id}` : '\n'}
    ${error.stack}
  `, 'Unhandled Rejection')

  // Webhook
  if (client.config.webhook.enabled) {
    if (client.config.webhook.processEvents[eventName]) {
      client.webhook({
        username: client.user.username,
        avatarURL: client.user.displayAvatarURL(),
        embeds: [{
          footer: { text: eventName },
          timestamp: new Date(),
          title: `Unhandled Rejection${client.shard ? ` | Shard ID: ${client.shard.id}` : ''}`,
          description: '```js\n' + client.cleanText(error.stack) + '\n```',
          color: 0xAA0000
        }]
      })
    }
  }

  // Sentry
  if (client.config.sentry.enabled === true) {
    var Raven = require('raven')
    Raven.config(`https://${client.config.sentry.token}@sentry.io/${client.config.sentry.id}`, {
      release: require(`${process.cwd()}/package.json`).version,
      tags: {
        shard_id: client.shard ? client.shard.id : ''
      }
    }).install()
    Raven.captureException(error)
  }
}
