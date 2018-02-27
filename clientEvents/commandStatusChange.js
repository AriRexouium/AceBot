const oneLine = require('common-tags').oneLine

module.exports = (client, guild, command, enabled) => {
  client.log.info(oneLine`
    Command ${command.memberName} (${command.groupID})
    ${enabled ? 'enabled' : 'disabled'}
    ${guild ? `in guild ${guild.name} (${guild.id})` : 'globally'}.
    ${client.shard ? `\nShard ID: ${client.shard.id}` : ''}
  `, 'commandStatusChange')

  if (client.sqlReady === true) {
  // Global Command Status Changes (persistent)
    client.provider.set('global', 'commandStatusChange', client.provider.get('global', 'commandStatusChange', 0) + 1)
    if (guild) {
    // Guild Command Status Changes (persistent)
      client.provider.set(guild.id, 'commandStatusChange', client.provider.get(guild.id, 'commandStatusChange', 0) + 1)
    }
  }

  // Webhook
  if (client.config.webhook.enabled) {
    if (client.config.webhook.clientEvents.commandStatusChange) {
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
