const { stripIndents } = require('common-tags')

module.exports = (client, type, registry) => {
  client.log.info(stripIndents`
    ${type.memberName} (${type.groupID})
    ${client.shard ? `Shard ID: ${client.shard.id}` : ''}
  `, 'typeRegister')

  // Global Types Registered (persistent)
  client.temp.sqlData.push({ location: 'global', type: 'typeRegister' })

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
            **Type Registered:** ${type.memberName} (${type.groupID})
          `,
          color: 0x00FFFF
        }]
      })
    }
  }
}
