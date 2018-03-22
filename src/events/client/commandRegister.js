const { stripIndents } = require('common-tags')

module.exports = (client, command, registry) => {
  client.log('info', stripIndents`
    ${client.shard ? `Shard ID: ${client.shard.id}` : ''}
  `, 'Command Register', `${command.memberName} (${command.groupID})`)

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
