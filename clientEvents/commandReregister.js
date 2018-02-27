const { stripIndents } = require('common-tags')

module.exports = (client, command, registry) => {
  client.log.info(stripIndents`
    ${command.memberName} (${command.groupID})
    ${client.shard ? `Shard ID: ${client.shard.id}` : ''}
  `, 'commandReregister')

  if (client.sqlReady === true) {
  // Global Commands Reregistered (persistent)
    client.provider.set('global', 'commandReregister', client.provider.get('global', 'commandReregister', 0) + 1)
  }

  // Webhook
  if (client.config.webhook.enabled) {
    if (client.config.webhook.clientEvents.commandReregister) {
      client.webhook({
        content: '',
        username: client.user.username,
        avatarURL: client.user.displayAvatarURL(),
        embeds: [{
          author: { name: client.user.tag, icon_url: client.user.displayAvatarURL() },
          footer: { text: 'commandReregister' },
          timestamp: new Date(),
          title: `commandReregister${client.shard ? ` | Shard ID: ${client.shard.id}` : ''}`,
          description: stripIndents`
            **Command Reregistered:** ${command.memberName} (${command.groupID})
          `,
          color: 0x00FFFF
        }]
      })
    }
  }
}
