const { stripIndents } = require('common-tags')

module.exports = (client, newCommand, oldCommand) => {
  client.log.info(stripIndents`
    ${newCommand.memberName} (${newCommand.groupID})
    ${client.shard ? `Shard ID: ${client.shard.id}` : ''}
  `, 'commandReregister')

  // Global Commands Reregistered (persistent)
  client.temp.sqlData.push({ location: 'global', type: 'commandReregister' })

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
            **Command Reregistered:** ${newCommand.memberName} (${newCommand.groupID})
          `,
          color: 0x00FFFF
        }]
      })
    }
  }
}
