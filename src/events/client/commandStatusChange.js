const oneLine = require('common-tags').oneLine

module.exports = (client, guild, command, enabled) => {
  client.log('info', oneLine`
    Command ${command.memberName} (${command.groupID})
    ${enabled ? 'enabled' : 'disabled'}
    ${guild ? `in guild ${guild.name} (${guild.id})` : 'globally'}.
    ${client.shard ? `\nShard ID: ${client.shard.id}` : ''}
  `, 'Command Status Change', guild ? guild.name : 'Global')

  // Webhook
  if (client.config.webhook.enabled) {
    if (client.config.webhook.clientEvents.commandStatusChange) {
      client.webhook({
        username: client.user.username,
        avatarURL: client.user.displayAvatarURL(),
        embeds: [{
          footer: { text: 'commandStatusChange' },
          timestamp: new Date(),
          title: `Command Status Changed${client.shard ? ` | Shard ID: ${client.shard.id}` : ''}`,
          thumbnail: { url: guild ? guild.iconURL() : client.user.displayAvatarURL() },
          description: oneLine`
            Command ${command.memberName} \`(${command.groupID})\`
            ${enabled ? 'enabled' : 'disabled'}
            ${guild ? `in guild ${guild.name} \`(${guild.id})\`` : 'globally'}.
          `,
          color: 0x00FFFF
        }]
      })
    }
  }
}
