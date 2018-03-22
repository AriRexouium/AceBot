const { stripIndents } = require('common-tags')

module.exports = (client, command) => {
  client.log('info', stripIndents`
    ${client.shard ? `Shard ID: ${client.shard.id}` : ''}
  `, 'Command Unregister', `${command.memberName} (${command.groupID})`)

  // Webhook
  if (client.config.webhook.enabled) {
    if (client.config.webhook.clientEvents.commandUnregister) {
      client.webhook({
        content: '',
        username: client.user.username,
        avatarURL: client.user.displayAvatarURL(),
        embeds: [{
          author: { name: client.user.tag, icon_url: client.user.displayAvatarURL() },
          footer: { text: 'commandUnregister' },
          timestamp: new Date(),
          title: `commandUnregister${client.shard ? ` | Shard ID: ${client.shard.id}` : ''}`,
          description: stripIndents`
            **Command Unregistered:** ${command.memberName} (${command.groupID})
          `,
          color: 0x00FFFF
        }]
      })
    }
  }
}
