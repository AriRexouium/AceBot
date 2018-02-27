const { stripIndents } = require('common-tags')
const fs = require('fs')
const yaml = require('js-yaml')
const sentryConfig = yaml.safeLoad(fs.readFileSync('./config/sentry.yml', 'utf8'))

module.exports = (client, error) => {
  client.log.error(stripIndents`\n
    ${client.shard ? `Shard ID: ${client.shard.id}\n` : ''}
    ${error.stack}
  `)

  if (client.sqlReady === true) {
  // Global Errors (persistent)
    client.provider.set('global', 'error', client.provider.get('global', 'error', 0) + 1)
  }

  // Webhook
  if (client.config.webhook.enabled) {
    if (client.config.webhook.clientEvents.error) {
      client.webhook({
        content: '',
        username: client.user.username,
        avatarURL: client.user.displayAvatarURL(),
        embeds: [{
          author: { name: client.user.tag, icon_url: client.user.displayAvatarURL() },
          footer: { text: 'error' },
          timestamp: new Date(),
          title: `c${client.shard ? ` | Shard ID: ${client.shard.id}` : ''}`,
          description: '```js\n' + clean(error.stack) + '\n```',
          color: 0xAA0000
        }]
      })
    }
  }

  // Sentry
  if (sentryConfig.enabled === true) {
    var Raven = require('raven')
    Raven.config(`https://${sentryConfig.token}@sentry.io/${sentryConfig.id}`, {
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
