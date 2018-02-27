const { oneLine } = require('common-tags')

module.exports = (client, guild, prefix) => {
  client.log.info(oneLine`
    Prefix ${prefix === '' ? 'removed' : `changed to ${prefix || 'the default'}`}
    ${guild ? `in guild ${guild.name} (${guild.id})` : 'globally'}.
    ${client.shard ? `\nShard ID: ${client.shard.id}` : ''}
  `, 'commandPrefixChange')

  // Global Commands Blocked (persistent)
  client.provider.set('global', 'commandPrefixChange', client.provider.get('global', 'commandPrefixChange', 0) + 1)
  if (guild) {
    // Guild Commands Blocked (persistent)
    client.provider.set(guild.id, 'commandPrefixChange', client.provider.get(guild.id, 'commandPrefixChange', 0) + 1)
  }

  // Webhook
  if (client.config.webhook.enabled) {
    if (client.config.webhook.clientEvents.commandPrefixChange) {
      client.webhook({
        content: '',
        username: client.user.username,
        avatarURL: client.user.displayAvatarURL(),
        embeds: [{
          author: { name: client.user.tag, icon_url: client.user.displayAvatarURL() },
          footer: { text: 'commandPrefixChange' },
          timestamp: new Date(),
          title: `commandPrefixChange${client.shard ? ` | Shard ID: ${client.shard.id}` : ''}`,
          description: oneLine`
            Prefix ${prefix === '' ? 'removed' : `changed to ${prefix || 'the default'}`}
            ${guild ? `in guild ${guild.name} \`(${guild.id})\`` : 'globally'}.
          `,
          color: 0x00FFFF
        }]
      })
    }
  }
}
