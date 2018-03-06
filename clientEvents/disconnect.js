const { oneLine } = require('common-tags')

module.exports = (client, event) => {
  client.log.warn(oneLine`
    Disconnected!
    ${client.shard ? ` | Shard ID: ${client.shard.id}` : ''}
  `, 'Client')

  // Webhook
  if (client.config.webhook.enabled) {
    if (client.config.webhook.clientEvents.disconnect) {
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
          color: 0xFFFF00
        }]
      })
    }
  }
}
