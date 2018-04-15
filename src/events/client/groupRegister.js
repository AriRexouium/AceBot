const { stripIndents } = require('common-tags')

module.exports = (client, group, registry) => {
  client.log('info', stripIndents`
    ${client.shard ? `Shard ID: ${client.shard.id}` : ''}
  `, 'Group Register', `${group.memberName} (${group.groupID})`)

  // Webhook
  if (client.config.webhook.enabled) {
    if (client.config.webhook.clientEvents.groupRegister) {
      client.webhook({
        username: client.user.username,
        avatarURL: client.user.displayAvatarURL(),
        embeds: [{
          footer: { text: 'groupRegister' },
          timestamp: new Date(),
          title: `Group Registered${client.shard ? ` | Shard ID: ${client.shard.id}` : ''}`,
          description: `${group.memberName} (${group.groupID})`,
          color: 0x00FFFF
        }]
      })
    }
  }
}
