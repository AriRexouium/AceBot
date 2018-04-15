const { stripIndents } = require('common-tags')

module.exports = (client, type, registry) => {
  client.log('info', stripIndents`
    ${client.shard ? `Shard ID: ${client.shard.id}` : ''}
  `, 'Type Register', `${type.memberName} (${type.groupID})`)

  // Webhook
  if (client.config.webhook.enabled) {
    if (client.config.webhook.clientEvents.typeRegister) {
      client.webhook({
        username: client.user.username,
        avatarURL: client.user.displayAvatarURL(),
        embeds: [{
          footer: { text: 'typeRegister' },
          timestamp: new Date(),
          title: `Type Registered${client.shard ? ` | Shard ID: ${client.shard.id}` : ''}`,
          description: type.id,
          color: 0x00FFFF
        }]
      })
    }
  }
}
