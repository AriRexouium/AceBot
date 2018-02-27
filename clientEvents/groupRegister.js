const { stripIndents } = require('common-tags')

module.exports = (client, command, registry) => {
  client.log.info(stripIndents`
    ${command.memberName} (${command.groupID})
    ${client.shard ? `Shard ID: ${client.shard.id}` : ''}
  `, 'groupRegister')

  if (client.sqlReady === true) {
  // Global Groups Registered (persistent)
    client.provider.set('global', 'groupRegister', client.provider.get('global', 'groupRegister', 0) + 1)
  }

  // Webhook
  if (client.config.webhook.enabled) {
    if (client.config.webhook.clientEvents.groupRegister) {
      client.webhook({
        content: '',
        username: client.user.username,
        avatarURL: client.user.displayAvatarURL(),
        embeds: [{
          author: { name: client.user.tag, icon_url: client.user.displayAvatarURL() },
          footer: { text: 'groupRegister' },
          timestamp: new Date(),
          title: `groupRegister${client.shard ? ` | Shard ID: ${client.shard.id}` : ''}`,
          description: stripIndents`
            **Group Registered:** ${command.memberName} (${command.groupID})
          `,
          color: 0x00FFFF
        }]
      })
    }
  }
}
