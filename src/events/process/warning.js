const { stripIndents } = require('common-tags')

module.exports = (client, warning) => {
  client.log('warn', stripIndents`
    ${client.shard ? `Shard ID: ${client.shard.id}` : '\n'}
    ${warning.stack}
  `, 'Process', 'Warning')

  // Webhook
  if (client.config.webhook.enabled) {
    if (client.config.webhook.processEvents.warning) {
      client.webhook({
        username: client.user.username,
        avatarURL: client.user.displayAvatarURL(),
        embeds: [{
          footer: { text: 'processWarning' },
          timestamp: new Date(),
          title: `Process Warning${client.shard ? ` | Shard ID: ${client.shard.id}` : ''}`,
          description: '```js\n' + client.cleanText(warning.stack) + '\n```',
          color: 0xFFFF00
        }]
      })
    }
  }
}
