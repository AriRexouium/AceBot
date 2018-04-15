const { oneLine } = require('common-tags')

module.exports = (client, guild, group, enabled) => {
  client.log('info', oneLine`
    Group ${group.id}
    ${enabled ? 'enabled' : 'disabled'}
    ${guild.guild ? `in guild ${guild.guild.name} (${guild.guild.id})` : 'globally'}.
    ${client.shard ? `\nShard ID: ${client.shard.id}` : ''}
  `, 'Group Status Change', guild ? guild.name : 'Global')

  // Webhook
  if (client.config.webhook.enabled) {
    if (client.config.webhook.clientEvents.groupStatusChange) {
      client.webhook({
        username: client.user.username,
        avatarURL: client.user.displayAvatarURL(),
        embeds: [{
          footer: { text: 'groupStatusChange' },
          timestamp: new Date(),
          title: `Group Status Changed${client.shard ? ` | Shard ID: ${client.shard.id}` : ''}`,
          thumbnail: { url: guild ? guild.iconURL() : client.user.displayAvatarURL() },
          description: oneLine`
            Group ${group.id}
            ${enabled ? 'enabled' : 'disabled'}
            ${guild.guild ? `in guild ${guild.guild.name} \`(${guild.guild.id})\`` : 'globally'}.
          `,
          color: 0x00FFFF
        }]
      })
    }
  }
}
