const { stripIndents } = require('common-tags')

module.exports = (client, newCommand, oldCommand) => {
  client.log('info', stripIndents`
    ${client.shard ? `Shard ID: ${client.shard.id}` : ''}
  `, 'Command Register', `${newCommand.memberName} (${newCommand.groupID})`)

  // Webhook
  if (client.config.webhook.enabled) {
    if (client.config.webhook.clientEvents.commandReregister) {
      client.webhook({
        username: client.user.username,
        avatarURL: client.user.displayAvatarURL(),
        embeds: [{
          footer: { text: 'commandReregister' },
          timestamp: new Date(),
          title: `Command Reregistered${client.shard ? ` | Shard ID: ${client.shard.id}` : ''}`,
          description: `${newCommand.memberName} \`(${newCommand.groupID})\``,
          color: 0x00FFFF
        }]
      })
    }
  }
}
