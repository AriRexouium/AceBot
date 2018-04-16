const { stripIndents } = require('common-tags')

module.exports = (client, type, registry) => {
  var event = client.getFileName(__filename)
  client.log('info', stripIndents`
    ${client.shard ? `Shard ID: ${client.shard.id}` : ''}
  `, 'Type Register', type.id)

  // Webhook
  if (client.config.webhook.enabled) {
    if (client.config.webhook.clientEvents[event]) {
      client.webhook({
        username: client.user.username,
        avatarURL: client.user.displayAvatarURL(),
        embeds: [{
          footer: { text: event },
          timestamp: new Date(),
          title: `Type Registered${client.shard ? ` | Shard ID: ${client.shard.id}` : ''}`,
          description: type.id,
          color: 0x00FFFF
        }]
      })
    }
  }
}
