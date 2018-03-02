const { oneLine } = require('common-tags')

module.exports = (client, info) => {
  client.log.warn(oneLine`
    ${info}
    ${client.shard ? ` | Shard ID: ${client.shard.id}` : ''}
  `)

  // Global Warnings (persistent)
  client.temp.sqlData.push({ location: 'global', type: 'warn' })

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
          description: '```js\n' + clean(info.stack) + '\n```',
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
