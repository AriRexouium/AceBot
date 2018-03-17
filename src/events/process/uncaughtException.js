const { stripIndents } = require('common-tags')

module.exports = (client, error) => {
  client.log.error(stripIndents`
    ${client.shard ? `Shard ID: ${client.shard.id}` : '\n'}
    ${error.stack}
  `, 'uncaughtException')

  // Webhook
  if (client.config.webhook.enabled) {
    if (client.config.webhook.processEvents.uncaughtException) {
      client.webhook({
        content: '',
        username: client.user.username,
        avatarURL: client.user.displayAvatarURL(),
        embeds: [{
          author: { name: client.user.tag, icon_url: client.user.displayAvatarURL() },
          footer: { text: 'uncaughtException' },
          timestamp: new Date(),
          title: `uncaughtException${client.shard ? ` | Shard ID: ${client.shard.id}` : ''}`,
          description: '```js\n' + clean(error.stack) + '\n```',
          color: 0xAA0000
        }]
      })
    }
  }

  // Sentry
  if (client.config.sentry.enabled === true) {
    var Raven = require('raven')
    Raven.config(`https://${client.config.sentry.token}@sentry.io/${client.config.sentry.id}`, {
      release: require('../package.json').version,
      tags: {
        shard_id: client.shard ? client.shard.id : ''
      }
    }).install()
    Raven.captureException(error)
  }
}

/**
 * Adds a nospace character to embed breaking text.
 * @param {string} text The text to clean.
 * @return {string} The text after it was cleaned.
 */
var clean = (text) => {
  if (typeof (text) === 'string') {
    return text
      .replace(/`/g, '`' + String.fromCharCode(8203))
      .replace(/@/g, '@' + String.fromCharCode(8203))
      .replace(/#/g, '#' + String.fromCharCode(8203))
  } else {
    return text
  }
}
