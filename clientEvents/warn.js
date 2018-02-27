const { oneLine } = require('common-tags')

module.exports = (client, warn) => {
  client.log.warn(oneLine`
    ${warn}
    ${client.shard ? ` | Shard ID: ${client.shard.id}` : ''}
  `)

  if (client.sqlReady === true) {
  // Global Warnings (persistent)
    client.provider.set('global', 'warn', client.provider.get('global', 'warn', 0) + 1)
  }

  // Webhook
  if (client.config.webhook.enabled) {
    if (client.config.webhook.clientEvents.warn) {
      client.webhook({
        content: '',
        username: client.user.username,
        avatarURL: client.user.displayAvatarURL(),
        embeds: [{
          author: { name: client.user.tag, icon_url: client.user.displayAvatarURL() },
          footer: { text: 'warn' },
          timestamp: new Date(),
          title: `warn${client.shard ? ` | Shard ID: ${client.shard.id}` : ''}`,
          description: '```js\n' + clean(warn.stack) + '\n```',
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
