const { stripIndents } = require('common-tags')
const { escapeMarkdown } = require('discord.js')

module.exports = (client, warning) => {
  var eventName = client.getFileName(__filename)
  client.log('warn', stripIndents`
    ${client.shard ? `Shard ID: ${client.shard.id}` : '\n'}
    ${warning.stack}
  `, 'Process', 'Warning')

  // Webhook
  if (client.config.webhook.enabled) {
    if (client.config.webhook.processEvents[eventName]) {
      client.webhook({
        username: client.user.username,
        avatarURL: client.user.displayAvatarURL(),
        embeds: [{
          footer: { text: eventName },
          timestamp: new Date(),
          title: `Process Warning${client.shard ? ` | Shard ID: ${client.shard.id}` : ''}`,
          description: '```js\n' + escapeMarkdown(warning.stack, true) + '\n```',
          color: 0xFFFF00
        }]
      })
    }
  }
}
