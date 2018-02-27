const { stripIndents } = require('common-tags')

module.exports = (client, warning) => {
  client.log.warn(stripIndents`
    ${client.shard ? `Shard ID: ${client.shard.id}` : '\n'}
    ${warning.stack}
  `, 'process')

  // Global Warnings (persistent)
  client.provider.set('global', 'processWarning', client.provider.get('global', 'processWarning', 0) + 1)

  // Webhook
  if (client.config.webhook.enabled) {
    if (client.config.webhook.processEvents.warning) {
      client.webhook({
        content: '',
        username: client.user.username,
        avatarURL: client.user.displayAvatarURL(),
        embeds: [{
          author: { name: client.user.tag, icon_url: client.user.displayAvatarURL() },
          footer: { text: 'processWarning' },
          timestamp: new Date(),
          title: `processWarning${client.shard ? ` | Shard ID: ${client.shard.id}` : ''}`,
          description: '```js\n' + clean(warning.stack) + '\n```',
          color: 0xFFFF00
        }]
      })
    }
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
