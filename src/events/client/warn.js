const { oneLine } = require('common-tags')

module.exports = (client, info) => {
  client.log('warn', oneLine`
    ${info}
    ${client.shard ? ` | Shard ID: ${client.shard.id}` : ''}
  `)

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
          description: '```js\n' + client.cleanText(info.stack) + '\n```',
          color: 0xFFFF00
        }]
      })
    }
  }
}
