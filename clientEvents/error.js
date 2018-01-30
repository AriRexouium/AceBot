const { stripIndents } = require('common-tags')

module.exports = (client, error) => {
  client.log.error(stripIndents`\n
    ${client.shard ? `Shard ID: ${client.shard.id}\n` : ''}
    ${error.stack}
  `)

  // Webhook
  if (client.config.webhookConfig.enabled) {
    if (client.config.webhookConfig.clientEvents.error) {
      client.webhook({
        content: '',
        username: client.user.username,
        avatarURL: client.user.displayAvatarURL(),
        embeds: [{
          author: { name: client.user.tag, icon_url: client.user.displayAvatarURL() },
          footer: { text: 'error' },
          timestamp: new Date(),
          title: `error${client.shard ? ` | Shard ID: ${client.shard.id}` : ''}`,
          description: '```js\n' + clean(error.stack) + '\n```',
          color: 0xAA0000
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
