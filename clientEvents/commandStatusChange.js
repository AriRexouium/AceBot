const oneLine = require('common-tags').oneLine

module.exports = (client, guild, command, enabled) => {
  client.log.info(oneLine`
    Command ${command.memberName} (${command.groupID})
    ${enabled ? 'enabled' : 'disabled'}
    ${guild ? `in guild ${guild.name} (${guild.id})` : 'globally'}.
    ${client.shard ? `\nShard ID: ${client.shard.id}` : ''}
  `, 'commandStatusChange')

  // Webhook
  if (client.config.webhookConfig.enabled) {
    if (client.config.webhookConfig.clientEvents.commandStatusChange) {
      client.webhook({
        content: '',
        username: client.user.username,
        avatarURL: client.user.displayAvatarURL(),
        embeds: [{
          author: { name: client.user.tag, icon_url: client.user.displayAvatarURL() },
          footer: { text: 'commandStatusChange' },
          timestamp: new Date(),
          title: `commandStatusChange${client.shard ? ` | Shard ID: ${client.shard.id}` : ''}`,
          description: oneLine`
            Command ${command.memberName} \`(${command.groupID})\`
            ${enabled ? 'enabled' : 'disabled'}
            ${guild ? `in guild ${guild.name} \`(${guild.id})\`` : 'globally'}.
            ${client.shard ? `\nShard ID: ${client.shard.id}` : ''}
          `,
          color: 0x00FFFF
        }]
      })
    }
  }
}
