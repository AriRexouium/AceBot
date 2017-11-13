const oneLine = require('common-tags').oneLine

module.exports = (client) => {
  client.log.warn(oneLine`
    Disconnected!
    ${client.shard ? ` | Shard ID: ${client.shard.id}` : ''}
  `, 'Client')

  // Webhook
  if (client.config.webhookConfig.enabled) {
    if (client.config.webhookConfig.clientEvents.disconnect) {
      client.webhook({
        content: '',
        username: client.user.username,
        avatarURL: client.user.displayAvatarURL(),
        embeds: [{
          author: { name: client.user.tag, icon_url: client.user.displayAvatarURL() },
          footer: { text: 'disconnect' },
          timestamp: new Date(),
          title: `disconnect${client.shard ? ` | Shard ID: ${client.shard.id}` : ''}`,
          description: `${client.shard ? `Shard ${client.shard.id}` : 'Master'} disconnected!`,
          color: 0xAAAA00
        }]
      })
    }
  }
}
