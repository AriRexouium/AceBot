const { oneLine } = require('common-tags')

module.exports = (client) => {
  client.log('verbose', oneLine`
    ${client.shard ? ` | Shard ID: ${client.shard.id}` : ''}
  `, 'Client', 'Reconnecting')

  // Webhook
  if (client.config.webhook.enabled) {
    if (client.config.webhook.clientEvents.reconnecting) {
      client.webhook({
        username: client.user.username,
        avatarURL: client.user.displayAvatarURL(),
        embeds: [{
          footer: { text: 'reconnecting' },
          timestamp: new Date(),
          title: client.shard ? `Shard ${client.shard.id} is reconnecting.` : 'Reconnecting!',
          color: 0xFFFF00
        }]
      })
    }
  }
}
