const { stripIndents } = require('common-tags')

module.exports = (client, command, registry) => {
  client.log.info(stripIndents`
    ${command.memberName} (${command.groupID})
    ${client.shard ? `Shard ID: ${client.shard.id}` : ''}
  `, 'typeRegister')

  // Global Types Registered (persistent)
  client.provider.set('global', 'typeRegister', client.provider.get('global', 'typeRegister', 0) + 1)

  // Webhook
  if (client.config.webhook.enabled) {
    if (client.config.webhook.clientEvents.typeRegister) {
      client.webhook({
        content: '',
        username: client.user.username,
        avatarURL: client.user.displayAvatarURL(),
        embeds: [{
          author: { name: client.user.tag, icon_url: client.user.displayAvatarURL() },
          footer: { text: 'typeRegister' },
          timestamp: new Date(),
          title: `typeRegister${client.shard ? ` | Shard ID: ${client.shard.id}` : ''}`,
          description: stripIndents`
            **Type Registered:** ${command.memberName} (${command.groupID})
          `,
          color: 0x00FFFF
        }]
      })
    }
  }
}
