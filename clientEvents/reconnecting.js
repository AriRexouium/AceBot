const oneLine = require('common-tags').oneLine

module.exports = (client) => {
  client.log.warn(oneLine`
    Reconnecting...
    ${client.shard ? ` | Shard ID: ${client.shard.id}` : ''}
  `, 'Client')

  // Webhook
  if (client.config.webhookConfig.enabled) {
    if (client.config.webhookConfig.clientEvents.reconnecting) {
      client.webhook({
        content: '',
        username: client.user.username,
        avatarURL: client.user.displayAvatarURL(),
        embeds: [{
          author: { name: client.user.tag, icon_url: client.user.displayAvatarURL() },
          footer: { text: 'reconnecting' },
          timestamp: new Date(),
          title: `reconnecting${client.shard ? ` | Shard ID: ${client.shard.id}` : ''}`,
          description: `${client.shard ? `Shard ${client.shard.id}` : 'Master'} is reconnecting...`,
          color: 0xFFFF00
        }]
      })
    }
  }
}
