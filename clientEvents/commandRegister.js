const { stripIndents } = require('common-tags')

module.exports = (client, command, registry) => {
  client.log.info(stripIndents`
    ${command.memberName} (${command.groupID})
    ${client.shard ? `Shard ID: ${client.shard.id}` : ''}
  `, 'commandRegister')

  if (client.sqlReady === true) {
  // Global Commands Registered (persistent)
    client.provider.set('global', 'commandRegister', client.provider.get('global', 'commandRegister', 0) + 1)
  }

  // Webhook
  if (client.config.webhook.enabled) {
    if (client.config.webhook.clientEvents.commandRegister) {
      client.webhook({
        content: '',
        username: client.user.username,
        avatarURL: client.user.displayAvatarURL(),
        embeds: [{
          author: { name: client.user.tag, icon_url: client.user.displayAvatarURL() },
          footer: { text: 'commandRegister' },
          timestamp: new Date(),
          title: `commandRegister${client.shard ? ` | Shard ID: ${client.shard.id}` : ''}`,
          description: stripIndents`
            **Command Registered:** ${command.memberName} (${command.groupID})
          `,
          color: 0x00FFFF
        }]
      })
    }
  }
}
